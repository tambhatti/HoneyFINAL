import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/theme';
const LOGO = '/logo-icon.png';
export default function AboutUsScreen() {
  const router = useRouter();
  return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>About Us</Text><View style={{width:32}}/></View>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{uri:LOGO}} style={styles.logo} resizeMode="contain"/>
        <Text style={styles.brand}>HONEYMOON</Text>
        <Text style={styles.tagline}>Luxury Emirati Weddings — Intelligently Curated</Text>
        <View style={styles.divider}/>
        {[
          ['Our Mission','Honeymoon is the UAE\'s premier wedding planning platform, connecting couples with the finest vendors to create unforgettable celebrations. We combine cutting-edge AI with a curated selection of premium vendors to make your perfect wedding a reality.'],
          ['What We Offer','From stunning venues and world-class photographers to expert caterers and talented musicians, our platform provides access to hundreds of vetted wedding professionals across Dubai, Abu Dhabi, and Sharjah.'],
          ['AI-Powered Planning','Our AI budget estimation tool helps couples plan smarter by providing personalized cost estimates based on location, guest count, and preferences — ensuring your dream wedding fits your budget.'],
          ['Our Values','We are committed to transparency, quality, and exceptional service. Every vendor on our platform is carefully vetted to ensure they meet our high standards.'],
        ].map(([heading, body]) => (
          <View key={heading} style={styles.block}>
            <Text style={styles.blockTitle}>{heading}</Text>
            <Text style={styles.blockText}>{body}</Text>
          </View>
        ))}
        <View style={styles.statsRow}>
          {[['500+','Vendors'],['10K+','Happy Couples'],['3','Emirates'],['4.8★','App Rating']].map(([num,lbl])=>(
            <View key={lbl} style={styles.stat}><Text style={styles.statNum}>{num}</Text><Text style={styles.statLbl}>{lbl}</Text></View>
          ))}
        </View>
        <Text style={styles.footer}>© 2026 Honeymoon. All rights reserved.</Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  content:{padding:20,paddingBottom:40,alignItems:'center'},
  logo:{width:80,height:80,marginBottom:8},
  brand:{fontSize:24,fontWeight:'900',letterSpacing:4,color:COLORS.dark,marginBottom:4},
  tagline:{fontSize:13,color:COLORS.gray,textAlign:'center',marginBottom:20},
  divider:{width:60,height:2,backgroundColor:COLORS.gold,borderRadius:1,marginBottom:20},
  block:{width:'100%',marginBottom:20},
  blockTitle:{fontSize:17,fontWeight:'700',color:COLORS.dark,marginBottom:6},
  blockText:{fontSize:14,color:COLORS.gray,lineHeight:22},
  statsRow:{flexDirection:'row',width:'100%',borderTopWidth:1,borderTopColor:'#f3f4f6',marginTop:16,paddingTop:16},
  stat:{flex:1,alignItems:'center'},statNum:{fontSize:18,fontWeight:'900',color:COLORS.primary},statLbl:{fontSize:11,color:COLORS.gray,marginTop:3},
  footer:{fontSize:12,color:COLORS.gray,marginTop:20},
});
