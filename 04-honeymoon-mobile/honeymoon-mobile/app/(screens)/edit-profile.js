import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import UserService from '../../services/user.service';
const AVATAR='https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200';
export default function EditProfileScreen(){
  const router=useRouter();
  const { user, updateUser } = useAuth();
  const [form,setForm]=useState({firstName:user?.firstName||'',lastName:user?.lastName||'',phone:user?.phone||'',email:user?.email||'',gender:user?.gender||''});
  const [loading,setLoading]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  async function save(){
    setLoading(true);
    try{ const data=await UserService.updateProfile(form); updateUser(data.user); Alert.alert('Saved','Profile updated'); router.back(); }
    catch(err){ Alert.alert('Error',err.message); }
    finally{ setLoading(false); }
  }
  return(
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Edit Profile</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarSection}><View style={styles.avatarWrap}><Image source={{uri:AVATAR}} style={styles.avatar}/><TouchableOpacity style={styles.cameraBtn}><Text style={{fontSize:14}}>📷</Text></TouchableOpacity></View></View>
        {[['First Name','firstName'],['Last Name','lastName'],['Phone Number','phone'],['Email address','email']].map(([l,k])=>(
          <View key={k}><Text style={styles.label}>{l}<Text style={styles.req}> *</Text></Text>
          <TextInput style={styles.input} value={form[k]} onChangeText={v=>f(k,v)} placeholderTextColor="#9ca3af" autoCapitalize={k==='email'?'none':'words'}/></View>
        ))}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>{['Male','Female'].map(g=>(
          <TouchableOpacity key={g} onPress={()=>f('gender',g)} style={[styles.genderBtn,form.gender===g&&styles.genderBtnActive]}>
            <Text style={[styles.genderText,form.gender===g&&styles.genderTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}</View>
        <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]} onPress={save} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles=StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},
  avatarSection:{alignItems:'center',marginBottom:24},avatarWrap:{position:'relative'},
  avatar:{width:88,height:88,borderRadius:44,borderWidth:3,borderColor:COLORS.gold},
  cameraBtn:{position:'absolute',bottom:0,right:0,width:28,height:28,borderRadius:14,backgroundColor:COLORS.primary,alignItems:'center',justifyContent:'center'},
  label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6,marginTop:4},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:13,fontSize:14,color:COLORS.dark,marginBottom:14},
  genderRow:{flexDirection:'row',gap:10,marginBottom:20},
  genderBtn:{flex:1,borderWidth:1.5,borderColor:'#e5e7eb',borderRadius:12,paddingVertical:12,alignItems:'center'},
  genderBtnActive:{borderColor:COLORS.primary,backgroundColor:'#f0fdf4'},
  genderText:{fontSize:14,color:COLORS.gray,fontWeight:'500'},genderTextActive:{color:COLORS.primary,fontWeight:'700'},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center'},btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
