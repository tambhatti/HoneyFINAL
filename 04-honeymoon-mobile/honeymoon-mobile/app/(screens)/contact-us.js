import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import UserService from '../../services/user.service';
export default function ContactUsScreen(){
  const router=useRouter();
  const [form,setForm]=useState({name:'',email:'',subject:'',message:''});
  const [loading,setLoading]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  async function submit(){
    if(!form.subject||!form.message) return Alert.alert('Required','Enter subject and message');
    setLoading(true);
    try{ await UserService.contactUs(form); Alert.alert('Sent!','We\'ll get back to you soon.'); router.back(); }
    catch(err){ Alert.alert('Error',err.message); }
    finally{ setLoading(false); }
  }
  return(
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Contact Us</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.infoCard}>
          {[['📧','support@honeymoon.ae'],['📞','+971 4 123 4567'],['📍','Dubai, United Arab Emirates']].map(([icon,val])=>(
            <View key={val} style={styles.infoRow}><Text style={{fontSize:18}}>{icon}</Text><Text style={styles.infoVal}>{val}</Text></View>
          ))}
        </View>
        {[['Name','name','Your name'],['Email','email','Your email'],['Subject','subject','Subject']].map(([l,k,ph])=>(
          <View key={k}><Text style={styles.label}>{l}<Text style={styles.req}> *</Text></Text>
          <TextInput style={styles.input} placeholder={ph} value={form[k]} onChangeText={v=>f(k,v)} placeholderTextColor="#9ca3af" autoCapitalize={k==='email'?'none':'sentences'}/></View>
        ))}
        <Text style={styles.label}>Message<Text style={styles.req}> *</Text></Text>
        <TextInput style={[styles.input,{height:120,textAlignVertical:'top'}]} placeholder="Your message..." value={form.message} onChangeText={v=>f('message',v)} multiline placeholderTextColor="#9ca3af"/>
        <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]} onPress={submit} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Send Message</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles=StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},
  infoCard:{backgroundColor:'#f9f6ef',borderRadius:16,padding:16,marginBottom:20,gap:10},
  infoRow:{flexDirection:'row',alignItems:'center',gap:10},infoVal:{fontSize:14,color:COLORS.dark,fontWeight:'500'},
  label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6,marginTop:4},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:13,fontSize:14,color:COLORS.dark,marginBottom:14},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center',marginTop:8},btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
