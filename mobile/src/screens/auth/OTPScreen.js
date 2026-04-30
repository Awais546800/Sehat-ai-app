import React,{useState,useRef,useEffect} from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
import useStore from '../../store/useStore';
export default function OTPScreen({navigation,route}){
  const {userId,email,devOTP}=route.params||{};
  const {login}=useStore();
  const [otp,setOtp]=useState(['','','','','','']);
  const [loading,setL]=useState(false);const [timer,setTimer]=useState(60);
  const inputs=useRef([]);
  useEffect(()=>{
    if(devOTP){setOtp(devOTP.toString().split(''));Alert.alert('Dev OTP',`OTP: ${devOTP}\n\nAuto-filled. Tap Verify.`);}
    const iv=setInterval(()=>setTimer(t=>t>0?t-1:0),1000);
    return()=>clearInterval(iv);
  },[]);
  const change=(val,i)=>{const n=[...otp];n[i]=val;setOtp(n);if(val&&i<5)inputs.current[i+1]?.focus();if(!val&&i>0)inputs.current[i-1]?.focus();};
  const verify=async()=>{
    const code=otp.join('');
    if(code.length<6){Alert.alert('Error','Enter 6-digit OTP');return;}
    setL(true);
    try{
      const res=await api.post('/auth/verify-otp',{userId,otp:code});
      await login(res.data.accessToken,res.data.refreshToken,res.data.user);
      navigation.navigate('HealthProfile');
    }catch(err){Alert.alert('Error',err.response?.data?.message||'Wrong OTP. Check terminal for OTP.');setOtp(['','','','','','']);inputs.current[0]?.focus();}
    finally{setL(false);}
  };
  const resend=async()=>{
    if(timer>0)return;
    try{const res=await api.post('/auth/resend-otp',{userId});setTimer(60);if(res.data.devOTP){setOtp(res.data.devOTP.toString().split(''));Alert.alert('New OTP',`${res.data.devOTP} (auto-filled)`);}else Alert.alert('Sent!','OTP sent to email');}
    catch(){Alert.alert('Error','Could not resend OTP');}
  };
  return(<View style={{flex:1,backgroundColor:'#fff'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:60,paddingBottom:28,paddingHorizontal:24,gap:8}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:28,fontWeight:'900',color:'#fff',marginTop:8}}>Verify Email</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)'}}>Code sent to {email}</Text>
    </LinearGradient>
    <View style={{flex:1,padding:28,alignItems:'center'}}>
      <Text style={{fontSize:24,fontWeight:'800',color:'#1a1a1a',marginBottom:8,marginTop:20}}>Enter OTP</Text>
      <Text style={{fontSize:13,color:'#888',textAlign:'center',marginBottom:36,lineHeight:20}}>6-digit code from email.{'
'}Check terminal if email not configured.</Text>
      <View style={{flexDirection:'row',gap:10,marginBottom:20}}>
        {otp.map((d,i)=><TextInput key={i} ref={r=>inputs.current[i]=r} style={{width:46,height:56,borderRadius:14,borderWidth:2,borderColor:d?'#00897B':'#ebebeb',textAlign:'center',fontSize:22,fontWeight:'700',color:'#1a1a1a',backgroundColor:d?'#e8f5e9':'#f9f9f9'}} value={d} onChangeText={v=>change(v.replace(/\D/g,'').slice(-1),i)} keyboardType="numeric" maxLength={1} selectTextOnFocus/>)}
      </View>
      <Text style={{color:'#888',fontSize:14,marginBottom:8}}>{timer>0?`Resend in ${timer}s`:"Didn't get OTP?"}</Text>
      <TouchableOpacity onPress={resend} disabled={timer>0} style={{marginBottom:32}}><Text style={{color:timer>0?'#ccc':'#00897B',fontWeight:'700',fontSize:14}}>Resend OTP</Text></TouchableOpacity>
      <TouchableOpacity onPress={verify} disabled={loading} style={{width:'100%',borderRadius:14,overflow:'hidden',marginBottom:16}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}>{loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>Verify & Continue →</Text>}</LinearGradient>
      </TouchableOpacity>
      <View style={{flexDirection:'row',backgroundColor:'#FFF8E1',padding:14,borderRadius:12,gap:8,alignItems:'flex-start'}}>
        <Ionicons name="bulb-outline" size={16} color="#F57C00"/>
        <Text style={{flex:1,color:'#E65100',fontSize:12,lineHeight:18}}>OTP is printed in your backend terminal window for testing</Text>
      </View>
    </View>
  </View>);}