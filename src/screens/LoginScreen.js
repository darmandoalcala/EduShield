import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Iniciar Sesión</Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.card, 
          color: colors.text,
          borderColor: colors.border
        }]}
        placeholder="Correo institucional UDG"
        placeholderTextColor={colors.textSecondary}
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
      />
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Home')} // Cambia 'Home' por tu pantalla principal
      >
        <Text style={[styles.buttonText, { color: colors.buttonText || 'white' }]}>Ingresar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, { color: colors.primary }]}>Regresar</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
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