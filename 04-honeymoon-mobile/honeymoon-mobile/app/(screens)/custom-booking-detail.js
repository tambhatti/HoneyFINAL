import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';

const STATUS_COLOR = { Requested:'#3b82f6', Pending:'#f59e0b', Upcoming:'#8b5cf6', Completed:'#16a34a', Rejected:'#ef4444' };

function PieDonut({ label, amount, color }) {
  return (
    <View style={{ alignItems:'center', flex:1 }}>
      <View style={[styles.donut, { borderColor: color }]}>
        <Text style={styles.donutAmount}>AED {amount?.toLocaleString()}</Text>
      </View>
      <Text style={styles.donutLabel}>{label}</Text>
    </View>
  );
}

export default function CustomBookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data, loading, refresh } = useApi(UserService.getMyCustomQuotation, id);
  const quotation = data?.quotation;
  const vendor    = data?.vendor;

  async function handleConfirm() {
    Alert.alert('Confirm Quotation', 'Accept this quotation from the vendor?', [
      { text:'Cancel', style:'cancel' },
      { text:'Confirm', onPress: async () => {
        try { await UserService.confirmQuotation(id); refresh(); Alert.alert('Confirmed!','Your booking is now Upcoming.'); }
        catch(err) { Alert.alert('Error', err.message); }
      }}
    ]);
  }

  if (loading) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color={COLORS.primary}/></View>;
  if (!quotation) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{color:COLORS.gray}}>Quotation not found</Text></View>;

  const ai = quotation.aiRecommendedBudget || {};

  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <Text style={styles.title}>Booking Details</Text>
        <View style={{width:32}}/>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={styles.statusRow}>
          <Text style={styles.reqId}>#{quotation.id}</Text>
          <View style={[styles.badge,{backgroundColor:(STATUS_COLOR[quotation.status]||'#6b7280')+'20'}]}>
            <Text style={[styles.badgeText,{color:STATUS_COLOR[quotation.status]||'#6b7280'}]}>{quotation.status}</Text>
          </View>
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Services To Be Availed</Text>
        <View style={styles.tagsRow}>
          {(quotation.services||[]).map((s,i)=>(
            <View key={i} style={styles.tag}><Text style={styles.tagText}>{s}</Text></View>
          ))}
        </View>

        {/* Event info */}
        <View style={styles.infoGrid}>
          {[['Location',quotation.location],['Event Date',new Date(quotation.eventDate).toLocaleDateString()],['Guests',quotation.guestCount],['Budget Range',`AED ${quotation.budgetMin?.toLocaleString()} – ${quotation.budgetMax?.toLocaleString()}`]].map(([l,v])=>(
            <View key={l} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{l}:</Text>
              <Text style={styles.infoValue}>{v}</Text>
            </View>
          ))}
        </View>

        {quotation.additionalNote&&(
          <><Text style={styles.sectionTitle}>Additional Note:</Text>
          <Text style={styles.noteText}>{quotation.additionalNote}</Text></>
        )}

        {/* AI Recommendation */}
        <Text style={styles.sectionTitle}>AI Recommendation</Text>
        <Text style={styles.aiMsg}>Most couples in {quotation.location} with {quotation.guestCount} guests spend AED {ai.min?.toLocaleString()} – {ai.max?.toLocaleString()} on average</Text>
        <View style={styles.donutRow}>
          <PieDonut label="Your Budget Range" amount={quotation.budgetMax} color={COLORS.gold}/>
          <PieDonut label="AI Recommended" amount={ai.average} color={COLORS.primary}/>
        </View>

        {/* Vendor quotation */}
        {quotation.quotationAmount && (
          <>
            <Text style={styles.sectionTitle}>Vendor Quotation</Text>
            {vendor && <Text style={styles.vendorName}>From: {vendor.companyName}</Text>}
            <View style={styles.quotationCard}>
              {[['Quotation Amount',`AED ${quotation.quotationAmount?.toLocaleString()}`],['Initial Deposit (20%)',`AED ${(quotation.quotationAmount*0.2).toLocaleString()}`],['Amount To Pay Later',`AED ${(quotation.quotationAmount*0.8).toLocaleString()}`]].map(([l,v])=>(
                <View key={l} style={styles.payRow}>
                  <Text style={styles.payLabel}>{l}</Text>
                  <Text style={styles.payValue}>{v}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Actions */}
        {quotation.status === 'Pending' && (
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
            <Text style={styles.confirmBtnText}>Confirm Quotation</Text>
          </TouchableOpacity>
        )}
        {quotation.status === 'Upcoming' && (
          <TouchableOpacity style={styles.payBtn} onPress={()=>router.push(`/payment-details?bookingId=${id}&amount=${quotation.quotationAmount*0.2}`)}>
            <Text style={styles.payBtnText}>Make Payment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},
  statusRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:14},
  reqId:{fontSize:15,fontWeight:'700',color:COLORS.dark},
  badge:{paddingHorizontal:12,paddingVertical:4,borderRadius:20},badgeText:{fontSize:12,fontWeight:'600'},
  sectionTitle:{fontSize:16,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,marginBottom:8,marginTop:8},
  tagsRow:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:12},
  tag:{backgroundColor:COLORS.primary,borderRadius:8,paddingHorizontal:12,paddingVertical:6},tagText:{fontSize:12,color:COLORS.white,fontWeight:'600'},
  infoGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:12},
  infoItem:{width:'47%'},infoLabel:{fontSize:12,color:COLORS.gray,marginBottom:2},infoValue:{fontSize:14,fontWeight:'600',color:COLORS.dark},
  noteText:{fontSize:13,color:COLORS.gray,lineHeight:20,marginBottom:12},
  aiMsg:{fontSize:12,color:COLORS.gray,textAlign:'center',lineHeight:18,marginBottom:14},
  donutRow:{flexDirection:'row',gap:10,marginBottom:14},
  donut:{width:100,height:100,borderRadius:50,borderWidth:8,alignItems:'center',justifyContent:'center',alignSelf:'center'},
  donutAmount:{fontSize:11,fontWeight:'700',color:COLORS.dark,textAlign:'center'},donutLabel:{fontSize:10,color:COLORS.gray,textAlign:'center',marginTop:6,lineHeight:14},
  vendorName:{fontSize:14,color:COLORS.gray,marginBottom:8},
  quotationCard:{backgroundColor:'#fafafa',borderRadius:12,padding:14,marginBottom:14},
  payRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:7,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  payLabel:{fontSize:12,color:COLORS.gray},payValue:{fontSize:12,fontWeight:'700',color:COLORS.dark},
  confirmBtn:{backgroundColor:COLORS.primary,borderRadius:12,paddingVertical:16,alignItems:'center',marginTop:8},
  confirmBtnText:{color:COLORS.white,fontSize:15,fontWeight:'700'},
  payBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center',marginTop:8},
  payBtnText:{color:COLORS.white,fontSize:15,fontWeight:'700'},
});
