import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useUser } from '../context/UserContext';
import { API_BASE_URL, ApiService } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { loginUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validarCorreoUDG = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@alumnos\.udg\.mx$/;
    return regex.test(correo);
  };

  const validarFormulario = () => {
    let erroresNuevos = { email: '', password: '' };
    let esValido = true;

    // Validar email
    if (!email.trim()) {
      erroresNuevos.email = 'El correo es requerido';
      esValido = false;
    } else if (!validarCorreoUDG(email)) {
      erroresNuevos.email = 'Debes usar un correo institucional (@alumnos.udg.mx)';
      esValido = false;
    }

    // Validar contraseña
    if (!password) {
      erroresNuevos.password = 'La contraseña es requerida';
      esValido = false;
    } else if (password.length < 6) {
      erroresNuevos.password = 'La contraseña debe tener al menos 6 caracteres';
      esValido = false;
    }

    setErrors(erroresNuevos);
    return esValido;
  };

  const limpiarError = (campo) => {
    setErrors(prev => ({ ...prev, [campo]: '' }));
  };

  const manejarIngreso = async () => {
    if (!validarFormulario()) {
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

        // Agregar un id temporal si no viene del backend
        const userData = {
          ...response.data,
          id: response.data.id || response.data.codigo_estudiante
        };

        console.log('🔄 Llamando loginUser con:', userData); // 👈 NUEVO LOG

        try {
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          console.log('✅ Datos guardados en AsyncStorage:', userData);
        } catch (storageError) {
          console.error('❌ Error guardando en AsyncStorage:', storageError);
        }

        // Guardar usuario en el contexto global
        loginUser(userData);

        console.log('✅ loginUser ejecutado'); // 👈 NUEVO LOG

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainApp',
              params: { 
                user: userData,
                userId: userData.id
              }
            }
          ],
        });
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error response:', error.response);

      let errorMessage = 'Hubo un problema al iniciar sesión. Intenta nuevamente.';
      let errorTitle = 'Error de inicio de sesión';

      // Detectar tipo de error
      if (error.message.includes('JSON válido') || error.message.includes('JSON')) {
        errorTitle = 'Error del servidor';
        errorMessage = 'El servidor no respondió correctamente. Por favor intenta nuevamente o contacta al administrador.';
      } else if (error.message.includes('fetch') || error.message.includes('Network') || error.message.includes('network')) {
        errorTitle = 'Sin conexión';
        errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
      } else if (error.message.toLowerCase().includes('credenciales') || error.message.toLowerCase().includes('credentials') || error.message.includes('401')) {
        errorTitle = 'Credenciales incorrectas';
        errorMessage = 'El correo o la contraseña son incorrectos. Por favor verifica tus datos.';
        // Limpiar campos
        setPassword('');
        setErrors({ email: '', password: 'Email o contraseña incorrectos' });
      } else if (error.message.toLowerCase().includes('usuario no encontrado') || error.message.includes('404')) {
        errorTitle = 'Usuario no encontrado';
        errorMessage = 'No existe una cuenta con este correo. ¿Deseas registrarte?';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(errorTitle, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const manejarOlvidePassword = () => {
    Alert.alert('Próximamente', 'Función en desarrollo');
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

      {/* Input de Email */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: errors.email ? 'red' : colors.border
          }]}
          placeholder="Correo institucional UDG"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            limpiarError('email');
          }}
          editable={!isLoading}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}
      </View>

      {/* Input de Contraseña con icono para mostrar/ocultar */}
      <View style={styles.inputContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.inputPassword, {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: errors.password ? 'red' : colors.border
            }]}
            placeholder="Contraseña"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              limpiarError('password');
            }}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            <Image
              source={showPassword 
                ? require('../../assets/eye-off.png') 
                : require('../../assets/eye.png')
              }
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}
      </View>

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
        onPress={manejarOlvidePassword}
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
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  passwordContainer: {
    position: 'relative',
  },
  inputPassword: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconImage: {
    width: 22,
    height: 22,
    tintColor: '#999',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
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