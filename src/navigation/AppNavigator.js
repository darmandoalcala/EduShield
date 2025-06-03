import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EdushieldWelcome from '../screens/EdushieldWelcome';
import LoginScreen from '../screens/LoginScreen';
//....
//AGREGAR TODAS LAS PANTALLAS DESPUÉS

import { useTheme } from '../theme/ThemeContext';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterScreen2 from '../screens/RegisterScreen2';
import Home1 from '../screens/Home1';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="EdushieldWelcome" 
        component={EdushieldWelcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          title: 'Inicio de Sesión',
          headerShown: 'Atras',
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          title: 'Registro de usuario',
          headerShown: 'Atras',
        }}
      />
      <Stack.Screen 
        name="Register2"
        component={RegisterScreen2}
        options={{ 
          title: 'Registro de usuario',
          headerShown: 'Atras',
        }}
      />
      <Stack.Screen 
        name="Home"
        component={Home1}
        options={{ 
          title: 'Home1',
          headerShown: 'Atras',
        }}
      />
       
      {/* Otras pantallas */}
    </Stack.Navigator>
  );
}