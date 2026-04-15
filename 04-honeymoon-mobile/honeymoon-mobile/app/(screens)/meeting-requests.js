import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SHADOW } from '../../constants/theme';
import { usePaginatedApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
const STATUS_COLOR={Pending:'#3b82f6',Confirmed:'#16a34a',Cancelled:'#ef4444'};
export default function MeetingRequestsScreen(){
  const router=useRouter();
  const { items, loading, refresh } = usePaginatedApi(UserService.getMeetingRequests, {});
  return(
    <View style={styles.screen}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Meeting Request</Text><View style={{width:32}}/></View>
      <FlatList data={items} keyExtractor={i=>i.id} contentContainerStyle={{padding:20,gap:12}}
        refreshControl={<RefreshControl refreshing={loading&&items.length===0} onRefresh={refresh} tintColor={COLORS.primary}/>}
        ListEmptyComponent={!loading&&<View style={{alignItems:'center',paddingTop:40}}><Text style={{fontSize:40}}>🤝</Text><Text style={{color:COLORS.gray,marginTop:8}}>No meeting requests</Text></View>}
        renderItem={({item})=>(
          <View style={styles.card}>
            <View style={styles.cardHeader}><Text style={styles.reqId}>#{item.id}</Text>
              <View style={[styles.badge,{backgroundColor:(STATUS_COLOR[item.status]||'#6b7280')+'20'}]}>
                <Text style={[styles.badgeText,{color:STATUS_COLOR[item.status]||'#6b7280'}]}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.vendor}>Vendor ID: {item.vendorId}</Text>
            <View style={{flexDirection:'row',gap:16}}>
              <Text style={styles.meta}>📅 {new Date(item.requestDate).toLocaleDateString()}</Text>
              <Text style={styles.meta}>🕐 {item.requestTime}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
const styles=StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  card:{backgroundColor:COLORS.white,borderRadius:14,padding:16,borderWidth:1,borderColor:'#f0f0f0',...SHADOW.sm},
  cardHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8},
  reqId:{fontSize:14,fontWeight:'700',color:COLORS.dark},
  badge:{paddingHorizontal:10,paddingVertical:4,borderRadius:20},badgeText:{fontSize:12,fontWeight:'600'},
  vendor:{fontSize:15,fontWeight:'600',color:COLORS.dark,marginBottom:8},meta:{fontSize:12,color:COLORS.gray},
});
