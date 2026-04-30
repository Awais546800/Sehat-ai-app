import React,{useState,useRef} from 'react';
import {View,Text,TouchableOpacity,FlatList,Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import useStore from '../../store/useStore';
const {width}=Dimensions.get('window');
const SLIDES=[
  {id:'1',emoji:'🤒',title:'AI Diagnosis',desc:'Describe symptoms in Urdu or English. Get instant diagnosis powered by Gemini, GPT, DeepSeek & more.',color:'#00897B'},
  {id:'2',emoji:'👨‍⚕️',title:'Real Doctors',desc:'Find verified Pakistani doctors. Book appointments from Marham & Oladoc instantly.',color:'#1976D2'},
  {id:'3',emoji:'💊',title:'Medicine Info',desc:'Scan any medicine with your camera. Get complete information including Pakistani brands.',color:'#E53935'},
  {id:'4',emoji:'💎',title:'Premium Features',desc:'Free plan: 10 messages/day. Premium: Unlimited access for PKR 1400/month or PKR 8000/year.',color:'#7B1FA2'},
];
export default function OnboardingScreen({navigation}){
  const {setOnboarded}=useStore();
  const [idx,setIdx]=useState(0);const ref=useRef(null);
  const next=()=>{if(idx<SLIDES.length-1){ref.current?.scrollToIndex({index:idx+1});setIdx(idx+1);}else done();};
  const done=async()=>{await setOnboarded();navigation.replace('Login');};
  return(<View style={{flex:1,backgroundColor:'#fff'}}>
    <FlatList ref={ref} data={SLIDES} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={e=>setIdx(Math.round(e.nativeEvent.contentOffset.x/width))}
      renderItem={({item:s})=>(<LinearGradient colors={[s.color,s.color+'99','#fff']} style={{width,flex:1,alignItems:'center',justifyContent:'center',padding:40}}>
        <Text style={{fontSize:100,marginBottom:24}}>{s.emoji}</Text>
        <Text style={{fontSize:28,fontWeight:'900',color:'#fff',textAlign:'center',marginBottom:16}}>{s.title}</Text>
        <Text style={{fontSize:16,color:'rgba(255,255,255,0.9)',textAlign:'center',lineHeight:26}}>{s.desc}</Text>
      </LinearGradient>)} keyExtractor={i=>i.id}/>
    <View style={{flexDirection:'row',justifyContent:'center',gap:8,paddingVertical:20}}>
      {SLIDES.map((_,i)=><View key={i} style={{width:i===idx?24:8,height:8,borderRadius:4,backgroundColor:i===idx?'#00897B':'#ddd'}}/>)}
    </View>
    <View style={{flexDirection:'row',paddingHorizontal:24,paddingBottom:44,gap:12}}>
      <TouchableOpacity onPress={done} style={{flex:1,padding:18,alignItems:'center',borderRadius:14,borderWidth:1.5,borderColor:'#ebebeb'}}>
        <Text style={{color:'#888',fontWeight:'600',fontSize:15}}>Skip</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={next} style={{flex:2,borderRadius:14,overflow:'hidden'}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}>
          <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>{idx===SLIDES.length-1?'Get Started →':'Next →'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>);}