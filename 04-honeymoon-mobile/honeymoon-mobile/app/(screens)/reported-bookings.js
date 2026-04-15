import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SHADOW } from '../../constants/theme';
import { usePaginatedApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
const STATUS_COLOR={Pending:'#f59e0b',Resolved:'#16a34a'};
export default function ReportedBookingsScreen(){
  const router=useRouter();
  const { items, loading, refresh } = usePaginatedApi(UserService.getReportedBookings, {});
  return(
    <View style={styles.screen}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Reported Booking</Text><View style={{width:32}}/></View>
      <FlatList data={items} keyExtractor={i=>i.id} contentContainerStyle={{padding:20,gap:12}}
        refreshControl={<RefreshControl refreshing={loading&&items.length===0} onRefresh={refresh} tintColor={COLORS.primary}/>}
        ListEmptyComponent={!loading&&<View style={{alignItems:'center',paddingTop:40}}><Text style={{fontSize:40}}>📋</Text><Text style={{color:COLORS.gray,marginTop:8}}>No reported bookings</Text></View>}
        renderItem={({item})=>(
          <View style={styles.card}>
            <View style={styles.cardHeader}><Text style={styles.bookingId}>Booking #{item.bookingId}</Text>
              <View style={[styles.badge,{backgroundColor:(STATUS_COLOR[item.status]||'#6b7280')+'20'}]}>
                <Text style={[styles.badgeText,{color:STATUS_COLOR[item.status]||'#6b7280'}]}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.reasons}>{Array.isArray(item.reasons)?item.reasons.join(', '):item.reasons}</Text>
            <Text style={styles.date}>📅 {new Date(item.createdAt).toLocaleDateString()}</Text>
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
  bookingId:{fontSize:14,fontWeight:'700',color:COLORS.dark},
  badge:{paddingHorizontal:10,paddingVertical:4,borderRadius:20},badgeText:{fontSize:12,fontWeight:'600'},
  reasons:{fontSize:13,color:COLORS.gray,marginBottom:4},date:{fontSize:12,color:COLORS.gray},
});
