import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

// URL del backend en Codespaces
const API_BASE_URL = 'https://symmetrical-acorn-45pj6px5rr9hqvwv-3001.app.github.dev';

const ApiService = {
  async loginUser(credentials) {
    try {
      console.log('🚀 Enviando credenciales de login:', { email: credentials.email });

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('📥 Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      return data;
    } catch (error) {
      console.error('❌ Error en loginUser:', error);
      throw error;
    }
  }
};

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

    // Preparar credenciales
    const credentials = {
      email: email.trim().toLowerCase(),
      password: password,
    };

    setIsLoading(true);

    try {
      const response = await ApiService.loginUser(credentials);

      if (response.success) {
        console.log('✅ Login exitoso:', response.data);

        // Si pasa validación del backend, navega a MainApp
        navigation.replace("MainApp", {
          user: response.data
        });
      }
    } catch (error) {
      console.error('❌ Error en login:', error);

      let errorMessage = 'Hubo un problema al iniciar sesión. Intenta nuevamente.';

      if (error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
      } else if (error.message.includes('Credenciales inválidas')) {
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

      <View style={[styles.textContainer]}>
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
            <Text style={[styles.buttonText, { color: colors.buttonText || 'white' }]}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        disabled={isLoading}
      >
        <Text style={[styles.backText, { color: 'white' }]}>Olvide mi contraseña</Text>
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
