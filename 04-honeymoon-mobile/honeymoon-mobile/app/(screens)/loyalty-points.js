import { View, Text, TouchableOpacity, StyleSheet, Platform, Share, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
export default function LoyaltyPointsScreen() {
  const router = useRouter();
  const { data, loading } = useApi(UserService.getLoyalty);
  const loyalty = data || {};
  async function shareCode() {
    try { await Share.share({ message: `Join Honeymoon using my referral code: ${loyalty.referralCode} and get ${loyalty.config?.refereeBonus||100} loyalty points!` }); } catch {}
  }
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Loyalty Points</Text>
        <View style={{flexDirection:'row',gap:8}}>
          <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:16}}>☰</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:16}}>🔔</Text></TouchableOpacity>
        </View>
      </View>
      {loading?<ActivityIndicator color={COLORS.primary} style={{marginTop:40}}/>:(
        <View style={styles.card}>
          <Text style={styles.points}>{loyalty.points||0}</Text>
          <Text style={styles.pointsValue}>≈ AED {loyalty.pointsValue||'0.00'}</Text>
          <Text style={styles.referralLabel}>Referral Code</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Code:</Text>
            <Text style={styles.codeValue}>{loyalty.referralCode||'—'}</Text>
            <TouchableOpacity style={{padding:4}}><Text style={{fontSize:14}}>📋</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={shareCode}>
            <Text style={styles.shareBtnText}>Share Code</Text>
          </TouchableOpacity>
          <Text style={styles.shareDesc}>Share your referral code with friends to earn loyalty points when they join and make first booking</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14},
  title:{fontSize:24,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  iconBtn:{width:38,height:38,borderRadius:19,backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'},
  card:{margin:20,backgroundColor:'#f5f5f5',borderRadius:20,padding:24,alignItems:'center'},
  points:{fontSize:56,fontWeight:'900',color:COLORS.dark,marginBottom:4},
  pointsValue:{fontSize:16,color:COLORS.gray,marginBottom:14},
  referralLabel:{fontSize:16,color:COLORS.gray,marginBottom:14},
  codeRow:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:16,paddingVertical:14,backgroundColor:COLORS.white,width:'100%',marginBottom:16},
  codeLabel:{fontSize:14,color:COLORS.gray,marginRight:8},codeValue:{flex:1,fontSize:16,fontWeight:'700',color:COLORS.dark},
  shareBtn:{width:'100%',backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:15,alignItems:'center',marginBottom:14},
  shareBtnText:{color:COLORS.white,fontSize:15,fontWeight:'700'},
  shareDesc:{fontSize:13,color:COLORS.gray,textAlign:'center',lineHeight:20},
});
