import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ReportScreen = () => {
  const handleProfilePress = () => {
    console.log('Botón de perfil presionado');
    // Aquí podrías navegar a la pantalla de perfil, p. ej.:
    // navigation.navigate('Profile');
  };

  const handleButtonPress = (buttonName) => {
    console.log(`Botón ${buttonName} presionado`);
    // Aquí puedes agregar la lógica para cada botón de la barra inferior
  };

  return (
    <View style={styles.container}>
      {/* ----------------------- */}
      {/* Barra de Título / Header */}
      <View style={styles.header}>
        <Text style={styles.title}>EDUSHIELD</Text>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}
        >
          <Image
            source={require('/workspaces/EduShield/assets/icon.png')} // Ajusta la ruta a tu ícono
            style={styles.profileIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* ----------------------- */}
      {/* Contenido principal (mensaje) */}
      <View style={styles.content}>
        <Text style={styles.mensaje}>
          Hasta aquí llegaron, perras{'\n'}
          Saquen la lavada alv y unas perritas cocker
        </Text>
      </View>

      {/* ----------------------- */}
      {/* Barra de navegación inferior */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress('Inicio')}
        >
          <Image
            source={require('/workspaces/EduShield/assets/splash-icon.png')}
            style={styles.navImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress('Buscar')}
        >
          <Image
            source={require('/workspaces/EduShield/assets/splash-icon.png')}
            style={styles.navImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress('Perfil')}
        >
          <Image
            source={require('/workspaces/EduShield/assets/splash-icon.png')}
            style={styles.navImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Contenedor principal con fondo negro
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  // Header fijo en la parte superior
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',            // Texto e ícono en fila
    alignItems: 'center',            // Centrado vertical
    justifyContent: 'space-between', // Separar extremos
    paddingHorizontal: 16,           // Espacio a los lados
    backgroundColor: 'black',        // Fondo del header también negro
    borderBottomWidth: 1,            // Línea inferior para separación
    borderBottomColor: '#333',       // Línea sutil
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',                  // Texto en blanco
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    tintColor: 'white',              // Ícono en blanco
  },

  // Contenido principal debajo del header
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,                   // Separación desde el header
  },
  mensaje: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },

  // Barra de navegación inferior
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#333333',
  },
  navButton: {
    flex: 1, // Distribuye el espacio equitativamente
    alignItems: 'center',
  },
  navImage: {
    width: 30,        // Tamaño de las imágenes
    height: 30,
    tintColor: 'gray', // Color gris para las imágenes
  },
});

export default ReportScreen;
