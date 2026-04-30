import React,{useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,Alert,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
import useStore from '../../store/useStore';
export default function ProfileScreen({navigation}){
  const {user,updateUser,logout,isPremium}=useStore();
  const [name,setName]=useState(user?.name||'');const [city,setCity]=useState(user?.city||'');const [loading,setL]=useState(false);
  const save=async()=>{setL(true);try{const r=await api.put('/users/me',{name,city});updateUser(r.data.user);Alert.alert('Saved!','Profile updated.');}catch(e){Alert.alert('Error',e.response?.data?.message||'Failed');}finally{setL(false);}};
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:30,paddingHorizontal:20,alignItems:'center'}}>
      <TouchableOpacity onPress={()=>navigation.goBack()} style={{position:'absolute',left:20,top:60}}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <View style={{width:80,height:80,borderRadius:40,backgroundColor:'rgba(255,255,255,0.3)',alignItems:'center',justifyContent:'center',marginBottom:12}}><Text style={{fontSize:40,fontWeight:'900',color:'#fff'}}>{user?.name?.[0]?.toUpperCase()||'U'}</Text></View>
      <Text style={{fontSize:22,fontWeight:'900',color:'#fff'}}>{user?.name}</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:4}}>{user?.email}</Text>
      {isPremium&&<View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:8,backgroundColor:'rgba(255,215,0,0.2)',paddingHorizontal:14,paddingVertical:6,borderRadius:20}}>
        <Text style={{fontSize:14}}>💎</Text><Text style={{color:'#FFD700',fontWeight:'700',fontSize:13}}>Premium Member</Text>
      </View>}
    </LinearGradient>
    <ScrollView style={{flex:1,padding:20}}>
      {[['Full Name',name,setName,'words'],['City',city,setCity,'words']].map(([lb,val,fn,ac])=>(
        <View key={lb} style={{marginBottom:14}}>
          <Text style={{fontSize:14,fontWeight:'600',color:'#555',marginBottom:8}}>{lb}</Text>
          <View style={{backgroundColor:'#fff',borderRadius:14,paddingHorizontal:14,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:15,color:'#1a1a1a',paddingVertical:14}} value={val} onChangeText={fn} autoCapitalize={ac} placeholderTextColor="#bbb" placeholder={lb}/></View>
        </View>
      ))}
      <TouchableOpacity onPress={save} disabled={loading} style={{borderRadius:14,overflow:'hidden',marginBottom:12,marginTop:8}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:16,alignItems:'center'}}>{loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>Save Changes</Text>}</LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('HealthProfile')} style={{backgroundColor:'#f5f5f5',padding:16,borderRadius:14,alignItems:'center',marginBottom:12}}><Text style={{color:'#00897B',fontWeight:'700',fontSize:15}}>🩺 Update Health Profile</Text></TouchableOpacity>
      {!isPremium&&<TouchableOpacity onPress={()=>navigation.navigate('Subscription')} style={{borderRadius:14,overflow:'hidden',marginBottom:12}}>
        <LinearGradient colors={['#FFD700','#FFA500']} style={{padding:16,alignItems:'center'}}><Text style={{color:'#1a1a1a',fontWeight:'900',fontSize:15}}>💎 Upgrade to Premium</Text></LinearGradient>
      </TouchableOpacity>}
      <TouchableOpacity onPress={()=>Alert.alert('Logout','Are you sure?',[{text:'Cancel',style:'cancel'},{text:'Logout',style:'destructive',onPress:()=>logout()}])} style={{backgroundColor:'#fff',padding:16,borderRadius:14,alignItems:'center',marginBottom:24,borderWidth:1.5,borderColor:'#F44336'}}><Text style={{color:'#F44336',fontWeight:'700',fontSize:15}}>Logout</Text></TouchableOpacity>
    </ScrollView>
  </View>);}