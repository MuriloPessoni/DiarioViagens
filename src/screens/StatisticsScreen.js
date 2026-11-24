import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart, BarChart } from 'react-native-svg-charts';
import { usePlaces } from '../context/PlacesContext';
import { theme, shadow } from '../theme';

const WANT_COLOR = '#E8A44A';
const VISITED_COLOR = '#5B83C4';

export function StatisticsScreen() {
  const { places } = usePlaces();
  const statusData = useMemo(() => {
    const want = places.filter((place) => place.status === 'Quero visitar').length;
    const visited = places.filter((place) => place.status === 'Visitado').length;
    return [
      { key: 'Quero visitar', value: want, svg: { fill: WANT_COLOR } },
      { key: 'Visitado', value: visited, svg: { fill: VISITED_COLOR } },
    ];
  }, [places]);
  const cityData = useMemo(() => {
    const counts = places.reduce((acc, place) => {
      const label = `${place.city}, ${place.state}`;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
  }, [places]);

  return <ScrollView style={styles.safe} contentContainerStyle={styles.content}>
    <Text style={styles.kicker}>SUAS MEMÓRIAS EM NÚMEROS</Text><Text style={styles.title}>Estatísticas</Text>
    <Text style={styles.subtitle}>Os gráficos acompanham os lugares que você cadastrou.</Text>
    <View style={styles.summary}><Text style={styles.summaryNumber}>{places.length}</Text><View><Text style={styles.summaryTitle}>lugares no diário</Text><Text style={styles.summaryText}>Cada destino, uma nova história.</Text></View><Text style={styles.summaryIcon}>✦</Text></View>

    <View style={styles.card}>
      <View style={styles.cardHeading}><View><Text style={styles.cardTitle}>Planos e lembranças</Text><Text style={styles.cardCaption}>Lugares por status</Text></View><Text style={styles.smallLabel}>STATUS</Text></View>
      {places.length ? <View style={styles.pieRow}>
        <PieChart style={styles.pie} data={statusData.filter((item) => item.value > 0)} innerRadius="62%" outerRadius="100%" padAngle={0.035} />
        <View style={styles.legend}>{statusData.map((item) => <View key={item.key} style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: item.svg.fill }]} /><View style={styles.legendCopy}><Text style={styles.legendTitle}>{item.key}</Text><Text style={styles.legendValue}>{item.value} {item.value === 1 ? 'lugar' : 'lugares'}</Text></View><Text style={styles.legendPercent}>{Math.round((item.value / places.length) * 100)}%</Text></View>)}</View>
      </View> : <EmptyChart message="Cadastre um lugar para acompanhar seus planos e viagens realizadas." />}
    </View>

    <View style={styles.card}>
      <View style={styles.cardHeading}><View><Text style={styles.cardTitle}>Destinos mais presentes</Text><Text style={styles.cardCaption}>Lugares por cidade e estado</Text></View><Text style={styles.smallLabel}>DESTINOS</Text></View>
      {cityData.length ? <>
        <BarChart style={styles.bar} data={cityData.map((item) => ({ value: item.value, svg: { fill: theme.colors.primary } }))} yAccessor={({ item }) => item.value} contentInset={{ top: 14, bottom: 4 }} spacingInner={0.42} gridMin={0} />
        <View style={styles.cityList}>{cityData.map((item, index) => <View key={item.label} style={styles.cityRow}><View style={styles.cityLeft}><Text style={styles.cityIndex}>{String(index + 1).padStart(2, '0')}</Text><Text numberOfLines={1} style={styles.cityName}>{item.label}</Text></View><Text style={styles.cityCount}>{item.value}</Text></View>)}</View>
      </> : <EmptyChart message="Assim que salvar destinos, você verá quantos ficam em cada cidade." />}
    </View>
    <Text style={styles.footer}>Atualizado automaticamente com seus lugares salvos.</Text>
  </ScrollView>;
}

function EmptyChart({ message }) {
  return <View style={styles.empty}><View style={styles.emptyRing}><Text style={styles.emptyIcon}>＋</Text></View><Text style={styles.emptyText}>{message}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background }, content: { padding: 22, paddingBottom: 35 },
  kicker: { color: theme.colors.primary, fontSize: 10, letterSpacing: 1.6, fontWeight: '800', marginTop: 9 }, title: { color: theme.colors.ink, fontSize: 29, fontWeight: '800', marginTop: 5 }, subtitle: { color: theme.colors.muted, fontSize: 13, marginTop: 7 },
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 18, padding: 17, marginTop: 20, marginBottom: 17 }, summaryNumber: { color: '#fff', fontSize: 35, fontWeight: '800', marginRight: 13 }, summaryTitle: { color: '#fff', fontSize: 15, fontWeight: '700' }, summaryText: { color: '#D6E9E1', fontSize: 11, marginTop: 4 }, summaryIcon: { color: '#B2D5C5', fontSize: 25, marginLeft: 'auto' },
  card: { backgroundColor: '#fff', borderRadius: 19, padding: 17, marginBottom: 15, ...shadow }, cardHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, cardTitle: { color: theme.colors.ink, fontWeight: '800', fontSize: 15 }, cardCaption: { color: theme.colors.muted, fontSize: 11, marginTop: 4 }, smallLabel: { color: '#9AA29C', fontWeight: '700', fontSize: 9, letterSpacing: 1.2 },
  pieRow: { flexDirection: 'row', alignItems: 'center', marginTop: 13, minHeight: 150 }, pie: { width: 145, height: 145 }, legend: { flex: 1, gap: 16, paddingLeft: 11 }, legendRow: { flexDirection: 'row', alignItems: 'center' }, legendDot: { width: 9, height: 9, borderRadius: 5, marginRight: 8 }, legendCopy: { flex: 1 }, legendTitle: { color: theme.colors.ink, fontWeight: '600', fontSize: 11 }, legendValue: { color: theme.colors.muted, fontSize: 10, marginTop: 3 }, legendPercent: { color: theme.colors.ink, fontSize: 12, fontWeight: '800' },
  bar: { height: 145, marginTop: 12 }, cityList: { borderTopColor: theme.colors.line, borderTopWidth: 1, marginTop: 3 }, cityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#F0F2EF', borderBottomWidth: 1 }, cityLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 }, cityIndex: { fontSize: 9, color: theme.colors.primary, fontWeight: '800', marginRight: 11 }, cityName: { color: theme.colors.ink, fontSize: 12, flex: 1 }, cityCount: { backgroundColor: theme.colors.primarySoft, overflow: 'hidden', borderRadius: 10, minWidth: 26, textAlign: 'center', paddingVertical: 4, color: theme.colors.primary, fontSize: 11, fontWeight: '800' },
  empty: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 25 }, emptyRing: { width: 46, height: 46, borderRadius: 23, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }, emptyIcon: { color: theme.colors.primary, fontSize: 24 }, emptyText: { color: theme.colors.muted, textAlign: 'center', fontSize: 12, lineHeight: 18 }, footer: { textAlign: 'center', color: '#939D96', fontSize: 10, marginTop: 2 },
});
