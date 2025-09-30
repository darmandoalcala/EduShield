import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { API_BASE_URL, ApiService } from '../config/api';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validarCorreoUDG = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@alumnos\.udg\.mx$/;
    return regex.test(correo);
  };

  const manejarIngreso = async () => {
    if (!validarCorreoUDG(email)) {
      Alert.alert('Correo inválido', 'Debes usar un correo institucional (@alumnos.udg.mx)');
      return;
    }

    if (!password) {
      Alert.alert('Contraseña requerida', 'Por favor ingresa tu contraseña');
      return;
    }

    const credentials = {
      email: email.trim().toLowerCase(),
      password: password,
    };

    setIsLoading(true);

    try {
      const response = await ApiService.loginUser(credentials);

      if (response.success && response.data) {
        console.log('✅ Login exitoso:', response.data);

        // Pasamos userId por navigation params (sin AsyncStorage)
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainApp',
              params: { 
                user: response.data,
                userId: response.data.id
              }
            }
          ],
        });
      }
    } catch (error) {
      console.error('❌ Error en login:', error);

      let errorMessage = 'Hubo un problema al iniciar sesión. Intenta nuevamente.';

      if (error.message.includes('fetch') || error.message.includes('Network request failed')) {
        errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
      } else if (error.message.includes('Credenciales inválidas') || error.message.includes('credenciales')) {
        errorMessage = 'Email o contraseña incorrectos. Por favor verifica tus datos.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error de inicio de sesión', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'black' }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: 'white' }]}>EDUSHIELD</Text>
        <Image
          source={require('../../assets/edushield-high-resolution-logo-transparent (1).png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.welcome, { color: 'white' }]}>¡BIENVENIDO DE VUELTA!</Text>
        <Text style={[styles.subtext, { color: 'white' }]}>Inicia sesión con tu correo UDG</Text>
      </View>

      <TextInput
        style={[styles.input, {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border
        }]}
        placeholder="Correo institucional UDG"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />

      <TextInput
        style={[styles.input, {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border
        }]}
        placeholder="Contraseña"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, {
          backgroundColor: 'red',
          opacity: isLoading ? 0.6 : 1
        }]}
        onPress={manejarIngreso}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
            <Text style={[styles.buttonText, { color: 'white' }]}>Iniciando...</Text>
          </View>
        ) : (
          <Text style={[styles.buttonText, { color: 'white' }]}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => Alert.alert('Próximamente', 'Función en desarrollo')}
        disabled={isLoading}
      >
        <Text style={[styles.backText, { color: 'white' }]}>Olvidé mi contraseña</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 90,
    marginTop: -70, 
  },
  logo: {
    width: 100,
    height: 60,
    marginRight: -40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  textContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default LoginScreen;