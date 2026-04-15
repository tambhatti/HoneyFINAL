import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS, RADIUS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { loginEmail, loginUAEPass, loginMobile } = useAuth();
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin() {
    if (!email || !password) return Alert.alert('Required', 'Enter email and password');
    setLoading(true);
    try {
      await loginEmail(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  }

  async function handleUAEPass() {
    setLoading(true);
    try { await loginUAEPass(); router.replace('/(tabs)/home'); }
    catch (err) { Alert.alert('UAE Pass Error', err.message); }
    finally { setLoading(false); }
  }

  async function handleMobileLogin() {
    if (!otp) return Alert.alert('Required', 'Enter the OTP');
    setLoading(true);
    try { await loginMobile(phone, otp); router.replace('/(tabs)/home'); }
    catch (err) { Alert.alert('Login Failed', err.message); }
    finally { setLoading(false); }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Login</Text>
      <View style={styles.tabRow}>
        {[['email','Email'],['uae','UAE Pass'],['mobile','Mobile']].map(([k,l])=>(
          <TouchableOpacity key={k} onPress={()=>setTab(k)} style={[styles.tabBtn, tab===k&&styles.tabBtnActive]}>
            <Text style={[styles.tabText, tab===k&&styles.tabTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab==='email'&&<>
        <Text style={styles.label}>Email address<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.input} placeholder="Enter Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9ca3af"/>
        <Text style={styles.label}>Password<Text style={styles.req}> *</Text></Text>
        <View style={styles.pwRow}>
          <TextInput style={[styles.input,{flex:1,marginBottom:0}]} placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry={!showPw} placeholderTextColor="#9ca3af"/>
          <TouchableOpacity onPress={()=>setShowPw(!showPw)} style={{padding:8}}><Text style={{fontSize:18}}>{showPw?'👁':'👁‍🗨'}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=>router.push('/(auth)/forgot-password')} style={{alignSelf:'flex-end', marginBottom:20}}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnGold,loading&&{opacity:0.7}]} onPress={handleEmailLogin} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Login</Text>}
        </TouchableOpacity>
      </>}

      {tab==='uae'&&<>
        <Text style={styles.uaeDesc}>Login securely using your UAE Pass digital identity.</Text>
        <TouchableOpacity style={[styles.btnPrimary,loading&&{opacity:0.7}]} onPress={handleUAEPass} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Login With UAE Pass</Text>}
        </TouchableOpacity>
      </>}

      {tab==='mobile'&&<>
        <Text style={styles.label}>Phone Number<Text style={styles.req}> *</Text></Text>
        <View style={styles.phoneRow}>
          <View style={styles.flag}><Text>🇦🇪 +971</Text></View>
          <TextInput style={[styles.input,{flex:1,marginBottom:0}]} placeholder="5X XXX XXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor="#9ca3af"/>
        </View>
        {!showOtp
          ?<TouchableOpacity style={styles.btnGold} onPress={()=>{if(phone){setShowOtp(true);Alert.alert('OTP Sent',`Code sent to +971${phone}`)}}}>
            <Text style={styles.btnText}>Send OTP</Text></TouchableOpacity>
          :<>
            <Text style={styles.label}>OTP<Text style={styles.req}> *</Text></Text>
            <TextInput style={styles.input} placeholder="Enter 6-digit OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" placeholderTextColor="#9ca3af"/>
            <TouchableOpacity style={[styles.btnGold,loading&&{opacity:0.7}]} onPress={handleMobileLogin} disabled={loading}>
              {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Verify & Login</Text>}
            </TouchableOpacity>
          </>
        }
      </>}

      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Not A User? </Text>
        <TouchableOpacity onPress={()=>router.push('/(auth)/signup')}><Text style={styles.signupLink}>Sign Up Now</Text></TouchableOpacity>
      </View>
      <TouchableOpacity onPress={()=>router.replace('/(tabs)/home')} style={{alignItems:'center',marginTop:8}}>
        <Text style={styles.skipText}>Skip Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  content:{paddingHorizontal:24,paddingTop:Platform.OS==='ios'?70:50,paddingBottom:40},
  title:{fontSize:32,fontWeight:'700',fontFamily:'serif',textAlign:'center',marginBottom:24,color:COLORS.dark},
  tabRow:{flexDirection:'row',backgroundColor:'#f3f4f6',borderRadius:12,padding:4,marginBottom:24},
  tabBtn:{flex:1,paddingVertical:8,alignItems:'center',borderRadius:8},
  tabBtnActive:{backgroundColor:COLORS.white,elevation:2,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.1,shadowRadius:4},
  tabText:{fontSize:12,fontWeight:'500',color:COLORS.gray},
  tabTextActive:{color:COLORS.dark,fontWeight:'700'},
  label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6},
  req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:COLORS.grayLight,borderRadius:12,paddingHorizontal:14,paddingVertical:14,fontSize:14,color:COLORS.dark,marginBottom:16},
  pwRow:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:COLORS.grayLight,borderRadius:12,paddingHorizontal:14,backgroundColor:COLORS.white,marginBottom:16},
  forgotText:{fontSize:14,color:COLORS.red,textDecorationLine:'underline'},
  btnGold:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center',marginBottom:12},
  btnPrimary:{backgroundColor:COLORS.primary,borderRadius:12,paddingVertical:16,alignItems:'center',marginBottom:24},
  btnText:{color:COLORS.white,fontSize:16,fontWeight:'600'},
  uaeDesc:{fontSize:14,color:COLORS.gray,textAlign:'center',marginBottom:20,lineHeight:22},
  phoneRow:{flexDirection:'row',gap:8,marginBottom:16},
  flag:{borderWidth:1,borderColor:COLORS.grayLight,borderRadius:12,paddingHorizontal:12,paddingVertical:14,justifyContent:'center'},
  signupRow:{flexDirection:'row',justifyContent:'center',marginBottom:16,marginTop:12},
  signupText:{fontSize:14,color:COLORS.gray},
  signupLink:{fontSize:14,color:COLORS.primary,fontWeight:'600'},
  skipText:{fontSize:14,color:COLORS.gold,textDecorationLine:'underline'},
});
