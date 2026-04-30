import React from 'react';
import {View,Text,TouchableOpacity,ScrollView,Alert} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
import useStore from '../../store/useStore';
export default function PrivacyScreen({navigation}){
  const {logout}=useStore();
  const del=()=>Alert.alert('Delete Account','Your account will be deactivated. Data is kept securely on our servers per privacy policy.',[
    {text:'Cancel',style:'cancel'},
    {text:'Delete',style:'destructive',onPress:async()=>{try{await api.delete('/users/account');logout();}catch(e){Alert.alert('Error',e.response?.data?.message||'Failed');}}}
  ]);
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>🔒 Privacy & Data</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <View style={{backgroundColor:'#e8f5e9',borderRadius:14,padding:16,marginBottom:16}}><Text style={{fontSize:15,fontWeight:'700',color:'#2e7d32',marginBottom:4}}>✅ Your data is protected</Text><Text style={{fontSize:13,color:'#388e3c'}}>Sehat AI stores your data on secure private servers. We never sell your data.</Text></View>
      {[{e:'🔒',t:'Encryption',d:'AES-256 encryption for all data'},{e:'🏥',t:'Medical Privacy',d:'Health data never shared with third parties'},{e:'💾',t:'Weekly Backups',d:'Your data backed up every Sunday'},{e:'🌍',t:'Right to Delete',d:'You can request account deletion anytime'},{e:'📧',t:'No Spam',d:'Only health alerts and appointment reminders'}].map(i=>(
        <View key={i.t} style={{flexDirection:'row',alignItems:'flex-start',backgroundColor:'#fff',padding:16,borderRadius:14,marginBottom:10,gap:12}}>
          <Text style={{fontSize:28}}>{i.e}</Text>
          <View style={{flex:1}}><Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a',marginBottom:4}}>{i.t}</Text><Text style={{fontSize:13,color:'#888',lineHeight:18}}>{i.d}</Text></View>
        </View>
      ))}
      <TouchableOpacity onPress={del} style={{backgroundColor:'#fff',padding:16,borderRadius:14,alignItems:'center',marginTop:8,marginBottom:24,borderWidth:1.5,borderColor:'#F44336'}}><Text style={{color:'#F44336',fontWeight:'700',fontSize:15}}>⚠️ Delete My Account</Text></TouchableOpacity>
    </ScrollView>
  </View>);}