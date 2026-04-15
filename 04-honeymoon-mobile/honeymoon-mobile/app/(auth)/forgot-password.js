import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import AuthService from '../../services/auth.service';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleStep1() {
    if (!email) return Alert.alert('Required','Enter your email');
    setLoading(true);
    try {
      await AuthService.forgotPassword(email.trim());
      setStep(2);
      Alert.alert('OTP Sent', `A code was sent to ${email}`);
    } catch(err) { Alert.alert('Error', err.message); }
    finally { setLoading(false); }
  }

  async function handleStep2() {
    const code = otp.join('');
    if (code.length < 4) return Alert.alert('Required','Enter the OTP');
    setLoading(true);
    try { await AuthService.verifyOtp(email, code); setStep(3); }
    catch(err) { Alert.alert('Invalid OTP', err.message); }
    finally { setLoading(false); }
  }

  async function handleStep3() {
    if (!newPw || newPw !== confirmPw) return Alert.alert('Error','Passwords must match');
    setLoading(true);
    try { await AuthService.resetPassword(email, newPw); setStep(4); }
    catch(err) { Alert.alert('Error', err.message); }
    finally { setLoading(false); }
  }

  const titles = ['Forgot Password','Verify OTP','Reset Password','Success!'];
  const subs = ['Enter your email to receive a reset code.','Enter the 6-digit code sent to your email.','Enter your new password.','Your password has been reset successfully.'];

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={()=>step>1?setStep(s=>s-1):router.back()} style={{marginBottom:24}}>
        <Text style={styles.back}>‹</Text>
      </TouchableOpacity>
      <View style={styles.iconCircle}><Text style={{fontSize:32}}>{step===4?'✅':'🔒'}</Text></View>
      <Text style={styles.title}>{titles[step-1]}</Text>
      <Text style={styles.sub}>{subs[step-1]}</Text>

      {step===1&&<>
        <Text style={styles.label}>Email address<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9ca3af"/>
      </>}
      {step===2&&(
        <View style={styles.otpRow}>
          {otp.map((d,i)=>(
            <TextInput key={i} style={styles.otpInput} value={d} maxLength={1} keyboardType="number-pad" placeholderTextColor="#9ca3af"
              onChangeText={v=>{const n=[...otp];n[i]=v;setOtp(n);}}/>
          ))}
        </View>
      )}
      {step===3&&<>
        <Text style={styles.label}>New Password<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.input} placeholder="Enter new password" value={newPw} onChangeText={setNewPw} secureTextEntry placeholderTextColor="#9ca3af"/>
        <Text style={styles.label}>Confirm Password<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.input} placeholder="Confirm new password" value={confirmPw} onChangeText={setConfirmPw} secureTextEntry placeholderTextColor="#9ca3af"/>
      </>}

      {step<4?(
        <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]}
          onPress={step===1?handleStep1:step===2?handleStep2:handleStep3} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>{step===3?'Reset Password':'Continue'}</Text>}
        </TouchableOpacity>
      ):(
        <TouchableOpacity style={styles.btn} onPress={()=>router.replace('/(auth)/login')}>
          <Text style={styles.btnText}>Back to Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white,paddingHorizontal:24,paddingTop:Platform.OS==='ios'?60:40},
  back:{fontSize:32,color:COLORS.dark},
  iconCircle:{width:80,height:80,borderRadius:40,backgroundColor:'#f0fdf4',alignItems:'center',justifyContent:'center',alignSelf:'center',marginBottom:20},
  title:{fontSize:28,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,textAlign:'center',marginBottom:8},
  sub:{fontSize:14,color:COLORS.gray,textAlign:'center',marginBottom:28,lineHeight:22},
  label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#d1d5db',borderRadius:12,paddingHorizontal:14,paddingVertical:14,fontSize:14,color:COLORS.dark,marginBottom:16},
  otpRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:24},
  otpInput:{width:48,height:56,borderWidth:1.5,borderColor:'#d1d5db',borderRadius:12,textAlign:'center',fontSize:22,fontWeight:'700',color:COLORS.dark},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center',marginTop:8},
  btnText:{color:COLORS.white,fontSize:16,fontWeight:'600'},
});
