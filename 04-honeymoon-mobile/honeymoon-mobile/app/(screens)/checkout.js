import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import UserService from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
const DAYS=['M','T','W','T','F','S','S'];
const CAL=[[null,null,null,null,null,1,2],[3,4,5,6,7,8,9],[10,11,12,13,14,15,16],[17,18,19,20,21,22,23],[24,25,26,27,28,29,30]];
export default function CheckoutScreen() {
  const router = useRouter();
  const { serviceId, vendorId, addons } = useLocalSearchParams();
  const { user, isLoggedIn } = useAuth();
  const [form, setForm] = useState({ name: user?.firstName || '', phone: user?.phone || '', email: user?.email || '', location:'', guests:'', quantity:'', note:'' });
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime,   setEndTime]   = useState('');
  const [loading, setLoading] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  async function confirm() {
    if (!isLoggedIn) return router.push('/(auth)/login');
    if (!selectedDay || !form.location || !form.guests) return Alert.alert('Required','Fill in location, guests and select a date');
    setLoading(true);
    try {
      const booking = await UserService.createBooking({
        serviceId, vendorId,
        eventDate: `2026-03-${String(selectedDay).padStart(2,'0')}`,
        eventTime: startTime && endTime ? `${startTime} - ${endTime}` : 'TBD',
        guestCount: parseInt(form.guests),
        quantity: parseInt(form.quantity) || 1,
        addons: addons ? addons.split(',').filter(Boolean) : [],
        location: form.location,
        additionalNote: form.note,
      });
      router.push(`/booking-summary?bookingId=${booking.booking?.id}`);
    } catch(err) { Alert.alert('Error', err.message); }
    finally { setLoading(false); }
  }
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Checkout</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {[['Name','name','Enter Name'],['Email address','email','Enter Email address'],['Location','location','Select location'],['No.of Guests','guests','Enter No.of Guests'],['Quantity','quantity','Enter Quantity']].map(([l,k,ph])=>(
          <View key={k}><Text style={styles.label}>{l}<Text style={styles.req}> *</Text></Text>
          <TextInput style={styles.input} placeholder={ph} value={form[k]} onChangeText={v=>f(k,v)} keyboardType={['guests','quantity'].includes(k)?'number-pad':'default'} placeholderTextColor="#9ca3af"/></View>
        ))}
        <Text style={styles.label}>Phone Number<Text style={styles.req}> *</Text></Text>
        <View style={styles.phoneRow}><View style={styles.countryCode}><Text>🇦🇪 +971</Text></View>
        <TextInput style={[styles.input,{flex:1,marginBottom:0}]} placeholder="Enter Phone Number" value={form.phone} onChangeText={v=>f('phone',v)} keyboardType="phone-pad" placeholderTextColor="#9ca3af"/></View>
        <Text style={styles.label}>Event Date</Text>
        <View style={styles.calendar}>
          <View style={styles.calHeader}><TouchableOpacity><Text style={styles.calNav}>‹</Text></TouchableOpacity><Text style={styles.calMonth}>March 2026 ▾</Text><TouchableOpacity><Text style={styles.calNav}>›</Text></TouchableOpacity></View>
          <View style={styles.calDays}>{DAYS.map((d,i)=><Text key={i} style={styles.calDayLabel}>{d}</Text>)}</View>
          {CAL.map((week,i)=>(
            <View key={i} style={styles.calWeek}>{week.map((d,j)=>(
              <TouchableOpacity key={j} onPress={()=>d&&setSelectedDay(d)} style={[styles.calDay,d===selectedDay&&styles.calDaySelected,!d&&{opacity:0}]}>
                <Text style={[styles.calDayText,d===selectedDay&&{color:COLORS.white}]}>{d||''}</Text>
              </TouchableOpacity>
            ))}</View>
          ))}
        </View>
        {[['Start Time',startTime,setStartTime],['End Time',endTime,setEndTime]].map(([l,v,sv])=>(
          <View key={l}><Text style={styles.label}>{l}<Text style={styles.req}> *</Text></Text>
          <TextInput style={styles.input} placeholder={`Select ${l} (e.g. 10:00)`} value={v} onChangeText={sv} placeholderTextColor="#9ca3af"/></View>
        ))}
        <Text style={styles.label}>Additional Note</Text>
        <TextInput style={[styles.input,{height:90,textAlignVertical:'top'}]} placeholder="Enter Additional Note" value={form.note} onChangeText={v=>f('note',v)} multiline placeholderTextColor="#9ca3af"/>
        <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]} onPress={confirm} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Confirm</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6,marginTop:4},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:13,fontSize:14,color:COLORS.dark,marginBottom:14},
  phoneRow:{flexDirection:'row',gap:8,marginBottom:14},countryCode:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:12,paddingVertical:13,justifyContent:'center'},
  calendar:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,padding:14,marginBottom:14},
  calHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},
  calNav:{fontSize:20,color:COLORS.dark,paddingHorizontal:8},calMonth:{fontSize:14,fontWeight:'700',color:COLORS.dark},
  calDays:{flexDirection:'row',justifyContent:'space-around',marginBottom:6},calDayLabel:{fontSize:12,color:COLORS.gray,width:32,textAlign:'center'},
  calWeek:{flexDirection:'row',justifyContent:'space-around',marginBottom:4},
  calDay:{width:32,height:32,borderRadius:16,alignItems:'center',justifyContent:'center'},
  calDaySelected:{backgroundColor:COLORS.red},calDayText:{fontSize:13,color:COLORS.dark},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center'},btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
