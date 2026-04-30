import React,{useState} from 'react';
import {View,Text,TouchableOpacity,ScrollView,TextInput} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
const SPECS=['General Physician','Gynecologist','Cardiologist','Dermatologist','Orthopedic','Pediatrician','Psychiatrist','ENT Specialist','Neurologist','Endocrinologist'];
const CITIES=['Lahore','Karachi','Islamabad','Rawalpindi','Faisalabad','Multan'];
export default function FindDoctorScreen({navigation}){
  const [city,setCity]=useState('Lahore');const [q,setQ]=useState('');
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20}}>
      <Text style={{fontSize:24,fontWeight:'900',color:'#fff',marginBottom:12}}>👨‍⚕️ Find a Doctor</Text>
      <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:14,paddingHorizontal:14}}>
        <Ionicons name="search-outline" size={18} color="#888" style={{marginRight:8}}/>
        <TextInput style={{flex:1,fontSize:14,color:'#1a1a1a',paddingVertical:12}} placeholder="Search specialty or name..." value={q} onChangeText={setQ} placeholderTextColor="#aaa"/>
      </View>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>Select City</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>
        {CITIES.map(c=><TouchableOpacity key={c} onPress={()=>setCity(c)} style={{paddingHorizontal:16,paddingVertical:8,borderRadius:20,backgroundColor:city===c?'#00897B':'#f5f5f5',marginRight:8}}>
          <Text style={{fontSize:13,color:city===c?'#fff':'#555',fontWeight:'600'}}>{c}</Text>
        </TouchableOpacity>)}
      </ScrollView>
      <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>Browse by Specialty</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:20}}>
        {SPECS.filter(sp=>!q||sp.toLowerCase().includes(q.toLowerCase())).map(sp=>(
          <TouchableOpacity key={sp} onPress={()=>navigation.navigate('DoctorList',{specialty:sp,city})} style={{width:'30%',backgroundColor:'#fff',borderRadius:14,padding:14,alignItems:'center',borderWidth:1,borderColor:'#f0f0f0'}}>
            <Text style={{fontSize:28,marginBottom:6}}>🩺</Text>
            <Text style={{fontSize:11,color:'#444',textAlign:'center',fontWeight:'600'}}>{sp}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('DoctorList',{city})} style={{backgroundColor:'#e8f5e9',padding:16,borderRadius:14,alignItems:'center',marginBottom:20}}>
        <Text style={{color:'#00897B',fontWeight:'700',fontSize:15}}>View All Doctors in {city} →</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>);}