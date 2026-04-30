import React,{useState} from 'react';
import {View,Text,TouchableOpacity,ScrollView,TextInput,Alert,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
import useStore from '../../store/useStore';
const BG=['A+','A-','B+','B-','AB+','AB-','O+','O-','unknown'];
const CONDS=['Diabetes','Blood Pressure','Heart Disease','Asthma','Thyroid','Kidney Disease','None'];
const ALLGS=['Penicillin','Aspirin','Ibuprofen','Sulfa drugs','Peanuts','None'];
export default function HealthProfileScreen({navigation}){
  const {updateUser}=useStore();
  const [bg,setBg]=useState('unknown');const [conds,setConds]=useState([]);const [allgs,setAllgs]=useState([]);
  const [meds,setMeds]=useState('');const [eName,setEN]=useState('');const [ePhone,setEP]=useState('');const [loading,setL]=useState(false);
  const toggle=(arr,set,val)=>{if(val==='None'){set(['None']);return;}const f=arr.filter(v=>v!=='None');set(f.includes(val)?f.filter(v=>v!==val):[...f,val]);};
  const save=async()=>{
    setL(true);
    try{const res=await api.put('/users/health-profile',{bloodGroup:bg,existingConditions:conds,allergies:allgs,currentMedicines:meds.split(',').map(m=>m.trim()).filter(Boolean),emergencyContact:{name:eName,phone:ePhone}});updateUser(res.data.user);navigation.navigate('MainTabs');}
    catch(err){Alert.alert('Error',err.response?.data?.message||'Could not save');}
    finally{setL(false);}
  };
  const Chip=({label,active,onPress})=>(<TouchableOpacity onPress={onPress} style={{paddingHorizontal:14,paddingVertical:8,borderRadius:20,borderWidth:1.5,borderColor:active?'#00897B':'#ebebeb',backgroundColor:active?'#e8f5e9':'#f9f9f9',marginRight:8,marginBottom:8}}><Text style={{color:active?'#00897B':'#666',fontSize:13,fontWeight:active?'700':'400'}}>{label}</Text></TouchableOpacity>);
  return(<View style={{flex:1,backgroundColor:'#fff'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:60,paddingBottom:28,paddingHorizontal:24}}>
      <Text style={{fontSize:26,fontWeight:'900',color:'#fff'}}>Health Profile</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:4}}>Helps personalize your AI diagnosis</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:20}} showsVerticalScrollIndicator={false}>
      <Text style={{fontSize:15,fontWeight:'700',color:'#333',marginTop:8,marginBottom:12}}>🩸 Blood Group</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap'}}>{BG.map(b=><Chip key={b} label={b} active={bg===b} onPress={()=>setBg(b)}/>)}</View>
      <Text style={{fontSize:15,fontWeight:'700',color:'#333',marginTop:16,marginBottom:12}}>🏥 Existing Conditions</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap'}}>{CONDS.map(c=><Chip key={c} label={c} active={conds.includes(c)} onPress={()=>toggle(conds,setConds,c)}/>)}</View>
      <Text style={{fontSize:15,fontWeight:'700',color:'#333',marginTop:16,marginBottom:12}}>⚠️ Allergies</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap'}}>{ALLGS.map(a=><Chip key={a} label={a} active={allgs.includes(a)} onPress={()=>toggle(allgs,setAllgs,a)}/>)}</View>
      <Text style={{fontSize:15,fontWeight:'700',color:'#333',marginTop:16,marginBottom:8}}>💊 Current Medicines</Text>
      <View style={{backgroundColor:'#f5f5f5',borderRadius:14,padding:14,marginBottom:12,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:15,color:'#1a1a1a'}} placeholder="e.g. Metformin, Lisinopril" value={meds} onChangeText={setMeds} multiline placeholderTextColor="#aaa"/></View>
      <Text style={{fontSize:15,fontWeight:'700',color:'#333',marginTop:8,marginBottom:8}}>🚨 Emergency Contact</Text>
      <View style={{backgroundColor:'#f5f5f5',borderRadius:14,padding:14,marginBottom:12,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:15,color:'#1a1a1a'}} placeholder="Name" value={eName} onChangeText={setEN} placeholderTextColor="#aaa"/></View>
      <View style={{backgroundColor:'#f5f5f5',borderRadius:14,padding:14,marginBottom:24,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:15,color:'#1a1a1a'}} placeholder="Phone (+923...)" value={ePhone} onChangeText={setEP} keyboardType="phone-pad" placeholderTextColor="#aaa"/></View>
      <TouchableOpacity onPress={save} disabled={loading} style={{borderRadius:14,overflow:'hidden',marginBottom:12}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}>{loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>Save & Continue →</Text>}</LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('MainTabs')} style={{padding:16,alignItems:'center',marginBottom:40}}><Text style={{color:'#aaa',fontSize:14}}>Skip for now</Text></TouchableOpacity>
    </ScrollView>
  </View>);}