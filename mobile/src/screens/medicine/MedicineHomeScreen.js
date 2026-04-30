import React from 'react';
import {View,Text,TouchableOpacity,ScrollView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
export default function MedicineHomeScreen({navigation}){
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#1976D2','#0D47A1']} style={{paddingTop:56,paddingBottom:24,paddingHorizontal:20}}>
      <Text style={{fontSize:24,fontWeight:'900',color:'#fff',marginBottom:4}}>💊 Medicine Info</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)'}}>Search or scan any medicine worldwide</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:20}}>
      {[{emoji:'📷',title:'Scan Medicine',sub:'Take or upload a photo — AI reads it',route:'MedicineScan',color:'#1976D2'},{emoji:'🔍',title:'Search by Name',sub:'Type brand, generic, or salt name',route:'MedicineSearch',color:'#00897B'}].map(o=>(
        <TouchableOpacity key={o.route} onPress={()=>navigation.navigate(o.route)} style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',padding:20,borderRadius:16,marginBottom:14,gap:14,borderWidth:1,borderColor:'#f0f0f0'}}>
          <View style={{width:56,height:56,borderRadius:28,backgroundColor:o.color+'18',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:30}}>{o.emoji}</Text></View>
          <View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'700',color:'#1a1a1a'}}>{o.title}</Text><Text style={{fontSize:13,color:'#888',marginTop:2}}>{o.sub}</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#ccc"/>
        </TouchableOpacity>
      ))}
      <View style={{backgroundColor:'#E3F2FD',borderRadius:14,padding:16,marginTop:8}}>
        <Text style={{fontSize:14,fontWeight:'700',color:'#1565C0',marginBottom:4}}>ℹ️ Powered by Multiple AI</Text>
        <Text style={{fontSize:13,color:'#555',lineHeight:20}}>Medicine scanning uses Gemini Vision, GPT-4 Vision, and OpenFDA database for comprehensive information including Pakistani brand availability.</Text>
      </View>
    </ScrollView>
  </View>);}