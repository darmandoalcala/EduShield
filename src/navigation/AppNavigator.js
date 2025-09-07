import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, StyleSheet } from 'react-native';
import EdushieldWelcome from '../screens/EdushieldWelcome';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterScreen2 from '../screens/RegisterScreen2';
import Home1 from '../screens/Home1';
import AlertScreen from '../screens/AlertScreen';
import ReportScreen from '../screens/ReportScreen';
import ContactsScreen from '../screens/ContactsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from '../theme/ThemeContext';
import PersonalContact from '../screens/PersonalContact';
import EditProfile from '../screens/EditProfile';
import PrivacyScreen from '../screens/PrivacyScreen';
import LocationScreen from '../screens/LocationScreen';
import CentroUniversitarioScreen from '../screens/CentroUniversitarioScreen';
import ayudaYguiaScreen from '../screens/ayudaYguiaScreen';
import EliminarCuentaScreen from '../screens/EliminarCuentaScreen';
import SeleccionarReporteScreen from '../screens/SeleccionarReporteScreen';
import DetalleReporteScreen from '../screens/DetalleReporteScreen';
import MisReporteScreen from '../screens/MisReporteScreen';
import DetalleMisReporteScreen from '../screens/DetalleMisReporteScreen';
import ChatbotScreen from '../screens/ChatbotScreen';




const Tab = createBottomTabNavigator();     //navigator tab (para home, contacts & settings)
const Stack = createNativeStackNavigator(); //navigator Stack

//NAVEGADORES PARA PANTALLAS NUEVAS DENTRO DE PANTALLAS INICIALES
const HomeStack = createNativeStackNavigator(); //navigator Stack para Home1
const ContactsStack = createNativeStackNavigator(); //navigator Stack para ContactsScreen
const SettingsStack = createNativeStackNavigator(); //navigator Stack para SettingsScreen

//COMPONENTE PARA STACK DENTRO DE INICIO
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home1" component={Home1} />
      <HomeStack.Screen name="Alert" component={AlertScreen} />
      <HomeStack.Screen name="Report" component={ReportScreen} />
    </HomeStack.Navigator>
  );
}
//COMPONENTE PARA STACK DENTRO DE CONTACTOS
function ContactsStackScreen() {
  return (
    <ContactsStack.Navigator screenOptions={{headerShown: false }}>
      <ContactsStack.Screen name="Contacts" component={ContactsScreen} />
      <ContactsStack.Screen name="Personal" component={PersonalContact} />
    </ContactsStack.Navigator>
  );
}
//COMPONENTE PARA STACK DENTRO DE CONFIGURACIÓN
function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="EditP" component={EditProfile} />
      <SettingsStack.Screen name="Privacy" component={PrivacyScreen} /> 
      <SettingsStack.Screen name="Location" component={LocationScreen} />
      <SettingsStack.Screen name="CentroU" component={CentroUniversitarioScreen} /> 
      <SettingsStack.Screen name="AyudaGuia" component={ayudaYguiaScreen} /> 
      <SettingsStack.Screen name="EliminarCuenta" component={EliminarCuentaScreen} />
      <SettingsStack.Screen name="SeleccionarReporte" component={SeleccionarReporteScreen} />
      <SettingsStack.Screen name="DetalleReporte" component={DetalleReporteScreen} />
      <SettingsStack.Screen name="MisReportes" component={MisReporteScreen} />
      <SettingsStack.Screen name="DetalleMisReporte" component={DetalleMisReporteScreen} />

    </SettingsStack.Navigator>
  );
}

//COMPONENTE PARA NAVEGADOR INFERIOR DE HOME, CONTACTS Y SETTINGS
function MainAppTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarButton, 
        tabBarActiveTintColor: 'white', 
        tabBarInactiveTintColor: 'gray', 
        
        // Configuración del header (no necesario si ya lo ocultas)
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        
        // Estilo del contenido de la pantalla
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/home.png')}
              style={[styles.tabBarImage, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Contactos" 
        component={ContactsStackScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/people.png')}
              style={[styles.tabBarImage, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Configuración" 
        component={SettingsStackScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../../assets/settings.png')}
              style={[styles.tabBarImage, { tintColor: color }]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

//COMPONENTE DE NAVEGADOR PRINCIPAL
export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Aqui ocultamos el header de todas las pantallas.
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="EdushieldWelcome" component={EdushieldWelcome} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Register2" component={RegisterScreen2} />
      <Stack.Screen name="Home" component={Home1} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />

      {/* mas pantallas... */}

      {/* Pantallas CON tab bar (agrupadas en MainAppTabs) */}
      <Stack.Screen name="MainApp" component={MainAppTabs} />

    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,  
    paddingTop: 15,         
    paddingBottom: 25,      
    backgroundColor: '#333333',
    height: 80,             
    borderTopWidth: 0,      
    elevation: 0            
  },
  tabBarButton: {
    flex: 1,                
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',         
    paddingVertical: 5
  },
  tabBarImage: {
    width: 30, 
    height: 30,
    tintColor: 'gray', 
  },
});