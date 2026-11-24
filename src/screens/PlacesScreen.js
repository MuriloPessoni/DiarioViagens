import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { usePlaces } from '../context/PlacesContext';
import { PlaceCard } from '../components/PlaceCard';
import { theme } from '../theme';

export function PlacesScreen({ navigation }) {
  const { places } = usePlaces();
  const [filter, setFilter] = useState('Todos');
  const [query, setQuery] = useState('');
  const filteredPlaces = useMemo(() => places.filter((place) => {
    const matchesStatus = filter === 'Todos' || place.status === filter;
    const searchable = `${place.name} ${place.city} ${place.state}`.toLocaleLowerCase('pt-BR');
    return matchesStatus && searchable.includes(query.trim().toLocaleLowerCase('pt-BR'));
  }), [places, filter, query]);

  return <SafeAreaView style={styles.safe}>
    <FlatList
      data={filteredPlaces}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PlaceCard place={item} onPress={() => navigation.navigate('Detalhes', { placeId: item.id })} />}
      contentContainerStyle={styles.content}
      ListHeaderComponent={<>
        <View style={styles.topline}><View><Text style={styles.kicker}>SEU PRÓXIMO CAPÍTULO</Text><Text style={styles.title}>Diário de viagens</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="Adicionar lugar" onPress={() => navigation.navigate('Cadastro')} style={styles.add}><Text style={styles.addText}>＋</Text></Pressable>
        </View>
        <Text style={styles.subtitle}>Guarde lugares que você sonha conhecer e aqueles que já viraram lembrança.</Text>
        <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput placeholder="Buscar lugar ou cidade" placeholderTextColor="#98A19B" value={query} onChangeText={setQuery} style={styles.searchInput} /></View>
        <View style={styles.filters}>{['Todos', 'Quero visitar', 'Visitado'].map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterSelected]}><Text style={[styles.filterText, filter === item && styles.filterTextSelected]}>{item}</Text></Pressable>)}</View>
        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Seus lugares</Text><Text style={styles.count}>{filteredPlaces.length} {filteredPlaces.length === 1 ? 'lugar' : 'lugares'}</Text></View>
      </>}
      ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyIcon}>✦</Text><Text style={styles.emptyTitle}>{places.length ? 'Nada por aqui ainda' : 'Sua próxima viagem começa aqui'}</Text><Text style={styles.emptyText}>{places.length ? 'Tente outro filtro ou termo de busca.' : 'Adicione um lugar e comece a montar seu mapa de memórias.'}</Text>{places.length === 0 && <Pressable onPress={() => navigation.navigate('Cadastro')} style={styles.emptyButton}><Text style={styles.emptyButtonText}>Adicionar primeiro lugar</Text></Pressable>}</View>}
    />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background }, content: { padding: 22, paddingBottom: 28 },
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  kicker: { fontSize: 10, letterSpacing: 1.8, fontWeight: '800', color: theme.colors.primary, marginBottom: 8 },
  title: { fontSize: 29, fontWeight: '800', letterSpacing: -0.7, color: theme.colors.ink },
  add: { width: 48, height: 48, borderRadius: 16, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' }, addText: { color: '#fff', fontSize: 30, lineHeight: 34, fontWeight: '300' },
  subtitle: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, marginTop: 12, maxWidth: 320 },
  search: { flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 14, backgroundColor: '#fff', marginTop: 22, paddingHorizontal: 14 }, searchIcon: { color: theme.colors.primary, fontSize: 24, marginRight: 8 }, searchInput: { flex: 1, fontSize: 14, color: theme.colors.ink },
  filters: { flexDirection: 'row', gap: 8, marginTop: 15, marginBottom: 23 }, filter: { borderRadius: 99, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: '#EBEEEA' }, filterSelected: { backgroundColor: theme.colors.primary }, filterText: { fontSize: 12, color: theme.colors.muted, fontWeight: '600' }, filterTextSelected: { color: '#fff' },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }, sectionTitle: { fontSize: 18, color: theme.colors.ink, fontWeight: '800' }, count: { color: theme.colors.muted, fontSize: 12 },
  empty: { backgroundColor: '#fff', borderRadius: 20, padding: 26, alignItems: 'center', marginTop: 5 }, emptyIcon: { color: theme.colors.primary, fontSize: 30, marginBottom: 8 }, emptyTitle: { color: theme.colors.ink, fontSize: 17, fontWeight: '700', textAlign: 'center' }, emptyText: { color: theme.colors.muted, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 7 },
  emptyButton: { backgroundColor: theme.colors.primarySoft, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, marginTop: 18 }, emptyButtonText: { color: theme.colors.primary, fontSize: 13, fontWeight: '700' },
});
