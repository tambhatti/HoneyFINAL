import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import UserService from '../../services/user.service';
export default function RejectionReasonScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit() {
    if (!reason) return Alert.alert('Required','Enter a reason');
    setLoading(true);
    try {
      await UserService.cancelBooking(bookingId);
      Alert.alert('Cancelled','Your booking has been cancelled.');
      router.replace('/(tabs)/bookings');
    } catch(err) { Alert.alert('Error', err.message); }
    finally { setLoading(false); }
  }
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Rejection Reason</Text><View style={{width:32}}/></View>
      <View style={styles.content}>
        <Text style={styles.label}>Validity Date<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.textArea} placeholder="Enter reason for cancellation..." value={reason} onChangeText={setReason} multiline textAlignVertical="top" placeholderTextColor="#9ca3af"/>
        <TouchableOpacity style={[styles.btn,(!reason||loading)&&{opacity:0.6}]} onPress={submit} disabled={!reason||loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Submit</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20},label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:8},req:{color:COLORS.red},
  textArea:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,padding:14,height:200,fontSize:14,color:COLORS.dark,marginBottom:20},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center'},btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
