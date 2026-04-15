import { View, Text, Image, TouchableOpacity, ScrollView, Modal, TextInput, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
const STATUS_COLOR = { Pending:'#3b82f6', Rejected:'#ef4444', Upcoming:'#f59e0b', Completed:'#16a34a' };
const IMG1='https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80';
const IMG2='https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80';
export default function BookingDetailScreen() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams();
  const { data, loading, refresh } = useApi(UserService.getBooking, id);
  const booking = data?.booking;
  const vendor  = data?.vendor;
  const [rateModal, setRateModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [rateSuccess, setRateSuccess] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  async function cancelBooking() {
    Alert.alert('Cancel Booking','Are you sure?',[
      {text:'No',style:'cancel'},
      {text:'Yes',style:'destructive',onPress:async()=>{
        setCancelLoading(true);
        try{ await UserService.cancelBooking(id); refresh(); Alert.alert('Cancelled','Booking cancelled'); }
        catch(err){ Alert.alert('Error',err.message); }
        finally{ setCancelLoading(false); }
      }}
    ]);
  }
  async function submitRating() {
    if(!rating||!review) return Alert.alert('Required','Select rating and enter review');
    setSubmitLoading(true);
    try{ await UserService.rateBooking(id,{rating,review}); setRateModal(false); setRateSuccess(true); }
    catch(err){ Alert.alert('Error',err.message); }
    finally{ setSubmitLoading(false); }
  }
  if (loading) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color={COLORS.primary}/></View>;
  if (rateSuccess) return (
    <View style={{flex:1,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',padding:24}}>
      <Text style={{fontSize:60,marginBottom:16}}>⭐</Text>
      <Text style={{fontSize:22,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,marginBottom:12}}>Booking Rate successfully.</Text>
      <View style={{flexDirection:'row',gap:4,marginBottom:20}}>{[1,2,3,4,5].map(s=><Text key={s} style={{fontSize:28,color:s<=rating?'#f59e0b':'#e5e7eb'}}>★</Text>)}</View>
      <TouchableOpacity style={styles.rateSuccessBtn} onPress={()=>router.replace('/(tabs)/bookings')}>
        <Text style={{color:COLORS.white,fontSize:16,fontWeight:'700'}}>Back to Bookings</Text>
      </TouchableOpacity>
    </View>
  );
  if (!booking) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{color:COLORS.gray}}>Booking not found</Text></View>;
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <Modal visible={rateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <TouchableOpacity onPress={()=>setRateModal(false)} style={{position:'absolute',top:14,right:14}}><View style={styles.closeCircle}><Text style={{fontSize:14,color:COLORS.gray}}>✕</Text></View></TouchableOpacity>
            <Text style={styles.modalTitle}>Rate Service</Text>
            <View style={{flexDirection:'row',gap:6,marginBottom:16}}>{[1,2,3,4,5].map(s=><TouchableOpacity key={s} onPress={()=>setRating(s)}><Text style={{fontSize:36,color:s<=rating?'#f59e0b':'#e5e7eb'}}>★</Text></TouchableOpacity>)}</View>
            <Text style={{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:8,alignSelf:'flex-start'}}>Review<Text style={{color:COLORS.red}}> *</Text></Text>
            <TextInput style={styles.reviewInput} placeholder="Enter Review" value={review} onChangeText={setReview} multiline textAlignVertical="top" placeholderTextColor="#9ca3af"/>
            <TouchableOpacity style={[styles.submitBtn,(!rating||!review||submitLoading)&&{opacity:0.6}]} onPress={submitRating} disabled={!rating||!review||submitLoading}>
              {submitLoading?<ActivityIndicator color="#fff"/>:<Text style={{color:COLORS.white,fontSize:15,fontWeight:'700'}}>Submit</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Booking Details</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.idRow}>
          <View><Text style={{fontSize:12,color:COLORS.gray}}>Booking ID:</Text><Text style={{fontSize:15,fontWeight:'700',color:COLORS.dark}}>#{booking.id}</Text></View>
          <View style={[styles.statusBadge,{backgroundColor:(STATUS_COLOR[booking.status]||'#6b7280')+'20'}]}><Text style={[styles.statusText,{color:STATUS_COLOR[booking.status]||'#6b7280'}]}>{booking.status}</Text></View>
        </View>
        <Text style={{fontSize:12,color:COLORS.gray}}>Event Date:</Text>
        <Text style={{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:14}}>{new Date(booking.eventDate).toLocaleDateString()}</Text>
        {vendor&&<><Text style={styles.sectionTitle}>Vendor</Text><Text style={{fontSize:14,color:COLORS.dark,marginBottom:12}}>{vendor.companyName} — {vendor.location}</Text></>}
        <Text style={styles.sectionTitle}>Event Details</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:12}}>
          {[['Location',booking.location],['Event Time',booking.eventTime],['Guests',booking.guestCount],['Quantity',booking.quantity]].map(([l,v])=>(
            <View key={l} style={{width:'47%'}}><Text style={{fontSize:12,color:COLORS.gray}}>{l}:</Text><Text style={{fontSize:14,fontWeight:'600',color:COLORS.dark}}>{v||'—'}</Text></View>
          ))}
        </View>
        {booking.additionalNote&&<><Text style={{fontSize:12,color:COLORS.gray}}>Note:</Text><Text style={{fontSize:13,color:COLORS.gray,marginBottom:12,lineHeight:20}}>{booking.additionalNote}</Text></>}
        {booking.rejectionReason&&(
          <View style={styles.rejectionBox}>
            <Text style={{fontSize:13,fontWeight:'700',color:COLORS.red,marginBottom:4}}>Rejection Reason:</Text>
            <Text style={{fontSize:13,color:'#dc2626'}}>{booking.rejectionReason}</Text>
          </View>
        )}
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        {[['Total Amount',`AED ${booking.totalAmount?.toLocaleString()}`],['Deposit',`AED ${booking.depositAmount?.toLocaleString()}`],['Deposit Paid',booking.depositPaid?'Yes':'No'],['Payment Status',booking.paymentStatus]].map(([l,v])=>(
          <View key={l} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:6,borderBottomWidth:1,borderBottomColor:'#f9fafb'}}>
            <Text style={{fontSize:12,color:COLORS.gray}}>{l}</Text>
            <Text style={{fontSize:12,fontWeight:'600',color:COLORS.dark}}>{v}</Text>
          </View>
        ))}
        <View style={{marginTop:20,gap:10}}>
          {booking.status==='Pending'&&(
            <TouchableOpacity style={[styles.cancelBtn,cancelLoading&&{opacity:0.7}]} onPress={cancelBooking} disabled={cancelLoading}>
              {cancelLoading?<ActivityIndicator color="#fff"/>:<Text style={{color:COLORS.white,fontSize:15,fontWeight:'700'}}>Cancel Booking</Text>}
            </TouchableOpacity>
          )}
          {booking.status==='Upcoming'&&!booking.depositPaid&&(
            <TouchableOpacity style={styles.payBtn} onPress={()=>router.push(`/payment-details?bookingId=${booking.id}&amount=${booking.depositAmount}`)}>
              <Text style={{color:COLORS.white,fontSize:15,fontWeight:'700'}}>Pay Deposit</Text>
            </TouchableOpacity>
          )}
          {booking.status==='Completed'&&(
            <TouchableOpacity style={styles.rateBtn} onPress={()=>setRateModal(true)}>
              <Text style={{color:COLORS.white,fontSize:15,fontWeight:'700'}}>Rate Service ★</Text>
            </TouchableOpacity>
          )}
          {(booking.status==='Upcoming'||booking.status==='Completed')&&(
            <TouchableOpacity style={styles.reportBtn} onPress={()=>router.push(`/report-booking?id=${booking.id}`)}>
              <Text style={{color:COLORS.red,fontSize:15,fontWeight:'600'}}>Report Booking</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},
  idRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8},
  statusBadge:{paddingHorizontal:12,paddingVertical:4,borderRadius:20},statusText:{fontSize:13,fontWeight:'600'},
  sectionTitle:{fontSize:16,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,marginBottom:10,marginTop:6},
  rejectionBox:{backgroundColor:'#fef2f2',borderRadius:12,padding:14,marginBottom:14,borderWidth:1,borderColor:'#fee2e2'},
  cancelBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:15,alignItems:'center'},
  payBtn:{backgroundColor:COLORS.primary,borderRadius:12,paddingVertical:15,alignItems:'center'},
  rateBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:15,alignItems:'center'},
  reportBtn:{borderWidth:1.5,borderColor:COLORS.red,borderRadius:12,paddingVertical:13,alignItems:'center'},
  rateSuccessBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:15,paddingHorizontal:40},
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.6)',alignItems:'center',justifyContent:'center'},
  modal:{backgroundColor:COLORS.white,borderRadius:20,padding:24,width:'88%',alignItems:'center'},
  closeCircle:{width:28,height:28,borderRadius:14,borderWidth:1,borderColor:'#e5e7eb',alignItems:'center',justifyContent:'center'},
  modalTitle:{fontSize:20,fontWeight:'700',color:COLORS.dark,marginBottom:16},
  reviewInput:{width:'100%',borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,padding:14,height:110,fontSize:14,color:COLORS.dark,marginBottom:16},
  submitBtn:{width:'100%',backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:14,alignItems:'center'},
});
