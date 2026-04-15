import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import UserService from '../../services/user.service';
export default function RequestMeetingScreen(){
  const router=useRouter();
  const { vendorId } = useLocalSearchParams();
  const [form,setForm]=useState({name:'',phone:'',email:'',reason:''});
  const [loading,setLoading]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  async function submit(){
    if(!form.name||!form.reason) return Alert.alert('Required','Enter name and reason');
    if(!vendorId) return Alert.alert('Error','No vendor selected');
    setLoading(true);
    try{ await UserService.requestMeeting({vendorId,...form}); Alert.alert('Sent','Meeting request sent!'); router.back(); }
    catch(err){ Alert.alert('Error',err.message); }
    finally{ setLoading(false); }
  }
  return(
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Request Meeting</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Name<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.input} placeholder="Enter Name" value={form.name} onChangeText={v=>f('name',v)} placeholderTextColor="#9ca3af"/>
        <Text style={styles.label}>Phone Number<Text style={styles.req}> *</Text></Text>
        <View style={styles.phoneRow}><View style={styles.countryCode}><Text>🇦🇪 +971 ▾</Text></View>
        <TextInput style={[styles.input,{flex:1,marginBottom:0}]} placeholder="Enter Phone Number" value={form.phone} onChangeText={v=>f('phone',v)} keyboardType="phone-pad" placeholderTextColor="#9ca3af"/></View>
        <Text style={styles.label}>Email address<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.input} placeholder="Enter Email address" value={form.email} onChangeText={v=>f('email',v)} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9ca3af"/>
        <Text style={styles.label}>Request Reason</Text>
        <TextInput style={[styles.input,{height:110,textAlignVertical:'top'}]} placeholder="Enter Request Reason" value={form.reason} onChangeText={v=>f('reason',v)} multiline placeholderTextColor="#9ca3af"/>
        <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]} onPress={submit} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Request Now</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles=StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6,marginTop:4},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:13,fontSize:14,color:COLORS.dark,marginBottom:14},
  phoneRow:{flexDirection:'row',gap:8,marginBottom:14},
  countryCode:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:12,paddingVertical:13,justifyContent:'center'},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center'},btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
