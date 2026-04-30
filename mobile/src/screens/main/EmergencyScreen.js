import React from 'react';
import {View,Text,TouchableOpacity,Linking,ScrollView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
export default function EmergencyScreen({navigation}){
  const nums=[{emoji:'🚑',name:'Rescue (Punjab)',num:'1122'},{emoji:'🆘',name:'Edhi Foundation',num:'115'},{emoji:'🏥',name:'Aman Foundation',num:'115'},{emoji:'👮',name:'Police',num:'15'},{emoji:'🔥',name:'Fire Brigade',num:'16'},{emoji:'📞',name:'Umang Mental Health',num:'03174288665'}];
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#E53935','#B71C1C']} style={{paddingTop:56,paddingBottom:24,paddingHorizontal:20}}>
      <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginBottom:12}}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:28,fontWeight:'900',color:'#fff'}}>🚨 Emergency</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:4}}>Tap to call immediately</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      {nums.map(n=><TouchableOpacity key={n.name} onPress={()=>Linking.openURL('tel:'+n.num)} style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',padding:18,borderRadius:14,marginBottom:10,gap:14,borderWidth:1,borderColor:'#ffcdd2'}}>
        <Text style={{fontSize:36}}>{n.emoji}</Text>
        <View style={{flex:1}}><Text style={{fontSize:16,fontWeight:'700',color:'#1a1a1a'}}>{n.name}</Text></View>
        <View style={{backgroundColor:'#E53935',paddingHorizontal:16,paddingVertical:8,borderRadius:20}}><Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>{n.num}</Text></View>
      </TouchableOpacity>)}
      <View style={{backgroundColor:'#FFF3E0',borderRadius:14,padding:16,marginBottom:24}}><Text style={{fontSize:13,color:'#E65100',textAlign:'center',lineHeight:20}}>⚠️ In life-threatening emergency, call 1122 immediately or go to your nearest hospital.</Text></View>
    </ScrollView>
  </View>);}