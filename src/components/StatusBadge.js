import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function StatusBadge({ status }) {
  const visited = status === 'Visitado';
  return <View style={[styles.badge, visited ? styles.visited : styles.want]}>
    <View style={[styles.dot, visited ? styles.visitedDot : styles.wantDot]} />
    <Text style={[styles.text, visited ? styles.visitedText : styles.wantText]}>{status}</Text>
  </View>;
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6, gap: 6 },
  want: { backgroundColor: '#FFF2DE' }, visited: { backgroundColor: '#EAF0FB' },
  dot: { width: 6, height: 6, borderRadius: 3 }, wantDot: { backgroundColor: theme.colors.accent }, visitedDot: { backgroundColor: theme.colors.visited },
  text: { fontSize: 11, fontWeight: '700' }, wantText: { color: '#9A641E' }, visitedText: { color: '#4669A4' },
});
