import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import UserService from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';

export default function BudgetScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [location, setLocation] = useState('');
  const [guests,   setGuests]   = useState('');
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);

  async function generate() {
    if (!location || !guests) return Alert.alert('Required','Enter location and guest count');
    setLoading(true);
    try {
      const data = await UserService.estimateBudget({ location, guestCount: parseInt(guests) });
      setResult(data);
    } catch(err) { Alert.alert('Error', err.message); }
    finally { setLoading(false); }
  }

  async function saveBudget() {
    if (!isLoggedIn) { router.push('/(auth)/login'); return; }
    if (!result) return;
    try {
      await UserService.createBudget({
        name: `${location} Budget – ${guests} guests`,
        totalBudget: result.estimatedBudget,
        allocations: result.breakdown,
      });
      Alert.alert('Saved!','Budget saved to My Budgets');
      router.push('/my-budgets');
    } catch(err) { Alert.alert('Error', err.message); }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Estimation</Text>
        <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:16}}>🔔</Text></TouchableOpacity>
      </View>
      <Text style={styles.label}>Location<Text style={styles.req}> *</Text></Text>
      <View style={styles.locRow}>
        <TextInput style={[styles.input,{flex:1,marginBottom:0}]} placeholder="Select location" value={location} onChangeText={setLocation} placeholderTextColor="#9ca3af"/>
        <Text style={{position:'absolute',right:14,fontSize:16}}>📍</Text>
      </View>
      <Text style={styles.label}>No. of Guests<Text style={styles.req}> *</Text></Text>
      <TextInput style={styles.input} placeholder="Enter number of guests" value={guests} onChangeText={setGuests} keyboardType="number-pad" placeholderTextColor="#9ca3af"/>
      <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]} onPress={generate} disabled={loading}>
        {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Generate Estimation ↗</Text>}
      </TouchableOpacity>

      {result&&(
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>AI Estimation Budget</Text>
          <Text style={styles.resultAmount}>AED {result.estimatedBudget?.toLocaleString()}</Text>
          <Text style={styles.resultRange}>Range: AED {result.range?.min?.toLocaleString()} – AED {result.range?.max?.toLocaleString()}</Text>
          <Text style={styles.aiMsg}>{result.aiMessage}</Text>
          <View style={styles.breakdownGrid}>
            {Object.entries(result.breakdown||{}).map(([cat,amount])=>(
              <View key={cat} style={styles.breakdownItem}>
                <Text style={styles.breakdownCat}>{cat}</Text>
                <Text style={styles.breakdownAmt}>AED {amount?.toLocaleString()}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={saveBudget}>
            <Text style={styles.saveBtnText}>Save Budget</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  content:{padding:20,paddingTop:Platform.OS==='ios'?60:40},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:24},
  title:{fontSize:26,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  iconBtn:{width:38,height:38,borderRadius:19,backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'},
  label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:8},req:{color:COLORS.red},
  locRow:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:14,flexDirection:'row',alignItems:'center',marginBottom:16},
  input:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:14,fontSize:14,color:COLORS.dark,marginBottom:16},
  btn:{backgroundColor:COLORS.primary,borderRadius:12,paddingVertical:16,alignItems:'center',marginBottom:24},
  btnText:{color:COLORS.white,fontSize:16,fontWeight:'600'},
  resultCard:{backgroundColor:'#f9f9f9',borderRadius:16,padding:20},
  resultTitle:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,textAlign:'center',marginBottom:6},
  resultAmount:{fontSize:32,fontWeight:'900',color:COLORS.primary,textAlign:'center',marginBottom:4},
  resultRange:{fontSize:13,color:COLORS.gray,textAlign:'center',marginBottom:8},
  aiMsg:{fontSize:13,color:COLORS.gray,textAlign:'center',lineHeight:20,marginBottom:16},
  breakdownGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:16},
  breakdownItem:{width:'47%',backgroundColor:COLORS.white,borderRadius:10,padding:10},
  breakdownCat:{fontSize:11,color:COLORS.gray},breakdownAmt:{fontSize:14,fontWeight:'700',color:COLORS.dark},
  saveBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:14,alignItems:'center'},
  saveBtnText:{color:COLORS.white,fontSize:15,fontWeight:'700'},
});
