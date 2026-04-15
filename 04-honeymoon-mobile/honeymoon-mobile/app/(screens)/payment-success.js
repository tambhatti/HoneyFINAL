import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/theme';
export default function PaymentSuccessScreen() {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <View style={styles.circle}><Text style={{fontSize:48}}>✅</Text></View>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subtitle}>Your booking has been confirmed. You will receive a confirmation shortly.</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={()=>router.replace('/(tabs)/bookings')}>
        <Text style={styles.primaryBtnText}>View My Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>router.replace('/(tabs)/home')} style={{paddingVertical:8}}>
        <Text style={{color:COLORS.primary,fontSize:14,fontWeight:'600',textDecorationLine:'underline'}}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',padding:24},
  circle:{width:100,height:100,borderRadius:50,backgroundColor:'#f0fdf4',alignItems:'center',justifyContent:'center',marginBottom:20},
  title:{fontSize:26,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,textAlign:'center',marginBottom:10},
  subtitle:{fontSize:14,color:COLORS.gray,textAlign:'center',lineHeight:22,marginBottom:24},
  primaryBtn:{width:'100%',backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:15,alignItems:'center',marginBottom:12},
  primaryBtnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
