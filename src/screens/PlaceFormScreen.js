import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Asset, requestPermissionsAsync } from 'expo-media-library';
import * as Location from 'expo-location';
import { usePlaces } from '../context/PlacesContext';
import { ActionButton } from '../components/ActionButton';
import { theme } from '../theme';
import { confirmsAddress } from '../utils/addressValidation';

const emptyForm = { name: '', description: '', street: '', number: '', city: '', state: '', status: 'Quero visitar', imageUri: '' };

export function PlaceFormScreen({ navigation, route }) {
  const placeId = route.params?.placeId;
  const { findPlace, addPlace, updatePlace } = usePlaces();
  const original = placeId ? findPlace(placeId) : null;
  const [form, setForm] = useState(() => original ? { ...original } : emptyForm);
  const [saving, setSaving] = useState(false);

  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function choosePhoto() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permissão necessária', 'Permita o acesso às fotos nas configurações para escolher uma imagem.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.85 });
      if (!result.canceled && result.assets?.[0]?.uri) change('imageUri', result.assets[0].uri);
    } catch (error) {
      Alert.alert('Não foi possível abrir a galeria', 'Tente novamente ou escolha tirar uma foto.');
    }
  }

  async function openCamera() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permissão necessária', 'Permita o uso da câmera nas configurações para tirar uma foto.');
        return;
      }
      // Abre a câmera nativa do celular, que funciona também no Expo Go.
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.82 });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      const capturedUri = result.assets[0].uri;
      // Guarda a foto no formulário mesmo se o Expo Go bloquear o acesso à galeria.
      change('imageUri', capturedUri);
      try {
        // No Android, criar um item novo na galeria não exige permissão de leitura ampla.
        // iOS ainda solicita permissão limitada para adicionar a foto.
        if (Platform.OS === 'ios') {
          const permission = await requestPermissionsAsync(true);
          if (permission.status !== 'granted') {
            Alert.alert('Foto capturada', 'A foto foi anexada ao formulário, mas a permissão para salvá-la na galeria foi negada.');
            return;
          }
        }
        const asset = await Asset.create(capturedUri);
        change('imageUri', await asset.getUri());
        Alert.alert('Foto salva', 'A imagem foi salva na galeria e adicionada ao lugar.');
      } catch (error) {
        console.warn('Não foi possível adicionar a foto à galeria:', error);
        Alert.alert(
          'Foto capturada',
          'A foto ficou anexada ao formulário, mas o Expo Go não conseguiu gravá-la na galeria. Teste essa etapa em um development build do aplicativo.'
        );
      }
    } catch (error) {
      console.warn('Não foi possível abrir a câmera:', error);
      Alert.alert('Não foi possível tirar a foto', 'Confira a permissão da câmera e tente novamente.');
    }
  }

  async function savePlace() {
    const required = [form.name, form.street, form.number, form.city, form.state];
    if (required.some((value) => !String(value || '').trim())) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome, rua, número, cidade e estado.');
      return;
    }
    setSaving(true);
    try {
      // No Android, a permissão em primeiro plano deve ser concedida antes da geocodificação.
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permissão de localização', 'Permita o acesso à localização para converter o endereço em coordenadas.');
        return;
      }
      const fullAddress = `${form.street}, ${form.number}, ${form.city}, ${form.state}, Brasil`;
      // Geocodifica o endereço real antes de salvar, sem aceitar um lugar sem coordenadas.
      const results = await Location.geocodeAsync(fullAddress);
      if (!results?.length || !Number.isFinite(results[0].latitude) || !Number.isFinite(results[0].longitude)) {
        Alert.alert('Endereço não encontrado', 'Não localizamos esse endereço. Confira rua, número, cidade e estado e tente novamente.');
        return;
      }
      const reverseResults = await Location.reverseGeocodeAsync({ latitude: results[0].latitude, longitude: results[0].longitude });
      const addressConfirmed = reverseResults.some((address) => confirmsAddress(form, address));
      if (!addressConfirmed) {
        Alert.alert('Endereço não confirmado', 'O mapa não confirmou essa rua, cidade e estado. Corrija o endereço e tente novamente.');
        return;
      }
      const data = {
        name: form.name.trim(), description: form.description.trim(), street: form.street.trim(), number: form.number.trim(),
        city: form.city.trim(), state: form.state.trim().toUpperCase(), status: form.status, imageUri: form.imageUri || '',
        latitude: results[0].latitude, longitude: results[0].longitude,
      };
      if (placeId) updatePlace(placeId, data);
      else addPlace({ ...data, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao localizar endereço', 'Não foi possível converter esse endereço em coordenadas. Verifique sua conexão e tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return <>
    <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>{placeId ? 'Atualize as informações do seu destino.' : 'Guarde um destino para a próxima aventura.'}</Text>
        <Text style={styles.sectionTitle}>Sobre o lugar</Text>
        <Field label="Nome do lugar *" value={form.name} onChangeText={(value) => change('name', value)} placeholder="Ex.: Parque Ibirapuera" />
        <Field label="Descrição" value={form.description} onChangeText={(value) => change('description', value)} placeholder="O que você quer lembrar sobre este lugar?" multiline />

        <Text style={styles.sectionTitle}>Onde fica</Text>
        <Field label="Rua / avenida *" value={form.street} onChangeText={(value) => change('street', value)} placeholder="Nome da rua ou avenida" />
        <View style={styles.twoColumns}><View style={styles.numberField}><Field label="Número *" value={form.number} onChangeText={(value) => change('number', value)} placeholder="Nº" keyboardType="numeric" /></View><View style={styles.stateField}><Field label="Estado *" value={form.state} onChangeText={(value) => change('state', value)} placeholder="SP" autoCapitalize="characters" maxLength={2} /></View></View>
        <Field label="Cidade *" value={form.city} onChangeText={(value) => change('city', value)} placeholder="Cidade" />

        <Text style={styles.sectionTitle}>Status da viagem</Text>
        <View style={styles.statusRow}>{['Quero visitar', 'Visitado'].map((status) => <Pressable key={status} onPress={() => change('status', status)} style={[styles.statusOption, form.status === status && styles.statusOptionSelected]}><View style={[styles.radio, form.status === status && styles.radioSelected]}>{form.status === status ? <View style={styles.radioInner} /> : null}</View><Text style={[styles.statusText, form.status === status && styles.statusTextSelected]}>{status}</Text></Pressable>)}</View>

        <Text style={styles.sectionTitle}>Foto do lugar</Text>
        <Text style={styles.helper}>Escolha uma imagem ou tire uma foto com a câmera. A foto capturada será salva na galeria.</Text>
        {form.imageUri ? <View style={styles.previewWrap}><Image source={{ uri: form.imageUri }} style={styles.preview} /><Pressable onPress={() => change('imageUri', '')} style={styles.removePhoto}><Text style={styles.removePhotoText}>Remover foto</Text></Pressable></View> : null}
        <View style={styles.photoActions}><Pressable onPress={choosePhoto} style={styles.photoButton}><Text style={styles.photoButtonIcon}>▧</Text><Text style={styles.photoButtonText}>Escolher da galeria</Text></Pressable><Pressable onPress={openCamera} style={styles.photoButton}><Text style={styles.photoButtonIcon}>◎</Text><Text style={styles.photoButtonText}>Tirar foto</Text></Pressable></View>
        <View style={styles.hint}><Text style={styles.hintIcon}>⌖</Text><Text style={styles.hintText}>O endereço será localizado no mapa antes de salvar.</Text></View>
        <ActionButton title={placeId ? 'Salvar alterações' : 'Salvar lugar'} onPress={savePlace} loading={saving} style={styles.saveButton} />
      </ScrollView>
    </KeyboardAvoidingView>

  </>;
}

function Field({ label, ...props }) {
  return <View style={styles.fieldWrap}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor="#A0A9A2" style={[styles.input, props.multiline && styles.multiline]} {...props} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background }, content: { padding: 20, paddingBottom: 35 }, intro: { color: theme.colors.muted, fontSize: 14, marginBottom: 21, lineHeight: 20 }, sectionTitle: { color: theme.colors.ink, fontWeight: '800', fontSize: 16, marginTop: 14, marginBottom: 12 }, fieldWrap: { marginBottom: 13 }, label: { color: '#56625A', fontWeight: '700', fontSize: 12, marginBottom: 7 }, input: { minHeight: 49, backgroundColor: '#fff', borderWidth: 1, borderColor: theme.colors.line, borderRadius: 12, paddingHorizontal: 13, color: theme.colors.ink, fontSize: 14 }, multiline: { minHeight: 95, paddingTop: 12, textAlignVertical: 'top' },
  twoColumns: { flexDirection: 'row', gap: 12 }, numberField: { flex: 1 }, stateField: { width: 100 }, statusRow: { flexDirection: 'row', gap: 10, marginBottom: 5 }, statusOption: { flex: 1, minHeight: 48, borderRadius: 13, backgroundColor: '#fff', borderWidth: 1, borderColor: theme.colors.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 8 }, statusOptionSelected: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary }, radio: { width: 17, height: 17, borderRadius: 9, borderWidth: 1.5, borderColor: '#B5BDB7', alignItems: 'center', justifyContent: 'center' }, radioSelected: { borderColor: theme.colors.primary }, radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary }, statusText: { color: theme.colors.muted, fontSize: 11, fontWeight: '600' }, statusTextSelected: { color: theme.colors.primary },
  helper: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: -5, marginBottom: 12 }, photoActions: { flexDirection: 'row', gap: 10 }, photoButton: { flex: 1, minHeight: 80, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: '#B8C9BD', backgroundColor: '#F9FCF9', alignItems: 'center', justifyContent: 'center' }, photoButtonIcon: { color: theme.colors.primary, fontSize: 25, marginBottom: 5 }, photoButtonText: { color: theme.colors.primary, fontSize: 11, fontWeight: '700' }, previewWrap: { marginBottom: 12 }, preview: { height: 190, borderRadius: 15, backgroundColor: theme.colors.pale }, removePhoto: { alignSelf: 'flex-end', padding: 6 }, removePhotoText: { color: theme.colors.danger, fontSize: 12, fontWeight: '600' },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#EEF3EF', borderRadius: 12, padding: 12, marginTop: 17 }, hintIcon: { color: theme.colors.primary, fontSize: 18 }, hintText: { color: '#53635A', fontSize: 11, flex: 1 }, saveButton: { marginTop: 18 },
});
