import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/ThemeContext';
import { UserProvider } from './src/context/UserContext'; 
import { ConfigProvider } from './src/context/ConfigContext'; 
import { LocationProvider } from './src/context/LocationContext'; 
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-get-random-values';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ConfigProvider> 
          <LocationProvider> 
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </LocationProvider>
        </ConfigProvider>
      </UserProvider>
    </ThemeProvider>
  );
}