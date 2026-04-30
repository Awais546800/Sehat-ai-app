import React,{useState,useCallback} from 'react';
import {View,Text,FlatList,TouchableOpacity,Alert} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import api from '../../utils/api';
export default function HealthRecordsScreen({navigation}){
  const [data,setD]=useState([]);
  useFocusEffect(useCallback(()=>{api.get('/consultations').then(r=>setD(r.data.data||[])).catch(()=>{});},[]) );
  const del=(id)=>Alert.alert('Delete','Remove from your view?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:async()=>{await api.delete('/consultations/'+id).catch(()=>{});setD(d=>d.filter(c=>c._id!==id));}}]);
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>📊 Health Records</Text>
    </LinearGradient>
    <FlatList data={data} keyExtractor={i=>i._id} contentContainerStyle={{padding:16}}
      renderItem={({item:c})=>(<TouchableOpacity onPress={()=>navigation.navigate('Chat',{consultationId:c._id})} style={{backgroundColor:'#fff',borderRadius:14,padding:16,marginBottom:10,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:'#f0f0f0'}}>
        <View style={{width:44,height:44,borderRadius:22,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:22}}>🤒</Text></View>
        <View style={{flex:1}}>
          <Text style={{fontSize:14,fontWeight:'600',color:'#1a1a1a'}} numberOfLines={1}>{c.title||'Consultation'}</Text>
          <Text style={{fontSize:12,color:'#aaa'}}>{new Date(c.createdAt).toLocaleDateString()}</Text>
          {c.diagnosis?.condition&&<Text style={{fontSize:12,color:'#00897B',marginTop:2}} numberOfLines={1}>{c.diagnosis.condition}</Text>}
        </View>
        <TouchableOpacity onPress={()=>del(c._id)}><Ionicons name="trash-outline" size={18} color="#ccc"/></TouchableOpacity>
      </TouchableOpacity>)}
      ListEmptyComponent={<View style={{alignItems:'center',padding:40}}><Text style={{fontSize:48}}>📂</Text><Text style={{fontSize:16,fontWeight:'700',color:'#888',marginTop:12}}>No records yet</Text></View>}
    />
  </View>);}