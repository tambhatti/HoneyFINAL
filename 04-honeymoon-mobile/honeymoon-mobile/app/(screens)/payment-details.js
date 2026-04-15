import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import UserService from '../../services/user.service';
export default function PaymentDetailsScreen() {
  const router = useRouter();
  const { bookingId, amount } = useLocalSearchParams();
  const [method, setMethod] = useState('card');
  const [form, setForm] = useState({ cardName:'', cardNumber:'', cvv:'', expiry:'' });
  const [loading, setLoading] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  async function pay() {
    if (method === 'card' && (!form.cardName || !form.cardNumber || !form.cvv || !form.expiry))
      return Alert.alert('Required','Fill in all card details');
    setLoading(true);
    try {
      await UserService.processPayment({ bookingId, amount: parseFloat(amount), method });
      router.replace('/payment-success');
    } catch(err) {
      router.replace(`/payment-status?status=failed&message=${encodeURIComponent(err.message)}`);
    } finally { setLoading(false); }
  }
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Payment Details</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.methodRow}>
          {[['card','💳 Card'],['apple','🍎 Apple Pay'],['bank','🏦 Bank Transfer']].map(([m,l])=>(
            <TouchableOpacity key={m} style={[styles.methodBtn,method===m&&styles.methodBtnActive]} onPress={()=>setMethod(m)}>
              <Text style={[styles.methodText,method===m&&styles.methodTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {method==='card'&&(
          <>
            {[['Cardholder Name','cardName','Enter Name','default'],['Card Number','cardNumber','xxxx xxxx xxxx xxxx','numeric'],['CVV','cvv','xxx','numeric'],['Expiry Date','expiry','MM/YY','numeric']].map(([l,k,ph,kt])=>(
              <View key={k}><Text style={styles.label}>{l}<Text style={styles.req}> *</Text></Text>
              <TextInput style={styles.input} placeholder={ph} value={form[k]} onChangeText={v=>f(k,v)} keyboardType={kt} placeholderTextColor="#9ca3af"/></View>
            ))}
          </>
        )}
        {method==='apple'&&<View style={styles.centerBox}><Text style={{fontSize:40}}>🍎</Text><Text style={styles.centerTitle}>Pay with Apple Pay</Text><Text style={{fontSize:13,color:COLORS.gray,textAlign:'center'}}>Session 3 will integrate real Apple Pay merchant credentials</Text></View>}
        {method==='bank'&&(
          <View style={styles.bankBox}>
            {[['Account Name','Honeymoon Events Ltd'],['IBAN','AE07 0331 2345 6789 0123 456'],['SWIFT','EBILAEAD'],['Reference',`#${bookingId}`]].map(([l,v])=>(
              <View key={l}><Text style={{fontSize:12,color:COLORS.gray,marginTop:8}}>{l}</Text><Text style={{fontSize:14,fontWeight:'600',color:COLORS.dark}}>{v}</Text></View>
            ))}
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>AED {parseFloat(amount||0).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={[styles.payBtn,loading&&{opacity:0.7}]} onPress={pay} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.payBtnText}>Pay Now ↗</Text>}
        </TouchableOpacity>
        <Text style={{fontSize:11,color:COLORS.gray,textAlign:'center',marginTop:12}}>🔒 Payments will be processed via PayTabs/Telr in production (Session 4)</Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},
  methodRow:{flexDirection:'row',gap:8,marginBottom:20},
  methodBtn:{flex:1,borderWidth:1.5,borderColor:'#e5e7eb',borderRadius:10,paddingVertical:10,alignItems:'center'},
  methodBtnActive:{borderColor:COLORS.primary,backgroundColor:'#f0fdf4'},
  methodText:{fontSize:12,color:COLORS.gray,fontWeight:'500'},methodTextActive:{color:COLORS.primary,fontWeight:'700'},
  label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:13,fontSize:14,color:COLORS.dark,marginBottom:14},
  centerBox:{alignItems:'center',padding:30,backgroundColor:'#fafafa',borderRadius:12,marginBottom:16,gap:8},
  centerTitle:{fontSize:18,fontWeight:'700',color:COLORS.dark},
  bankBox:{backgroundColor:'#f9fafb',borderRadius:12,padding:16,marginBottom:16},
  totalRow:{flexDirection:'row',justifyContent:'space-between',padding:14,backgroundColor:'#fafafa',borderRadius:12,marginBottom:16},
  totalLabel:{fontSize:15,fontWeight:'600',color:COLORS.dark},totalValue:{fontSize:17,fontWeight:'700',color:COLORS.primary},
  payBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center'},payBtnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
