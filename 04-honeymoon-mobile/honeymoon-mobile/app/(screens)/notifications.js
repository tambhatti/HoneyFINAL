import { View, Text, Image, TouchableOpacity, SectionList, StyleSheet, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
const AVATAR = 'https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200';
export default function NotificationsScreen() {
  const router = useRouter();
  const { data, loading, refresh } = useApi(UserService.getNotifications);
  const notifications = data?.data || [];
  const sections = [
    { title:'Today',     data: notifications.slice(0,2) },
    { title:'Yesterday', data: notifications.slice(2,4) },
    { title:'This week', data: notifications.slice(4) },
  ].filter(s=>s.data.length>0);
  async function markAllRead() { try { await UserService.markAllNotificationsRead(); refresh(); } catch {} }
  async function markRead(id) { try { await UserService.markNotificationRead(id); refresh(); } catch {} }
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>router.back()}><Text style={{fontSize:28,color:COLORS.dark}}>‹</Text></TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{flexDirection:'row',gap:8}}>
          <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:14}}>☰</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:14}}>🔔</Text></TouchableOpacity>
        </View>
      </View>
      {loading&&notifications.length===0?<ActivityIndicator color={COLORS.primary} style={{marginTop:40}}/>:(
        <SectionList sections={sections} keyExtractor={(item,i)=>item.id||String(i)}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.primary}/>}
          ListHeaderComponent={<View style={styles.filterRow}><View style={{flexDirection:'row',alignItems:'center',gap:4}}><Text style={{fontSize:12}}>Showing: </Text><View style={styles.dropdown}><Text style={{fontSize:12}}>All ▾</Text></View></View><TouchableOpacity onPress={markAllRead}><Text style={styles.markAll}>Mark All As Read</Text></TouchableOpacity></View>}
          renderSectionHeader={({section:{title}})=><Text style={styles.sectionHeader}>{title}</Text>}
          renderItem={({item})=>(
            <View style={[styles.notifRow, !item.isRead&&styles.notifUnread]}>
              <Image source={{uri:AVATAR}} style={styles.avatar}/>
              <View style={styles.notifContent}>
                <Text style={styles.notifText}>{item.message}</Text>
                <View style={{flexDirection:'row',gap:8,alignItems:'center',flexWrap:'wrap',marginTop:4}}>
                  <Text style={styles.notifDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                  <TouchableOpacity onPress={()=>markRead(item.id)}><Text style={styles.markRead}>{item.isRead?'Mark Unread':'Mark As Read'}</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  title:{fontSize:22,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  iconBtn:{width:36,height:36,borderRadius:18,backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'},
  filterRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  dropdown:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:8,paddingHorizontal:10,paddingVertical:5},
  markAll:{fontSize:13,color:COLORS.gold,fontWeight:'600'},
  sectionHeader:{fontSize:14,fontWeight:'700',color:COLORS.dark,paddingHorizontal:20,paddingTop:14,paddingBottom:6},
  notifRow:{flexDirection:'row',gap:12,paddingHorizontal:20,paddingVertical:14,borderBottomWidth:1,borderBottomColor:'#f9fafb'},
  notifUnread:{backgroundColor:'#fefce8'},avatar:{width:44,height:44,borderRadius:22},
  notifContent:{flex:1},notifText:{fontSize:13,color:COLORS.dark,lineHeight:20},
  notifDate:{fontSize:11,color:COLORS.gray},markRead:{fontSize:11,color:COLORS.gold,fontWeight:'600'},
});
