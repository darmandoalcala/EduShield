import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView, // ← Se agrega ScrollView
} from 'react-native';

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
            source={require('/workspaces/EduShield/assets/icon.png')}
            style={styles.profileIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* ----------------------- */}
      {/* ScrollView como en Home1 */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.mensaje}>
            Hasta aquí llegaron, perras{'\n'}
            Saquen la lavada alv y unas perritas cocker
          </Text>
        </View>
      </ScrollView>

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

  // ScrollView container como en Home1
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },

  // Header fijo en la parte superior
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
    tintColor: 'white',
  },

  // Contenido dentro del scroll
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
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
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: '#333333',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navImage: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
});

export default ReportScreen;

