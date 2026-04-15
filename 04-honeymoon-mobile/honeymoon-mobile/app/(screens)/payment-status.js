import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../constants/theme';
export default function PaymentStatusScreen() {
  const router = useRouter();
  const { status, message } = useLocalSearchParams();
  const isPaid = status !== 'failed';
  return (
    <View style={styles.screen}>
      <Text style={styles.icon}>{isPaid ? '✅' : '❌'}</Text>
      <Text style={styles.title}>{isPaid ? 'Payment Successful!' : 'Payment Failed'}</Text>
      <Text style={styles.subtitle}>{isPaid ? 'Your booking is confirmed.' : (message || 'Something went wrong. Please try again.')}</Text>
      <TouchableOpacity style={styles.btn} onPress={()=>isPaid?router.replace('/(tabs)/bookings'):router.back()}>
        <Text style={styles.btnText}>{isPaid ? 'View Bookings' : 'Try Again'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>router.replace('/(tabs)/home')} style={{paddingVertical:8}}>
        <Text style={{color:COLORS.primary,fontSize:14,fontWeight:'600',textDecorationLine:'underline'}}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',padding:24},
  icon:{fontSize:60,marginBottom:16},
  title:{fontSize:24,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,textAlign:'center',marginBottom:8},
  subtitle:{fontSize:14,color:COLORS.gray,textAlign:'center',marginBottom:24},
  btn:{width:'100%',backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:15,alignItems:'center',marginBottom:12},
  btnText:{color:COLORS.white,fontSize:16,fontWeight:'700'},
});
