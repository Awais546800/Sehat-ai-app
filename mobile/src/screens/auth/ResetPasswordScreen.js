import React,{useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,Alert,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
export default function ResetPasswordScreen({navigation,route}){
  const {userId}=route.params||{};
  const [otp,setOtp]=useState('');const [pass,setPass]=useState('');const [conf,setConf]=useState('');const [loading,setL]=useState(false);
  const submit=async()=>{
    if(pass!==conf){Alert.alert('Passwords do not match');return;}
    if(pass.length<6){Alert.alert('Min 6 characters');return;}
    setL(true);
    try{await api.post('/auth/reset-password',{userId,otp,newPassword:pass});Alert.alert('Success','Password reset!',[{text:'Login',onPress:()=>navigation.navigate('Login')}]);}
    catch(err){Alert.alert('Error',err.response?.data?.message||'Invalid OTP');}
    finally{setL(false);}
  };
  return(<View style={{flex:1,backgroundColor:'#fff'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:60,paddingBottom:28,paddingHorizontal:24,gap:8}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:26,fontWeight:'900',color:'#fff',marginTop:8}}>Reset Password</Text>
    </LinearGradient>
    <View style={{padding:24}}>
      {[['OTP Code',otp,setOtp,'numeric',false],['New Password',pass,setPass,'default',true],['Confirm Password',conf,setConf,'default',true]].map(([lb,val,fn,kb,sec])=>(
        <View key={lb}>
          <Text style={{fontSize:14,fontWeight:'600',color:'#555',marginBottom:8,marginTop:16}}>{lb}</Text>
          <View style={{backgroundColor:'#f5f5f5',borderRadius:14,paddingHorizontal:14,borderWidth:1,borderColor:'#ebebeb'}}>
            <TextInput style={{fontSize:15,color:'#1a1a1a',paddingVertical:16}} placeholder={lb} value={val} onChangeText={fn} keyboardType={kb} secureTextEntry={sec} placeholderTextColor="#bbb"/>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={submit} disabled={loading} style={{borderRadius:14,overflow:'hidden',marginTop:24}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}>{loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>Reset Password</Text>}</LinearGradient>
      </TouchableOpacity>
    </View>
  </View>);}