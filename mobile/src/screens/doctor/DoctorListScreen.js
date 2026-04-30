import React,{useState,useEffect} from 'react';
import {View,Text,FlatList,TouchableOpacity,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
export default function DoctorListScreen({navigation,route}){
  const {specialty,city}=route.params||{};
  const [doctors,setD]=useState([]);const [loading,setL]=useState(true);
  useEffect(()=>{api.get('/doctors/search?specialty='+(specialty||'')+'&city='+(city||'')).then(r=>{setD(r.data.data||[]);setL(false);}).catch(()=>setL(false));},[]);
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <View><Text style={{fontSize:18,fontWeight:'800',color:'#fff'}}>{specialty||'All Doctors'}</Text><Text style={{color:'rgba(255,255,255,0.8)',fontSize:13}}>{city||'Pakistan'} • {doctors.length} found</Text></View>
    </LinearGradient>
    {loading?<ActivityIndicator color="#00897B" size="large" style={{marginTop:40}}/>:(
      <FlatList data={doctors} keyExtractor={i=>i.id} contentContainerStyle={{padding:16}}
        renderItem={({item:d})=>(<TouchableOpacity onPress={()=>navigation.navigate('DoctorProfile',{doctor:d})} style={{flexDirection:'row',alignItems:'flex-start',backgroundColor:'#fff',padding:16,borderRadius:14,marginBottom:10,gap:12,borderWidth:1,borderColor:'#f0f0f0'}}>
          <View style={{width:52,height:52,borderRadius:26,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:28}}>👨‍⚕️</Text></View>
          <View style={{flex:1}}>
            <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a'}}>{d.name}</Text>
            <Text style={{fontSize:13,color:'#00897B',marginTop:2}}>{d.specialty}</Text>
            <Text style={{fontSize:12,color:'#888',marginTop:2}} numberOfLines={1}>{d.hospital}</Text>
            <View style={{flexDirection:'row',gap:8,marginTop:6,flexWrap:'wrap'}}>
              <Text style={{fontSize:11,color:'#666',backgroundColor:'#f5f5f5',paddingHorizontal:8,paddingVertical:3,borderRadius:10}}>⭐ {d.rating}</Text>
              <Text style={{fontSize:11,color:'#666',backgroundColor:'#f5f5f5',paddingHorizontal:8,paddingVertical:3,borderRadius:10}}>{d.experience}yr exp</Text>
              <Text style={{fontSize:11,fontWeight:'700',color:d.available?'#4CAF50':'#F44336'}}>{d.available?'Available':'Busy'}</Text>
            </View>
          </View>
          <View style={{alignItems:'flex-end'}}>
            <Text style={{fontSize:14,fontWeight:'700',color:'#1a1a1a'}}>PKR {d.fee?.toLocaleString()}</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('AppointmentForm',{doctor:d})} style={{backgroundColor:'#00897B',paddingHorizontal:12,paddingVertical:6,borderRadius:10,marginTop:6}}>
              <Text style={{color:'#fff',fontSize:12,fontWeight:'700'}}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>)}
        ListEmptyComponent={<View style={{alignItems:'center',padding:40}}><Text style={{fontSize:48}}>👨‍⚕️</Text><Text style={{fontSize:16,fontWeight:'700',color:'#888',marginTop:12}}>No doctors found</Text></View>}
      />
    )}
  </View>);}