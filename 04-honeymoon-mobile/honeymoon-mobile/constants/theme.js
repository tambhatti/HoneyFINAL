import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary:   '#174a37',
  gold:      '#b89b6b',
  dark:      '#1a1a1a',
  gray:      '#6b7280',
  grayLight: '#e5e7eb',
  white:     '#ffffff',
  cream:     '#f4ebd0',
  red:       '#ef4444',
  green:     '#16a34a',
};

// ── Cross-platform font families ─────────────────────────────────────────────
// Uses @expo-google-fonts/libre-baskerville when loaded, with safe fallbacks
export const FONTS = {
  // Serif heading — Libre Baskerville on both platforms (loaded via expo-font)
  // Fallback: Georgia (iOS) / serif (Android) — both render identically
  serif: Platform.select({
    ios:     'LibreBaskerville-Regular',
    android: 'LibreBaskerville-Regular',
    default: 'serif',
  }),
  serifBold: Platform.select({
    ios:     'LibreBaskerville-Bold',
    android: 'LibreBaskerville-Bold',
    default: 'serif',
  }),
  serifItalic: Platform.select({
    ios:     'LibreBaskerville-Italic',
    android: 'LibreBaskerville-Italic',
    default: 'serif',
  }),
  // Sans serif body — system fonts per platform
  sans: Platform.select({
    ios:     'System',
    android: 'Roboto',
    default: 'sans-serif',
  }),
};

// ── Spacing ───────────────────────────────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOW = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
    },
    android: { elevation: 12 },
  }),
};

// ── Screen helpers ─────────────────────────────────────────────────────────────
export const SCREEN = { width, height };

// ── Platform hit slop (Android needs bigger touch targets) ────────────────────
export const HIT_SLOP = Platform.select({
  ios:     { top: 4, bottom: 4, left: 4, right: 4 },
  android: { top: 8, bottom: 8, left: 8, right: 8 },
});

// ── Seed vendor data (used in screens before API wiring) ──────────────────────
export const ASSETS = {
  heroBg:    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80',
  logoIcon:  '/logo-icon.png',
  logoText:  '/logo-text.png',
  avatar:    'https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200',
  venue1:    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
  venue2:    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  venue3:    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
};

export const VENDORS = [
  { id:'vendor-1', name:'The Wedding Atelier',  owner:'James Milner',  rating:4.5, reviews:12,  price:'AED 30,000', location:'Dubai',     guests:'For 200 guests', image: ASSETS.venue1, category:'Venue' },
  { id:'vendor-2', name:'Hearts Aligned',       owner:'Sarah Parker',  rating:4.3, reviews:531, price:'AED 15,000', location:'Abu Dhabi', guests:'For 150 guests', image: ASSETS.venue2, category:'Photography' },
  { id:'vendor-3', name:'Pearl Promise',        owner:'Anthony Ross',  rating:4.8, reviews:24,  price:'AED 8,000',  location:'Dubai',     guests:'For 100 guests', image: ASSETS.venue3, category:'Catering' },
  { id:'vendor-4', name:'Velvet Vows',          owner:'James Milner',  rating:4.2, reviews:12,  price:'AED 5,000',  location:'Sharjah',   guests:'For 80 guests',  image: ASSETS.venue1, category:'Beauty' },
];

export const CATEGORIES = [
  { id:'cat-1', name:'Venue',       icon:'🏛' },
  { id:'cat-2', name:'Photography', icon:'📸' },
  { id:'cat-3', name:'Catering',    icon:'🍽' },
  { id:'cat-4', name:'Beauty',      icon:'💄' },
  { id:'cat-5', name:'Decoration',  icon:'🌸' },
  { id:'cat-6', name:'Music',       icon:'🎵' },
];
