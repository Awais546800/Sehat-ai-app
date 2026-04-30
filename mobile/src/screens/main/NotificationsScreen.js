import React from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
export default function NotificationsScreen({navigation}){
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>🔔 Notifications</Text>
    </LinearGradient>
    <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:40}}>
      <Text style={{fontSize:64}}>🔔</Text>
      <Text style={{fontSize:18,fontWeight:'700',color:'#888',marginTop:16}}>No notifications yet</Text>
      <Text style={{fontSize:14,color:'#aaa',marginTop:8,textAlign:'center'}}>Medicine reminders and appointment alerts will appear here</Text>
    </View>
  </View>);}