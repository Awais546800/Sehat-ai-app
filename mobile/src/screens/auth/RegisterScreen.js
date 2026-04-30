import React,{useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,KeyboardAvoidingView,Platform,Alert,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
import useStore from '../../store/useStore';
const CITIES=['Lahore','Karachi','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta','Sialkot'];
export default function RegisterScreen({navigation}){
  const {setPendingUserId}=useStore();
  const [f,setF]=useState({name:'',email:'',phone:'',password:'',confirm:'',age:'',gender:'',city:'Lahore'});
  const [step,setStep]=useState(1);const [showP,setShowP]=useState(false);const [loading,setL]=useState(false);
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const next=()=>{
    if(!f.name||!f.email||!f.password){Alert.alert('Error','Fill all fields');return;}
    if(f.password.length<6){Alert.alert('Error','Password min 6 characters');return;}
    if(f.password!==f.confirm){Alert.alert('Error','Passwords do not match');return;}
    setStep(2);
  };
  const submit=async()=>{
    setL(true);
    try{
      const res=await api.post('/auth/register',{name:f.name.trim(),email:f.email.toLowerCase().trim(),phone:f.phone||undefined,password:f.password,age:parseInt(f.age)||undefined,gender:f.gender||undefined,city:f.city});
      setPendingUserId(res.data.userId);
      navigation.navigate('OTP',{userId:res.data.userId,email:f.email,devOTP:res.data.devOTP});
    }catch(err){
      if(!err.response)Alert.alert('Cannot Connect','Start the backend server first:
cd backend && node server.js');
      else Alert.alert('Failed',err.response?.data?.message||'Registration failed');
    }finally{setL(false);}
  };
  return(<KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}>
    <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'#fff'}} keyboardShouldPersistTaps="handled">
      <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:60,paddingBottom:28,paddingHorizontal:24,gap:8}}>
        <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
        <Text style={{fontSize:28,fontWeight:'900',color:'#fff',marginTop:8}}>Create Account</Text>
        <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)'}}>Step {step} of 2</Text>
      </LinearGradient>
      <View style={{backgroundColor:'#fff',borderTopLeftRadius:28,borderTopRightRadius:28,marginTop:-20,padding:24}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:20,gap:4}}>
          <View style={{width:12,height:12,borderRadius:6,backgroundColor:'#00897B'}}/>
          <View style={{width:60,height:2,backgroundColor:step>=2?'#00897B':'#ddd'}}/>
          <View style={{width:12,height:12,borderRadius:6,backgroundColor:step>=2?'#00897B':'#ddd'}}/>
        </View>
        {step===1?(<>
          {[['person-outline','Full Name','name','words',false],['mail-outline','Email Address','email','email-address',false],['call-outline','Phone (+92...)','phone','phone-pad',false]].map(([ic,ph,key,kb])=>(
            <View key={key} style={{flexDirection:'row',alignItems:'center',backgroundColor:'#f7f7f7',borderRadius:14,paddingHorizontal:14,marginBottom:14,borderWidth:1,borderColor:'#ebebeb'}}>
              <Ionicons name={ic} size={20} color="#888" style={{marginRight:10}}/>
              <TextInput style={{flex:1,fontSize:15,color:'#1a1a1a',paddingVertical:16}} placeholder={ph} value={f[key]} onChangeText={v=>u(key,v)} keyboardType={kb} autoCapitalize={key==='email'?'none':'words'} placeholderTextColor="#bbb"/>
            </View>
          ))}
          <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#f7f7f7',borderRadius:14,paddingHorizontal:14,marginBottom:14,borderWidth:1,borderColor:'#ebebeb'}}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={{marginRight:10}}/>
            <TextInput style={{flex:1,fontSize:15,color:'#1a1a1a',paddingVertical:16}} placeholder="Password (min 6)" value={f.password} onChangeText={v=>u('password',v)} secureTextEntry={!showP} placeholderTextColor="#bbb"/>
            <TouchableOpacity onPress={()=>setShowP(!showP)}><Ionicons name={showP?'eye-off-outline':'eye-outline'} size={20} color="#888"/></TouchableOpacity>
          </View>
          <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#f7f7f7',borderRadius:14,paddingHorizontal:14,marginBottom:20,borderWidth:1,borderColor:'#ebebeb'}}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={{marginRight:10}}/>
            <TextInput style={{flex:1,fontSize:15,color:'#1a1a1a',paddingVertical:16}} placeholder="Confirm Password" value={f.confirm} onChangeText={v=>u('confirm',v)} secureTextEntry placeholderTextColor="#bbb"/>
          </View>
          <TouchableOpacity onPress={next} style={{borderRadius:14,overflow:'hidden'}}>
            <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}><Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>Next →</Text></LinearGradient>
          </TouchableOpacity>
        </>):(<>
          <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#f7f7f7',borderRadius:14,paddingHorizontal:14,marginBottom:14,borderWidth:1,borderColor:'#ebebeb'}}>
            <Ionicons name="calendar-outline" size={20} color="#888" style={{marginRight:10}}/>
            <TextInput style={{flex:1,fontSize:15,color:'#1a1a1a',paddingVertical:16}} placeholder="Age" value={f.age} onChangeText={v=>u('age',v)} keyboardType="numeric" placeholderTextColor="#bbb"/>
          </View>
          <Text style={{fontSize:14,fontWeight:'600',color:'#555',marginBottom:10}}>Gender</Text>
          <View style={{flexDirection:'row',gap:10,marginBottom:16}}>
            {['male','female','other'].map(g=><TouchableOpacity key={g} onPress={()=>u('gender',g)} style={{flex:1,padding:12,borderRadius:12,borderWidth:1.5,borderColor:f.gender===g?'#00897B':'#ebebeb',backgroundColor:f.gender===g?'#e8f5e9':'#fff',alignItems:'center'}}>
              <Text style={{fontSize:13,fontWeight:'600',color:f.gender===g?'#00897B':'#888'}}>{g==='male'?'👨 Male':g==='female'?'👩 Female':'🧑 Other'}</Text>
            </TouchableOpacity>)}
          </View>
          <Text style={{fontSize:14,fontWeight:'600',color:'#555',marginBottom:10}}>City</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>
            {CITIES.map(c=><TouchableOpacity key={c} onPress={()=>u('city',c)} style={{paddingHorizontal:14,paddingVertical:8,borderRadius:20,backgroundColor:f.city===c?'#00897B':'#f5f5f5',marginRight:8}}>
              <Text style={{fontSize:13,color:f.city===c?'#fff':'#555',fontWeight:'600'}}>{c}</Text>
            </TouchableOpacity>)}
          </ScrollView>
          <View style={{flexDirection:'row',gap:12}}>
            <TouchableOpacity onPress={()=>setStep(1)} style={{flex:1,padding:18,borderRadius:14,borderWidth:1.5,borderColor:'#ebebeb',alignItems:'center'}}><Text style={{color:'#555',fontWeight:'600'}}>← Back</Text></TouchableOpacity>
            <TouchableOpacity onPress={submit} disabled={loading} style={{flex:2,borderRadius:14,overflow:'hidden'}}>
              <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}>{loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>Create Account</Text>}</LinearGradient>
            </TouchableOpacity>
          </View>
        </>)}
        <View style={{flexDirection:'row',justifyContent:'center',marginTop:20}}>
          <Text style={{color:'#888',fontSize:14}}>Already have an account? </Text>
          <TouchableOpacity onPress={()=>navigation.navigate('Login')}><Text style={{color:'#00897B',fontWeight:'700',fontSize:14}}>Login</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>);}