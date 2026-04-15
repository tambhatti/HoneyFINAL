import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
const AVATAR = 'https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200';
const MENU_ITEMS = [
  { icon:'🛍', label:'My Bookings',       route:'/(tabs)/bookings' },
  { icon:'💰', label:'My Budgets',         route:'/my-budgets' },
  { icon:'📋', label:'Reported Bookings',  route:'/reported-bookings' },
  { icon:'🤝', label:'Meeting Requests',   route:'/meeting-requests' },
  { icon:'⭐', label:'Loyalty Points',     route:'/loyalty-points' },
  { icon:'🔔', label:'Notifications',      route:'/notifications' },
  { icon:'📞', label:'Contact Us',         route:'/contact-us' },
  { icon:'ℹ️', label:'About Us',           route:'/about-us' },
];
export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  if (!isLoggedIn) return (
    <View style={{flex:1,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',padding:24}}>
      <Text style={{fontSize:48,marginBottom:12}}>👤</Text>
      <Text style={{fontSize:18,fontWeight:'700',color:COLORS.dark,marginBottom:8}}>Not Logged In</Text>
      <Text style={{fontSize:14,color:COLORS.gray,textAlign:'center',marginBottom:20}}>Login to access your profile and manage bookings</Text>
      <TouchableOpacity style={{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:14,paddingHorizontal:40}} onPress={()=>router.push('/(auth)/login')}>
        <Text style={{color:COLORS.white,fontSize:15,fontWeight:'700'}}>Login</Text>
      </TouchableOpacity>
    </View>
  );
  async function handleLogout() {
    Alert.alert('Log Out','Are you sure you want to log out?',[
      {text:'Cancel',style:'cancel'},
      {text:'Log Out',style:'destructive',onPress:async()=>{ await logout(); router.replace('/(auth)/login'); }}
    ]);
  }
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <View style={{flexDirection:'row',gap:8}}>
          <TouchableOpacity style={styles.iconBtn} onPress={()=>router.push('/menu')}><Text style={{fontSize:16}}>☰</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={()=>router.push('/notifications')}><Text style={{fontSize:16}}>🔔</Text></TouchableOpacity>
        </View>
      </View>
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrap}>
          <Image source={{uri: user?.avatar || AVATAR}} style={styles.avatar}/>
          <TouchableOpacity style={styles.cameraBtn}><Text style={{fontSize:14}}>📷</Text></TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>
      <View style={styles.infoCard}>
        {[['User Name:',`${user?.firstName} ${user?.lastName}`],['Phone:',user?.phone||'—'],['Email:',user?.email],['Gender:',user?.gender||'—'],['Loyalty Points:',`${user?.loyaltyPoints||0} pts`]].map(([l,v])=>(
          <View key={l} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{l}</Text>
            <Text style={styles.infoValue}>{v}</Text>
          </View>
        ))}
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.editBtn} onPress={()=>router.push('/edit-profile')}><Text style={styles.editBtnText}>Edit Profile</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>router.push('/change-password')} style={{alignItems:'center',paddingVertical:4}}>
          <Text style={{fontSize:14,color:COLORS.primary,fontWeight:'600',textDecorationLine:'underline'}}>Change Password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuSection}>
        {MENU_ITEMS.map(item=>(
          <TouchableOpacity key={item.label} style={styles.menuItem} onPress={()=>router.push(item.route)}>
            <View style={styles.menuIcon}><Text style={{fontSize:18}}>{item.icon}</Text></View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.menuItem,{borderTopWidth:1,borderTopColor:'#fee2e2',marginTop:8}]} onPress={handleLogout}>
          <View style={[styles.menuIcon,{backgroundColor:'#fee2e2'}]}><Text style={{fontSize:18}}>🚪</Text></View>
          <Text style={[styles.menuLabel,{color:COLORS.red}]}>Log Out</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14},
  title:{fontSize:26,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  iconBtn:{width:38,height:38,borderRadius:19,backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'},
  avatarSection:{alignItems:'center',marginVertical:20},avatarWrap:{position:'relative',marginBottom:10},
  avatar:{width:100,height:100,borderRadius:50,borderWidth:3,borderColor:COLORS.gold},
  cameraBtn:{position:'absolute',bottom:0,right:0,width:30,height:30,borderRadius:15,backgroundColor:COLORS.primary,alignItems:'center',justifyContent:'center'},
  profileName:{fontSize:20,fontWeight:'700',color:COLORS.dark},profileEmail:{fontSize:13,color:COLORS.gray,marginTop:2},
  infoCard:{marginHorizontal:20,marginBottom:16},
  infoRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  infoLabel:{fontSize:14,fontWeight:'600',color:COLORS.dark},infoValue:{fontSize:14,color:COLORS.gray},
  btnRow:{marginHorizontal:20,gap:12,marginBottom:24},
  editBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:14,alignItems:'center'},
  editBtnText:{color:COLORS.white,fontSize:15,fontWeight:'600'},
  menuSection:{marginHorizontal:20,marginBottom:40},
  menuItem:{flexDirection:'row',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:'#f9fafb',gap:14},
  menuIcon:{width:40,height:40,borderRadius:20,backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'},
  menuLabel:{flex:1,fontSize:15,fontWeight:'500',color:COLORS.dark},menuArrow:{fontSize:20,color:COLORS.grayLight},
});
