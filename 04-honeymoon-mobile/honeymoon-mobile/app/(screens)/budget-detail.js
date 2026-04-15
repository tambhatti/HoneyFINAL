import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
export default function BudgetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data, loading } = useApi(UserService.getBudget, id);
  const budget = data?.budget;
  if (loading) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color={COLORS.primary}/></View>;
  if (!budget) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{color:COLORS.gray}}>Budget not found</Text></View>;
  const total   = budget.totalBudget || 0;
  const spent   = Object.values(budget.spent||{}).reduce((s,v)=>s+(v||0), 0);
  const remaining = total - spent;
  const pct = total > 0 ? Math.min((spent/total)*100, 100) : 0;
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Budget Detail</Text>
        <TouchableOpacity onPress={()=>router.push(`/edit-budget?id=${id}`)}><Text style={{fontSize:14,color:COLORS.gold,fontWeight:'600'}}>Edit</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{budget.name}</Text>
          <View style={styles.summaryRow}>
            {[['Total',`AED ${total.toLocaleString()}`,COLORS.white],['Spent',`AED ${spent.toLocaleString()}`,COLORS.red],['Left',`AED ${remaining.toLocaleString()}`,COLORS.gold]].map(([l,v,c])=>(
              <View key={l} style={styles.summaryItem}><Text style={{fontSize:11,color:'rgba(255,255,255,0.7)',marginBottom:4}}>{l}</Text><Text style={{fontSize:15,fontWeight:'700',color:c}}>{v}</Text></View>
            ))}
          </View>
          <View style={styles.progressBg}><View style={[styles.progressFill,{width:`${pct}%`}]}/></View>
          <Text style={{fontSize:11,color:'rgba(255,255,255,0.8)',textAlign:'right'}}>{Math.round(pct)}% spent</Text>
        </View>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {Object.entries(budget.allocations||{}).map(([cat, allocated])=>{
          const catSpent = (budget.spent||{})[cat] || 0;
          const catPct = allocated > 0 ? Math.min((catSpent/allocated)*100,100) : 0;
          return (
            <View key={cat} style={styles.catRow}>
              <View style={{flex:1}}><Text style={styles.catName}>{cat}</Text><Text style={{fontSize:12,color:COLORS.gray}}>AED {allocated.toLocaleString()} allocated</Text></View>
              <View style={{alignItems:'flex-end',gap:4}}>
                <Text style={{fontSize:14,fontWeight:'700',color:COLORS.dark}}>AED {catSpent.toLocaleString()}</Text>
                <View style={styles.miniProgressBg}><View style={[styles.miniProgressFill,{width:`${catPct}%`}]}/></View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},
  summaryCard:{backgroundColor:COLORS.primary,borderRadius:16,padding:20,marginBottom:20},
  summaryTitle:{fontSize:18,fontWeight:'700',color:COLORS.white,marginBottom:16},
  summaryRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:14},
  summaryItem:{flex:1,alignItems:'center'},
  progressBg:{height:6,backgroundColor:'rgba(255,255,255,0.3)',borderRadius:3,marginBottom:6},
  progressFill:{height:6,backgroundColor:COLORS.gold,borderRadius:3},
  sectionTitle:{fontSize:17,fontWeight:'700',color:COLORS.dark,marginBottom:12},
  catRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  catName:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:2},
  miniProgressBg:{width:80,height:4,backgroundColor:'#e5e7eb',borderRadius:2},
  miniProgressFill:{height:4,backgroundColor:COLORS.gold,borderRadius:2},
});
