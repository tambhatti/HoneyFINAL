import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { COLORS, SHADOW } from '../../constants/theme';
import { usePaginatedApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLOR = { Pending:'#3b82f6', Rejected:'#ef4444', Upcoming:'#f59e0b', Completed:'#16a34a', Resolved:'#0891b2' };

function BookingCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
          <Text style={{fontSize:13}}>📅</Text>
          <Text style={styles.dateText}>{new Date(item.eventDate).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</Text>
        </View>
        <View style={[styles.badge,{backgroundColor:(STATUS_COLOR[item.status]||'#6b7280')+'20'}]}>
          <Text style={[styles.badgeText,{color:STATUS_COLOR[item.status]||'#6b7280'}]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.companyLabel}>Booking ID</Text>
      <Text style={styles.companyName}>#{item.id}</Text>
      <View style={styles.cardFooter}>
        <View><Text style={styles.metaLabel}>Amount</Text><Text style={styles.metaValue}>AED {item.totalAmount?.toLocaleString()}</Text></View>
        <View style={{alignItems:'flex-end'}}>
          <Text style={styles.metaLabel}>Payment</Text>
          <Text style={[styles.metaValue,{color:item.paymentStatus==='Paid'?COLORS.green:COLORS.red}]}>{item.paymentStatus}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function BookingsScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [mainTab,     setMainTab]     = useState('standard');
  const [customSubTab,setCustomSubTab]= useState('requests');

  const params = { type: mainTab, ...(mainTab==='custom'&&{subTab:customSubTab}) };
  const { items, loading, refresh, loadMore, hasMore } = usePaginatedApi(UserService.getBookings, params);

  if (!isLoggedIn) return (
    <View style={styles.screen}>
      <View style={styles.header}><Text style={styles.title}>My Bookings</Text></View>
      <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:24}}>
        <Text style={{fontSize:40,marginBottom:12}}>🔐</Text>
        <Text style={{fontSize:16,color:COLORS.gray,textAlign:'center',marginBottom:20}}>Login to view your bookings</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={()=>router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <View style={{flexDirection:'row',gap:8}}>
          <TouchableOpacity style={styles.iconBtn} onPress={()=>router.push('/menu')}><Text style={{fontSize:16}}>☰</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={()=>router.push('/notifications')}><Text style={{fontSize:16}}>🔔</Text></TouchableOpacity>
        </View>
      </View>
      <View style={styles.mainTabs}>
        {[['standard','Standard Booking'],['custom','Custom Booking']].map(([k,l])=>(
          <TouchableOpacity key={k} onPress={()=>setMainTab(k)} style={[styles.mainTab,mainTab===k&&styles.mainTabActive]}>
            <Text style={[styles.mainTabText,mainTab===k&&styles.mainTabTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {mainTab==='custom'&&(
        <View style={styles.subTabRow}>
          {[['requests','Requests'],['booking','Bookings']].map(([k,l])=>(
            <TouchableOpacity key={k} onPress={()=>setCustomSubTab(k)} style={[styles.subTabBtn,customSubTab===k&&styles.subTabBtnActive]}>
              <Text style={[styles.subTabText,customSubTab===k&&styles.subTabTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <FlatList
        data={items} keyExtractor={i=>i.id}
        contentContainerStyle={{padding:16,gap:12}}
        refreshControl={<RefreshControl refreshing={loading&&items.length===0} onRefresh={refresh} tintColor={COLORS.primary}/>}
        onEndReached={loadMore} onEndReachedThreshold={0.3}
        ListFooterComponent={hasMore&&loading?<ActivityIndicator color={COLORS.primary} style={{marginVertical:12}}/>:null}
        ListEmptyComponent={!loading&&<View style={{alignItems:'center',paddingTop:40}}><Text style={{fontSize:40,marginBottom:8}}>📋</Text><Text style={{color:COLORS.gray}}>No bookings yet</Text></View>}
        renderItem={({item})=><BookingCard item={item} onPress={()=>router.push(`/booking-detail?id=${item.id}&type=${item.type}`)}/>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14},
  title:{fontSize:26,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  iconBtn:{width:38,height:38,borderRadius:19,backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'},
  loginBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:14,paddingHorizontal:40},
  loginBtnText:{color:COLORS.white,fontSize:15,fontWeight:'700'},
  mainTabs:{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#f3f4f6',marginHorizontal:20},
  mainTab:{flex:1,paddingVertical:12,alignItems:'center'},
  mainTabActive:{borderBottomWidth:2,borderBottomColor:COLORS.red},
  mainTabText:{fontSize:14,fontWeight:'500',color:COLORS.gray},mainTabTextActive:{color:COLORS.dark,fontWeight:'700'},
  subTabRow:{flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:10,gap:8},
  subTabBtn:{paddingHorizontal:18,paddingVertical:8,borderRadius:20,backgroundColor:'#f3f4f6'},
  subTabBtnActive:{backgroundColor:COLORS.gold},
  subTabText:{fontSize:13,fontWeight:'500',color:COLORS.gray},subTabTextActive:{color:COLORS.white,fontWeight:'700'},
  card:{backgroundColor:COLORS.white,borderRadius:14,padding:16,borderWidth:1,borderColor:'#f0f0f0',...SHADOW.sm},
  cardHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},
  dateText:{fontSize:14,fontWeight:'600',color:COLORS.dark},
  badge:{paddingHorizontal:12,paddingVertical:4,borderRadius:20},badgeText:{fontSize:12,fontWeight:'600'},
  companyLabel:{fontSize:11,color:COLORS.gray,marginBottom:2},
  companyName:{fontSize:15,fontWeight:'700',color:COLORS.dark,marginBottom:10},
  cardFooter:{flexDirection:'row',justifyContent:'space-between'},
  metaLabel:{fontSize:11,color:COLORS.gray,marginBottom:2},metaValue:{fontSize:13,fontWeight:'700',color:COLORS.dark},
});
