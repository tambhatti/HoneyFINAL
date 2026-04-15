import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import UserService from '../../services/user.service';
export default function RateServiceScreen(){
  const router=useRouter();
  const { bookingId } = useLocalSearchParams();
  const [rating,setRating]=useState(0);
  const [review,setReview]=useState('');
  const [loading,setLoading]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  async function submit(){
    if(!rating||!review) return Alert.alert('Required','Select rating and enter review');
    setLoading(true);
    try{ await UserService.rateBooking(bookingId,{rating,review}); setSubmitted(true); }
    catch(err){ Alert.alert('Error',err.message); }
    finally{ setLoading(false); }
  }
  if(submitted) return(
    <View style={{flex:1,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',padding:24}}>
      <View style={{width:80,height:80,borderRadius:40,backgroundColor:'#f0fdf4',alignItems:'center',justifyContent:'center',marginBottom:20}}><Text style={{fontSize:40}}>⭐</Text></View>
      <Text style={{fontSize:22,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,marginBottom:16}}>Booking Rate successfully.</Text>
      <View style={{flexDirection:'row',gap:4,marginBottom:16}}>{[1,2,3,4,5].map(s=><Text key={s} style={{fontSize:28,color:s<=rating?'#f59e0b':'#e5e7eb'}}>★</Text>)}</View>
      <Text style={{fontSize:14,color:COLORS.gray,textAlign:'center',marginBottom:24}}>Thank you for your feedback!</Text>
      <TouchableOpacity style={{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:15,paddingHorizontal:40}} onPress={()=>router.replace('/(tabs)/bookings')}>
        <Text style={{color:COLORS.white,fontSize:16,fontWeight:'700'}}>Back to Bookings</Text>
      </TouchableOpacity>
    </View>
  );
  return(
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Rate Service</Text><View style={{width:32}}/></View>
      <View style={styles.content}>
        <Text style={styles.label}>Your Rating<Text style={styles.req}> *</Text></Text>
        <View style={styles.starsRow}>{[1,2,3,4,5].map(s=><TouchableOpacity key={s} onPress={()=>setRating(s)}><Text style={{fontSize:40,color:s<=rating?'#f59e0b':'#e5e7eb'}}>★</Text></TouchableOpacity>)}</View>
        <Text style={styles.label}>Review<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.reviewInput} placeholder="Share your experience..." value={review} onChangeText={setReview} multiline textAlignVertical="top" placeholderTextColor="#9ca3af"/>
        <TouchableOpacity style={[styles.btn,(!rating||!review||loading)&&{opacity:0.6}]} onPress={submit} disabled={!rating||!review||loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Submit Review</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles=StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20},label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:8},req:{color:COLORS.red},
  starsRow:{flexDirection:'row',gap:8,marginBottom:20,justifyContent:'center'},
  reviewInput:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,padding:14,height:120,fontSize:14,color:COLORS.dark,marginBottom:20},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center'},btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
