import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
export default function EditBudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data, loading: fetchLoading } = useApi(UserService.getBudget, id);
  const budget = data?.budget;
  const [name, setName] = useState('');
  const [allocations, setAllocations] = useState({});
  const [loading, setLoading] = useState(false);
  // Initialize form once data loads
  if (budget && !name && Object.keys(allocations).length === 0) {
    setName(budget.name || '');
    setAllocations(Object.fromEntries(Object.entries(budget.allocations||{}).map(([k,v])=>[k,String(v)])));
  }
  const total = Object.values(allocations).reduce((s,v)=>s+(parseFloat(v)||0),0);
  async function save() {
    if (!name) return Alert.alert('Required','Enter budget name');
    setLoading(true);
    try {
      await UserService.updateBudget(id, { name, totalBudget: total, allocations: Object.fromEntries(Object.entries(allocations).map(([k,v])=>[k,parseFloat(v)||0])) });
      Alert.alert('Saved','Budget updated'); router.back();
    } catch(err) { Alert.alert('Error',err.message); }
    finally { setLoading(false); }
  }
  if (fetchLoading) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color={COLORS.primary}/></View>;
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Edit Budget</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Budget Name<Text style={styles.req}> *</Text></Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#9ca3af"/>
        <Text style={styles.sectionTitle}>Category Allocations (AED)</Text>
        {Object.keys(allocations).map(cat=>(
          <View key={cat} style={styles.catRow}>
            <Text style={styles.catName}>{cat}</Text>
            <TextInput style={styles.catInput} value={allocations[cat]} onChangeText={v=>setAllocations(p=>({...p,[cat]:v}))} keyboardType="numeric" placeholderTextColor="#9ca3af"/>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>AED {total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={[styles.btn,loading&&{opacity:0.7}]} onPress={save} disabled={loading}>
          {loading?<ActivityIndicator color="#fff"/>:<Text style={styles.btnText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:13,fontSize:14,color:COLORS.dark,marginBottom:16},
  sectionTitle:{fontSize:16,fontWeight:'700',color:COLORS.dark,marginBottom:12},
  catRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10},
  catName:{fontSize:14,fontWeight:'500',color:COLORS.dark,flex:1},
  catInput:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:10,paddingHorizontal:12,paddingVertical:10,fontSize:14,color:COLORS.dark,width:100,textAlign:'right'},
  totalRow:{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#f9f6ef',borderRadius:12,padding:14,marginTop:8,marginBottom:20},
  totalLabel:{fontSize:15,fontWeight:'700',color:COLORS.dark},totalValue:{fontSize:17,fontWeight:'900',color:COLORS.primary},
  btn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:16,alignItems:'center'},btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
