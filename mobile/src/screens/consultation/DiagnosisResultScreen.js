import React from 'react';
import {View,Text,ScrollView,TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
const SEV={low:'#4CAF50',medium:'#FF9800',high:'#F44336',critical:'#B71C1C'};
export default function DiagnosisResultScreen({navigation,route}){
  const {diagnosis={},consultationId}=route.params||{};
  const {condition='Unknown',confidence=0,severity='low',recommendations=[],medicines=[],homeRemedies=[],specialtyNeeded='',aiUsed=''}=diagnosis;
  const sc=SEV[severity]||'#FF9800';
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>📋 Diagnosis Result</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <View style={{backgroundColor:'#fff',borderRadius:20,padding:20,marginBottom:16,borderWidth:1,borderColor:'#e8e8e8'}}>
        <Text style={{fontSize:12,color:'#888',letterSpacing:2,marginBottom:6}}>CONDITION IDENTIFIED</Text>
        <Text style={{fontSize:26,fontWeight:'900',color:'#1a1a1a',marginBottom:12}}>{condition}</Text>
        <View style={{flexDirection:'row',gap:10,flexWrap:'wrap',marginBottom:16}}>
          <View style={{paddingHorizontal:12,paddingVertical:6,borderRadius:20,borderWidth:1.5,borderColor:sc,backgroundColor:sc+'22'}}><Text style={{fontSize:12,fontWeight:'700',color:sc}}>⚠️ {severity.toUpperCase()}</Text></View>
          <View style={{paddingHorizontal:12,paddingVertical:6,borderRadius:20,borderWidth:1.5,borderColor:'#00897B',backgroundColor:'#00897B22'}}><Text style={{fontSize:12,fontWeight:'700',color:'#00897B'}}>✓ {confidence}% confidence</Text></View>
          {aiUsed&&<View style={{paddingHorizontal:12,paddingVertical:6,borderRadius:20,borderWidth:1.5,borderColor:'#1976D2',backgroundColor:'#1976D222'}}><Text style={{fontSize:12,fontWeight:'700',color:'#1976D2'}}>🤖 {aiUsed}</Text></View>}
        </View>
        <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
          <Text style={{fontSize:12,color:'#888',width:70}}>Confidence</Text>
          <View style={{flex:1,height:8,backgroundColor:'#f0f0f0',borderRadius:4,overflow:'hidden'}}><View style={{height:'100%',borderRadius:4,backgroundColor:confidence>70?'#4CAF50':confidence>40?'#FF9800':'#F44336',width:confidence+'%'}}/></View>
          <Text style={{fontSize:12,fontWeight:'700',color:'#1a1a1a',width:35,textAlign:'right'}}>{confidence}%</Text>
        </View>
      </View>
      {medicines.length>0&&<View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:12}}>
        <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a',marginBottom:10}}>💊 Recommended Medicines</Text>
        {medicines.map((m,i)=><View key={i} style={{flexDirection:'row',gap:8,marginBottom:6}}><Text style={{color:'#00897B',fontSize:16,marginTop:1}}>•</Text><Text style={{flex:1,fontSize:14,color:'#444',lineHeight:22}}>{m}</Text></View>)}
      </View>}
      {recommendations.length>0&&<View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:12}}>
        <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a',marginBottom:10}}>📋 Recommendations</Text>
        {recommendations.map((r,i)=><View key={i} style={{flexDirection:'row',gap:8,marginBottom:6}}><Text style={{color:'#00897B',fontSize:16,marginTop:1}}>•</Text><Text style={{flex:1,fontSize:14,color:'#444',lineHeight:22}}>{r}</Text></View>)}
      </View>}
      {homeRemedies.length>0&&<View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:12}}>
        <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a',marginBottom:10}}>🏠 Home Remedies</Text>
        {homeRemedies.map((r,i)=><View key={i} style={{flexDirection:'row',gap:8,marginBottom:6}}><Text style={{color:'#00897B',fontWeight:'700',fontSize:14,minWidth:22}}>{i+1}.</Text><Text style={{flex:1,fontSize:14,color:'#444',lineHeight:22}}>{r}</Text></View>)}
      </View>}
      {specialtyNeeded&&<View style={{backgroundColor:'#E8F5E9',borderRadius:14,padding:14,marginBottom:12}}><Text style={{fontSize:14,fontWeight:'700',color:'#2e7d32'}}>👨‍⚕️ See a {specialtyNeeded}</Text></View>}
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:12}}>
        <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a',marginBottom:12}}>📍 What would you like to do?</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
          {[{e:'🏥',l:'Find Hospital',r:'Doctors',c:'#E53935'},{e:'👨‍⚕️',l:'Find Doctor',r:'DoctorList',c:'#00897B'},{e:'💊',l:'Medicine',r:'MedicineSearch',c:'#1976D2'},{e:'📅',l:'Book Appt',r:'AppointmentForm',c:'#7B1FA2'}].map(a=>(
            <TouchableOpacity key={a.l} onPress={()=>navigation.navigate(a.r,{specialty:specialtyNeeded})} style={{width:'47%',borderRadius:14,borderWidth:2,borderColor:a.c,padding:16,alignItems:'center',backgroundColor:'#fff'}}>
              <Text style={{fontSize:28,marginBottom:6}}>{a.e}</Text>
              <Text style={{fontSize:12,fontWeight:'700',color:a.c,textAlign:'center'}}>{a.l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('Chat',{consultationId})} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:16,borderRadius:14,backgroundColor:'#e8f5e9',marginBottom:20}}>
        <Ionicons name="chatbubble-outline" size={18} color="#00897B" style={{marginRight:8}}/>
        <Text style={{color:'#00897B',fontWeight:'600',fontSize:14}}>Back to Chat</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>);}