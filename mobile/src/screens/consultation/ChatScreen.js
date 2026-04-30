import React,{useState,useRef,useEffect,useCallback} from 'react';
import {View,Text,TouchableOpacity,TextInput,ScrollView,KeyboardAvoidingView,Platform,Alert,ActivityIndicator,Image} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../utils/api';
import useStore from '../../store/useStore';
import LimitBanner from '../../components/LimitBanner';
export default function ChatScreen({navigation,route}){
  const {consultationId:existingId}=route.params||{};
  const {user,language,isPremium}=useStore();
  const [messages,setMessages]=useState([]);const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);const [consultId,setConsultId]=useState(existingId||null);
  const [lang,setLang]=useState(language||'en');const [images,setImages]=useState([]);
  const [limitData,setLimitData]=useState(null);const [aiUsed,setAiUsed]=useState('');
  const scrollRef=useRef(null);
  useEffect(()=>{if(existingId)loadConsult();else startNew();},[]);
  const startNew=async()=>{
    try{const res=await api.post('/consultations',{language:lang});setConsultId(res.data.data._id);
    setMessages([{role:'ai',content:lang==='ur'?'السلام علیکم! میں آپ کا صحت اے آئی ڈاکٹر ہوں۔

آپ کی تکلیف کیا ہے؟ بتائیں، میں مدد کروں گا۔ 🩺':'Assalam o Alaikum! I am your Sehat AI Doctor.

Tell me what is bothering you today. I will ask a few smart questions to give you the best diagnosis. 🩺',timestamp:new Date()}]);}
    catch(err){if(!err.response)Alert.alert('Cannot Connect','Backend server is not running.

Run: cd backend && node server.js');else Alert.alert('Error','Could not start consultation');}
  };
  const loadConsult=async()=>{
    try{const res=await api.get('/consultations/'+existingId);const c=res.data.data;setConsultId(c._id);setLang(c.language||'en');
    setMessages(c.messages.filter(m=>!m.isDeletedByUser).map(m=>({role:m.role,content:m.content,timestamp:m.timestamp,aiProvider:m.aiProvider})));}catch{}
  };
  const send=useCallback(async()=>{
    if(!input.trim()&&images.length===0)return;if(!consultId)return;
    const userMsg={role:'user',content:input.trim()||'[Image uploaded]',timestamp:new Date(),images:images.map(i=>i.uri)};
    setMessages(p=>[...p,userMsg]);const sentInput=input;setInput('');setImages([]);setLoading(true);
    try{
      const res=await api.post('/consultations/'+consultId+'/message',{content:sentInput||'[Image uploaded for analysis]',language:lang,imageBase64:null});
      setAiUsed(res.data.aiUsed||'');
      setMessages(p=>[...p,{role:'ai',content:res.data.aiMessage.content,timestamp:new Date(),aiProvider:res.data.aiUsed}]);
      if(res.data.diagnosis?.confidence>60&&res.data.diagnosis?.condition){
        setTimeout(()=>navigation.navigate('DiagnosisResult',{diagnosis:res.data.diagnosis,consultationId:consultId}),1500);
      }
    }catch(err){
      if(err.response?.status===429){setLimitData({message:err.response.data.message,resetIn:err.response.data.resetIn});}
      else if(!err.response){setMessages(p=>[...p,{role:'ai',content:'⚠️ Cannot connect to server.

Please check:
1. Backend server is running
2. IP address in api.js is correct
3. Same WiFi network',timestamp:new Date()}]);}
      else{setMessages(p=>[...p,{role:'ai',content:'Sorry, I had trouble processing that. Please try again.',timestamp:new Date()}]);}
    }finally{setLoading(false);setTimeout(()=>scrollRef.current?.scrollToEnd({animated:true}),100);}
  },[input,images,consultId,lang]);
  const pickImage=async(cam)=>{
    const perm=cam?await ImagePicker.requestCameraPermissionsAsync():await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!perm.granted){Alert.alert('Permission needed');return;}
    const res=cam?await ImagePicker.launchCameraAsync({quality:0.5}):await ImagePicker.launchImageLibraryAsync({quality:0.5});
    if(!res.canceled)setImages(p=>[...p,res.assets[0]]);
  };
  const QRS=lang==='ur'?['بخار ہے','سر درد','پیٹ درد','کھانسی','تھکاوٹ']:['I have fever','Headache','Stomach pain','Cough','Fatigue'];
  if(limitData)return(<LimitBanner message={limitData.message} resetIn={limitData.resetIn} onUpgrade={()=>{setLimitData(null);navigation.navigate('Subscription');}} onDismiss={()=>setLimitData(null)}/>);
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:16,paddingHorizontal:16,flexDirection:'row',alignItems:'center',gap:12}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <View style={{flex:1}}>
        <Text style={{fontSize:16,fontWeight:'700',color:'#fff'}}>🩺 Sehat AI Doctor</Text>
        <View style={{flexDirection:'row',alignItems:'center',gap:4,marginTop:2}}>
          <View style={{width:8,height:8,borderRadius:4,backgroundColor:'#69F0AE'}}/>
          <Text style={{fontSize:11,color:'rgba(255,255,255,0.8)'}}>Online{aiUsed?' • '+aiUsed:''}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={()=>setLang(l=>l==='en'?'ur':'en')} style={{backgroundColor:'rgba(255,255,255,0.2)',paddingHorizontal:10,paddingVertical:5,borderRadius:12}}>
        <Text style={{color:'#fff',fontWeight:'700',fontSize:12}}>{lang==='en'?'اردو':'EN'}</Text>
      </TouchableOpacity>
    </LinearGradient>
    <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:16,paddingBottom:8}} onContentSizeChange={()=>scrollRef.current?.scrollToEnd({animated:true})}>
      {messages.map((msg,i)=>(
        <View key={i} style={{flexDirection:msg.role==='user'?'row-reverse':'row',alignItems:'flex-end',marginBottom:12,gap:8}}>
          {msg.role==='ai'&&<View style={{width:36,height:36,borderRadius:18,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:18}}>🩺</Text></View>}
          <View style={{maxWidth:'78%',borderRadius:18,padding:12,paddingHorizontal:14,backgroundColor:msg.role==='user'?'#00897B':'#fff',borderBottomRightRadius:msg.role==='user'?4:18,borderBottomLeftRadius:msg.role==='ai'?4:18}}>
            {msg.images?.map((uri,j)=><Image key={j} source={{uri}} style={{width:200,height:150,borderRadius:10,marginBottom:8,resizeMode:'cover'}}/>)}
            <Text style={{fontSize:14,color:msg.role==='user'?'#fff':'#1a1a1a',lineHeight:22}}>{msg.content}</Text>
            <Text style={{fontSize:10,color:msg.role==='user'?'rgba(255,255,255,0.6)':'#aaa',marginTop:4,textAlign:'right'}}>{new Date(msg.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}{msg.aiProvider?' • '+msg.aiProvider:''}</Text>
          </View>
        </View>
      ))}
      {loading&&<View style={{flexDirection:'row',alignItems:'flex-end',marginBottom:12,gap:8}}>
        <View style={{width:36,height:36,borderRadius:18,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:18}}>🩺</Text></View>
        <View style={{backgroundColor:'#fff',borderRadius:18,borderBottomLeftRadius:4,padding:16}}>
          <ActivityIndicator color="#00897B" size="small"/>
          <Text style={{color:'#888',fontSize:12,marginTop:4}}>AI is analyzing...</Text>
        </View>
      </View>}
    </ScrollView>
    {messages.length<=1&&<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight:52,marginBottom:4}} contentContainerStyle={{paddingHorizontal:12}}>
      {QRS.map(qr=><TouchableOpacity key={qr} onPress={()=>setInput(qr)} style={{backgroundColor:'#e8f5e9',borderRadius:20,paddingHorizontal:14,paddingVertical:8,marginRight:8,borderWidth:1,borderColor:'#a5d6a7'}}>
        <Text style={{color:'#2e7d32',fontSize:13,fontWeight:'600'}}>{qr}</Text>
      </TouchableOpacity>)}
    </ScrollView>}
    {images.length>0&&<ScrollView horizontal style={{maxHeight:80,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#f0f0f0'}} contentContainerStyle={{padding:8,gap:8}}>
      {images.map((img,i)=><View key={i} style={{position:'relative'}}>
        <Image source={{uri:img.uri}} style={{width:60,height:60,borderRadius:8}}/>
        <TouchableOpacity onPress={()=>setImages(p=>p.filter((_,j)=>j!==i))} style={{position:'absolute',top:-4,right:-4}}><Ionicons name="close-circle" size={18} color="#cc0000"/></TouchableOpacity>
      </View>)}
    </ScrollView>}
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'}>
      <View style={{flexDirection:'row',alignItems:'flex-end',backgroundColor:'#fff',borderTopWidth:1,borderColor:'#f0f0f0',paddingHorizontal:12,paddingVertical:8,gap:8}}>
        <TouchableOpacity onPress={()=>pickImage(true)} style={{width:40,height:40,alignItems:'center',justifyContent:'center'}}><Ionicons name="camera-outline" size={22} color="#00897B"/></TouchableOpacity>
        <TouchableOpacity onPress={()=>pickImage(false)} style={{width:40,height:40,alignItems:'center',justifyContent:'center'}}><Ionicons name="image-outline" size={22} color="#00897B"/></TouchableOpacity>
        <TextInput style={{flex:1,backgroundColor:'#f5f5f5',borderRadius:22,paddingHorizontal:16,paddingVertical:10,fontSize:14,color:'#1a1a1a',maxHeight:100,borderWidth:1,borderColor:'#ebebeb'}} placeholder={lang==='ur'?'علامات بیان کریں...':'Describe your symptoms...'} value={input} onChangeText={setInput} multiline maxLength={1000} placeholderTextColor="#bbb"/>
        <TouchableOpacity onPress={send} disabled={loading||(!input.trim()&&images.length===0)} style={{width:42,height:42,borderRadius:21,backgroundColor:(!input.trim()&&images.length===0)?'#ccc':'#00897B',alignItems:'center',justifyContent:'center'}}>
          <Ionicons name="send" size={20} color="#fff"/>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </View>);}