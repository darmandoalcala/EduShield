import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const userRegion = {
  latitude: 20.6976,
  longitude: -103.3468,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const AlertScreen = ({ navigation }) => {
  const handleProfilePress = () => {
    console.log('Botón de perfil presionado');
  };

  const handleButtonPress = (screen) => {
    console.log(`Navegar a sección: ${screen}`);
  };

  const handleCancelAlert = () => {
    console.log('Cancelar Alerta');
  };

  return (
    <View style={styles.container}>
      {/* ----------------------- */}
      {/* Header (sin cambios) */}
      {/* ----------------------- */}
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
      {/* Contenido desplazable */}
      {/* ----------------------- */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* ----------------------- */}
        {/* Sección 1: Mapa */}
        {/* ----------------------- */}
        <View style={styles.mapSection}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={userRegion}
            showsUserLocation
          >
            <Marker coordinate={userRegion} />
          </MapView>
        </View>

        {/* ----------------------- */}
        {/* Sección 2: Localización / Zonas de riesgo */}
        {/* ----------------------- */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.evidenceButton}
            onPress={() => console.log('Localización')}
          >
            <Icon
              name="crosshairs-gps"
              size={20}
              color="#FFF"
              style={styles.iconLeft}
            />
            <Text style={styles.evidenceText}>Localización</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.evidenceButton}
            onPress={() => console.log('Zonas de riesgo')}
          >
            <Icon
              name="alert-outline"
              size={20}
              color="#FFF"
              style={styles.iconLeft}
            />
            <Text style={styles.evidenceText}>Zonas de riesgo</Text>
          </TouchableOpacity>
        </View>

        {/* ----------------------- */}
        {/* Sección 3: Cancelar Alerta */}
        {/* ----------------------- */}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleCancelAlert}
        >
          <Icon
            name="close-circle-outline"
            size={20}
            color="#FFF"
            style={styles.iconLeft}
          />
          <Text style={styles.sendButtonText}>Cancelar Alerta</Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
    paddingTop: 30,
    alignItems: 'center',
  },


  header: {
    width: '100%',
    marginTop: 50,
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
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  mensaje: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: 'white',
  },
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
    width: 28,
    height: 28,
    tintColor: 'gray',
  },

   mapSection: {
    marginBottom: 16,
    width: '100%',
  },

  // Mapa de Google
  map: {
    width: '100%',
    height: 350,
    borderRadius: 8,
  },

  // Fila de los dos botones (Localización / Zonas de riesgo)
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    height: 70,
  },

  // Botones “Localización” y “Zonas de riesgo”
  evidenceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  evidenceText: {
    flex: 1,
    color: '#FFF',
    fontSize: 17,
  },

  // Ícono a la izquierda de cada botón
  iconLeft: {
    marginRight: 8,
  },

  // Botón rojo “Cancelar Alerta”
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 50,
    width: '70%',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default AlertScreen;
