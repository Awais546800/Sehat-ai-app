import React,{useState,useCallback} from 'react';
import {View,Text,FlatList,TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import api from '../../utils/api';
export default function MyAppointmentsScreen({navigation}){
  const [appts,setA]=useState([]);
  useFocusEffect(useCallback(()=>{api.get('/appointments').then(r=>setA(r.data.data||[])).catch(()=>{});},[]) );
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>My Appointments</Text>
    </LinearGradient>
    <FlatList data={appts} keyExtractor={i=>i._id} contentContainerStyle={{padding:16}}
      renderItem={({item:a})=>(<View style={{backgroundColor:'#fff',borderRadius:14,padding:16,marginBottom:10,borderWidth:1,borderColor:'#f0f0f0'}}>
        <View style={{flexDirection:'row',alignItems:'center',gap:12}}>
          <View style={{width:44,height:44,borderRadius:22,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:22}}>👨‍⚕️</Text></View>
          <View style={{flex:1}}>
            <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a'}}>{a.doctorName}</Text>
            <Text style={{fontSize:13,color:'#00897B'}}>{a.specialty}</Text>
            <Text style={{fontSize:12,color:'#888',marginTop:2}}>{new Date(a.dateTime).toLocaleString()}</Text>
          </View>
          <View style={{paddingHorizontal:10,paddingVertical:4,borderRadius:12,backgroundColor:a.status==='confirmed'?'#e8f5e9':'#f5f5f5'}}>
            <Text style={{fontSize:11,fontWeight:'700',color:a.status==='confirmed'?'#4CAF50':'#888',textTransform:'capitalize'}}>{a.status}</Text>
          </View>
        </View>
      </View>)}
      ListEmptyComponent={<View style={{alignItems:'center',padding:40}}><Text style={{fontSize:48}}>📅</Text><Text style={{fontSize:16,fontWeight:'700',color:'#888',marginTop:12}}>No appointments yet</Text></View>}
    />
  </View>);}