import React,{useState} from 'react';
import {View,Text,TouchableOpacity,ScrollView,Linking} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
const MOODS=[{v:1,e:'😢',l:'Very Bad'},{v:2,e:'😕',l:'Bad'},{v:3,e:'😐',l:'Okay'},{v:4,e:'🙂',l:'Good'},{v:5,e:'😄',l:'Great'}];
const HELP=[{emoji:'📞',title:'Umang Helpline',sub:'24/7 mental health support',num:'03174288665'},{emoji:'🤝',title:'Rozan Counseling',sub:'Professional support',num:'051-2890505'},{emoji:'🆘',title:'Edhi Foundation',sub:'Emergency support',num:'115'}];
export default function MentalHealthScreen({navigation}){
  const [mood,setMood]=useState(null);
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#7B1FA2','#4A148C']} style={{paddingTop:56,paddingBottom:24,paddingHorizontal:20}}>
      <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginBottom:12}}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:24,fontWeight:'900',color:'#fff'}}>🧠 Mental Health</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:4}}>You are not alone. We are here.</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:20,marginBottom:16}}>
        <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:16}}>How are you feeling today?</Text>
        <View style={{flexDirection:'row',justifyContent:'space-around'}}>
          {MOODS.map(m=><TouchableOpacity key={m.v} onPress={()=>setMood(m)} style={{alignItems:'center',padding:8,borderRadius:12,borderWidth:2,borderColor:mood?.v===m.v?'#7B1FA2':'transparent',backgroundColor:mood?.v===m.v?'#F3E5F5':'transparent'}}>
            <Text style={{fontSize:36}}>{m.e}</Text>
            <Text style={{fontSize:10,color:'#888',marginTop:4}}>{m.l}</Text>
          </TouchableOpacity>)}
        </View>
        {mood&&<Text style={{textAlign:'center',marginTop:12,fontSize:14,color:'#7B1FA2',fontWeight:'600'}}>Feeling {mood.l}. {mood.v<=2?'Talk to our AI for support.':'Keep it up!'}</Text>}
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('Chat',{})} style={{backgroundColor:'#7B1FA2',padding:16,borderRadius:14,alignItems:'center',marginBottom:16,flexDirection:'row',justifyContent:'center',gap:10}}>
        <Text style={{fontSize:22}}>💬</Text><Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>Talk to AI Therapist</Text>
      </TouchableOpacity>
      <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>🆘 Crisis Resources Pakistan</Text>
      {HELP.map(h=><View key={h.title} style={{backgroundColor:'#fff',borderRadius:14,padding:16,marginBottom:10,flexDirection:'row',alignItems:'center',gap:12}}>
        <Text style={{fontSize:32}}>{h.emoji}</Text>
        <View style={{flex:1}}><Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a'}}>{h.title}</Text><Text style={{fontSize:13,color:'#888'}}>{h.sub}</Text></View>
        <TouchableOpacity onPress={()=>Linking.openURL('tel:'+h.num)} style={{backgroundColor:'#7B1FA2',paddingHorizontal:12,paddingVertical:6,borderRadius:10}}><Text style={{color:'#fff',fontSize:12,fontWeight:'700'}}>{h.num}</Text></TouchableOpacity>
      </View>)}
      <View style={{backgroundColor:'#F3E5F5',borderRadius:14,padding:16,marginBottom:24}}><Text style={{fontSize:13,color:'#4A148C',lineHeight:20,textAlign:'center'}}>If you are in crisis, please call one of the numbers above or visit your nearest hospital emergency. You matter. 💜</Text></View>
    </ScrollView>
  </View>);}