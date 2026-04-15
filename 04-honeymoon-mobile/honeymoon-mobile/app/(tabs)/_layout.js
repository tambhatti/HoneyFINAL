import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { COLORS } from '../../constants/theme';

// iOS has a home indicator bar at the bottom (~34pt on modern iPhones)
// Android does not — so tab bar height needs to account for this
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 84 : 64;
const TAB_PADDING_BOTTOM = Platform.OS === 'ios' ? 28 : 8;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height:          TAB_BAR_HEIGHT,
          paddingBottom:   TAB_PADDING_BOTTOM,
          paddingTop:      8,
          backgroundColor: '#fff',
          borderTopWidth:  1,
          borderTopColor:  '#f3f4f6',
          // iOS shadow
          ...Platform.select({
            ios: {
              shadowColor:   '#000',
              shadowOffset:  { width: 0, height: -2 },
              shadowOpacity: 0.06,
              shadowRadius:  8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarIcon: ({ focused }) => {
          const icons = {
            home:     focused ? '🏠' : '🏡',
            budget:   focused ? '📊' : '📉',
            bookings: focused ? '🛍' : '🛒',
            profile:  focused ? '👤' : '🧑',
            settings: focused ? '⚙️' : '🔧',
          };
          return (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>
              {icons[route.name] || '•'}
            </Text>
          );
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="budget" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
