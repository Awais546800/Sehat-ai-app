import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import useStore from './src/store/useStore';

// Auth Screens
import SplashScreen         from './src/screens/auth/SplashScreen';
import LanguageSelectScreen from './src/screens/auth/LanguageSelectScreen';
import OnboardingScreen     from './src/screens/auth/OnboardingScreen';
import LoginScreen          from './src/screens/auth/LoginScreen';
import RegisterScreen       from './src/screens/auth/RegisterScreen';
import OTPScreen            from './src/screens/auth/OTPScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen  from './src/screens/auth/ResetPasswordScreen';
import HealthProfileScreen  from './src/screens/auth/HealthProfileScreen';

// Main Screens
import HomeScreen          from './src/screens/main/HomeScreen';
import ProfileScreen       from './src/screens/main/ProfileScreen';
import NotificationsScreen from './src/screens/main/NotificationsScreen';
import EmergencyScreen     from './src/screens/main/EmergencyScreen';
import SettingsScreen      from './src/screens/main/SettingsScreen';
import PrivacyScreen       from './src/screens/main/PrivacyScreen';

// Consultation
import NewConsultationScreen     from './src/screens/consultation/NewConsultationScreen';
import ChatScreen                from './src/screens/consultation/ChatScreen';
import DiagnosisResultScreen     from './src/screens/consultation/DiagnosisResultScreen';
import ConsultationHistoryScreen from './src/screens/consultation/ConsultationHistoryScreen';

// Doctor & Appointment
import FindDoctorScreen      from './src/screens/doctor/FindDoctorScreen';
import DoctorListScreen      from './src/screens/doctor/DoctorListScreen';
import DoctorProfileScreen   from './src/screens/doctor/DoctorProfileScreen';
import AppointmentFormScreen  from './src/screens/appointment/AppointmentFormScreen';
import BookingConfirmedScreen from './src/screens/appointment/BookingConfirmedScreen';
import MyAppointmentsScreen   from './src/screens/appointment/MyAppointmentsScreen';

// Medicine
import MedicineHomeScreen   from './src/screens/medicine/MedicineHomeScreen';
import MedicineScanScreen   from './src/screens/medicine/MedicineScanScreen';
import MedicineSearchScreen from './src/screens/medicine/MedicineSearchScreen';
import MedicineDetailScreen from './src/screens/medicine/MedicineDetailScreen';

// Modules
import PregnancyScreen    from './src/screens/modules/PregnancyScreen';
import ElderlyScreen      from './src/screens/modules/ElderlyScreen';
import MentalHealthScreen from './src/screens/modules/MentalHealthScreen';

// Records
import HealthRecordsScreen from './src/screens/records/HealthRecordsScreen';

// Subscription
import SubscriptionScreen from './src/screens/subscription/SubscriptionScreen';
import PaymentScreen      from './src/screens/subscription/PaymentScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#f0f0f0', height: 62, paddingBottom: 8 },
      tabBarActiveTintColor: '#00897B',
      tabBarInactiveTintColor: '#9e9e9e',
      tabBarIcon: ({ focused, color }) => {
        const icons = {
          Home:     focused ? 'home'    : 'home-outline',
          Consult:  focused ? 'medical' : 'medical-outline',
          Doctors:  focused ? 'people'  : 'people-outline',
          Medicine: focused ? 'medkit'  : 'medkit-outline',
          More:     focused ? 'menu'    : 'menu-outline',
        };
        return <Ionicons name={icons[route.name] || 'circle'} size={24} color={color} />;
      },
    })}>
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="Consult"  component={NewConsultationScreen} />
      <Tab.Screen name="Doctors"  component={FindDoctorScreen} />
      <Tab.Screen name="Medicine" component={MedicineHomeScreen} />
      <Tab.Screen name="More"     component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function Loading() {
  return (
    <View style={s.loading}>
      <Text style={s.loadingLogo}>☪️</Text>
      <Text style={s.loadingName}>Sehat AI</Text>
      <ActivityIndicator color="#00897B" style={{ marginTop: 20 }} size="large" />
      <Text style={s.loadingTag}>Pakistan Ka AI Doctor</Text>
    </View>
  );
}

export default function App() {
  const { isLoading, isLoggedIn, isOnboarded, initApp, language } = useStore();

  useEffect(() => { initApp(); }, []);
  useEffect(() => { i18n.changeLanguage(language); }, [language]);

  if (isLoading) return <Loading />;

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false, animationEnabled: true }}>

              {!isOnboarded ? (
                <>
                  <Stack.Screen name="Splash"          component={SplashScreen} />
                  <Stack.Screen name="LanguageSelect"  component={LanguageSelectScreen} />
                  <Stack.Screen name="Onboarding"      component={OnboardingScreen} />
                </>
              ) : !isLoggedIn ? (
                <>
                  <Stack.Screen name="Login"           component={LoginScreen} />
                  <Stack.Screen name="Register"        component={RegisterScreen} />
                  <Stack.Screen name="OTP"             component={OTPScreen} />
                  <Stack.Screen name="ForgotPassword"  component={ForgotPasswordScreen} />
                  <Stack.Screen name="ResetPassword"   component={ResetPasswordScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="MainTabs"          component={MainTabs} />
                  <Stack.Screen name="HealthProfile"     component={HealthProfileScreen} />
                  <Stack.Screen name="Chat"              component={ChatScreen} />
                  <Stack.Screen name="DiagnosisResult"   component={DiagnosisResultScreen} />
                  <Stack.Screen name="ConsultHistory"    component={ConsultationHistoryScreen} />
                  <Stack.Screen name="DoctorList"        component={DoctorListScreen} />
                  <Stack.Screen name="DoctorProfile"     component={DoctorProfileScreen} />
                  <Stack.Screen name="AppointmentForm"   component={AppointmentFormScreen} />
                  <Stack.Screen name="BookingConfirmed"  component={BookingConfirmedScreen} />
                  <Stack.Screen name="MyAppointments"    component={MyAppointmentsScreen} />
                  <Stack.Screen name="MedicineScan"      component={MedicineScanScreen} />
                  <Stack.Screen name="MedicineSearch"    component={MedicineSearchScreen} />
                  <Stack.Screen name="MedicineDetail"    component={MedicineDetailScreen} />
                  <Stack.Screen name="Pregnancy"         component={PregnancyScreen} />
                  <Stack.Screen name="Elderly"           component={ElderlyScreen} />
                  <Stack.Screen name="MentalHealth"      component={MentalHealthScreen} />
                  <Stack.Screen name="HealthRecords"     component={HealthRecordsScreen} />
                  <Stack.Screen name="Subscription"      component={SubscriptionScreen} />
                  <Stack.Screen name="Payment"           component={PaymentScreen} />
                  <Stack.Screen name="Profile"           component={ProfileScreen} />
                  <Stack.Screen name="Notifications"     component={NotificationsScreen} />
                  <Stack.Screen name="Emergency"         component={EmergencyScreen} />
                  <Stack.Screen name="Privacy"           component={PrivacyScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}

const s = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  loadingLogo: { fontSize: 72 },
  loadingName: { fontSize: 32, fontWeight: '900', color: '#00897B', marginTop: 12, letterSpacing: 4 },
  loadingTag: { fontSize: 14, color: '#aaa', marginTop: 8, letterSpacing: 2 },
});
