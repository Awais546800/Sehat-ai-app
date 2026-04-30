import React,{useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,Alert,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
import useStore from '../../store/useStore';
export default function AppointmentFormScreen({navigation,route}){
  const {doctor:d={}}=route.params||{};const {user}=useStore();
  const [date,setDate]=useState('');const [time,setTime]=useState('');const [notes,setNotes]=useState('');const [type,setType]=useState('in-person');const [loading,setL]=useState(false);
  const submit=async()=>{
    if(!date||!time){Alert.alert('Error','Enter date and time');return;}
    setL(true);
    try{const res=await api.post('/appointments',{doctorName:d.name,doctorPhoto:'',specialty:d.specialty,platform:d.platform||'marham',platformDoctorId:d.id,clinicAddress:d.hospital,fee:d.fee,dateTime:new Date(date+'T'+time),type,notes,symptoms:''});
    navigation.replace('BookingConfirmed',{appointment:res.data.data,doctor:d});}
    catch(err){Alert.alert('Error',err.response?.data?.message||'Booking failed');}
    finally{setL(false);}
  };
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>Book Appointment</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:16,flexDirection:'row',alignItems:'center',gap:12}}>
        <View style={{width:52,height:52,borderRadius:26,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:28}}>👨‍⚕️</Text></View>
        <View><Text style={{fontSize:16,fontWeight:'700',color:'#1a1a1a'}}>{d.name}</Text><Text style={{fontSize:13,color:'#00897B'}}>{d.specialty}</Text><Text style={{fontSize:12,color:'#888'}}>PKR {d.fee?.toLocaleString()}</Text></View>
      </View>
      {[['Date (YYYY-MM-DD)',date,setDate,'numeric'],['Time (HH:MM)',time,setTime,'numbers-and-punctuation']].map(([lb,val,fn,kb])=>(
        <View key={lb} style={{marginBottom:14}}>
          <Text style={{fontSize:14,fontWeight:'600',color:'#555',marginBottom:8}}>{lb}</Text>
          <View style={{backgroundColor:'#f5f5f5',borderRadius:14,paddingHorizontal:14,borderWidth:1,borderColor:'#ebebeb'}}>
            <TextInput style={{fontSize:15,color:'#1a1a1a',paddingVertical:14}} placeholder={lb} value={val} onChangeText={fn} keyboardType={kb} placeholderTextColor="#bbb"/>
          </View>
        </View>
      ))}
      <Text style={{fontSize:14,fontWeight:'600',color:'#555',marginBottom:8}}>Appointment Type</Text>
      <View style={{flexDirection:'row',gap:10,marginBottom:14}}>
        {['in-person','video','phone'].map(t=><TouchableOpacity key={t} onPress={()=>setType(t)} style={{flex:1,padding:10,borderRadius:12,borderWidth:1.5,borderColor:type===t?'#00897B':'#ebebeb',backgroundColor:type===t?'#e8f5e9':'#fff',alignItems:'center'}}>
          <Text style={{fontSize:12,fontWeight:'600',color:type===t?'#00897B':'#888'}}>{t==='in-person'?'🏥 In-Person':t==='video'?'📹 Video':'📞 Phone'}</Text>
        </TouchableOpacity>)}
      </View>
      <Text style={{fontSize:14,fontWeight:'600',color:'#555',marginBottom:8}}>Notes (Optional)</Text>
      <View style={{backgroundColor:'#f5f5f5',borderRadius:14,padding:14,borderWidth:1,borderColor:'#ebebeb',marginBottom:20}}>
        <TextInput style={{fontSize:15,color:'#1a1a1a',minHeight:80}} placeholder="Describe your symptoms briefly..." value={notes} onChangeText={setNotes} multiline placeholderTextColor="#bbb"/>
      </View>
      <TouchableOpacity onPress={submit} disabled={loading} style={{borderRadius:14,overflow:'hidden',marginBottom:30}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}>{loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>✅ Confirm Booking</Text>}</LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  </View>);}