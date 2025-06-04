import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'; 

const AlertScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mensaje}>
        Hasta aquí llegaron, perras

        Saquen la lavada alv y unas perritas cocker
      </Text>
      {/* Barra de navegación con 3 imágenes como botones */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => handleButtonPress('Inicio')}
        >
          <Image
            source={require('/workspaces/EduShield/assets/splash-icon.png')} // Cambia por tu imagen
            style={styles.navImage}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => handleButtonPress('Buscar')}
        >
          <Image
            source={require('/workspaces/EduShield/assets/splash-icon.png')} // Cambia por tu imagen
            style={styles.navImage}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => handleButtonPress('Perfil')}
        >
          <Image
            source={require('/workspaces/EduShield/assets/splash-icon.png')} // Cambia por tu imagen
            style={styles.navImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mensaje: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
navBar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '110%',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingHorizontal: 20,
  paddingVertical: 15,
  backgroundColor: '#333333',
},
  navButton: {
    flex: 1, // ¡Esto es clave! Distribuye el espacio equitativamente
    alignItems: 'center'
  },
  navImage: {
    width: 30, // Tamaño de las imágenes
    height: 30,
    tintColor: 'gray', // Color gris para las imágenes
  },
});

export default AlertScreen;
