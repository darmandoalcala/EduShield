import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const EdushieldWelcome = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>EDUSHIELD</Text>
      
      <Text style={[styles.welcomeText, { color: colors.text }]}>Bienvenido, inicia sesión o registrate.</Text>
      
      <Pressable 
        style={[styles.mainButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={[styles.mainButtonText, { color: colors.buttonText || 'white' }]}>Continúa con correo institucional UDG</Text>
      </Pressable>
      
      <View style={styles.signInContainer}>
        <Text style={[styles.signInText, { color: colors.textSecondary }]}>¿Ya tienes una cuenta? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.signInLink, { color: colors.primary }]}>Sign In</Text>
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
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  mainButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    marginTop: 40,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  mainButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signInText: {},
  signInLink: {
    fontWeight: 'bold',
  },
});

export default EdushieldWelcome;