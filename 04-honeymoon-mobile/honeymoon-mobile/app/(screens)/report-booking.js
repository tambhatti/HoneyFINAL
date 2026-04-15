import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import UserService from '../../services/user.service';
const REASONS=['Service Not As Described','No Show','Poor Quality','Rude Behavior','Overcharged','Other'];
export default function ReportBookingScreen(){
  const router=useRouter();
  const { id } = useLocalSearchParams();
  const [selected,setSelected]=useState([]);
  const [details,setDetails]=useState('');
  const [loading,setLoading]=useState(false);
  function toggle(r){ setSelected(p=>p.includes(r)?p.filter(x=>x!==r):[...p,r]); }
  async function submit(){
    if(!selected.length||!details) return Alert.alert('Required','Select at least one reason and enter details');
    setLoading(true);
    try{ await UserService.reportBooking(id,{reasons:selected,details}); Alert.alert('Reported','Your report has been submitted.'); router.back(); }
    catch(err){ Alert.alert('Error',err.message); }
    finally{ setLoading(false); }
  }
  return(
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Report Booking</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.bookingId}>Booking #{id}</Text>
        <Text style={styles.label}>Select Reason(s)<Text style={styles.req}> *</Text></Text>
        {REASONS.map(r=>(
          <TouchableOpacity key={r} onPress={()=>toggle(r)} style={[styles.reasonRow,selected.includes(r)&&styles.reasonRowActive]}>
            <View style={[styles.checkbox,selected.includes(r)&&styles.checkboxActive]}>{selected.includes(r)&&<Text style={{color:COLORS.white,fontSize:11,fontWeight:'700'}}>✓</Text>}</View>
            <Text style={styles.reasonText}>{r}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.label}>Details<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.textArea} placeholder="Describe the issue in detail..." value={details} onChangeText={setDetails} multiline textAlignVertical="top" placeholderTextColor="#9ca3af"/>
        <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]} onPress={submit} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Submit Report</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles=StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},
  bookingId:{fontSize:16,fontWeight:'700',color:COLORS.dark,marginBottom:16},
  label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:8},req:{color:COLORS.red},
  reasonRow:{flexDirection:'row',alignItems:'center',gap:12,padding:14,borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,marginBottom:8},
  reasonRowActive:{borderColor:COLORS.primary,backgroundColor:'#f0fdf4'},
  checkbox:{width:20,height:20,borderRadius:10,borderWidth:1.5,borderColor:'#d1d5db',alignItems:'center',justifyContent:'center'},
  checkboxActive:{backgroundColor:COLORS.primary,borderColor:COLORS.primary},
  reasonText:{fontSize:14,color:COLORS.dark,flex:1},
  textArea:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,padding:14,height:110,fontSize:14,color:COLORS.dark,marginBottom:20},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center'},btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
