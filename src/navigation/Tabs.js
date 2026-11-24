import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlacesScreen } from '../screens/PlacesScreen';
import { MapScreen } from '../screens/MapScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();
const icons = { Lugares: '▤', Mapa: '⌖', Estatísticas: '◔' };

export function Tabs() {
  return <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: '#536159',
    tabBarLabelStyle: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
    // Barra mais alta, com contraste e um espaço inferior para ficar fácil de encontrar.
    tabBarStyle: { height: 82, marginBottom: 10, paddingTop: 5, backgroundColor: '#fff', borderTopColor: theme.colors.line, borderRadius: 17, borderTopWidth: 0, elevation: 8 },
    tabBarIcon: ({ focused }) => <TabIcon glyph={icons[route.name]} focused={focused} />,
  })}>
    <Tab.Screen name="Lugares" component={PlacesScreen} />
    <Tab.Screen name="Mapa" component={MapScreen} />
    <Tab.Screen name="Estatísticas" component={StatisticsScreen} />
  </Tab.Navigator>;
}

function TabIcon({ glyph, focused }) {
  return <Text style={{ color: focused ? theme.colors.primary : '#536159', fontSize: 25, fontWeight: '700', lineHeight: 29 }}>{glyph}</Text>;
}
