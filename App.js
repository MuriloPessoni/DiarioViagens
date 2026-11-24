import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlacesProvider } from './src/context/PlacesContext';
import { Tabs } from './src/navigation/Tabs';
import { PlaceFormScreen } from './src/screens/PlaceFormScreen';
import { PlaceDetailsScreen } from './src/screens/PlaceDetailsScreen';
import { theme } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PlacesProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={theme.colors.background} />
        <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.ink,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: theme.colors.background },
        }}>
          <Stack.Screen name="Início" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={PlaceFormScreen} options={{ title: 'Novo lugar' }} />
          <Stack.Screen name="Editar" component={PlaceFormScreen} options={{ title: 'Editar lugar' }} />
          <Stack.Screen name="Detalhes" component={PlaceDetailsScreen} options={{ title: 'Detalhes da viagem' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PlacesProvider>
  );
}
