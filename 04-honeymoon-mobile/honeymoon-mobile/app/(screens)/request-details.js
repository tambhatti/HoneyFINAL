import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
export default function RequestDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data, loading } = useApi(UserService.getMyCustomQuotation, id);
  const quotation = data?.quotation;
  if (loading) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color={COLORS.primary}/></View>;
  if (!quotation) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{color:COLORS.gray}}>Request not found</Text></View>;
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Request Details</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <View style={styles.field}><Text style={styles.fieldLabel}>Request Id:</Text><Text style={styles.fieldValue}>#{quotation.id}</Text></View>
          <View style={styles.field}><Text style={styles.fieldLabel}>Request Date:</Text><Text style={styles.fieldValue}>{new Date(quotation.createdAt).toLocaleDateString()}</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.field}><Text style={styles.fieldLabel}>Location:</Text><Text style={styles.fieldValue}>{quotation.location}</Text></View>
          <View style={styles.field}><Text style={styles.fieldLabel}>Event Date:</Text><Text style={styles.fieldValue}>{new Date(quotation.eventDate).toLocaleDateString()}</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.field}><Text style={styles.fieldLabel}>Guests:</Text><Text style={styles.fieldValue}>{quotation.guestCount}</Text></View>
          <View style={styles.field}><Text style={styles.fieldLabel}>Status:</Text><Text style={[styles.fieldValue,{color:quotation.status==='Rejected'?COLORS.red:COLORS.primary}]}>{quotation.status}</Text></View>
        </View>
        <View style={styles.fieldFull}><Text style={styles.fieldLabel}>Budget Range:</Text><Text style={styles.fieldValue}>AED {quotation.budgetMin?.toLocaleString()} – {quotation.budgetMax?.toLocaleString()}</Text></View>
        {quotation.additionalNote&&(
          <View style={styles.fieldFull}><Text style={styles.fieldLabel}>Additional Note:</Text><Text style={[styles.fieldValue,{color:COLORS.gray,lineHeight:20}]}>{quotation.additionalNote}</Text></View>
        )}
        {quotation.quotationAmount&&(
          <View style={styles.quotationBox}><Text style={{fontSize:13,fontWeight:'700',color:COLORS.primary,marginBottom:4}}>Vendor Quotation</Text><Text style={{fontSize:18,fontWeight:'900',color:COLORS.dark}}>AED {quotation.quotationAmount?.toLocaleString()}</Text></View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20},
  row:{flexDirection:'row',gap:16,marginBottom:16},field:{flex:1},fieldFull:{marginBottom:16},
  fieldLabel:{fontSize:13,fontWeight:'600',color:COLORS.dark,marginBottom:4},fieldValue:{fontSize:14,color:COLORS.gray},
  quotationBox:{backgroundColor:'#f0fdf4',borderRadius:12,padding:14,marginTop:8,alignItems:'center'},
});
