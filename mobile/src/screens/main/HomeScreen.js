import React,{useState,useCallback} from 'react';
import {View,Text,ScrollView,TouchableOpacity,Dimensions,RefreshControl} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import useStore from '../../store/useStore';
import api from '../../utils/api';
const {width}=Dimensions.get('window');
const TIPS=['Drink 8 glasses of water daily.','Walk 30 minutes every day.','Sleep 7-8 hours every night.','Eat fresh fruits with every meal.','Wash hands frequently.','Check blood pressure after age 40.'];
export default function HomeScreen({navigation}){
  const {t}=useTranslation();const {user,language,setLanguage,isPremium,usageStats,refreshUsage}=useStore();
  const [recents,setRecents]=useState([]);const [refreshing,setRefreshing]=useState(false);
  const [tip]=useState(TIPS[Math.floor(Math.random()*TIPS.length)]);
  const load=async()=>{try{const r=await api.get('/consultations?limit=3');setRecents(r.data.data||[]);}catch{}};
  useFocusEffect(useCallback(()=>{load();refreshUsage();},[]) );
  const onRefresh=async()=>{setRefreshing(true);await load();await refreshUsage();setRefreshing(false);};
  const ACTIONS=[
    {emoji:'🤒',label:t('checkSymptoms'),route:'Consult',color:'#00897B'},
    {emoji:'💊',label:t('scanMedicine'),route:'MedicineScan',color:'#1976D2'},
    {emoji:'🏥',label:t('findHospital'),route:'Doctors',color:'#E53935'},
    {emoji:'👨‍⚕️',label:t('bookDoctor'),route:'DoctorList',color:'#7B1FA2'},
    {emoji:'🤰',label:t('pregnancyCare'),route:'Pregnancy',color:'#F57C00'},
    {emoji:'👴',label:t('elderlyCare'),route:'Elderly',color:'#0288D1'},
  ];
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00897B']}/>}>
      <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
          <View>
            <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)'}}>{t('greeting')},</Text>
            <Text style={{fontSize:24,fontWeight:'800',color:'#fff',marginTop:2}}>{user?.name?.split(' ')[0]||'User'} 👋</Text>
            {isPremium&&<View style={{flexDirection:'row',alignItems:'center',gap:4,marginTop:4}}>
              <Text style={{fontSize:12}}>💎</Text>
              <Text style={{color:'#FFD700',fontSize:12,fontWeight:'700'}}>PREMIUM</Text>
            </View>}
          </View>
          <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
            <TouchableOpacity onPress={()=>setLanguage(language==='en'?'ur':'en')} style={{backgroundColor:'rgba(255,255,255,0.2)',paddingHorizontal:10,paddingVertical:6,borderRadius:16}}>
              <Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>{language==='en'?'اردو':'EN'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Notifications')} style={{padding:4}}><Ionicons name="notifications-outline" size={24} color="#fff"/></TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
              <View style={{width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,0.3)',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#fff',fontWeight:'800',fontSize:18}}>{user?.name?.[0]?.toUpperCase()||'U'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('Consult')} style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:14,paddingHorizontal:16,paddingVertical:14}}>
          <Ionicons name="search-outline" size={18} color="#888" style={{marginRight:8}}/>
          <Text style={{color:'#aaa',fontSize:14}}>{t('describeSymptoms')}</Text>
        </TouchableOpacity>
      </LinearGradient>
      {!isPremium&&usageStats&&(
        <View style={{marginHorizontal:16,marginTop:12,backgroundColor:'#fff',borderRadius:14,padding:14,borderWidth:1,borderColor:'#e8e8e8'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <Text style={{fontSize:13,fontWeight:'700',color:'#333'}}>Daily Usage</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('Subscription')}>
              <Text style={{fontSize:12,color:'#FFD700',fontWeight:'700'}}>💎 Go Premium</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row',gap:12}}>
            {[{e:'💬',u:usageStats.messages||0,l:usageStats.limits?.messages||10,n:'Messages'},{e:'📷',u:usageStats.images||0,l:usageStats.limits?.images||2,n:'Scans'}].map(s=>(
              <View key={s.n} style={{flex:1}}>
                <Text style={{fontSize:11,color:'#888',marginBottom:4}}>{s.e} {s.n}</Text>
                <View style={{height:6,backgroundColor:'#f0f0f0',borderRadius:3,overflow:'hidden'}}>
                  <View style={{height:'100%',borderRadius:3,backgroundColor:s.u>=s.l?'#F44336':'#00897B',width:`${Math.min((s.u/s.l)*100,100)}%`}}/>
                </View>
                <Text style={{fontSize:10,color:'#aaa',marginTop:2}}>{s.u}/{s.l}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <TouchableOpacity onPress={()=>navigation.navigate('Emergency')} style={{marginHorizontal:16,marginTop:12,borderRadius:14,overflow:'hidden'}}>
        <LinearGradient colors={['#E53935','#B71C1C']} style={{padding:14,alignItems:'center'}}>
          <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>🚨 {t('emergency')} — Rescue: 1122 | Edhi: 115</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={{paddingHorizontal:16,marginTop:20}}>
        <Text style={{fontSize:17,fontWeight:'700',color:'#1a1a1a',marginBottom:14}}>Quick Actions</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
          {ACTIONS.map(a=>(
            <TouchableOpacity key={a.route+a.label} onPress={()=>navigation.navigate(a.route)} style={{width:(width-56)/3,alignItems:'center'}}>
              <View style={{width:60,height:60,borderRadius:18,alignItems:'center',justifyContent:'center',marginBottom:6,backgroundColor:a.color+'18'}}><Text style={{fontSize:26}}>{a.emoji}</Text></View>
              <Text style={{fontSize:11,color:'#444',fontWeight:'600',textAlign:'center'}} numberOfLines={2}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{paddingHorizontal:16,marginTop:20}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <Text style={{fontSize:17,fontWeight:'700',color:'#1a1a1a'}}>{t('recentConsultations')}</Text>
          <TouchableOpacity onPress={()=>navigation.navigate('ConsultHistory')}><Text style={{color:'#00897B',fontSize:13,fontWeight:'600'}}>{t('viewAll')}</Text></TouchableOpacity>
        </View>
        {recents.length===0?(
          <TouchableOpacity onPress={()=>navigation.navigate('Consult')} style={{backgroundColor:'#fff',borderRadius:16,padding:24,alignItems:'center',borderWidth:2,borderColor:'#e8f5e9',borderStyle:'dashed'}}>
            <Text style={{fontSize:48,marginBottom:12}}>🤒</Text>
            <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:6}}>No consultations yet</Text>
            <Text style={{fontSize:13,color:'#888',textAlign:'center',marginBottom:16}}>Tap to describe symptoms and get AI diagnosis</Text>
            <View style={{backgroundColor:'#00897B',paddingHorizontal:20,paddingVertical:10,borderRadius:20}}><Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>Start Consultation →</Text></View>
          </TouchableOpacity>
        ):recents.map(c=>(
          <TouchableOpacity key={c._id} onPress={()=>navigation.navigate('Chat',{consultationId:c._id})} style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',padding:14,borderRadius:14,marginBottom:10,gap:12}}>
            <View style={{width:44,height:44,borderRadius:22,backgroundColor:'#e8f5e9',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:22}}>🤒</Text></View>
            <View style={{flex:1}}>
              <Text style={{fontSize:14,fontWeight:'600',color:'#1a1a1a'}} numberOfLines={1}>{c.title||'Consultation'}</Text>
              <Text style={{fontSize:12,color:'#aaa'}}>{new Date(c.createdAt).toLocaleDateString()}</Text>
              {c.diagnosis?.condition&&<Text style={{fontSize:12,color:'#00897B',marginTop:2}} numberOfLines={1}>Diagnosed: {c.diagnosis.condition}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc"/>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{paddingHorizontal:16,marginTop:20}}>
        <Text style={{fontSize:17,fontWeight:'700',color:'#1a1a1a',marginBottom:14}}>{t('healthTip')}</Text>
        <LinearGradient colors={['#E8F5E9','#C8E6C9']} style={{borderRadius:16,padding:16,flexDirection:'row',alignItems:'flex-start',gap:12}}>
          <Text style={{fontSize:28}}>💡</Text>
          <Text style={{flex:1,fontSize:14,color:'#2e7d32',lineHeight:22,fontWeight:'500'}}>{tip}</Text>
        </LinearGradient>
      </View>
      <View style={{paddingHorizontal:16,marginTop:20,marginBottom:20}}>
        <Text style={{fontSize:17,fontWeight:'700',color:'#1a1a1a',marginBottom:14}}>Health Modules</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
          {[{emoji:'🤰',title:'Pregnancy',route:'Pregnancy',colors:['#F57C00','#E65100']},{emoji:'👴',title:'Elderly',route:'Elderly',colors:['#0288D1','#01579B']},{emoji:'🧠',title:'Mental Health',route:'MentalHealth',colors:['#7B1FA2','#4A148C']},{emoji:'📊',title:'Records',route:'HealthRecords',colors:['#00897B','#004D40']}].map(m=>(
            <TouchableOpacity key={m.route} onPress={()=>navigation.navigate(m.route)} style={{width:(width-52)/2,borderRadius:16,overflow:'hidden'}}>
              <LinearGradient colors={m.colors} style={{padding:20,alignItems:'center'}}>
                <Text style={{fontSize:34,marginBottom:8}}>{m.emoji}</Text>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:13,textAlign:'center'}}>{m.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  </View>);}