import { View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    bookingReminders: true,
    promotions: false,
    language: 'English',
    currency: 'AED',
  });
  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

  async function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text:'Cancel', style:'cancel' },
      { text:'Log Out', style:'destructive', onPress: async () => {
        await logout();
        router.replace('/(auth)/login');
      }}
    ]);
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {[
          ['pushNotifications',  'Push Notifications', 'Receive app push notifications'],
          ['emailNotifications', 'Email Notifications','Receive email updates'],
          ['smsNotifications',   'SMS Notifications',  'Receive SMS alerts'],
          ['bookingReminders',   'Booking Reminders',  'Get reminded before events'],
          ['promotions',         'Promotions',         'Receive promotional offers'],
        ].map(([key, label, sub]) => (
          <View key={key} style={styles.settingRow}>
            <View style={{ flex:1 }}>
              <Text style={styles.settingLabel}>{label}</Text>
              <Text style={styles.settingSubLabel}>{sub}</Text>
            </View>
            <Switch
              value={settings[key]}
              onValueChange={() => toggle(key)}
              trackColor={{ false:'#d1d5db', true:COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        ))}
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {[
          ['Language', settings.language, ['English','Arabic']],
          ['Currency', settings.currency, ['AED','USD','EUR']],
        ].map(([label, current, options]) => (
          <View key={label} style={styles.settingRow}>
            <Text style={styles.settingLabel}>{label}</Text>
            <View style={styles.dropdownRow}>
              {options.map(o => (
                <TouchableOpacity key={o}
                  style={[styles.optionBtn, current===o && styles.optionBtnActive]}
                  onPress={() => setSettings(p => ({ ...p, [label.toLowerCase()]: o }))}>
                  <Text style={[styles.optionText, current===o && styles.optionTextActive]}>{o}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {[
          ['👤','My Profile','/(tabs)/profile'],
          ['🔒','Change Password','/change-password'],
          ['⭐','Loyalty Points','/loyalty-points'],
          ['📞','Contact Us','/contact-us'],
          ['ℹ️','About Us','/about-us'],
        ].map(([icon,label,route]) => (
          <TouchableOpacity key={label} style={styles.linkRow} onPress={() => router.push(route)}>
            <Text style={styles.linkIcon}>{icon}</Text>
            <Text style={styles.linkLabel}>{label}</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      {isLoggedIn && (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪  Log Out</Text>
        </TouchableOpacity>
      )}

      <View style={{ height:40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:{ flex:1, backgroundColor:'#f9fafb' },
  header:{ paddingHorizontal:20, paddingTop:Platform.OS==='ios'?60:44, paddingBottom:14, backgroundColor:COLORS.white },
  title:{ fontSize:26, fontWeight:'700', fontFamily:'serif', color:COLORS.dark },
  section:{ backgroundColor:COLORS.white, borderRadius:16, marginHorizontal:16, marginTop:16, overflow:'hidden' },
  sectionTitle:{ fontSize:13, fontWeight:'700', color:COLORS.gray, paddingHorizontal:16, paddingTop:14, paddingBottom:8, textTransform:'uppercase', letterSpacing:0.5 },
  settingRow:{ flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:14, borderTopWidth:1, borderTopColor:'#f9fafb', gap:12 },
  settingLabel:{ fontSize:15, fontWeight:'500', color:COLORS.dark },
  settingSubLabel:{ fontSize:12, color:COLORS.gray, marginTop:2 },
  dropdownRow:{ flexDirection:'row', gap:6 },
  optionBtn:{ borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, paddingHorizontal:10, paddingVertical:5 },
  optionBtnActive:{ backgroundColor:COLORS.primary, borderColor:COLORS.primary },
  optionText:{ fontSize:12, color:COLORS.gray },
  optionTextActive:{ color:COLORS.white, fontWeight:'600' },
  linkRow:{ flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:15, borderTopWidth:1, borderTopColor:'#f9fafb', gap:14 },
  linkIcon:{ fontSize:18, width:24, textAlign:'center' },
  linkLabel:{ flex:1, fontSize:15, fontWeight:'500', color:COLORS.dark },
  linkArrow:{ fontSize:20, color:'#d1d5db' },
  logoutBtn:{ marginHorizontal:16, marginTop:16, backgroundColor:COLORS.white, borderRadius:16, padding:16, alignItems:'center' },
  logoutText:{ fontSize:15, fontWeight:'700', color:COLORS.red },
});
