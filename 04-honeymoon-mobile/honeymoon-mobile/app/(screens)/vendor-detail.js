import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS, SHADOW } from '../../constants/theme';
import { StarRating } from '../../components/StarRating';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const AVATAR = 'https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200';

export default function VendorDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isLoggedIn } = useAuth();
  const [tab, setTab] = useState('services');
  const [wishlisted, setWishlisted] = useState(false);

  const { data, loading } = useApi(UserService.getVendor, id);
  const vendor   = data?.vendor;
  const services = data?.services  || [];
  const reviews  = data?.reviews   || [];

  async function toggleWishlist() {
    if (!isLoggedIn) return router.push('/(auth)/login');
    try { await UserService.toggleWishlist(id); setWishlisted(p => !p); } catch {}
  }

  if (loading) return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!vendor)  return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><Text style={{ color:COLORS.gray }}>Vendor not found</Text></View>;

  return (
    <View style={{ flex:1, backgroundColor:COLORS.white }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: vendor.avatar || AVATAR }} style={{ width, height:220 }} resizeMode="cover" />
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <View style={{ flex:1 }}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
                <Text style={styles.vendorName}>{vendor.companyName}</Text>
                {vendor.isVerified && <Text style={{ color:COLORS.primary, fontSize:16 }}>✓</Text>}
              </View>
              <View style={{ flexDirection:'row', alignItems:'center', gap:4, marginTop:4 }}>
                <Text style={{ color:COLORS.gold, fontSize:14 }}>★</Text>
                <Text style={styles.rating}>{vendor.rating}</Text>
                <Text style={{ fontSize:12, color:COLORS.gray }}>({vendor.reviewCount} reviews)</Text>
              </View>
              <Text style={styles.ownerLine}>👤 {vendor.firstName} {vendor.lastName}</Text>
              <Text style={styles.locationLine}>📍 {vendor.location}</Text>
            </View>
            <TouchableOpacity onPress={toggleWishlist} style={{ padding:4 }}>
              <Text style={{ fontSize:22 }}>{wishlisted ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Service Offering</Text>
          <View style={styles.tagsRow}>
            {[vendor.category, ...(vendor.services ? vendor.services.split(',') : [])].filter(Boolean).map((t, i) => (
              <View key={i} style={styles.tag}><Text style={styles.tagText}>{t.trim()}</Text></View>
            ))}
          </View>

          <TouchableOpacity
            style={{backgroundColor:COLORS.primary,borderRadius:12,paddingVertical:14,alignItems:'center',marginBottom:10}}
            onPress={() => router.push(`/service-detail?id=${vendor?.services?.[0]?.id || ''}&vendorId=${id}`)}
            activeOpacity={0.85}>
            <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>Book Now →</Text>
          </TouchableOpacity>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.quotationBtn} onPress={() => router.push(`/custom-quotation?vendorId=${id}`)} activeOpacity={0.85}>
              <Text style={styles.quotationBtnText}>Request Custom Quotation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.meetingBtn} onPress={() => router.push(`/request-meeting?vendorId=${id}`)} activeOpacity={0.85}>
              <Text style={styles.meetingBtnText}>Request Meeting</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            {['services','reviews'].map(t => (
              <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab===t && styles.tabActive]}>
                <Text style={[styles.tabText, tab===t && styles.tabTextActive]}>
                  {t === 'services' ? 'Services Offered' : 'Reviews'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tab === 'services' && (
            services.length === 0
              ? <Text style={{ color:COLORS.gray, textAlign:'center', marginTop:20 }}>No services listed</Text>
              : <View style={styles.servicesGrid}>
                  {services.map(s => (
                    <TouchableOpacity key={s.id} style={styles.serviceCard} onPress={() => router.push(`/service-detail?id=${s.id}`)} activeOpacity={0.9}>
                      <Image source={{ uri: s.images?.[0] || AVATAR }} style={styles.serviceImg} resizeMode="cover" />
                      <Text style={styles.serviceName} numberOfLines={2}>{s.name}</Text>
                      <Text style={styles.servicePrice}>AED {s.basePrice?.toLocaleString()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
          )}

          {tab === 'reviews' && (
            <View style={{ gap:12 }}>
              <View style={styles.ratingOverall}>
                <Text style={styles.ratingBig}>{vendor.rating}</Text>
                <StarRating rating={vendor.rating || 0} size={18} />
                <Text style={styles.ratingCount}>{vendor.reviewCount} Reviews</Text>
              </View>
              {reviews.length === 0
                ? <Text style={{ color:COLORS.gray, textAlign:'center' }}>No reviews yet</Text>
                : reviews.map((r, i) => (
                    <View key={i} style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewName}>User {r.userId}</Text>
                        <Text style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</Text>
                      </View>
                      <StarRating rating={r.rating} size={12} />
                      <Text style={styles.reviewText}>{r.review}</Text>
                      {r.vendorReply && (
                        <View style={styles.replyBox}>
                          <Text style={styles.replyLabel}>Vendor reply:</Text>
                          <Text style={styles.replyText}>{r.vendorReply}</Text>
                        </View>
                      )}
                    </View>
                  ))
              }
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn:{ position:'absolute', top:Platform.OS==='ios'?54:30, left:16, zIndex:10, width:36, height:36, borderRadius:18, backgroundColor:'rgba(255,255,255,0.9)', alignItems:'center', justifyContent:'center', ...SHADOW.sm },
  backArrow:{ fontSize:24, color:COLORS.dark },
  content:{ padding:20 },
  nameRow:{ flexDirection:'row', alignItems:'flex-start', marginBottom:12 },
  vendorName:{ fontSize:20, fontWeight:'700', fontFamily:'serif', color:COLORS.dark },
  rating:{ fontSize:14, fontWeight:'700', color:COLORS.dark },
  ownerLine:{ fontSize:13, color:COLORS.gold, marginTop:4 },
  locationLine:{ fontSize:12, color:COLORS.gray, marginTop:2 },
  sectionLabel:{ fontSize:14, fontWeight:'600', color:COLORS.dark, marginBottom:8 },
  tagsRow:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16 },
  tag:{ borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, paddingHorizontal:12, paddingVertical:6 },
  tagText:{ fontSize:13, color:COLORS.dark },
  actionsRow:{ flexDirection:'row', gap:10, marginBottom:16 },
  quotationBtn:{ flex:1, borderWidth:1.5, borderColor:COLORS.gold, borderRadius:10, paddingVertical:12, alignItems:'center' },
  quotationBtnText:{ fontSize:11, fontWeight:'600', color:COLORS.gold },
  meetingBtn:{ flex:1, backgroundColor:COLORS.primary, borderRadius:10, paddingVertical:12, alignItems:'center' },
  meetingBtnText:{ fontSize:11, fontWeight:'600', color:COLORS.white },
  tabs:{ flexDirection:'row', borderBottomWidth:1, borderBottomColor:'#f3f4f6', marginBottom:16 },
  tabBtn:{ flex:1, paddingVertical:12, alignItems:'center' },
  tabActive:{ borderBottomWidth:2, borderBottomColor:COLORS.primary },
  tabText:{ fontSize:14, color:COLORS.gray },
  tabTextActive:{ color:COLORS.primary, fontWeight:'700' },
  servicesGrid:{ flexDirection:'row', flexWrap:'wrap', gap:12 },
  serviceCard:{ width:'47%', ...SHADOW.sm, borderRadius:12, overflow:'hidden', backgroundColor:COLORS.white },
  serviceImg:{ width:'100%', height:110 },
  serviceName:{ fontSize:12, fontWeight:'600', color:COLORS.dark, padding:8, paddingBottom:2 },
  servicePrice:{ fontSize:12, color:COLORS.primary, paddingHorizontal:8, paddingBottom:8, fontWeight:'700' },
  ratingOverall:{ alignItems:'center', padding:16, backgroundColor:'#fafafa', borderRadius:12, gap:6, marginBottom:12 },
  ratingBig:{ fontSize:48, fontWeight:'700', color:COLORS.dark },
  ratingCount:{ fontSize:13, color:COLORS.gray },
  reviewCard:{ backgroundColor:'#fafafa', borderRadius:12, padding:14, gap:6 },
  reviewHeader:{ flexDirection:'row', justifyContent:'space-between' },
  reviewName:{ fontSize:14, fontWeight:'700', color:COLORS.dark },
  reviewDate:{ fontSize:12, color:COLORS.gray },
  reviewText:{ fontSize:13, color:COLORS.gray, lineHeight:20 },
  replyBox:{ backgroundColor:'#f0fdf4', borderRadius:8, padding:10, borderLeftWidth:3, borderLeftColor:COLORS.primary },
  replyLabel:{ fontSize:11, fontWeight:'700', color:COLORS.primary, marginBottom:3 },
  replyText:{ fontSize:12, color:COLORS.gray },
});
