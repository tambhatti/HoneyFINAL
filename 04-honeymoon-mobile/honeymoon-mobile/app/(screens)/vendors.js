import { View, Text, TextInput, Image, TouchableOpacity, FlatList, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS, SHADOW } from '../../constants/theme';
import { StarRating } from '../../components/StarRating';
import { usePaginatedApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
const AVATAR = 'https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200';
export default function VendorsScreen() {
  const router = useRouter();
  const { category: initCategory } = useLocalSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initCategory || '');
  const [wishlisted, setWishlisted] = useState({});
  const params = { search, category };
  const { items, loading, refresh, loadMore, hasMore } = usePaginatedApi(UserService.getVendors, params);
  async function toggleWishlist(id) {
    try { await UserService.toggleWishlist(id); setWishlisted(p=>({...p,[id]:!p[id]})); } catch {}
  }
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{category || 'Vendors'}</Text>
        <View style={{flexDirection:'row',gap:8}}>
          <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:16}}>☰</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:16}}>🔔</Text></TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={{fontSize:14,marginRight:8}}>🔍</Text>
          <TextInput style={styles.searchInput} placeholder="Search" value={search} onChangeText={setSearch} placeholderTextColor="#9ca3af"/>
        </View>
        <TouchableOpacity style={styles.filterBtn}><Text style={{fontSize:16,color:COLORS.white}}>⊞</Text></TouchableOpacity>
      </View>
      <FlatList data={items} numColumns={2} keyExtractor={i=>i.id}
        contentContainerStyle={styles.grid} columnWrapperStyle={{gap:12}}
        onEndReached={loadMore} onEndReachedThreshold={0.3}
        ListFooterComponent={hasMore&&loading?<ActivityIndicator color={COLORS.primary} style={{marginVertical:12}}/>:null}
        ListEmptyComponent={!loading&&<View style={{alignItems:'center',paddingTop:40}}><Text style={{fontSize:40}}>🏪</Text><Text style={{color:COLORS.gray,marginTop:8}}>No vendors found</Text></View>}
        renderItem={({item})=>(
          <TouchableOpacity style={styles.card} onPress={()=>router.push(`/vendor-detail?id=${item.id}`)}>
            <View style={styles.imgWrap}>
              <Image source={{uri:item.avatar||AVATAR}} style={styles.img} resizeMode="cover"/>
              <TouchableOpacity style={styles.heartBtn} onPress={()=>toggleWishlist(item.id)}>
                <Text style={{fontSize:16}}>{wishlisted[item.id]?'❤️':'🤍'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.vendorName} numberOfLines={1}>{item.companyName}</Text>
            <Text style={styles.ownerName} numberOfLines={1}>👤 {item.firstName} {item.lastName}</Text>
            <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
              <StarRating rating={item.rating||0} size={11}/>
              <Text style={styles.reviews}>({item.reviewCount||0})</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14},
  title:{fontSize:26,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  iconBtn:{width:38,height:38,borderRadius:19,backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'},
  searchRow:{flexDirection:'row',gap:10,paddingHorizontal:20,marginBottom:16},
  searchBox:{flex:1,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:12,backgroundColor:'#fafafa'},
  searchInput:{flex:1,fontSize:14,color:COLORS.dark},
  filterBtn:{width:48,height:48,borderRadius:12,backgroundColor:COLORS.gold,alignItems:'center',justifyContent:'center'},
  grid:{paddingHorizontal:20,paddingBottom:24},
  card:{flex:1},imgWrap:{borderRadius:12,overflow:'hidden',marginBottom:8,position:'relative'},
  img:{width:'100%',height:140},
  heartBtn:{position:'absolute',top:8,right:8,width:30,height:30,borderRadius:15,backgroundColor:'rgba(255,255,255,0.9)',alignItems:'center',justifyContent:'center'},
  vendorName:{fontSize:13,fontWeight:'700',color:COLORS.dark,marginBottom:3},
  ownerName:{fontSize:11,color:COLORS.gray,marginBottom:3},reviews:{fontSize:11,color:COLORS.gray},
});
