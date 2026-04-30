import React,{useState,useEffect} from 'react';
import {View,Text,TextInput,TouchableOpacity,FlatList,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
export default function MedicineSearchScreen({navigation,route}){
  const [q,setQ]=useState(route.params?.q||'');const [results,setR]=useState([]);const [loading,setL]=useState(false);const [searched,setS]=useState(false);
  useEffect(()=>{if(route.params?.q)search();},[]);
  const search=async()=>{
    if(!q.trim())return;setL(true);setS(true);
    try{const r=await api.get('/medicines/search?q='+encodeURIComponent(q));setR(r.data.data||[]);}
    catch(err){if(err.response?.status===429)alert(err.response.data.message);setR([]);}
    finally{setL(false);}
  };
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#1976D2','#0D47A1']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>🔍 Search Medicine</Text>
    </LinearGradient>
    <View style={{flexDirection:'row',padding:16,gap:10}}>
      <View style={{flex:1,flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:14,paddingHorizontal:14,borderWidth:1,borderColor:'#ebebeb'}}>
        <Ionicons name="search-outline" size={18} color="#888" style={{marginRight:8}}/>
        <TextInput style={{flex:1,fontSize:14,color:'#1a1a1a',paddingVertical:14}} placeholder="Brand or generic name..." value={q} onChangeText={setQ} onSubmitEditing={search} returnKeyType="search" placeholderTextColor="#bbb"/>
      </View>
      <TouchableOpacity onPress={search} style={{backgroundColor:'#1976D2',paddingHorizontal:18,borderRadius:14,justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:'700'}}>Search</Text></TouchableOpacity>
    </View>
    {loading?<ActivityIndicator color="#1976D2" size="large" style={{marginTop:40}}/>:(
      <FlatList data={results} keyExtractor={(_,i)=>i.toString()} contentContainerStyle={{padding:16,paddingTop:0}}
        renderItem={({item:m})=>(<TouchableOpacity onPress={()=>navigation.navigate('MedicineDetail',{medicine:m})} style={{backgroundColor:'#fff',borderRadius:14,padding:16,marginBottom:10,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:'#f0f0f0'}}>
          <View style={{width:44,height:44,borderRadius:22,backgroundColor:'#e3f2fd',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:22}}>💊</Text></View>
          <View style={{flex:1}}>
            <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a'}}>{m.name}</Text>
            {m.genericName&&<Text style={{fontSize:12,color:'#888',marginTop:2}}>{m.genericName}</Text>}
            {m.manufacturer&&<Text style={{fontSize:11,color:'#aaa',marginTop:2}}>{m.manufacturer}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc"/>
        </TouchableOpacity>)}
        ListEmptyComponent={searched&&!loading&&<View style={{alignItems:'center',padding:40}}><Text style={{fontSize:48}}>💊</Text><Text style={{fontSize:16,fontWeight:'700',color:'#888',marginTop:12}}>No results found</Text><Text style={{fontSize:13,color:'#aaa',marginTop:6}}>Try a different name</Text></View>}
      />
    )}
  </View>);}