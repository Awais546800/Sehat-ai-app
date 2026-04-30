import React from 'react';
import {View,Text,TouchableOpacity,ScrollView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
export default function NewConsultationScreen({navigation}){
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:24,paddingHorizontal:20}}>
      <Text style={{fontSize:24,fontWeight:'900',color:'#fff'}}>🩺 New Consultation</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:4}}>AI-powered diagnosis in minutes</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:20}}>
      <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:16}}>How would you like to start?</Text>
      {[{emoji:'💬',title:'Describe Symptoms',sub:'Type or speak your symptoms',action:()=>navigation.navigate('Chat',{})},{emoji:'📷',title:'Upload Image',sub:'Photo of affected area or medicine',action:()=>navigation.navigate('Chat',{})},{emoji:'🩺',title:'Select Body Part',sub:'Tap on body diagram',action:()=>navigation.navigate('Chat',{})}].map(o=>(
        <TouchableOpacity key={o.title} onPress={o.action} style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',padding:18,borderRadius:16,marginBottom:12,gap:14,borderWidth:1,borderColor:'#f0f0f0'}}>
          <Text style={{fontSize:36}}>{o.emoji}</Text>
          <View style={{flex:1}}><Text style={{fontSize:16,fontWeight:'700',color:'#1a1a1a'}}>{o.title}</Text><Text style={{fontSize:13,color:'#888',marginTop:2}}>{o.sub}</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#ccc"/>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={()=>navigation.navigate('ConsultHistory')} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:16,borderRadius:14,backgroundColor:'#e8f5e9',marginTop:8}}>
        <Ionicons name="time-outline" size={18} color="#00897B" style={{marginRight:8}}/>
        <Text style={{color:'#00897B',fontWeight:'600',fontSize:14}}>View Consultation History</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>);}