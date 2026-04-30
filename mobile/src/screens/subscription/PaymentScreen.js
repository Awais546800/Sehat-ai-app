import React,{useState} from 'react';
import {View,Text,TouchableOpacity,ScrollView,TextInput,Alert,ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import api from '../../utils/api';
const METHODS=[{id:'easypaisa',emoji:'📱',name:'EasyPaisa',sub:'Most popular in Pakistan',color:'#00A651'},{id:'jazzcash',emoji:'💛',name:'JazzCash',sub:'Fast mobile payment',color:'#EE1C25'},{id:'stripe',emoji:'💳',name:'Credit/Debit Card',sub:'Visa, MasterCard, Amex',color:'#635BFF'},{id:'bank',emoji:'🏦',name:'Bank Transfer',sub:'HBL, MCB, Meezan, UBL',color:'#1976D2'},{id:'crypto',emoji:'₿',name:'Cryptocurrency',sub:'BTC, ETH, USDT',color:'#F7931A'}];
export default function PaymentScreen({navigation,route}){
  const {plan,planData}=route.params||{};
  const [method,setMethod]=useState('easypaisa');const [coupon,setCoupon]=useState('');const [couponValid,setCouponValid]=useState(null);const [loading,setL]=useState(false);const [instructions,setInstructions]=useState(null);
  const validateCoupon=async()=>{
    if(!coupon.trim())return;
    try{const r=await api.post('/subscriptions/validate-coupon',{code:coupon,plan});setCouponValid(r.data);Alert.alert('Valid!',r.data.discount+'% discount applied');}
    catch(){Alert.alert('Invalid','Coupon code not valid');}
  };
  const initPayment=async()=>{
    setL(true);
    try{
      const r=await api.post('/subscriptions/initiate',{plan,method,currency:'PKR',couponCode:couponValid?coupon:undefined});
      setInstructions(r.data);
    }catch(err){Alert.alert('Error',err.response?.data?.message||'Payment initiation failed');}
    finally{setL(false);}
  };
  if(instructions)return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>setInstructions(null)}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>Payment Instructions</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:20,marginBottom:16,borderWidth:2,borderColor:'#00897B'}}>
        <Text style={{fontSize:16,fontWeight:'900',color:'#00897B',marginBottom:4}}>✅ {instructions.instructions?.method}</Text>
        <Text style={{fontSize:24,fontWeight:'900',color:'#1a1a1a'}}>PKR {instructions.amount?.toLocaleString()}</Text>
        {instructions.discount>0&&<Text style={{fontSize:13,color:'#4CAF50',marginTop:2}}>🎉 {instructions.discount}% discount applied!</Text>}
        <Text style={{fontSize:12,color:'#888',marginTop:4}}>Reference: {instructions.invoiceNumber}</Text>
      </View>
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:16}}>
        <Text style={{fontSize:15,fontWeight:'700',color:'#333',marginBottom:12}}>Follow these steps:</Text>
        {instructions.instructions?.steps?.map((s,i)=><Text key={i} style={{fontSize:14,color:'#555',lineHeight:24,marginBottom:4}}>{s}</Text>)}
      </View>
      <View style={{backgroundColor:'#FFF8E1',borderRadius:14,padding:14,marginBottom:16}}>
        <Text style={{fontSize:13,color:'#E65100',lineHeight:20}}>⏰ After payment, your account will be activated within 2 hours.

Save your transaction screenshot for reference.</Text>
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('MainTabs')} style={{borderRadius:14,overflow:'hidden',marginBottom:12}}>
        <LinearGradient colors={['#00897B','#00695C']} style={{padding:18,alignItems:'center'}}><Text style={{color:'#fff',fontSize:16,fontWeight:'700'}}>🏠 Back to Home</Text></LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>Alert.alert('Support','Email: support@sehatai.pk
WhatsApp: +92-XXX-XXXXXXX')} style={{backgroundColor:'#f5f5f5',padding:16,borderRadius:14,alignItems:'center'}}>
        <Text style={{color:'#555',fontWeight:'600'}}>Need help? Contact Support</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>);
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#0a0a1a','#1a1a2e']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <View><Text style={{fontSize:18,fontWeight:'800',color:'#fff'}}>Choose Payment Method</Text><Text style={{color:'rgba(255,255,255,0.7)',fontSize:13}}>{planData?.name} — PKR {planData?.pricePKR?.toLocaleString()}</Text></View>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      {METHODS.map(m=>(
        <TouchableOpacity key={m.id} onPress={()=>setMethod(m.id)} style={{flexDirection:'row',alignItems:'center',backgroundColor:method===m.id?'#1a1a2e':'#fff',padding:16,borderRadius:14,marginBottom:10,gap:14,borderWidth:2,borderColor:method===m.id?'#FFD700':'#f0f0f0'}}>
          <View style={{width:48,height:48,borderRadius:24,backgroundColor:m.color+'22',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:24}}>{m.emoji}</Text></View>
          <View style={{flex:1}}><Text style={{fontSize:15,fontWeight:'700',color:method===m.id?'#FFD700':'#1a1a1a'}}>{m.name}</Text><Text style={{fontSize:12,color:'#888',marginTop:2}}>{m.sub}</Text></View>
          {method===m.id&&<Ionicons name="checkmark-circle" size={24} color="#FFD700"/>}
        </TouchableOpacity>
      ))}
      <View style={{backgroundColor:'#fff',borderRadius:14,padding:16,marginTop:8,marginBottom:16}}>
        <Text style={{fontSize:14,fontWeight:'600',color:'#555',marginBottom:10}}>🎟️ Coupon Code (Optional)</Text>
        <View style={{flexDirection:'row',gap:10}}>
          <View style={{flex:1,backgroundColor:'#f5f5f5',borderRadius:12,paddingHorizontal:14,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:14,color:'#1a1a1a',paddingVertical:12}} placeholder="Enter coupon code" value={coupon} onChangeText={v=>setCoupon(v.toUpperCase())} autoCapitalize="characters" placeholderTextColor="#bbb"/></View>
          <TouchableOpacity onPress={validateCoupon} style={{backgroundColor:'#00897B',paddingHorizontal:14,borderRadius:12,justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:'700',fontSize:13}}>Apply</Text></TouchableOpacity>
        </View>
        {couponValid&&<Text style={{color:'#4CAF50',fontSize:13,marginTop:8,fontWeight:'600'}}>✅ {couponValid.discount}% discount applied! Try: SEHATLAUNCH</Text>}
        <Text style={{color:'#aaa',fontSize:12,marginTop:6}}>Try: SEHATLAUNCH (30% off) • STUDENT20 (20% off)</Text>
      </View>
      <TouchableOpacity onPress={initPayment} disabled={loading} style={{borderRadius:16,overflow:'hidden',marginBottom:12}}>
        <LinearGradient colors={['#FFD700','#FFA500']} style={{padding:20,alignItems:'center'}}>
          {loading?<ActivityIndicator color="#1a1a1a"/>:<Text style={{fontSize:17,fontWeight:'900',color:'#1a1a1a'}}>💎 Proceed to Payment</Text>}
        </LinearGradient>
      </TouchableOpacity>
      <Text style={{color:'#888',fontSize:12,textAlign:'center',marginBottom:30}}>🔒 Secure payment. Cancel anytime.</Text>
    </ScrollView>
  </View>);}