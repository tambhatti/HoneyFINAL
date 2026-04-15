import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Platform, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { COLORS, SHADOW } from '../../constants/theme';
import { usePaginatedApi } from '../../hooks/useApi';
import UserService from '../../services/user.service';
export default function MyBudgetsScreen() {
  const router = useRouter();
  const { items, loading, refresh } = usePaginatedApi(UserService.getBudgets, {});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  async function deleteBudget() {
    try { await UserService.deleteBudget(deleteTarget); setDeleteTarget(null); refresh(); }
    catch(err) { Alert.alert('Error', err.message); }
  }
  async function addBudget() {
    if (!newName) return Alert.alert('Required','Enter budget name');
    try { await UserService.createBudget({name:newName,totalBudget:parseFloat(newAmount)||0,allocations:{}}); setAddModal(false);setNewName('');setNewAmount('');refresh(); }
    catch(err) { Alert.alert('Error',err.message); }
  }
  return (
    <View style={styles.screen}>
      <Modal visible={!!deleteTarget} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity style={{position:'absolute',top:14,right:14}} onPress={()=>setDeleteTarget(null)}><Text style={{fontSize:18,color:COLORS.gray}}>✕</Text></TouchableOpacity>
            <View style={styles.warnIcon}><Text style={{fontSize:28,color:COLORS.white}}>!</Text></View>
            <Text style={styles.modalText}>Are You Sure You Want To Delete The Budget</Text>
            <View style={{flexDirection:'row',gap:12,width:'100%'}}>
              <TouchableOpacity style={styles.yesBtn} onPress={deleteBudget}><Text style={{color:COLORS.white,fontSize:15,fontWeight:'700'}}>Yes</Text></TouchableOpacity>
              <TouchableOpacity style={styles.noBtn} onPress={()=>setDeleteTarget(null)}><Text style={{color:COLORS.gold,fontSize:15,fontWeight:'600'}}>No</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={addModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={[styles.modalBox,{padding:24}]}>
            <TouchableOpacity style={{position:'absolute',top:14,right:14}} onPress={()=>setAddModal(false)}><Text style={{fontSize:18,color:COLORS.gray}}>✕</Text></TouchableOpacity>
            <Text style={{fontSize:20,fontWeight:'700',fontFamily:'serif',color:COLORS.dark,marginBottom:16}}>New Budget</Text>
            <Text style={styles.label}>Budget Name<Text style={styles.req}> *</Text></Text>
            <TextInput style={styles.input} placeholder="e.g. Wedding Budget" value={newName} onChangeText={setNewName} placeholderTextColor="#9ca3af"/>
            <Text style={styles.label}>Total Amount (AED)</Text>
            <TextInput style={styles.input} placeholder="e.g. 25000" value={newAmount} onChangeText={setNewAmount} keyboardType="numeric" placeholderTextColor="#9ca3af"/>
            <TouchableOpacity style={{backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:14,alignItems:'center',width:'100%'}} onPress={addBudget}>
              <Text style={{color:COLORS.white,fontSize:15,fontWeight:'700'}}>Create Budget</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.title}>My Budgets</Text>
        <View style={{flexDirection:'row',gap:8}}>
          <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:16}}>☰</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Text style={{fontSize:16}}>🔔</Text></TouchableOpacity>
        </View>
      </View>
      <FlatList data={items} keyExtractor={i=>i.id}
        contentContainerStyle={{padding:20,paddingBottom:90,gap:12}}
        refreshControl={<RefreshControl refreshing={loading&&items.length===0} onRefresh={refresh} tintColor={COLORS.primary}/>}
        ListEmptyComponent={!loading&&<View style={{alignItems:'center',paddingTop:40}}><Text style={{fontSize:40}}>💰</Text><Text style={{color:COLORS.gray,marginTop:8}}>No budgets yet</Text></View>}
        renderItem={({item})=>(
          <View style={styles.card}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <View>
                <Text style={styles.budgetName}>{item.name}</Text>
                <Text style={styles.budgetMeta}>Total: AED {item.totalBudget?.toLocaleString()}</Text>
                <Text style={styles.budgetMeta}>Modified: {new Date(item.modifiedAt||item.createdAt).toLocaleDateString()}</Text>
              </View>
              <TouchableOpacity onPress={()=>setDeleteTarget(item.id)}><Text style={{fontSize:20}}>🗑</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>router.push(`/budget-detail?id=${item.id}`)} style={{alignSelf:'flex-end'}}>
              <Text style={{fontSize:13,color:COLORS.gold,fontWeight:'600',textDecorationLine:'underline'}}>View</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={()=>setAddModal(true)}>
        <Text style={{color:COLORS.white,fontSize:24}}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:44,paddingBottom:14},
  title:{fontSize:26,fontWeight:'700',fontFamily:'serif',color:COLORS.dark},
  iconBtn:{width:38,height:38,borderRadius:19,backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'},
  card:{backgroundColor:COLORS.white,borderRadius:14,padding:16,borderWidth:1,borderColor:'#f0f0f0',...SHADOW.sm},
  budgetName:{fontSize:15,fontWeight:'700',color:COLORS.dark,marginBottom:4},budgetMeta:{fontSize:12,color:COLORS.gray,marginBottom:2},
  overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.55)',alignItems:'center',justifyContent:'center'},
  modalBox:{backgroundColor:COLORS.white,borderRadius:20,padding:20,width:'85%',alignItems:'center'},
  warnIcon:{width:60,height:60,borderRadius:30,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center',marginBottom:14},
  modalText:{fontSize:15,fontWeight:'600',color:COLORS.dark,textAlign:'center',marginBottom:20,lineHeight:22},
  yesBtn:{flex:1,backgroundColor:COLORS.gold,borderRadius:12,paddingVertical:13,alignItems:'center'},
  noBtn:{flex:1,borderWidth:1.5,borderColor:COLORS.gold,borderRadius:12,paddingVertical:13,alignItems:'center'},
  label:{fontSize:14,fontWeight:'600',color:COLORS.dark,marginBottom:6,alignSelf:'flex-start',width:'100%'},req:{color:COLORS.red},
  input:{borderWidth:1,borderColor:'#e5e7eb',borderRadius:12,paddingHorizontal:14,paddingVertical:12,fontSize:14,color:COLORS.dark,marginBottom:14,width:'100%'},
  fab:{position:'absolute',bottom:24,right:24,width:56,height:56,borderRadius:28,backgroundColor:COLORS.primary,alignItems:'center',justifyContent:'center'},
});
