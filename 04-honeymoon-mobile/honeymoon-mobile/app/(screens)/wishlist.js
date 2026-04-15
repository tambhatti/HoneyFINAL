import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SHADOW } from '../../constants/theme';
import { StarRating } from '../../components/StarRating';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
const AVATAR='https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200';
export default function WishlistScreen(){
  const router=useRouter();
  const { data, loading, refresh } = useApi(UserService.getWishlist);
  const items = data?.wishlist || [];
  async function remove(id){ try{ await UserService.toggleWishlist(id); refresh(); } catch{} }
  return(
    <View style={styles.screen}>
      <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Wishlist</Text><Text style={{fontSize:13,color:COLORS.gray}}>{items.length} items</Text></View>
      {loading&&items.length===0?<ActivityIndicator color={COLORS.primary} style={{marginTop:40}}/>:(
        items.length===0?(
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:48}}>🤍</Text><Text style={{fontSize:16,color:COLORS.gray,marginTop:12,marginBottom:12}}>Wishlist is empty</Text><TouchableOpacity onPress={()=>router.push('/vendors')}><Text style={{color:COLORS.primary,fontWeight:'600'}}>Browse Vendors →</Text></TouchableOpacity></View>
        ):(
          <FlatList data={items} keyExtractor={i=>i.id} contentContainerStyle={{padding:16,gap:12}}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.primary}/>}
            renderItem={({item})=>(
              <TouchableOpacity style={styles.card} onPress={()=>router.push(`/vendor-detail?id=${item.id}`)}>
                <Image source={{uri:item.avatar||AVATAR}} style={styles.img}/>
                <View style={styles.info}>
                  <Text style={styles.vendorName}>{item.companyName}</Text>
                  <Text style={{fontSize:12,color:COLORS.gold}}>{item.category}</Text>
                  <View style={{flexDirection:'row',alignItems:'center',gap:4,marginTop:4}}><StarRating rating={item.rating||0} size={11}/><Text style={{fontSize:11,color:COLORS.gray}}>({item.reviewCount||0})</Text></View>
                </View>
                <TouchableOpacity onPress={()=>remove(item.id)} style={{padding:10}}><Text style={{fontSize:20}}>❤️</Text></TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )
      )}
    </View>
  );
}
const styles=StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  back:{fontSize:28,color:COLORS.dark},title:{fontSize:22,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  card:{flexDirection:'row',gap:12,backgroundColor:COLORS.white,borderRadius:14,overflow:'hidden',borderWidth:1,borderColor:'#f0f0f0',...SHADOW.sm},
  img:{width:100,height:90},info:{flex:1,padding:10},
  vendorName:{fontSize:14,fontWeight:'700',color:COLORS.dark,marginBottom:2},
});
