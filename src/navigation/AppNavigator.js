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

const Tab = createBottomTabNavigator();     //navigator tab (para home, contacts & settings)
const Stack = createNativeStackNavigator(); //navigator Stack

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
        component={Home1}
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
        component={ContactsScreen}
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
        component={SettingsScreen}
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
      <Stack.Screen name="Alert" component={AlertScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="Personal" component={PersonalContact} />
      <Stack.Screen name="EditP" component={EditProfile} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} /> 
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="CentroU" component={CentroUniversitarioScreen} /> 
      <Stack.Screen name="AyudaGuia" component={ayudaYguiaScreen} /> 
      <Stack.Screen name="EliminarCuenta" component={EliminarCuentaScreen} /> 

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