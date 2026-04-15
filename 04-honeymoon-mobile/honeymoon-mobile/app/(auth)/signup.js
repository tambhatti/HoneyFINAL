import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', confirm:'', referralCode:'' });
  const [loading, setLoading] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  async function handleSignup() {
    if (!form.firstName || !form.email || !form.password)
      return Alert.alert('Required', 'Please fill in all required fields');
    if (form.password !== form.confirm)
      return Alert.alert('Mismatch', 'Passwords do not match');
    if (form.password.length < 6)
      return Alert.alert('Weak', 'Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup({ firstName: form.firstName, lastName: form.lastName, email: form.email.trim(),
        password: form.password, phone: form.phone, referralCode: form.referralCode || undefined });
      router.replace('/(tabs)/home');
    } catch (err) {
      Alert.alert('Signup Failed', err.message || 'Something went wrong');
    } finally { setLoading(false); }
  }

  return (
    <ScrollView style={{flex:1,backgroundColor:COLORS.white}} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={()=>router.back()} style={{marginBottom:16}}><Text style={styles.back}>‹</Text></TouchableOpacity>
      <Text style={styles.title}>Sign Up</Text>
      {[
        ['First Name','firstName','Enter first name','default'],
        ['Last Name','lastName','Enter last name','default'],
        ['Email address','email','Enter Email address','email-address'],
        ['Phone Number','phone','Enter phone number','phone-pad'],
        ['Referral Code','referralCode','Optional referral code','default'],
      ].map(([l,k,ph,kt])=>(
        <View key={k}>
          <Text style={styles.label}>{l}{k!=='referralCode'&&<Text style={styles.req}> *</Text>}</Text>
          <TextInput style={styles.input} placeholder={ph} value={form[k]} onChangeText={v=>f(k,v)} keyboardType={kt} autoCapitalize="none" placeholderTextColor="#9ca3af"/>
        </View>
      ))}
      <Text style={styles.label}>Password<Text style={styles.req}> *</Text></Text>
      <TextInput style={styles.input} placeholder="Enter password" value={form.password} onChangeText={v=>f('password',v)} secureTextEntry placeholderTextColor="#9ca3af"/>
      <Text style={styles.label}>Confirm Password<Text style={styles.req}> *</Text></Text>
      <TextInput style={styles.input} placeholder="Confirm password" value={form.confirm} onChangeText={v=>f('confirm',v)} secureTextEntry placeholderTextColor="#9ca3af"/>
      <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]} onPress={handleSignup} disabled={loading}>
        {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Create Account</Text>}
      </TouchableOpacity>
      <View style={{flexDirection:'row',justifyContent:'center'}}>
        <Text style={{color:COLORS.gray}}>Already have an account? </Text>
        <TouchableOpacity onPress={()=>router.back()}><Text style={{color:COLORS.primary,fontWeight:'600'}}>Login</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  content:{paddingHorizontal:24,paddingTop:Platform.OS==='ios'?60:40,paddingBottom:40},
  back:{fontSize:32,color:COLORS.dark},
  title:{fontSize:32,fontWeight:'700',fontFamily:'serif',textAlign:'center',marginBottom:28,color:COLORS.dark},
  label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#d1d5db',borderRadius:12,paddingHorizontal:14,paddingVertical:14,fontSize:14,color:COLORS.dark,marginBottom:14},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center',marginBottom:20},
  btnText:{color:COLORS.white,fontSize:16,fontWeight:'600'},
});
