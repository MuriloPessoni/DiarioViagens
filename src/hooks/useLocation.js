import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

// Solicita a permissão uma vez e disponibiliza a localização atual para o mapa.
export function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setError('Permissão de localização negada. Ative-a nas configurações do aparelho.');
        return;
      }
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(current.coords);
    } catch (err) {
      setError('Não foi possível obter sua localização. Verifique o GPS e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { location, loading, error, refresh };
}
