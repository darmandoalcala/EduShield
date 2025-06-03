import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const Home1 = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  const handleSOSPress = () => {
    console.log('SOS activado');
  };

  const handleReportPress = () => {
    console.log('Incidente reportado');
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.instructionText}>
          Toca el botón de SOS para alertar a otros usuarios.
        </Text>

        <Pressable onPress={() => navigation.navigate('Alert')} style={styles.sosButton}>
          <Image
            source={require('../../assets/alert.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>

        <View style={{ height: 30 }} />
        <Text style={styles.separator}>ó</Text>

        <Pressable onPress={() => navigation.navigate('Report')} style={styles.reportButton}>
          <Text style={styles.reportButtonText}>Reportar un incidente</Text>
        </Pressable>

        <Text style={styles.noteText}>
          Nota, una vez que se toque o se reporte, se enviará de inmediato una llamada de alerta y un SMS a los contactos cercanos y de emergencia. Puedes cancelarlo si la situación se resuelve.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'black', // Fondo negro respetado
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Espacio para el menú inferior
    alignItems: 'center',
  },
  instructionText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 300,
    height: 200,
  },
  sosButton: {
    padding: 10,
    borderRadius: 10,
  },
  separator: {
    color: '#aaa',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  reportButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noteText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default Home1;



