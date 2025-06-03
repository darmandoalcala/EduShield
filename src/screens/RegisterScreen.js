import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();

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
        <Text style={[styles.welcome, { color: 'white' }]}>¡BIENVENIDO!</Text>
        <Text style={[styles.subtext, { color: 'white' }]}>Ingresa tu informacion para crear una cuenta</Text>
      </View>

      <TextInput
        style={[styles.input, {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border
        }]}
        placeholder="Ingresa tu nombre completo"
        placeholderTextColor={colors.textSecondary}
      />

      <TextInput
        style={[styles.input, {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border
        }]}
        placeholder="Ingresa tu carrera"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
      />

       <TextInput
        style={[styles.input, {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border
        }]}
        placeholder="Ingresa tu centro universitario"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'red' }]}
        onPress={() => navigation.navigate('Register2')}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText || 'white' }]}>Continuar</Text>
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
    fontSize: 38,
    fontWeight: 'bold',
  },
textContainer: {
  marginBottom: 30,
  alignItems: 'center',
},
welcome: {
  fontSize: 22,
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

export default RegisterScreen;