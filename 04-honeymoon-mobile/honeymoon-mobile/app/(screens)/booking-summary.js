import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
export default function BookingSummaryScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const { data, loading } = useApi(UserService.getBooking, bookingId);
  const [loyaltyApplied, setLoyaltyApplied] = useState(false);
  const booking = data?.booking;
  const { data: loyaltyData } = useApi(UserService.getLoyalty);
  const loyaltyPoints = loyaltyData?.points || 0;
  const loyaltyValue  = loyaltyData?.pointsValue || 0;
  async function handlePay() {
    router.push(`/payment-details?bookingId=${bookingId}&amount=${booking?.depositAmount}&loyaltyApplied=${loyaltyApplied}`);
  }
  if (loading) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color={COLORS.primary}/></View>;
  if (!booking) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{color:COLORS.gray}}>Booking not found</Text></View>;
  const discount = loyaltyApplied ? parseFloat(loyaltyValue) : 0;
  const totalPay = Math.max(0, (booking.depositAmount || 0) - discount);
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Service Details</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceName}>Booking #{booking.id}</Text>
          <View style={styles.statusBadge}><Text style={styles.statusText}>{booking.status}</Text></View>
        </View>
        {loyaltyPoints > 0 && (
          <View style={styles.loyaltyRow}>
            <Text style={styles.loyaltyText}>You have {loyaltyPoints} pts ≈ AED {loyaltyValue}</Text>
            <TouchableOpacity style={styles.loyaltyBtn} onPress={()=>setLoyaltyApplied(!loyaltyApplied)}>
              <Text style={styles.loyaltyBtnText}>{loyaltyApplied?'Remove':'Use Loyalty Points'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {loyaltyApplied && (
          <View style={styles.loyaltyApplied}>
            <Text style={styles.loyaltyAppliedText}>⭐ {loyaltyPoints} loyalty points applied (AED {loyaltyValue} discount)</Text>
          </View>
        )}
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        {[
          ['Total Amount', `AED ${booking.totalAmount?.toLocaleString()}`, true],
          ['Initial Deposit (20%)', `AED ${booking.depositAmount?.toLocaleString()}`, true],
          ['Amount To Pay Later', `AED ${((booking.totalAmount||0) - (booking.depositAmount||0)).toLocaleString()}`, false],
          ...(loyaltyApplied ? [['Loyalty Discount', `- AED ${discount.toFixed(2)}`, false]] : []),
          ['Pay Now', `AED ${totalPay.toFixed(2)}`, true],
        ].map(([l,v,bold], i)=>(
          <View key={i} style={styles.payRow}>
            <Text style={[styles.payLabel,bold&&styles.payLabelBold]}>{l}</Text>
            <Text style={[styles.payValue,bold&&styles.payValueBold]}>{v}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.bookBtn} onPress={handlePay} activeOpacity={0.85}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},
  serviceRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12},
  serviceName:{fontSize:18,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  statusBadge:{backgroundColor:'#f0fdf4',borderRadius:20,paddingHorizontal:10,paddingVertical:4},
  statusText:{fontSize:12,color:COLORS.green,fontWeight:'600'},
  loyaltyRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fafafa',borderRadius:12,padding:12,marginBottom:8},
  loyaltyText:{fontSize:12,color:COLORS.gray,flex:1},
  loyaltyBtn:{backgroundColor:COLORS.gold,borderRadius:8,paddingHorizontal:12,paddingVertical:8},
  loyaltyBtnText:{fontSize:11,color:COLORS.white,fontWeight:'600'},
  loyaltyApplied:{backgroundColor:'#fef3c7',borderRadius:10,padding:10,marginBottom:12},
  loyaltyAppliedText:{fontSize:12,color:'#92400e',fontWeight:'500'},
  sectionTitle:{fontSize:17,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,marginBottom:12,marginTop:8},
  payRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#f9fafb'},
  payLabel:{fontSize:13,color:COLORS.gray,flex:1},payLabelBold:{fontWeight:'700',color:COLORS.dark},
  payValue:{fontSize:13,color:COLORS.gray},payValueBold:{fontWeight:'700',color:COLORS.dark},
  bookBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center',marginTop:20},
  bookBtnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
