import React,{useState} from 'react';
import {View,Text,TouchableOpacity,ScrollView,TextInput} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
const WEEKS={4:{baby:"Embryo size of poppy seed.",mom:"Nausea may begin. Tender breasts.",diet:"Start folic acid 400mcg daily. Avoid alcohol.",warn:"Confirm pregnancy with doctor."},8:{baby:"Heart beating. Fingers forming.",mom:"Morning sickness peaks. Fatigue.",diet:"Small frequent meals. Ginger for nausea.",warn:"First prenatal visit due."},12:{baby:"All organs formed. Baby is 5cm.",mom:"Nausea usually improves.",diet:"Increase protein: eggs, chicken, daal.",warn:"First trimester screening tests."},16:{baby:"Baby can make facial expressions.",mom:"Baby bump showing. More energy.",diet:"Iron-rich foods: spinach, lentils.",warn:"Anatomy scan scheduled."},20:{baby:"Baby can hear sounds.",mom:"Movements felt. Back pain starts.",diet:"Calcium: milk, yogurt, cheese.",warn:"Anatomy scan at 20 weeks."},24:{baby:"Lungs developing. Responding to sound.",mom:"Heartburn common. Swollen feet.",diet:"Stay hydrated. Omega-3 foods.",warn:"Glucose test for diabetes."},28:{baby:"Eyes open. Brain developing.",mom:"Shortness of breath. Braxton Hicks.",diet:"Small frequent meals.",warn:"Start counting kicks daily."},32:{baby:"Practicing breathing. Gaining weight.",mom:"Pelvic pressure. Frequent urination.",diet:"Light meals. Fiber for constipation.",warn:"Baby position check at scan."},36:{baby:"Almost full term. Lungs mature.",mom:"Nesting instinct. Back pain.",diet:"Dates may help labor. Stay hydrated.",warn:"Hospital bag should be ready."},40:{baby:"Full term! Average 3.4kg.",mom:"Any day now!",diet:"Light snacks only. Stay active.",warn:"If no labor by 41 weeks see doctor immediately."}};
export default function PregnancyScreen({navigation}){
  const [week,setWeek]=useState('');const [info,setInfo]=useState(null);
  const check=()=>{const w=parseInt(week);if(isNaN(w)||w<1||w>42){alert('Enter week 1-42');return;}const closest=Object.keys(WEEKS).map(Number).reduce((a,b)=>Math.abs(b-w)<Math.abs(a-w)?b:a);setInfo(WEEKS[closest]);};
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#F57C00','#E65100']} style={{paddingTop:56,paddingBottom:24,paddingHorizontal:20}}>
      <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginBottom:12}}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:24,fontWeight:'900',color:'#fff'}}>🤰 Pregnancy Care</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:4}}>Week-by-week guide</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:20}}>
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:20,marginBottom:16}}>
        <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>Enter pregnancy week (1-42)</Text>
        <View style={{flexDirection:'row',gap:10}}>
          <View style={{flex:1,backgroundColor:'#f5f5f5',borderRadius:14,paddingHorizontal:14,borderWidth:1,borderColor:'#ebebeb'}}>
            <TextInput style={{fontSize:16,color:'#1a1a1a',paddingVertical:14}} placeholder="Week number" value={week} onChangeText={setWeek} keyboardType="numeric" placeholderTextColor="#bbb"/>
          </View>
          <TouchableOpacity onPress={check} style={{backgroundColor:'#F57C00',paddingHorizontal:20,borderRadius:14,justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:'700'}}>Check</Text></TouchableOpacity>
        </View>
      </View>
      {info&&[{emoji:'👶',title:"Baby's Development",text:info.baby,color:'#E8F5E9'},{emoji:'🤰',title:"Your Body",text:info.mom,color:'#FFF3E0'},{emoji:'🥗',title:"Diet This Week",text:info.diet,color:'#E3F2FD'},{emoji:'⚠️',title:"Important",text:info.warn,color:'#FCE4EC'}].map(s=>(
        <View key={s.title} style={{backgroundColor:s.color,borderRadius:14,padding:16,marginBottom:12}}>
          <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a',marginBottom:6}}>{s.emoji} {s.title}</Text>
          <Text style={{fontSize:14,color:'#444',lineHeight:22}}>{s.text}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={()=>navigation.navigate('DoctorList',{specialty:'Gynecologist'})} style={{backgroundColor:'#F57C00',padding:16,borderRadius:14,alignItems:'center',marginTop:8,marginBottom:24}}>
        <Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>👩‍⚕️ Find Gynecologist</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>);}