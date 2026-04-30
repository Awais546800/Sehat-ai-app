import React from 'react';
import {View,Text,ScrollView,TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
export default function DoctorProfileScreen({navigation,route}){
  const {doctor:d={}}=route.params||{};
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>Doctor Profile</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <View style={{backgroundColor:'#fff',borderRadius:20,padding:20,alignItems:'center',marginBottom:16}}>
        <View style={{width:80,height:80,borderRadius:40,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center',marginBottom:12}}><Text style={{fontSize:40}}>👨‍⚕️</Text></View>
        <Text style={{fontSize:22,fontWeight:'900',color:'#1a1a1a'}}>{d.name}</Text>
        <Text style={{fontSize:15,color:'#00897B',marginTop:4}}>{d.specialty}</Text>
        <Text style={{fontSize:13,color:'#888',marginTop:4,textAlign:'center'}}>{d.hospital}</Text>
        <Text style={{fontSize:12,color:'#aaa',marginTop:4}}>{d.qualifications}</Text>
        <View style={{flexDirection:'row',gap:16,marginTop:16}}>
          {[['⭐',d.rating,'Rating'],['💬',d.reviews,'Reviews'],[d.experience+'yr','','Experience']].map(([v,s,l],i)=>(
            <View key={i} style={{alignItems:'center'}}><Text style={{fontSize:18,fontWeight:'900',color:'#1a1a1a'}}>{v}{s}</Text><Text style={{fontSize:11,color:'#888'}}>{l}</Text></View>
          ))}
        </View>
      </View>
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:12}}>
        {[['Consultation Fee','PKR '+(d.fee?.toLocaleString()||'N/A')],['Platform',d.platform],['Availability',d.available?'Available Today':'Currently Busy']].map(([k,v])=>(
          <View key={k} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:10,borderBottomWidth:1,borderColor:'#f0f0f0'}}>
            <Text style={{color:'#888',fontSize:13}}>{k}</Text>
            <Text style={{fontWeight:'700',color:'#1a1a1a',fontSize:13}}>{v}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('AppointmentForm',{doctor:d})} style={{borderRadius:14,overflow:'hidden',marginBottom:20}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}><Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>📅 Book Appointment</Text></LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  </View>);}