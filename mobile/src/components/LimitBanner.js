import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/**
 * LimitBanner — shown when user hits daily free tier limits
 * Shows cooldown time and upgrade CTA
 */
export default function LimitBanner({ message, resetIn, onUpgrade, onDismiss }) {
  return (
    <View style={s.overlay}>
      <LinearGradient colors={['#1a1a2e','#16213e','#0f3460']} style={s.card}>
        <View style={s.iconRow}>
          <Text style={s.lockEmoji}>⏳</Text>
          <Text style={s.title}>Daily Limit Reached</Text>
        </View>

        <Text style={s.message}>{message}</Text>

        {resetIn && (
          <View style={s.timerBox}>
            <Ionicons name="time-outline" size={16} color="#64B5F6" />
            <Text style={s.timerText}>
              Resets in {resetIn.hours}h {resetIn.minutes}m
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={onUpgrade} style={s.upgradeBtn}>
          <LinearGradient colors={['#FFD700','#FFA500']} style={s.upgradeBtnGrad}>
            <Text style={s.upgradeBtnText}>💎 Upgrade to Premium</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={s.freeTierInfo}>
          <Text style={s.freeTierTitle}>Free Tier Limits (per day)</Text>
          {[['💬','AI Messages','10'],['📷','Image Scans','2'],['💊','Medicine Searches','5'],['🤒','Consultations','3']].map(([e,l,v]) => (
            <View key={l} style={s.freeRow}>
              <Text style={s.freeEmoji}>{e}</Text>
              <Text style={s.freeLabel}>{l}</Text>
              <Text style={s.freeVal}>{v}/day</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={onDismiss} style={s.dismissBtn}>
          <Text style={s.dismissText}>Continue with Free Plan</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: { position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.85)', justifyContent:'center', alignItems:'center', zIndex:999, padding:20 },
  card: { width:'100%', borderRadius:24, padding:24, maxWidth:380 },
  iconRow: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:16 },
  lockEmoji: { fontSize:32 },
  title: { fontSize:20, fontWeight:'900', color:'#fff', flex:1 },
  message: { fontSize:14, color:'#B0BEC5', lineHeight:22, marginBottom:16 },
  timerBox: { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:'rgba(100,181,246,0.15)', padding:12, borderRadius:12, marginBottom:20 },
  timerText: { color:'#64B5F6', fontSize:14, fontWeight:'600' },
  upgradeBtn: { borderRadius:14, overflow:'hidden', marginBottom:20 },
  upgradeBtnGrad: { padding:16, alignItems:'center' },
  upgradeBtnText: { fontSize:17, fontWeight:'900', color:'#1a1a1a' },
  freeTierInfo: { backgroundColor:'rgba(255,255,255,0.05)', borderRadius:14, padding:14, marginBottom:16 },
  freeTierTitle: { fontSize:12, color:'#888', letterSpacing:2, marginBottom:10, textAlign:'center' },
  freeRow: { flexDirection:'row', alignItems:'center', paddingVertical:6, borderBottomWidth:1, borderColor:'rgba(255,255,255,0.05)' },
  freeEmoji: { fontSize:16, width:28 },
  freeLabel: { flex:1, fontSize:13, color:'#ccc' },
  freeVal: { fontSize:13, color:'#FFD700', fontWeight:'700' },
  dismissBtn: { alignItems:'center', padding:12 },
  dismissText: { color:'#666', fontSize:13 },
});
