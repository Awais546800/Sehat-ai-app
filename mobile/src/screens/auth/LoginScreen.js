import React,{useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,KeyboardAvoidingView,Platform,Alert,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
import useStore from '../../store/useStore';
export default function LoginScreen({navigation}){
  const {login}=useStore();
  const [email,setEmail]=useState('');const [pass,setPass]=useState('');
  const [show,setShow]=useState(false);const [loading,setL]=useState(false);
  const handleLogin=async()=>{
    if(!email.trim()||!pass.trim()){Alert.alert('Missing Info','Enter email and password');return;}
    setL(true);
    try{
      const res=await api.post('/auth/login',{email:email.trim().toLowerCase(),password:pass});
      await login(res.data.accessToken,res.data.refreshToken,res.data.user);
    }catch(err){
      if(!err.response)Alert.alert('Cannot Connect','Make sure backend is running and IP in api.js is correct.

Tip: Run ipconfig to find your IP');
      else Alert.alert('Login Failed',err.response?.data?.message||'Invalid credentials');
    }finally{setL(false);}
  };
  const skipLogin=async()=>{
    setL(true);
    try{
      const res=await api.post('/auth/dev-skip-login');
      await login(res.data.accessToken,res.data.refreshToken,res.data.user);
    }catch(err){Alert.alert('Skip failed','Make sure backend is running');}
    finally{setL(false);}
  };
  return(<KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}>
    <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'#fff'}} keyboardShouldPersistTaps="handled">
      <LinearGradient colors={['#00897B','#00695C']} style={{alignItems:'center',paddingTop:80,paddingBottom:44}}>
        <Text style={{fontSize:64,marginBottom:10}}>☪️</Text>
        <Text style={{fontSize:36,fontWeight:'900',color:'#fff',letterSpacing:4}}>Sehat AI</Text>
        <Text style={{fontSize:14,color:'rgba(255,255,255,0.85)',marginTop:6,letterSpacing:2}}>Pakistan Ka AI Doctor</Text>
      </LinearGradient>
      <View style={{flex:1,backgroundColor:'#fff',borderTopLeftRadius:28,borderTopRightRadius:28,marginTop:-24,padding:28}}>
        <Text style={{fontSize:26,fontWeight:'800',color:'#1a1a1a',marginBottom:4}}>Welcome Back</Text>
        <Text style={{fontSize:14,color:'#888',marginBottom:28}}>Login to your Sehat AI account</Text>
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#f7f7f7',borderRadius:14,paddingHorizontal:14,marginBottom:14,borderWidth:1,borderColor:'#ebebeb'}}>
          <Ionicons name="mail-outline" size={20} color="#888" style={{marginRight:10}}/>
          <TextInput style={{flex:1,fontSize:15,color:'#1a1a1a',paddingVertical:16}} placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholderTextColor="#bbb"/>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#f7f7f7',borderRadius:14,paddingHorizontal:14,marginBottom:14,borderWidth:1,borderColor:'#ebebeb'}}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={{marginRight:10}}/>
          <TextInput style={{flex:1,fontSize:15,color:'#1a1a1a',paddingVertical:16}} placeholder="Password" value={pass} onChangeText={setPass} secureTextEntry={!show} placeholderTextColor="#bbb"/>
          <TouchableOpacity onPress={()=>setShow(!show)} style={{padding:4}}><Ionicons name={show?'eye-off-outline':'eye-outline'} size={20} color="#888"/></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')} style={{alignSelf:'flex-end',marginBottom:24}}>
          <Text style={{color:'#00897B',fontWeight:'600',fontSize:14}}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin} disabled={loading} style={{borderRadius:14,overflow:'hidden',marginBottom:16}}>
          <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}>
            {loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontSize:17,fontWeight:'700',letterSpacing:2}}>Login →</Text>}
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={skipLogin} disabled={loading} style={{backgroundColor:'#f0f0f0',padding:14,borderRadius:14,alignItems:'center',marginBottom:20}}>
          <Text style={{color:'#666',fontSize:14,fontWeight:'600'}}>⚡ Skip Login (Testing Only)</Text>
        </TouchableOpacity>
        <View style={{flexDirection:'row',justifyContent:'center'}}>
          <Text style={{color:'#888',fontSize:14}}>Don't have an account? </Text>
          <TouchableOpacity onPress={()=>navigation.navigate('Register')}><Text style={{color:'#00897B',fontWeight:'700',fontSize:14}}>Create Account</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>);}