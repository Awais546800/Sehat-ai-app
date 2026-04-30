import React,{useEffect,useRef} from 'react';
import {View,Text,StyleSheet,Animated} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import useStore from '../../store/useStore';
export default function SplashScreen({navigation}){
  const {isOnboarded}=useStore();
  const s=useRef(new Animated.Value(0.3)).current;
  const o=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.parallel([Animated.spring(s,{toValue:1,friction:4,useNativeDriver:true}),Animated.timing(o,{toValue:1,duration:800,useNativeDriver:true})]).start();
    const t=setTimeout(()=>navigation.replace(isOnboarded?'Login':'LanguageSelect'),2500);
    return ()=>clearTimeout(t);
  },[]);
  return(<LinearGradient colors={['#00897B','#004D40']} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
    <Animated.View style={{transform:[{scale:s}],opacity:o,alignItems:'center'}}>
      <Text style={{fontSize:90,marginBottom:12}}>☪️</Text>
      <Text style={{fontSize:42,fontWeight:'900',color:'#fff',letterSpacing:4}}>Sehat AI</Text>
      <Text style={{fontSize:16,color:'rgba(255,255,255,0.85)',marginTop:8,letterSpacing:2}}>Pakistan Ka AI Doctor</Text>
      <Text style={{fontSize:22,color:'rgba(255,255,255,0.7)',marginTop:8}}>صحت اے آئی</Text>
    </Animated.View>
  </LinearGradient>);}