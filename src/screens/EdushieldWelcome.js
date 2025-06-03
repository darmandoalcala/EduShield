import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const EdushieldWelcome = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: 'black' }]}>

      <Image
        source={require('../../assets/edushield-high-resolution-logo-transparent (1).png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title]}>EDUSHIELD</Text>
      
      <Text style={[styles.welcomeText]}>Bienvenido, inicia sesión o registrate.</Text>
      
      <Pressable 
        style={[styles.mainButton]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={[styles.mainButtonText, { color: colors.buttonText || 'white' }]}>Continúa con correo institucional UDG</Text>
      </Pressable>
      
      <View style={styles.signInContainer}>
        <Text style={[styles.signInText]}>¿Ya tienes una cuenta? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.signInLink]}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
};

// Estilos base (sin colores)
const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'white',
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
    color: 'white',
  },
  mainButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    marginTop: 40,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'red',

  },
  mainButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 20,
    color: 'white',
  },
  signInText: {
    color: 'white',
  },
  signInLink: {
    fontWeight: 'bold',
    color: 'red',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
});

export default EdushieldWelcome;