import React,{useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,Alert,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
export default function ForgotPasswordScreen({navigation}){
  const [email,setEmail]=useState('');const [loading,setL]=useState(false);
  const submit=async()=>{
    if(!email){Alert.alert('Enter email');return;}
    setL(true);
    try{const res=await api.post('/auth/forgot-password',{email:email.toLowerCase()});
    Alert.alert('OTP Sent',`Check email or terminal.\nDev OTP: ${res.data.devOTP}`,[{text:'OK',onPress:()=>navigation.navigate('ResetPassword',{userId:res.data.userId,email})}]);}
    catch(err){Alert.alert('Error',err.response?.data?.message||'Server error');}
    finally{setL(false);}
  };
  return(<View style={{flex:1,backgroundColor:'#fff'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:60,paddingBottom:28,paddingHorizontal:24,gap:8}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:26,fontWeight:'900',color:'#fff',marginTop:8}}>Forgot Password</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)'}}>Enter email to get reset OTP</Text>
    </LinearGradient>
    <View style={{padding:24}}>
      <Text style={{fontSize:14,fontWeight:'600',color:'#555',marginBottom:8,marginTop:16}}>Email Address</Text>
      <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#f5f5f5',borderRadius:14,paddingHorizontal:14,borderWidth:1,borderColor:'#ebebeb'}}>
        <Ionicons name="mail-outline" size={20} color="#888" style={{marginRight:10}}/>
        <TextInput style={{flex:1,fontSize:15,color:'#1a1a1a',paddingVertical:16}} placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#bbb"/>
      </View>
      <TouchableOpacity onPress={submit} disabled={loading} style={{borderRadius:14,overflow:'hidden',marginTop:24}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}>{loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>Send Reset OTP</Text>}</LinearGradient>
      </TouchableOpacity>
    </View>
  </View>);}