import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, ASSETS } from '../constants/theme';

export function Header({ title, showBack = false, showMenu = false, showBell = false }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
      ) : <View style={styles.spacer} />}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        {showMenu && (
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.icon}>☰</Text>
          </TouchableOpacity>
        )}
        {showBell && (
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
        )}
        {!showMenu && !showBell && <View style={styles.spacer} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 24) + 12,
    paddingBottom: 14, backgroundColor: COLORS.white,
  },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.dark, fontFamily: 'serif' },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 32, color: COLORS.dark, lineHeight: 32 },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 16 },
  spacer: { width: 38 },
});
