import React,{useState} from 'react';
import {View,Text,TouchableOpacity,ScrollView,TextInput,Alert} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
export default function ElderlyScreen({navigation}){
  const [reminders,setR]=useState([]);const [mn,setMN]=useState('');const [mt,setMT]=useState('');
  const [readings,setRd]=useState([]);const [bp,setBP]=useState('');const [sugar,setSugar]=useState('');
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#0288D1','#01579B']} style={{paddingTop:56,paddingBottom:24,paddingHorizontal:20}}>
      <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginBottom:12}}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:24,fontWeight:'900',color:'#fff'}}>👴 Elderly Care</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:4}}>Medicine reminders & health tracking</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:16}}>
        <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>💊 Add Medicine Reminder</Text>
        <View style={{flexDirection:'row',gap:8,marginBottom:8}}>
          <View style={{flex:1,backgroundColor:'#f5f5f5',borderRadius:12,paddingHorizontal:12,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:14,paddingVertical:12}} placeholder="Medicine name" value={mn} onChangeText={setMN} placeholderTextColor="#bbb"/></View>
          <View style={{flex:1,backgroundColor:'#f5f5f5',borderRadius:12,paddingHorizontal:12,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:14,paddingVertical:12}} placeholder="Time e.g. 8:00 AM" value={mt} onChangeText={setMT} placeholderTextColor="#bbb"/></View>
        </View>
        <TouchableOpacity onPress={()=>{if(!mn||!mt){Alert.alert('Enter name and time');return;}setR(p=>[...p,{id:Date.now(),name:mn,time:mt,taken:false}]);setMN('');setMT('');}} style={{backgroundColor:'#0288D1',padding:12,borderRadius:12,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700'}}>+ Add Reminder</Text></TouchableOpacity>
      </View>
      {reminders.length>0&&<View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:16}}>
        <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>Today's Medicines</Text>
        {reminders.map(r=><View key={r.id} style={{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderColor:'#f0f0f0'}}>
          <Text style={{flex:1,fontSize:14,color:'#1a1a1a'}}>{r.name}</Text>
          <Text style={{fontSize:13,color:'#888',marginRight:12}}>{r.time}</Text>
          <TouchableOpacity onPress={()=>setR(p=>p.map(x=>x.id===r.id?{...x,taken:!x.taken}:x))} style={{paddingHorizontal:12,paddingVertical:6,borderRadius:10,backgroundColor:r.taken?'#e8f5e9':'#f5f5f5'}}>
            <Text style={{fontSize:12,fontWeight:'700',color:r.taken?'#4CAF50':'#888'}}>{r.taken?'✓ Taken':'Mark Taken'}</Text>
          </TouchableOpacity>
        </View>)}
      </View>}
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:16}}>
        <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>📊 Log Health Reading</Text>
        <View style={{flexDirection:'row',gap:8,marginBottom:8}}>
          <View style={{flex:1,backgroundColor:'#f5f5f5',borderRadius:12,paddingHorizontal:12,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:14,paddingVertical:12}} placeholder="BP (120/80)" value={bp} onChangeText={setBP} placeholderTextColor="#bbb"/></View>
          <View style={{flex:1,backgroundColor:'#f5f5f5',borderRadius:12,paddingHorizontal:12,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:14,paddingVertical:12}} placeholder="Sugar (mg/dL)" value={sugar} onChangeText={setSugar} keyboardType="numeric" placeholderTextColor="#bbb"/></View>
        </View>
        <TouchableOpacity onPress={()=>{if(!bp&&!sugar)return;setRd(p=>[...p,{id:Date.now(),bp,sugar,date:new Date().toLocaleString()}]);setBP('');setSugar('');}} style={{backgroundColor:'#0288D1',padding:12,borderRadius:12,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700'}}>+ Log Reading</Text></TouchableOpacity>
      </View>
      {readings.slice(-3).reverse().map(r=><View key={r.id} style={{backgroundColor:'#E1F5FE',borderRadius:12,padding:12,marginBottom:8,flexDirection:'row',justifyContent:'space-between'}}>
        <View>{r.bp&&<Text style={{fontSize:13,fontWeight:'600'}}>BP: {r.bp}</Text>}{r.sugar&&<Text style={{fontSize:13,fontWeight:'600'}}>Sugar: {r.sugar} mg/dL</Text>}</View>
        <Text style={{fontSize:11,color:'#888'}}>{r.date}</Text>
      </View>)}
      <TouchableOpacity onPress={()=>navigation.navigate('Chat',{})} style={{backgroundColor:'#0288D1',padding:16,borderRadius:14,alignItems:'center',marginTop:8,marginBottom:24}}><Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>🩺 Check Symptoms with AI</Text></TouchableOpacity>
    </ScrollView>
  </View>);}