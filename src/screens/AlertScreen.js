import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
// import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';

const AlertScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const handleProfilePress = () => {
    console.log('Botón de perfil presionado');
  };

  const handleCancelAlert = () => {
    console.log('Cancelar Alerta');
  };

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mapSection}>
          <View style={[styles.map, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: 'white', fontSize: 16 }}>Mapa temporal</Text>
            <Text style={{ color: '#666', fontSize: 12, marginTop: 5 }}>
              {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Obteniendo ubicación...'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.evidenceButton} onPress={() => console.log('Localización')}>
            <Icon name="crosshairs-gps" size={20} color="#FFF" style={styles.iconLeft} />
            <Text style={styles.evidenceText}>Localización</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.evidenceButton} onPress={() => console.log('Zonas de riesgo')}>
            <Icon name="alert-outline" size={20} color="#FFF" style={styles.iconLeft} />
            <Text style={styles.evidenceText}>Zonas de riesgo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleCancelAlert}>
          <Icon name="close-circle-outline" size={20} color="#FFF" style={styles.iconLeft} />
          <Text style={styles.sendButtonText}>Cancelar Alerta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


// ... tus estilos siguen igual ...


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
