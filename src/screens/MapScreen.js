import React, { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import { usePlaces } from '../context/PlacesContext';
import { theme } from '../theme';

export function MapScreen({ navigation }) {
  const { places } = usePlaces();
  const { location, loading, error, refresh } = useLocation();
  const mapRef = useRef(null);
  const initialRegion = useMemo(() => {
    if (location) return { latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.12, longitudeDelta: 0.12 };
    if (places.length) return { latitude: places[0].latitude, longitude: places[0].longitude, latitudeDelta: 0.25, longitudeDelta: 0.25 };
    return { latitude: -20.5396, longitude: -47.4008, latitudeDelta: 0.18, longitudeDelta: 0.18 };
  }, [location, places]);

  useEffect(() => {
    if (location) mapRef.current?.animateToRegion(initialRegion, 500);
  }, [location, initialRegion]);

  return <SafeAreaView style={styles.safe}>
    <View style={styles.header}><Text style={styles.kicker}>EXPLORE SEU MUNDO</Text><Text style={styles.title}>Mapa de viagens</Text><Text style={styles.subtitle}>{places.length} {places.length === 1 ? 'lugar salvo' : 'lugares salvos'} no seu diário</Text></View>
    <View style={styles.mapWrap}>
      <MapView ref={mapRef} style={StyleSheet.absoluteFill} initialRegion={initialRegion} showsUserLocation={false}>
        {places.map((place) => <Marker key={place.id} coordinate={{ latitude: place.latitude, longitude: place.longitude }} title={place.name} description={`${place.city}, ${place.state} · ${place.status}`} onPress={() => navigation.navigate('Detalhes', { placeId: place.id })} pinColor={place.status === 'Visitado' ? theme.colors.visited : theme.colors.primary} />)}
        {location && <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Você está aqui" pinColor="#E8A44A" />}
      </MapView>
      {!places.length && <View style={styles.empty}><Text style={styles.emptyTitle}>Seu mapa está esperando por histórias</Text><Text style={styles.emptyText}>Cadastre um lugar para ver seu marcador aqui.</Text></View>}
      {loading && <View style={styles.locationPill}><ActivityIndicator size="small" color={theme.colors.primary} /><Text style={styles.locationText}>Localizando você…</Text></View>}
      {!loading && error ? <View style={styles.warning}><Text style={styles.warningText}>{error}</Text><Text onPress={refresh} style={styles.retry}>Tentar novamente</Text></View> : null}
    </View>
    <View style={styles.legend}><View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} /><Text style={styles.legendLabel}>Quero visitar</Text><View style={[styles.legendDot, { backgroundColor: theme.colors.visited }]} /><Text style={styles.legendLabel}>Visitado</Text><View style={[styles.legendDot, { backgroundColor: theme.colors.accent }]} /><Text style={styles.legendLabel}>Você</Text></View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background }, header: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 15 }, kicker: { color: theme.colors.primary, fontSize: 10, letterSpacing: 1.7, fontWeight: '800' }, title: { color: theme.colors.ink, fontSize: 27, fontWeight: '800', marginTop: 6 }, subtitle: { color: theme.colors.muted, fontSize: 13, marginTop: 5 },
  mapWrap: { flex: 1, overflow: 'hidden', borderRadius: 22, marginHorizontal: 15, marginBottom: 10, backgroundColor: '#E6ECE7' }, empty: { position: 'absolute', top: 18, left: 18, right: 18, backgroundColor: '#FFFFFFF0', padding: 15, borderRadius: 15 }, emptyTitle: { color: theme.colors.ink, fontWeight: '700', fontSize: 14 }, emptyText: { color: theme.colors.muted, fontSize: 12, marginTop: 4 },
  locationPill: { position: 'absolute', bottom: 16, left: 14, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', paddingVertical: 9, paddingHorizontal: 12, borderRadius: 99 }, locationText: { color: theme.colors.ink, fontSize: 12 }, warning: { position: 'absolute', bottom: 14, left: 12, right: 12, backgroundColor: '#fff', padding: 12, borderRadius: 14 }, warningText: { color: theme.colors.muted, fontSize: 11, lineHeight: 16 }, retry: { color: theme.colors.primary, fontWeight: '700', marginTop: 6, fontSize: 12 },
  legend: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, paddingVertical: 13 }, legendDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 }, legendLabel: { fontSize: 10, color: theme.colors.muted },
});
