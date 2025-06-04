import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EdushieldWelcome from '../screens/EdushieldWelcome';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterScreen2 from '../screens/RegisterScreen2';
import Home1 from '../screens/Home1';
import AlertScreen from '../screens/AlertScreen';
import ReportScreen from '../screens/ReportScreen';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator();

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
      {/* Otras pantallas */}
    </Stack.Navigator>
  );
}
