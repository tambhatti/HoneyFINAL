import { View, Text, TextInput, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS, SHADOW } from '../../constants/theme';
import { StarRating } from '../../components/StarRating';
import { usePaginatedApi, useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
const AVATAR = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80';
export default function ServicesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const { data: catData } = useApi(UserService.getCategories);
  const categories = catData?.categories || [];
  const params = { search, ...(activeCategory && { category: activeCategory }) };
  const { items, loading, loadMore, hasMore } = usePaginatedApi(UserService.getServices, params);
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:16}}>🔔</Text></TouchableOpacity>
      </View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={{fontSize:14,marginRight:8}}>🔍</Text>
          <TextInput style={styles.searchInput} placeholder="Search services..." value={search} onChangeText={setSearch} placeholderTextColor="#9ca3af"/>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <TouchableOpacity onPress={()=>setActiveCategory('')} style={[styles.chip,!activeCategory&&styles.chipActive]}>
          <Text style={[styles.chipText,!activeCategory&&styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {categories.map(c=>(
          <TouchableOpacity key={c.id} onPress={()=>setActiveCategory(c.name)} style={[styles.chip,activeCategory===c.name&&styles.chipActive]}>
            <Text style={styles.chipEmoji}>{c.icon}</Text>
            <Text style={[styles.chipText,activeCategory===c.name&&styles.chipTextActive]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={items} numColumns={2} keyExtractor={i=>i.id}
        contentContainerStyle={styles.grid} columnWrapperStyle={{gap:12}}
        onEndReached={loadMore} onEndReachedThreshold={0.3}
        ListFooterComponent={hasMore&&loading?<ActivityIndicator color={COLORS.primary} style={{marginVertical:12}}/>:null}
        ListEmptyComponent={!loading&&<View style={{alignItems:'center',paddingTop:40}}><Text style={{fontSize:40}}>🔍</Text><Text style={{color:COLORS.gray,marginTop:8}}>No services found</Text></View>}
        renderItem={({item})=>(
          <TouchableOpacity style={styles.card} onPress={()=>router.push(`/service-detail?id=${item.id}`)} activeOpacity={0.9}>
            <Image source={{uri:item.images?.[0]||AVATAR}} style={styles.cardImg} resizeMode="cover"/>
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
                <StarRating rating={item.rating||0} size={10}/>
                <Text style={styles.cardReviews}>{item.reviewCount}</Text>
              </View>
              <Text style={styles.cardPrice}>AED {item.basePrice?.toLocaleString()}</Text>
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
  searchRow:{paddingHorizontal:20,marginBottom:12},
  searchBox:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:12,backgroundColor:'#fafafa'},
  searchInput:{flex:1,fontSize:14,color:COLORS.dark},
  chips:{paddingHorizontal:20,paddingBottom:12,gap:8},
  chip:{flexDirection:'row',alignItems:'center',gap:4,borderWidth:1,borderColor:'#e5e7eb',borderRadius:20,paddingHorizontal:12,paddingVertical:7},
  chipActive:{backgroundColor:COLORS.primary,borderColor:COLORS.primary},
  chipText:{fontSize:13,color:COLORS.gray},chipTextActive:{color:COLORS.white,fontWeight:'600'},chipEmoji:{fontSize:13},
  grid:{paddingHorizontal:20,paddingBottom:24},
  card:{flex:1,...SHADOW.sm,borderRadius:14,overflow:'hidden',backgroundColor:COLORS.white},
  cardImg:{width:'100%',height:120},cardBody:{padding:10},
  cardName:{fontSize:13,fontWeight:'700',color:COLORS.dark,marginBottom:2},
  cardCategory:{fontSize:11,color:COLORS.gold,marginBottom:4},cardReviews:{fontSize:11,color:COLORS.gray},
  cardPrice:{fontSize:13,fontWeight:'700',color:COLORS.primary,marginTop:4},
});
