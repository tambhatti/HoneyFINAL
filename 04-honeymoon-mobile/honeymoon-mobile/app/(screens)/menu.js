import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SHADOW } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
const { width } = Dimensions.get('window');
const AVATAR = 'https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200';
const MENU_ITEMS = [
  { icon:'🏠', label:'Home',              route:'/(tabs)/home' },
  { icon:'📊', label:'Budget Estimation', route:'/(tabs)/budget' },
  { icon:'🛍', label:'My Bookings',       route:'/(tabs)/bookings' },
  { icon:'💰', label:'My Budgets',         route:'/my-budgets' },
  { icon:'📋', label:'Reported Bookings', route:'/reported-bookings' },
  { icon:'🤝', label:'Meeting Requests',  route:'/meeting-requests' },
  { icon:'⭐', label:'Loyalty Points',    route:'/loyalty-points' },
  { icon:'🔔', label:'Notifications',     route:'/notifications' },
  { icon:'👤', label:'My Profile',        route:'/(tabs)/profile' },
  { icon:'📞', label:'Contact Us',        route:'/contact-us' },
  { icon:'ℹ️', label:'About Us',          route:'/about-us' },
  { icon:'⚙️', label:'Settings',          route:'/(tabs)/settings' },
];
export default function MenuScreen() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  function handleLogout() {
    Alert.alert('Log Out','Are you sure you want to log out?',[
      {text:'Cancel',style:'cancel'},
      {text:'Log Out',style:'destructive',onPress:async()=>{ await logout(); router.replace('/(auth)/login'); }}
    ]);
  }
  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={()=>router.back()}/>
      <View style={styles.drawer}>
        <View style={styles.profile}>
          <Image source={{uri:user?.avatar||AVATAR}} style={styles.avatar}/>
          {isLoggedIn ? (
            <><Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text><Text style={styles.userEmail}>{user?.email}</Text></>
          ) : (
            <><Text style={styles.userName}>Guest</Text><TouchableOpacity onPress={()=>router.push('/(auth)/login')} style={{marginTop:6}}><Text style={{color:COLORS.gold,fontWeight:'600'}}>Login / Sign Up</Text></TouchableOpacity></>
          )}
        </View>
        <View style={styles.menuList}>
          {MENU_ITEMS.map(item=>(
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={()=>router.replace(item.route)} activeOpacity={0.85}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  overlay:{flex:1,flexDirection:'row',backgroundColor:'rgba(0,0,0,0.5)'},
  backdrop:{flex:1},
  drawer:{width:width*0.75,backgroundColor:COLORS.white,height:'100%',...SHADOW.md},
  profile:{backgroundColor:COLORS.primary,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:24,paddingHorizontal:20,alignItems:'center'},
  avatar:{width:70,height:70,borderRadius:35,borderWidth:3,borderColor:COLORS.gold,marginBottom:10},
  userName:{fontSize:18,fontWeight:'700',color:COLORS.white,marginBottom:4},
  userEmail:{fontSize:13,color:'rgba(255,255,255,0.7)'},
  menuList:{flex:1,paddingTop:8},
  menuItem:{flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:14,gap:14,borderBottomWidth:1,borderBottomColor:'#f9fafb'},
  menuIcon:{fontSize:20,width:28,textAlign:'center'},
  menuLabel:{fontSize:15,fontWeight:'500',color:COLORS.dark},
  logoutBtn:{flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:18,gap:14,borderTopWidth:1,borderTopColor:'#fee2e2'},
  logoutIcon:{fontSize:20},logoutText:{fontSize:15,fontWeight:'600',color:COLORS.red},
});
