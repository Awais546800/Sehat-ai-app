import React,{useState,useEffect} from 'react';
import {View,Text,TouchableOpacity,ScrollView,ActivityIndicator,Alert} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
import useStore from '../../store/useStore';
export default function SubscriptionScreen({navigation}){
  const {user,isPremium}=useStore();
  const [plans,setPlans]=useState(null);const [selected,setSelected]=useState('monthly');const [loading,setL]=useState(true);
  useEffect(()=>{api.get('/subscriptions/plans').then(r=>{setPlans(r.data);setL(false);}).catch(()=>setL(false));},[]);
  if(loading)return(<View style={{flex:1,backgroundColor:'#0a0a1a',alignItems:'center',justifyContent:'center'}}><ActivityIndicator color="#FFD700" size="large"/></View>);
  const plan=plans?.plans?.[selected];
  const FREE=plans?.freeTier;
  const OFFERS=plans?.offers||[];
  return(<View style={{flex:1,backgroundColor:'#0a0a1a'}}>
    <LinearGradient colors={['#0a0a1a','#1a1a2e','#0a0a1a']} style={{flex:1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:60,paddingHorizontal:20,alignItems:'center',paddingBottom:20}}>
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{position:'absolute',left:20,top:60}}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
          <Text style={{fontSize:40,marginBottom:8}}>💎</Text>
          <Text style={{fontSize:28,fontWeight:'900',color:'#FFD700',letterSpacing:2}}>Sehat AI Premium</Text>
          <Text style={{fontSize:15,color:'#888',marginTop:8,textAlign:'center'}}>Unlimited AI consultations{'
'}No daily limits • Priority responses</Text>
        </View>
        {isPremium&&<View style={{marginHorizontal:20,marginBottom:16,backgroundColor:'#1a3a1a',borderRadius:16,padding:16,borderWidth:1,borderColor:'#4CAF50'}}>
          <Text style={{color:'#4CAF50',fontWeight:'700',fontSize:16,textAlign:'center'}}>✅ You are a Premium Member!</Text>
          <Text style={{color:'#888',fontSize:13,textAlign:'center',marginTop:4}}>Premium expires: {user?.subscription?.endDate?new Date(user.subscription.endDate).toLocaleDateString():'Active'}</Text>
        </View>}
        <View style={{flexDirection:'row',marginHorizontal:20,marginBottom:16,gap:10}}>
          {['monthly','yearly'].map(p=>(
            <TouchableOpacity key={p} onPress={()=>setSelected(p)} style={{flex:1,borderRadius:16,overflow:'hidden',borderWidth:2,borderColor:selected===p?'#FFD700':'#333'}}>
              <LinearGradient colors={selected===p?['#2a2000','#1a1500']:['#1a1a1a','#111']} style={{padding:16,alignItems:'center'}}>
                {p==='yearly'&&<View style={{backgroundColor:'#FFD700',paddingHorizontal:8,paddingVertical:2,borderRadius:8,marginBottom:6}}><Text style={{fontSize:10,fontWeight:'900',color:'#000'}}>SAVE 55%</Text></View>}
                <Text style={{fontSize:14,color:selected===p?'#FFD700':'#888',fontWeight:'700',textTransform:'uppercase'}}>{p}</Text>
                <Text style={{fontSize:26,fontWeight:'900',color:'#fff',marginTop:4}}>PKR {plans?.plans?.[p]?.pricePKR?.toLocaleString()}</Text>
                <Text style={{fontSize:12,color:'#888',marginTop:2}}>/{p==='monthly'?'month':'year'}</Text>
                {p==='yearly'&&<Text style={{fontSize:11,color:'#4CAF50',marginTop:4}}>≈ PKR 667/month</Text>}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        {OFFERS.length>0&&<View style={{marginHorizontal:20,marginBottom:16}}>
          <Text style={{fontSize:14,fontWeight:'700',color:'#FFD700',marginBottom:10,letterSpacing:2}}>🔥 ACTIVE OFFERS</Text>
          {OFFERS.map(o=>(
            <View key={o.id} style={{backgroundColor:'#1a1500',borderRadius:12,padding:14,marginBottom:8,borderWidth:1,borderColor:'#FFD700aa',flexDirection:'row',alignItems:'center',gap:12}}>
              <Text style={{fontSize:24}}>{o.title.split(' ')[0]}</Text>
              <View style={{flex:1}}><Text style={{color:'#FFD700',fontWeight:'700',fontSize:14}}>{o.title.substring(2)}</Text><Text style={{color:'#888',fontSize:12}}>{o.description}</Text></View>
              <View style={{backgroundColor:'#FFD700',paddingHorizontal:10,paddingVertical:4,borderRadius:8}}><Text style={{fontWeight:'900',color:'#000',fontSize:14}}>{o.discount}% OFF</Text></View>
            </View>
          ))}
        </View>}
        <View style={{marginHorizontal:20,backgroundColor:'#111',borderRadius:16,padding:16,marginBottom:16,borderWidth:1,borderColor:'#222'}}>
          <Text style={{fontSize:14,fontWeight:'700',color:'#fff',marginBottom:12'}}>✨ Premium Features</Text>
          {['Unlimited AI consultations daily','Unlimited image & medicine scans','Priority AI responses (Gemini Pro)','Full medicine database access','Download health reports as PDF','Doctor appointment priority','No daily cooldown limits','Family sharing (2 accounts) - Yearly only'].map(f=>(
            <View key={f} style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8}}>
              <Ionicons name="checkmark-circle" size={18} color="#FFD700"/>
              <Text style={{color:'#ccc',fontSize:13,flex:1}}>{f}</Text>
            </View>
          ))}
        </View>
        {FREE&&<View style={{marginHorizontal:20,backgroundColor:'#111',borderRadius:16,padding:16,marginBottom:20,borderWidth:1,borderColor:'#222'}}>
          <Text style={{fontSize:14,fontWeight:'700',color:'#888',marginBottom:12}}>Free Plan (Current)</Text>
          {[['💬','AI Messages',FREE.dailyMessages+'/day'],['📷','Image Scans',FREE.dailyImageScans+'/day'],['💊','Medicine Searches',FREE.medicineSearches+'/day'],['🤒','Consultations',FREE.dailyConsultations+'/day']].map(([e,l,v])=>(
            <View key={l} style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8}}>
              <Text style={{fontSize:16,width:24}}>{e}</Text>
              <Text style={{color:'#888',fontSize:13,flex:1}}>{l}</Text>
              <Text style={{color:'#666',fontSize:13}}>{v}</Text>
            </View>
          ))}
        </View>}
        <TouchableOpacity onPress={()=>navigation.navigate('Payment',{plan:selected,planData:plan})} style={{marginHorizontal:20,borderRadius:16,overflow:'hidden',marginBottom:12}}>
          <LinearGradient colors={['#FFD700','#FFA500']} style={{padding:20,alignItems:'center'}}>
            <Text style={{fontSize:18,fontWeight:'900',color:'#1a1a1a'}}>💎 Get Premium — PKR {plan?.pricePKR?.toLocaleString()}/{selected==='monthly'?'mo':'yr'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={{color:'#444',fontSize:12,textAlign:'center',marginBottom:30,paddingHorizontal:20}}>Cancel anytime. No hidden charges. Secure payment via EasyPaisa, JazzCash, Card, or Crypto.</Text>
      </ScrollView>
    </LinearGradient>
  </View>);}