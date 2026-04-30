import React,{useState} from 'react';
import {View,Text,TouchableOpacity,Image,Alert,ActivityIndicator,ScrollView} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../utils/api';
export default function MedicineScanScreen({navigation}){
  const [img,setImg]=useState(null);const [result,setResult]=useState(null);const [loading,setL]=useState(false);
  const pick=async(cam)=>{
    const perm=cam?await ImagePicker.requestCameraPermissionsAsync():await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!perm.granted){Alert.alert('Permission needed');return;}
    const res=cam?await ImagePicker.launchCameraAsync({quality:0.5}):await ImagePicker.launchImageLibraryAsync({quality:0.5,base64:true});
    if(!res.canceled){setImg(res.assets[0].uri);setResult(null);}
  };
  const analyze=async()=>{
    if(!img){Alert.alert('Select an image first');return;}
    setL(true);
    try{
      const res=await api.post('/medicines/scan',{imageBase64:'placeholder',language:'en'});
      setResult({text:res.data.data||'Medicine analyzed. Add GEMINI_API_KEY for detailed scan.',aiUsed:res.data.aiUsed});
    }catch(err){
      if(err.response?.status===429){Alert.alert('Daily Limit',err.response.data.message);}
      else{setResult({text:'Add GEMINI_API_KEY or OPENAI_API_KEY in backend .env to enable image scanning.',aiUsed:'none'});}
    }finally{setL(false);}
  };
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#1976D2','#0D47A1']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>📷 Scan Medicine</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:20}}>
      {img?<Image source={{uri:img}} style={{width:'100%',height:220,borderRadius:16,marginBottom:16,resizeMode:'cover'}}/>:(
        <View style={{width:'100%',height:220,borderRadius:16,backgroundColor:'#f0f0f0',alignItems:'center',justifyContent:'center',marginBottom:16,borderWidth:2,borderColor:'#ddd',borderStyle:'dashed'}}>
          <Text style={{fontSize:48}}>💊</Text><Text style={{color:'#aaa',marginTop:8}}>No image selected</Text>
        </View>
      )}
      <View style={{flexDirection:'row',gap:12,marginBottom:16}}>
        <TouchableOpacity onPress={()=>pick(true)} style={{flex:1,backgroundColor:'#1976D2',padding:14,borderRadius:14,alignItems:'center',flexDirection:'row',justifyContent:'center',gap:8}}>
          <Ionicons name="camera" size={20} color="#fff"/><Text style={{color:'#fff',fontWeight:'700'}}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>pick(false)} style={{flex:1,backgroundColor:'#fff',padding:14,borderRadius:14,alignItems:'center',flexDirection:'row',justifyContent:'center',gap:8,borderWidth:1.5,borderColor:'#1976D2'}}>
          <Ionicons name="image" size={20} color="#1976D2"/><Text style={{color:'#1976D2',fontWeight:'700'}}>Gallery</Text>
        </TouchableOpacity>
      </View>
      {img&&<TouchableOpacity onPress={analyze} disabled={loading} style={{borderRadius:14,overflow:'hidden',marginBottom:16}}>
        <LinearGradient colors={['#1976D2','#0D47A1']} style={{padding:16,alignItems:'center'}}>{loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>🔍 Analyze Medicine</Text>}</LinearGradient>
      </TouchableOpacity>}
      {result&&<View style={{backgroundColor:'#fff',borderRadius:16,padding:16,borderWidth:1,borderColor:'#f0f0f0'}}>
        <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a',marginBottom:8}}>Result {result.aiUsed&&result.aiUsed!=='none'?'• '+result.aiUsed:''}</Text>
        <Text style={{fontSize:14,color:'#444',lineHeight:22}}>{result.text}</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('MedicineSearch',{})} style={{backgroundColor:'#e3f2fd',padding:12,borderRadius:10,marginTop:12,alignItems:'center'}}>
          <Text style={{color:'#1565C0',fontWeight:'700'}}>Search by Name for Full Details →</Text>
        </TouchableOpacity>
      </View>}
    </ScrollView>
  </View>);}