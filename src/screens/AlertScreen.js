import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const AlertScreen = ({ navigation }) => {
  // Función al presionar el ícono de perfil
  const handleProfilePress = () => {
    console.log('Botón de perfil presionado');
    // navigation.navigate('Profile'); // descomenta si quieres navegar
  };

  // Función genérica para los botones de la barra inferior
  const handleButtonPress = (screen) => {
    console.log(`Navegar a sección: ${screen}`);
    // navigation.navigate(screen);      // descomenta para navegación real
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
            source={require('/workspaces/EduShield/assets/icon.png')}
            style={styles.profileIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* ----------------------- */}
      {/* Contenido principal */}
      <View style={styles.content}>
        <Text style={styles.mensaje}>
          Hasta aquí llegaron, perras

          {'\n\n'}
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
    borderBottomColor: '#333',       // Línea ligeramente más clara que negro
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
    tintColor: 'white', // El ícono se verá blanco
  },

  // Contenido principal debajo del header
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20, // Pequeño margen desde el header
  },
  mensaje: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: 'white', // Texto en blanco
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
    flex: 1,
    alignItems: 'center',
  },
  navImage: {
    width: 28,
    height: 28,
    tintColor: 'gray',        // Íconos en blanco
  },
});

export default AlertScreen;
