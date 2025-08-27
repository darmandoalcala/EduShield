import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const RegisterScreen2 = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedGender, setSelectedGender] = useState('');

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
        <Text style={[styles.welcome, { color: 'white' }]}>¡BIENVENIDO!</Text>
        <Text style={[styles.subtext, { color: 'white' }]}>
          Ingresa tu información para crear una cuenta
        </Text>
      </View>

      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderOption,
            selectedGender === 'Masculino' && styles.genderOptionSelected,
          ]}
          onPress={() => setSelectedGender('Masculino')}
        >
          <Text
            style={[
              styles.genderText,
              selectedGender === 'Masculino' && styles.genderTextSelected,
            ]}
          >
            Masculino
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderOption,
            selectedGender === 'Femenino' && styles.genderOptionSelected,
          ]}
          onPress={() => setSelectedGender('Femenino')}
        >
          <Text
            style={[
              styles.genderText,
              selectedGender === 'Femenino' && styles.genderTextSelected,
            ]}
          >
            Femenino
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Ingresa correo institucional UDG"
        placeholderTextColor={colors.textSecondary}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Ingresa una contraseña"
        placeholderTextColor={colors.textSecondary}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'red' }]}
        onPress={() => navigation.replace("MainApp")}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText || 'white' }]}>
          Regístrate
        </Text>
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  genderOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#666',
  },
  genderOptionSelected: {
    backgroundColor: '#444',
    borderColor: 'white',
  },
  genderText: {
    color: '#ccc',
    fontSize: 16,
  },
  genderTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 17,
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
});

export default RegisterScreen2;
