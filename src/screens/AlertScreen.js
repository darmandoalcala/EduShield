import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { io } from "socket.io-client";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import { StyleSheet } from 'react-native';


const AlertScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [usuariosAlerta, setUsuariosAlerta] = useState([]);
  const [alertaActiva, setAlertaActiva] = useState(false);

  // Conexión al backend
  const socket = io("http://localhost:3000"); // Cambia al URL de tu servidor

  // Obtener ubicación inicial
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

  // Recibir actualizaciones del servidor
  useEffect(() => {
    socket.on("actualizarMapa", (usuarios) => {
      setUsuariosAlerta(usuarios);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Activar alerta: envía tu ubicación al backend
  const handleActivarAlerta = () => {
    if (!location) return;

    Alert.alert(
      'Confirmación de alerta',
      '¿Estás seguro de mostrar una alerta? Se enviará un mensaje SMS a tus contactos personales.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, activar',
          onPress: () => {
            setAlertaActiva(true);
            socket.emit("ubicacion", {
              userId: socket.id,
              lat: location.latitude,
              lng: location.longitude,
              alerta: true
            });
          }
        }
      ]
    );
  };

  // Mostrar zonas de alerta: solo ver usuarios y tu ubicación (sin tu alerta si no activaste)
  const handleMostrarZonas = () => {
    Alert.alert(
      'Zonas de alerta',
      usuariosAlerta.length > 0
        ? usuariosAlerta
            .map(u => `Usuario: ${u.userId}, Lat: ${u.lat.toFixed(4)}, Lng: ${u.lng.toFixed(4)}`)
            .join('\n')
        : 'No hay alertas activas en este momento.'
    );
  };

  // Cancelar alerta
  const handleCancelarAlerta = () => {
    Alert.alert(
      'Cancelar alerta',
      '¿Estás seguro de cancelar la alerta?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'si, cancelar',
          onPress: () => {
            setAlertaActiva(false);
            socket.emit("desconectarUbicacion");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Mapa */}
        <View style={styles.mapSection}>
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {/* Tu marcador */}
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="Tú"
                pinColor={alertaActiva ? "red" : "#3ca33cff"}
              />

              {/* Marcadores de otros usuarios */}
              {usuariosAlerta
                .filter(u => u.userId !== socket.id)
                .map(u => (
                  <Marker
                    key={u.userId}
                    coordinate={{ latitude: u.lat, longitude: u.lng }}
                    title={`Usuario ${u.userId}`}
                    pinColor="red"
                  />
                ))
              }
            </MapView>
          )}
        </View>
      {/* Botones */}
        <View style={styles.buttonRow}>
          {/* Botón de activar alerta */}
          <TouchableOpacity
            style={[
              styles.evidenceButton,
              { backgroundColor: alertaActiva ? '#fc0000ff' : '#999' } // Rojo o gris
            ]}
            onPress={handleActivarAlerta}
            disabled={alertaActiva} // evita tocarlo si ya está activa
          >
            <Icon
              name={alertaActiva ? 'alert-outline' : 'crosshairs-gps'}
              size={20}
              color="#ffffffff"
              style={styles.iconLeft}
            />
            <Text style={styles.evidenceText}>
              {alertaActiva ? 'Alerta activa' : 'Activar mi alerta'}
            </Text>
          </TouchableOpacity>

          {/* Botón de mostrar zonas */}
          <TouchableOpacity style={styles.evidenceButton} onPress={handleMostrarZonas}>
            <Icon name="map-marker-alert" size={20} color="#ff0000ff" style={styles.iconLeft} />
            <Text style={styles.evidenceText}>Mostrar zonas de alerta</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de cancelar alerta */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: alertaActiva ? '#ff0000ff' : '#999' } // Solo rojo si hay alerta
          ]}
          onPress={handleCancelarAlerta}
          disabled={!alertaActiva} // deshabilitado si no hay alerta
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

// ... tus estilos 


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

  // Fila de los dos botones (Localización / Zonass de riesgo)
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