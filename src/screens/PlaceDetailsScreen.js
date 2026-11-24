import React, { useLayoutEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { usePlaces } from '../context/PlacesContext';
import { StatusBadge } from '../components/StatusBadge';
import { ActionButton } from '../components/ActionButton';
import { theme } from '../theme';

export function PlaceDetailsScreen({ route, navigation }) {
  const { placeId } = route.params;
  const { findPlace, updatePlace, removePlace } = usePlaces();
  const place = findPlace(placeId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: place?.name || 'Lugar' });
  }, [navigation, place?.name]);

  if (!place) return <View style={styles.missing}><Text style={styles.missingText}>Este lugar não está mais no diário.</Text></View>;

  const confirmRemove = () => Alert.alert('Remover lugar?', `“${place.name}” será excluído do seu diário.`, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Remover', style: 'destructive', onPress: () => { removePlace(place.id); navigation.goBack(); } },
  ]);

  return <ScrollView style={styles.safe} contentContainerStyle={styles.content}>
    {place.imageUri ? <Image source={{ uri: place.imageUri }} style={styles.hero} /> : <View style={styles.heroFallback}><Text style={styles.fallbackIcon}>✦</Text><Text style={styles.fallbackText}>Uma nova história começa aqui</Text></View>}
    <View style={styles.titleRow}><View style={styles.titleCopy}><Text style={styles.title}>{place.name}</Text><Text style={styles.location}>{place.city}, {place.state}</Text></View><StatusBadge status={place.status} /></View>
    {place.description ? <View style={styles.section}><Text style={styles.sectionTitle}>Sobre este lugar</Text><Text style={styles.description}>{place.description}</Text></View> : null}
    <View style={styles.section}><Text style={styles.sectionTitle}>Endereço</Text><Text style={styles.address}>{place.street}, {place.number}</Text><Text style={styles.address}>{place.city} — {place.state}</Text></View>
    <View style={styles.mapSection}><View style={styles.mapHeading}><Text style={styles.sectionTitle}>No mapa</Text><Text style={styles.coordinates}>📍 {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}</Text></View>
      <MapView style={styles.map} initialRegion={{ latitude: place.latitude, longitude: place.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }} scrollEnabled={false} zoomEnabled={false}>
        <Marker coordinate={{ latitude: place.latitude, longitude: place.longitude }} title={place.name} description={`${place.city}, ${place.state}`} />
      </MapView>
    </View>
    <View style={styles.actions}><ActionButton title="Editar lugar" variant="secondary" onPress={() => navigation.navigate('Editar', { placeId: place.id })} />
      {place.status !== 'Visitado' ? <ActionButton title="Marcar como visitado" onPress={() => updatePlace(place.id, { status: 'Visitado' })} /> : <ActionButton title="Marcar como quero visitar" variant="secondary" onPress={() => updatePlace(place.id, { status: 'Quero visitar' })} />}
      <ActionButton title="Remover do diário" variant="danger" onPress={confirmRemove} />
    </View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background }, content: { padding: 19, paddingBottom: 30 },
  hero: { width: '100%', height: 245, borderRadius: 20, backgroundColor: theme.colors.pale }, heroFallback: { height: 180, borderRadius: 20, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center' }, fallbackIcon: { color: theme.colors.primary, fontSize: 40 }, fallbackText: { color: theme.colors.primary, fontWeight: '600', marginTop: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }, titleCopy: { flex: 1, paddingRight: 10 }, title: { color: theme.colors.ink, fontSize: 24, fontWeight: '800' }, location: { color: theme.colors.muted, fontSize: 14, marginTop: 5 },
  section: { marginTop: 22 }, sectionTitle: { color: theme.colors.ink, fontSize: 15, fontWeight: '800', marginBottom: 8 }, description: { color: '#5E6962', fontSize: 14, lineHeight: 21 }, address: { color: '#5E6962', fontSize: 13, lineHeight: 20 }, mapSection: { marginTop: 22 }, mapHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, coordinates: { color: theme.colors.muted, fontSize: 10 }, map: { height: 165, borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  actions: { gap: 10, marginTop: 23 }, missing: { flex: 1, alignItems: 'center', justifyContent: 'center' }, missingText: { color: theme.colors.muted },
});
