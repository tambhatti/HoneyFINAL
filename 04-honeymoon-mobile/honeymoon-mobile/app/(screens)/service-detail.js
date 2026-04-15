import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { COLORS, SHADOW } from '../../constants/theme';
import { StarRating } from '../../components/StarRating';
import { useApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';

const { width } = Dimensions.get('window');
const DAYS = ['M','T','W','T','F','S','S'];
const CAL  = [[null,null,null,null,null,1,2],[3,4,5,6,7,8,9],[10,11,12,13,14,15,16],[17,18,19,20,21,22,23],[24,25,26,27,28,29,30]];
const AVATAR = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80';

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedDay,    setSelectedDay]    = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const { data, loading } = useApi(UserService.getService, id);
  const svc    = data?.service;
  const vendor = data?.vendor;
  const addons = data?.addons  || [];
  const reviews= data?.reviews || [];

  function toggleAddon(addonId) {
    setSelectedAddons(p => p.includes(addonId) ? p.filter(a => a !== addonId) : [...p, addonId]);
  }

  function handleBookNow() {
    router.push(`/checkout?serviceId=${id}&vendorId=${svc?.vendorId}&addons=${selectedAddons.join(',')}`);
  }

  if (loading) return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (!svc) return <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}><Text>Service not found</Text></View>;

  const avgRating = reviews.length ? (reviews.reduce((s,r) => s+r.rating, 0)/reviews.length).toFixed(1) : svc.rating;

  return (
    <View style={{ flex:1, backgroundColor:COLORS.white }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={{ fontSize:16, color:COLORS.dark, fontWeight:'600' }}>‹ View Service</Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: svc.images?.[0] || AVATAR }} style={{ width, height:220 }} resizeMode="cover" />
        <View style={styles.content}>
          {/* Name + category */}
          <View style={styles.nameRow}>
            <Text style={styles.serviceName}>{svc.name}</Text>
            <View style={styles.categoryBadge}><Text style={styles.categoryText}>Category: {svc.category}</Text></View>
          </View>
          {vendor && <Text style={styles.owner}>👤 {vendor.firstName} {vendor.lastName}</Text>}
          <Text style={styles.location}>📍 {svc.location}</Text>
          <Text style={styles.description}>{svc.description}</Text>

          {/* Pricing */}
          <View style={styles.pricingGrid}>
            {svc.pricingType === 'Per Guest' && svc.basePrice && (
              <View style={styles.pricingItem}><Text style={styles.pricingLabel}>Price Per Guest:</Text><Text style={styles.pricingValue}>AED {svc.basePrice}</Text></View>
            )}
            {svc.pricingType === 'Per Hour' && (
              <View style={styles.pricingItem}><Text style={styles.pricingLabel}>Price Per Hour:</Text><Text style={styles.pricingValue}>AED {svc.basePrice}</Text></View>
            )}
            {svc.minGuests && <View style={styles.pricingItem}><Text style={styles.pricingLabel}>Min Guests:</Text><Text style={styles.pricingValue}>{svc.minGuests}</Text></View>}
            {svc.maxGuests && <View style={styles.pricingItem}><Text style={styles.pricingLabel}>Max Guests:</Text><Text style={styles.pricingValue}>{svc.maxGuests}</Text></View>}
            {svc.minHours  && <View style={styles.pricingItem}><Text style={styles.pricingLabel}>Min Hours:</Text><Text style={styles.pricingValue}>{svc.minHours}:00</Text></View>}
          </View>

          {/* Packages */}
          {svc.packages?.length > 0 && (
            <View style={styles.packagesRow}>
              {svc.packages.map((p, i) => (
                <View key={i} style={styles.packageCard}>
                  <Text style={styles.packageName}>{p.name}</Text>
                  <Text style={styles.packageDesc}>{p.description}</Text>
                  <Text style={styles.packagePrice}>AED {p.price?.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Add-ons */}
          {addons.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Add-ons</Text>
              {addons.map(a => (
                <TouchableOpacity key={a.id} style={[styles.addonRow, selectedAddons.includes(a.id) && styles.addonSelected]} onPress={() => toggleAddon(a.id)}>
                  <View>
                    <Text style={styles.addonName}>{a.title}</Text>
                    <Text style={styles.addonPrice}>AED {a.price} {a.priceType}</Text>
                  </View>
                  <View style={selectedAddons.includes(a.id) ? styles.addonChecked : styles.addonCheck}>
                    {selectedAddons.includes(a.id) && <Text style={{ color:COLORS.white, fontSize:12 }}>✓</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Policies */}
          {svc.policies && (
            <View style={styles.faqSection}>
              {Object.entries(svc.policies).map(([k, v]) => (
                <View key={k} style={styles.faqItem}>
                  <Text style={styles.faqQ}>{k.replace(/([A-Z])/g, ' $1').trim()}:</Text>
                  <Text style={styles.faqA}>{String(v)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Calendar */}
          <Text style={styles.sectionTitle}>Service Availability for Booking</Text>
          <View style={styles.calendar}>
            <View style={styles.calHeader}>
              <TouchableOpacity><Text style={styles.calNav}>‹</Text></TouchableOpacity>
              <Text style={styles.calMonth}>March 2026 ▾</Text>
              <TouchableOpacity><Text style={styles.calNav}>›</Text></TouchableOpacity>
            </View>
            <View style={styles.calDays}>
              {DAYS.map((d, i) => <Text key={i} style={styles.calDayLabel}>{d}</Text>)}
            </View>
            {CAL.map((week, i) => (
              <View key={i} style={styles.calWeek}>
                {week.map((d, j) => (
                  <TouchableOpacity key={j} onPress={() => d && setSelectedDay(d)}
                    style={[styles.calDay, d===selectedDay && styles.calDaySelected, !d && { opacity:0 }]}>
                    <Text style={[styles.calDayText, d===selectedDay && { color:COLORS.white }]}>{d||''}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Reviews */}
          {reviews.length > 0 && (
            <>
              <View style={styles.ratingSummary}>
                <Text style={styles.ratingNum}>{avgRating}</Text>
                <Text style={styles.ratingTotal}>/5 ({reviews.length})</Text>
              </View>
              <StarRating rating={parseFloat(avgRating)} size={16} />
              {reviews.slice(0, 3).map((r, i) => (
                <View key={i} style={styles.reviewCard}>
                  <StarRating rating={r.rating} size={12} />
                  <Text style={styles.reviewText}>{r.review}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Book Now button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBookNow} activeOpacity={0.85}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn:{ position:'absolute', top:Platform.OS==='ios'?54:30, left:16, zIndex:10, flexDirection:'row', alignItems:'center', gap:4 },
  content:{ padding:20 },
  nameRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 },
  serviceName:{ fontSize:22, fontWeight:'700', fontFamily:'serif', color:COLORS.dark, flex:1 },
  categoryBadge:{ backgroundColor:'#f0fdf4', borderRadius:20, paddingHorizontal:10, paddingVertical:4, marginLeft:8 },
  categoryText:{ fontSize:11, color:COLORS.green, fontWeight:'600' },
  owner:{ fontSize:13, color:COLORS.gold, marginBottom:3 },
  location:{ fontSize:13, color:COLORS.gray, marginBottom:12 },
  description:{ fontSize:13, color:COLORS.gray, lineHeight:20, marginBottom:16 },
  pricingGrid:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:14 },
  pricingItem:{ width:'48%', backgroundColor:'#fafafa', borderRadius:10, padding:10 },
  pricingLabel:{ fontSize:11, color:COLORS.gray, marginBottom:2 },
  pricingValue:{ fontSize:14, fontWeight:'700', color:COLORS.dark },
  packagesRow:{ flexDirection:'row', gap:10, marginBottom:12 },
  packageCard:{ flex:1, backgroundColor:'#f4ebd0', borderRadius:10, padding:12 },
  packageName:{ fontSize:13, fontWeight:'700', color:COLORS.dark, marginBottom:4 },
  packageDesc:{ fontSize:11, color:COLORS.gray, marginBottom:6 },
  packagePrice:{ fontSize:13, fontWeight:'700', color:COLORS.primary },
  sectionTitle:{ fontSize:16, fontWeight:'700', color:COLORS.dark, marginBottom:10, marginTop:4 },
  addonRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:12, borderWidth:1, borderColor:'#e5e7eb', borderRadius:10, marginBottom:8 },
  addonSelected:{ borderColor:COLORS.primary, backgroundColor:'#f0fdf4' },
  addonName:{ fontSize:13, fontWeight:'600', color:COLORS.dark, marginBottom:2 },
  addonPrice:{ fontSize:12, color:COLORS.gray },
  addonCheck:{ width:20, height:20, borderRadius:10, borderWidth:1.5, borderColor:'#e5e7eb' },
  addonChecked:{ width:20, height:20, borderRadius:10, backgroundColor:COLORS.primary, alignItems:'center', justifyContent:'center' },
  faqSection:{ backgroundColor:'#fafafa', borderRadius:12, padding:14, marginBottom:16, gap:10 },
  faqItem:{ borderBottomWidth:1, borderBottomColor:'#f3f4f6', paddingBottom:8 },
  faqQ:{ fontSize:13, fontWeight:'600', color:COLORS.dark, marginBottom:3 },
  faqA:{ fontSize:13, color:COLORS.gray },
  calendar:{ borderWidth:1, borderColor:'#e5e7eb', borderRadius:12, padding:14, marginBottom:16 },
  calHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  calNav:{ fontSize:22, color:COLORS.dark, paddingHorizontal:8 },
  calMonth:{ fontSize:14, fontWeight:'700', color:COLORS.dark },
  calDays:{ flexDirection:'row', justifyContent:'space-around', marginBottom:8 },
  calDayLabel:{ fontSize:12, color:COLORS.gray, width:32, textAlign:'center' },
  calWeek:{ flexDirection:'row', justifyContent:'space-around', marginBottom:6 },
  calDay:{ width:32, height:32, borderRadius:16, alignItems:'center', justifyContent:'center' },
  calDaySelected:{ backgroundColor:COLORS.primary },
  calDayText:{ fontSize:14, color:COLORS.dark },
  ratingSummary:{ flexDirection:'row', alignItems:'baseline', marginBottom:4, gap:4 },
  ratingNum:{ fontSize:28, fontWeight:'700', color:COLORS.dark },
  ratingTotal:{ fontSize:14, color:COLORS.gray },
  reviewCard:{ backgroundColor:'#fafafa', borderRadius:10, padding:12, marginBottom:8, gap:6, marginTop:8 },
  reviewText:{ fontSize:13, color:COLORS.gray },
  footer:{ padding:16, backgroundColor:COLORS.white, borderTopWidth:1, borderTopColor:'#f3f4f6' },
  bookBtn:{ backgroundColor:COLORS.gold, borderRadius:12, paddingVertical:16, alignItems:'center' },
  bookBtnText:{ color:COLORS.white, fontSize:16, fontWeight:'700' },
});
