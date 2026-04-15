import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SHADOW } from '../../constants/theme';
import { StarRating } from '../../components/StarRating';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';

const { width } = Dimensions.get('window');
const HERO_BG   = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80';
const LOGO_ICON = '/logo-icon.png';
const LOGO_TEXT = '/logo-text.png';
const AVATAR    = 'https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { data, loading } = useApi(UserService.getHome);

  const featuredVendors = data?.featuredVendors || [];
  const categories      = data?.categories      || [];

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        {isLoggedIn ? (
          <View style={styles.headerLeft}>
            <Image source={{ uri: user?.avatar || AVATAR }} style={styles.avatar} />
            <View>
              <Text style={styles.greeting}>Hi, Good Morning</Text>
              <Text style={styles.userName}>{user?.firstName || 'Guest'} 👋</Text>
            </View>
          </View>
        ) : (
          <View style={styles.headerLeft}>
            <Image source={{ uri: LOGO_ICON }} style={styles.logoIcon} resizeMode="contain" />
            <Image source={{ uri: LOGO_TEXT }} style={styles.logoText} resizeMode="contain" />
          </View>
        )}
        <View style={styles.headerRight}>
          {isLoggedIn ? (
            <>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/menu')}><Text style={{fontSize:16}}>☰</Text></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}><Text style={{fontSize:16}}>🔔</Text></TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>Login | Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Hero */}
      <View style={styles.heroBanner}>
        <Image source={{ uri: HERO_BG }} style={styles.heroImg} resizeMode="cover" />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroSub}>Decoration & Lightning</Text>
          <Text style={styles.heroTitle}>Find Perfect Style</Text>
        </View>
      </View>

      {/* AI Budget Card */}
      <TouchableOpacity style={styles.aiCard} onPress={() => router.push('/(tabs)/budget')} activeOpacity={0.9}>
        <Text style={{fontSize:28,marginBottom:8}}>📊</Text>
        <Text style={styles.aiTitle}>Plan Your Wedding Budget</Text>
        <Text style={styles.aiSub}>Quick questions. Instant wedding cost estimate.</Text>
        <View style={styles.aiBtn}><Text style={styles.aiBtnText}>Start AI Planning ↗</Text></View>
      </TouchableOpacity>

      {/* Featured Vendors */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Features Vendors</Text>
          <TouchableOpacity onPress={() => router.push('/vendors')}><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{marginVertical:20}}/>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingLeft:20,gap:12}}>
            {featuredVendors.map(v => (
              <TouchableOpacity key={v.id} style={styles.vendorCard} onPress={() => router.push(`/vendor-detail?id=${v.id}`)}>
                <Image source={{ uri: v.avatar || AVATAR }} style={styles.vendorImg} resizeMode="cover" />
                <Text style={styles.vendorName} numberOfLines={1}>{v.companyName}</Text>
                <Text style={styles.vendorOwner}>👤 {v.firstName} {v.lastName}</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                  <StarRating rating={v.rating || 0} size={11}/>
                  <Text style={styles.reviewCount}>{v.reviewCount}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/vendors')}><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.catGrid}>
          {categories.map(c => (
            <TouchableOpacity key={c.id} style={styles.catChip}
              onPress={() => router.push(`/vendors?category=${c.name}`)}>
              <Text style={styles.catIcon}>{c.icon}</Text>
              <Text style={styles.catName}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?56:(StatusBar.currentHeight||24)+12,paddingBottom:14},
  headerLeft:{flexDirection:'row',alignItems:'center',gap:12},
  logoIcon:{width:36,height:36},logoText:{height:16,width:120},
  avatar:{width:40,height:40,borderRadius:20},
  greeting:{fontSize:12,color:COLORS.gray},userName:{fontSize:16,fontWeight:'700',color:COLORS.dark},
  headerRight:{flexDirection:'row',gap:8},
  iconBtn:{width:38,height:38,borderRadius:19,backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'},
  loginBtn:{borderWidth:1,borderColor:COLORS.grayLight,borderRadius:20,paddingHorizontal:14,paddingVertical:8},
  loginBtnText:{fontSize:13,fontWeight:'600',color:COLORS.dark},
  heroBanner:{marginHorizontal:20,borderRadius:16,overflow:'hidden',height:160,marginBottom:16},
  heroImg:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
  heroOverlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.35)',justifyContent:'flex-end',padding:16},
  heroSub:{fontSize:12,color:'rgba(255,255,255,0.8)',marginBottom:4},heroTitle:{fontSize:22,fontWeight:'700',color:'#fff',fontFamily:'serif'},
  aiCard:{marginHorizontal:20,backgroundColor:COLORS.primary,borderRadius:16,padding:20,alignItems:'center',marginBottom:24},
  aiTitle:{fontSize:18,fontWeight:'700',color:'#fff',fontFamily:'serif',textAlign:'center',marginBottom:6},
  aiSub:{fontSize:12,color:'rgba(255,255,255,0.8)',textAlign:'center',marginBottom:14},
  aiBtn:{backgroundColor:'rgba(255,255,255,0.15)',borderRadius:10,paddingVertical:10,paddingHorizontal:24,borderWidth:1,borderColor:'rgba(255,255,255,0.3)'},
  aiBtnText:{fontSize:14,fontWeight:'600',color:'#fff'},
  section:{marginBottom:24},
  sectionHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,marginBottom:12},
  sectionTitle:{fontSize:18,fontWeight:'700',color:COLORS.dark},seeAll:{fontSize:13,color:COLORS.red,fontWeight:'500'},
  vendorCard:{width:140},vendorImg:{width:140,height:100,borderRadius:12,marginBottom:8},
  vendorName:{fontSize:13,fontWeight:'600',color:COLORS.dark,marginBottom:3},
  vendorOwner:{fontSize:11,color:COLORS.gray,marginBottom:3},reviewCount:{fontSize:11,color:COLORS.gray},
  catGrid:{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,gap:10},
  catChip:{width:'30%',backgroundColor:'#f9f6ef',borderRadius:12,padding:12,alignItems:'center',gap:4},
  catIcon:{fontSize:22},catName:{fontSize:11,fontWeight:'600',color:COLORS.dark,textAlign:'center'},
});
