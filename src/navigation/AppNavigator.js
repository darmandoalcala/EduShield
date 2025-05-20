import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EdushieldWelcome from '../screens/EdushieldWelcome';
import LoginScreen from '../screens/LoginScreen';
//....
//AGREGAR TODAS LAS PANTALLAS DESPUÉS

import { useTheme } from '../theme/ThemeContext';

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
      {/* Otras pantallas */}
    </Stack.Navigator>
  );
}