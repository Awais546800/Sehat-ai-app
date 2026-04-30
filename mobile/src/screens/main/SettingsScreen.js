import React from 'react';
import {View,Text,TouchableOpacity,ScrollView,Alert} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import useStore from '../../store/useStore';
export default function SettingsScreen({navigation}){
  const {user,language,setLanguage,logout,isPremium}=useStore();
  const items=[
    {icon:'person-outline',label:'Edit Profile',action:()=>navigation.navigate('Profile'),color:'#00897B'},
    {icon:'language-outline',label:'Language: '+(language==='en'?'English':'اردو'),action:()=>setLanguage(language==='en'?'ur':'en'),color:'#1976D2'},
    {icon:'diamond-outline',label:isPremium?'Premium Active ✓':'Upgrade to Premium',action:()=>navigation.navigate('Subscription'),color:'#FFD700'},
    {icon:'time-outline',label:'Consultation History',action:()=>navigation.navigate('ConsultHistory'),color:'#7B1FA2'},
    {icon:'calendar-outline',label:'My Appointments',action:()=>navigation.navigate('MyAppointments'),color:'#F57C00'},
    {icon:'document-text-outline',label:'Health Records',action:()=>navigation.navigate('HealthRecords'),color:'#0288D1'},
    {icon:'shield-outline',label:'Privacy & Data',action:()=>navigation.navigate('Privacy'),color:'#E53935'},
    {icon:'medical-outline',label:'Emergency',action:()=>navigation.navigate('Emergency'),color:'#F44336'},
  ];
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:24,paddingHorizontal:20}}>
      <Text style={{fontSize:24,fontWeight:'900',color:'#fff'}}>⚙️ More</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:4}}>{user?.name}</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      {!isPremium&&<TouchableOpacity onPress={()=>navigation.navigate('Subscription')} style={{borderRadius:16,overflow:'hidden',marginBottom:16}}>
        <LinearGradient colors={['#1a1a2e','#16213e']} style={{padding:20,flexDirection:'row',alignItems:'center',gap:14}}>
          <Text style={{fontSize:36}}>💎</Text>
          <View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'900',color:'#FFD700'}}>Upgrade to Premium</Text><Text style={{fontSize:13,color:'#aaa',marginTop:2}}>Unlimited AI • No daily limits</Text><Text style={{fontSize:13,color:'#FFD700',marginTop:2}}>From PKR 1,400/month</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#FFD700"/>
        </LinearGradient>
      </TouchableOpacity>}
      {items.map(i=><TouchableOpacity key={i.label} onPress={i.action} style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',padding:16,borderRadius:14,marginBottom:10,gap:14}}>
        <View style={{width:40,height:40,borderRadius:20,backgroundColor:i.color+'18',alignItems:'center',justifyContent:'center'}}><Ionicons name={i.icon} size={20} color={i.color}/></View>
        <Text style={{flex:1,fontSize:15,fontWeight:'600',color:'#1a1a1a'}}>{i.label}</Text>
        <Ionicons name="chevron-forward" size={18} color="#ccc"/>
      </TouchableOpacity>)}
      <TouchableOpacity onPress={()=>Alert.alert('Logout','Are you sure?',[{text:'Cancel',style:'cancel'},{text:'Logout',style:'destructive',onPress:()=>logout()}])} style={{backgroundColor:'#fff',padding:16,borderRadius:14,alignItems:'center',marginTop:4,borderWidth:1.5,borderColor:'#F44336'}}>
        <Text style={{color:'#F44336',fontWeight:'700',fontSize:15}}>🚪 Logout</Text>
      </TouchableOpacity>
      <Text style={{textAlign:'center',color:'#aaa',fontSize:12,marginTop:20,marginBottom:30}}>Sehat AI v2.0 • UET Lahore FYP{'
'}Made with ❤️ for Pakistan</Text>
    </ScrollView>
  </View>);}