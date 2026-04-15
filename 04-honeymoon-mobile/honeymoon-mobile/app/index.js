import { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const SPLASH_BG = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80';
const LOGO_ICON = '/logo-icon.png';

export default function SplashScreen() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace('/(auth)/login'), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{ uri: SPLASH_BG }} style={styles.bg} resizeMode="cover" />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.logoRing}>
          <Image source={{ uri: LOGO_ICON }} style={styles.logoIcon} resizeMode="contain" />
        </View>
        <Text style={styles.logoText}>HONEYMOON</Text>
        <Text style={styles.logoArabic}>هـنـي مـون</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  bg: { ...StyleSheet.absoluteFillObject, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.55)' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoRing: {
    width: 90, height: 90, borderRadius: 45, borderWidth: 2,
    borderColor: COLORS.gold, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.8)',
  },
  logoIcon: { width: 48, height: 48 },
  logoText: {
    fontSize: 26, fontWeight: '600', letterSpacing: 6,
    color: COLORS.dark, fontFamily: 'serif', marginBottom: 4,
  },
  logoArabic: { fontSize: 14, color: COLORS.gold, letterSpacing: 2 },
});
