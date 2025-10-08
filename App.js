import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/ThemeContext';
import { UserProvider } from './src/context/UserContext'; 
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider> 
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </UserProvider> 
    </ThemeProvider>
  );
}