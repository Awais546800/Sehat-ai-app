import React from 'react';
import {View,Text,ScrollView,TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
export default function BookingConfirmedScreen({navigation,route}){
  const {appointment:a={},doctor:d={}}=route.params||{};
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <ScrollView contentContainerStyle={{flexGrow:1,alignItems:'center',padding:24,paddingTop:80}}>
      <View style={{width:100,height:100,borderRadius:50,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center',marginBottom:20}}><Text style={{fontSize:56}}>✅</Text></View>
      <Text style={{fontSize:28,fontWeight:'900',color:'#1a1a1a',marginBottom:8}}>Booking Confirmed!</Text>
      <Text style={{fontSize:14,color:'#888',textAlign:'center',marginBottom:32}}>Your appointment has been booked successfully</Text>
      <View style={{backgroundColor:'#fff',borderRadius:20,padding:24,width:'100%',borderWidth:1,borderColor:'#e8e8e8',marginBottom:24}}>
        <View style={{flexDirection:'row',alignItems:'center',gap:12,marginBottom:16,paddingBottom:16,borderBottomWidth:1,borderColor:'#f0f0f0'}}>
          <View style={{width:52,height:52,borderRadius:26,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:28}}>👨‍⚕️</Text></View>
          <View><Text style={{fontSize:16,fontWeight:'700',color:'#1a1a1a'}}>{d.name}</Text><Text style={{fontSize:13,color:'#00897B'}}>{d.specialty}</Text></View>
        </View>
        {[['📋 Booking Ref',a.confirmationNumber||'SA'+Date.now()],['💰 Fee','PKR '+(d.fee?.toLocaleString()||'N/A')],['📍 Location',d.hospital||'TBD'],['📋 Status','Confirmed ✓']].map(([k,v])=>(
          <View key={k} style={{flexDirection:'row',justifyContent:'space-between',marginBottom:12}}>
            <Text style={{color:'#888',fontSize:13}}>{k}</Text>
            <Text style={{fontWeight:'700',color:'#1a1a1a',fontSize:13,flex:1,textAlign:'right'}}>{v}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('MainTabs')} style={{width:'100%',borderRadius:14,overflow:'hidden',marginBottom:12}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}><Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>🏠 Back to Home</Text></LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('MyAppointments')} style={{width:'100%',padding:16,borderRadius:14,borderWidth:1.5,borderColor:'#00897B',alignItems:'center'}}>
        <Text style={{color:'#00897B',fontWeight:'700',fontSize:15}}>📋 View All Appointments</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>);}