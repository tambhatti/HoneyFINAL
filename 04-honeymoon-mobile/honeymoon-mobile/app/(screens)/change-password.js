import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import UserService from '../../services/user.service';
export default function ChangePasswordScreen(){
  const router=useRouter();
  const [form,setForm]=useState({currentPassword:'',newPassword:'',confirmPassword:''});
  const [loading,setLoading]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  async function save(){
    if(!form.currentPassword||!form.newPassword) return Alert.alert('Required','Fill in all fields');
    if(form.newPassword!==form.confirmPassword) return Alert.alert('Mismatch','New passwords do not match');
    if(form.newPassword.length<6) return Alert.alert('Weak','Password must be at least 6 characters');
    setLoading(true);
    try{ await UserService.changePassword({currentPassword:form.currentPassword,newPassword:form.newPassword}); Alert.alert('Done','Password changed'); router.back(); }
    catch(err){ Alert.alert('Error',err.message); }
    finally{ setLoading(false); }
  }
  return(
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Change Password</Text><View style={{width:32}}/></View>
      <View style={styles.content}>
        {[['Current Password','currentPassword'],['New Password','newPassword'],['Confirm Password','confirmPassword']].map(([l,k])=>(
          <View key={k}><Text style={styles.label}>{l}<Text style={styles.req}> *</Text></Text>
          <TextInput style={styles.input} placeholder={`Enter ${l}`} value={form[k]} onChangeText={v=>f(k,v)} secureTextEntry placeholderTextColor="#9ca3af"/></View>
        ))}
        <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]} onPress={save} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Update Password</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles=StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20},label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6,marginTop:4},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:13,fontSize:14,color:COLORS.dark,marginBottom:14},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center',marginTop:8},btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
