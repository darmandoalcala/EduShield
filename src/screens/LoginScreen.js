import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validarCorreoUDG = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@alumnos\.udg\.mx$/;       //Expresion regular para "@alumnos.udg.mx"
    return regex.test(correo);
  };

  const manejarIngreso = () => {
    if (!validarCorreoUDG(email)) {
      Alert.alert('Correo inválido', 'Debes usar un correo institucional (@alumnos.udg.mx)');
      return;
    }

    if (!password) {
      Alert.alert('Contraseña requerida', 'Por favor ingresa tu contraseña');
      return;
    }

    // Si pasa validación, navega a MainApp
    navigation.replace("MainApp");
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
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'red' }]}
        onPress={manejarIngreso}                              //VALIDA INICIO DE SESION
      >
        <Text style={[styles.buttonText, { color: colors.buttonText || 'white' }]}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
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
