import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
const AVATAR = 'https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200';
export default function MyProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: loyaltyData } = useApi(UserService.getLoyalty);
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>My Profile</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <Image source={{uri:user?.avatar||AVATAR}} style={styles.avatar}/>
          <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <View style={styles.statsRow}>
          {[['Loyalty Points',`${user?.loyaltyPoints||0} pts`],['Referral Code',user?.referralCode||'—'],['Member Since',new Date(user?.createdAt||Date.now()).getFullYear()]].map(([l,v])=>(
            <View key={l} style={styles.stat}><Text style={styles.statVal}>{v}</Text><Text style={styles.statLbl}>{l}</Text></View>
          ))}
        </View>
        <View style={styles.infoCard}>
          {[['Phone',user?.phone||'—'],['Gender',user?.gender||'—'],['Email',user?.email||'—']].map(([l,v])=>(
            <View key={l} style={styles.infoRow}><Text style={styles.infoLabel}>{l}</Text><Text style={styles.infoValue}>{v}</Text></View>
          ))}
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={()=>router.push('/edit-profile')}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40},
  avatarSection:{alignItems:'center',marginBottom:20},
  avatar:{width:88,height:88,borderRadius:44,borderWidth:3,borderColor:COLORS.gold,marginBottom:10},
  name:{fontSize:20,fontWeight:'700',color:COLORS.dark,marginBottom:4},email:{fontSize:13,color:COLORS.gray},
  statsRow:{flexDirection:'row',backgroundColor:'#f9f6ef',borderRadius:16,padding:16,marginBottom:20},
  stat:{flex:1,alignItems:'center'},statVal:{fontSize:15,fontWeight:'700',color:COLORS.dark,marginBottom:4},statLbl:{fontSize:11,color:COLORS.gray,textAlign:'center'},
  infoCard:{marginBottom:20},
  infoRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  infoLabel:{fontSize:14,fontWeight:'600',color:COLORS.dark},infoValue:{fontSize:14,color:COLORS.gray},
  editBtn:{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:15,alignItems:'center'},
  editBtnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
