import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import useStore from '../../store/useStore';
export default function LanguageSelectScreen({navigation}){
  const {setLanguage}=useStore();
  const select=async(lang)=>{await setLanguage(lang);navigation.replace('Onboarding');};
  return(<LinearGradient colors={['#00897B','#004D40']} style={{flex:1,alignItems:'center',justifyContent:'center',padding:32}}>
    <Text style={{fontSize:72,marginBottom:8}}>☪️</Text>
    <Text style={{fontSize:36,fontWeight:'900',color:'#fff',letterSpacing:4,marginBottom:8}}>Sehat AI</Text>
    <Text style={{fontSize:18,color:'rgba(255,255,255,0.9)',textAlign:'center',marginBottom:40,lineHeight:30}}>Choose your language{'
'}زبان منتخب کریں</Text>
    {[{lang:'en',flag:'🇬🇧',name:'English',sub:'Continue in English'},{lang:'ur',flag:'🇵🇰',name:'اردو',sub:'اردو میں جاری رکھیں'}].map(l=>(
      <TouchableOpacity key={l.lang} onPress={()=>select(l.lang)} style={{width:'100%',backgroundColor:'rgba(255,255,255,0.15)',borderRadius:18,padding:24,alignItems:'center',marginBottom:16,borderWidth:2,borderColor:'rgba(255,255,255,0.3)'}}>
        <Text style={{fontSize:42,marginBottom:8}}>{l.flag}</Text>
        <Text style={{fontSize:24,fontWeight:'800',color:'#fff',marginBottom:4}}>{l.name}</Text>
        <Text style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{l.sub}</Text>
      </TouchableOpacity>
    ))}
  </LinearGradient>);}