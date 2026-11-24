import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBadge } from './StatusBadge';
import { theme, shadow } from '../theme';

export function PlaceCard({ place, onPress }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    {place.imageUri ? <Image source={{ uri: place.imageUri }} style={styles.photo} /> :
      <View style={styles.photoFallback}><Text style={styles.photoIcon}>✦</Text></View>}
    <View style={styles.info}>
      <Text numberOfLines={1} style={styles.name}>{place.name}</Text>
      <Text numberOfLines={1} style={styles.city}>{place.city}, {place.state}</Text>
      <StatusBadge status={place.status} />
    </View>
    <Text style={styles.chevron}>›</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 12, borderRadius: 18, marginBottom: 12, ...shadow },
  photo: { width: 76, height: 82, borderRadius: 13, backgroundColor: theme.colors.pale },
  photoFallback: { width: 76, height: 82, borderRadius: 13, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  photoIcon: { fontSize: 25, color: theme.colors.primary },
  info: { flex: 1, marginHorizontal: 13, gap: 6 }, name: { fontSize: 16, fontWeight: '700', color: theme.colors.ink },
  city: { fontSize: 13, color: theme.colors.muted, marginBottom: 2 }, chevron: { color: '#9AA29C', fontSize: 27, paddingHorizontal: 4 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
