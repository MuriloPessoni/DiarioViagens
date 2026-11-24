import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

export function ActionButton({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const secondary = variant === 'secondary';
  const danger = variant === 'danger';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.button, secondary && styles.secondary, danger && styles.danger,
        (disabled || loading) && styles.disabled, pressed && styles.pressed, style]}
    >
      {loading ? <ActivityIndicator color={secondary ? theme.colors.primary : '#fff'} /> :
        <Text style={[styles.label, secondary && styles.secondaryLabel]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 15, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  secondary: { backgroundColor: theme.colors.primarySoft }, danger: { backgroundColor: theme.colors.danger },
  label: { color: '#fff', fontSize: 15, fontWeight: '700' }, secondaryLabel: { color: theme.colors.primary },
  disabled: { opacity: 0.55 }, pressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
});
