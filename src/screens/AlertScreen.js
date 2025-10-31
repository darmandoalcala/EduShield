import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet,ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import { LocationContext } from '../context/LocationContext';


const AlertScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [usuariosAlerta, setUsuariosAlerta] = useState([]);
  const [alertaActiva, setAlertaActiva] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { locationEnabled, setLocationEnabled } = useContext(LocationContext);

  // Conexión al backend
  //const socket = io("https://filthy-superstition-v669r5jjp7g7fxvqw-3001.app.github.dev"); 
  const socket = io("http://edushield.duckdns.org:3000"); 


  // Obtener ubicación inicial
  useEffect(() => {
    const solicitarPermiso = async () => {
      try {
          let { status } = await Location.getForegroundPermissionsAsync();

          if (status !== 'granted') {
            const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
            status = newStatus;
          }

          if (status !== 'granted') {
            setLocationEnabled(false);
            setIsLoading(false);
            Alert.alert(
              "Permiso de ubicación denegado",
              "No podemos acceder a tu ubicación. Ve a Configuración > Permisos > Activa ubicación para esta app."
            );
            return;
          }

        setLocationEnabled(true);

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        console.error("Error al obtener ubicación:", error);
        Alert.alert("Error", "Hubo un problema al acceder a la ubicación.");
      } finally {
        setIsLoading(false);
      }
    };

    solicitarPermiso();
  }, []);

  // Recibir actualizaciones del servidor
  useEffect(() => {
    socket.on("actualizarMapa", (usuarios) => {
      setUsuariosAlerta(usuarios);
    });

    return () => socket.disconnect();
  }, []);

  // Activar alerta: envía tu ubicación al backend
  const handleActivarAlerta = () => {
    if (!locationEnabled) {
      Alert.alert(
        "Localización desactivada",
        "Actívala en Configuración para enviar alertas."
      );
      return;
    }

    if (!location) {
      Alert.alert(
        "Ubicación no disponible",
        "Aún no se ha obtenido tu ubicación actual."
      );
      return;
    }

    Alert.alert("Confirmar", "¿Deseas activar la alerta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, activar",
        onPress: () => {
          setAlertaActiva(true);
          socket.emit("ubicacion", {
            userId: socket.id,
            lat: location.latitude,
            lng: location.longitude,
            alerta: true,
          });
        },
      },
    ]);
  }

 

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
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ff0000" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Obteniendo permisos de ubicación...</Text>
      </View>
    );
  }

  if (!locationEnabled) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 15 }}>
          La localización está desactivada. Actívala en Configuración para usar alertas.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#E53935',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
          }}
          onPress={() => Alert.alert(
            "Abrir configuración",
            "Ve a la configuración de tu dispositivo y otorga permisos de ubicación."
          )}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Abrir configuración</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ff0000" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Obteniendo tu ubicación actual...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Mapa */}
        <View style={styles.mapSection}>
          <MapView
            style={styles.map}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="Tú"
              pinColor={alertaActiva ? "red" : "#3ca33cff"}
            />

            {usuariosAlerta
              .filter(u => u.userId !== socket.id)
              .map(u => (
                <Marker
                  key={u.userId}
                  coordinate={{ latitude: u.lat, longitude: u.lng }}
                  title={`Usuario ${u.userId}`}
                  pinColor="red"
                />
              ))}
          </MapView>
        </View>

        {/* Botones */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.evidenceButton,
              { backgroundColor: alertaActiva ? '#fc0000ff' : '#999' },
            ]}
            onPress={handleActivarAlerta}
            disabled={alertaActiva}
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

          <TouchableOpacity style={styles.evidenceButton} onPress={handleMostrarZonas}>
            <Icon name="map-marker-alert" size={20} color="#ff0000ff" style={styles.iconLeft} />
            <Text style={styles.evidenceText}>Mostrar zonas de alerta</Text>
          </TouchableOpacity>
        </View>

        {/* Cancelar alerta */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: alertaActiva ? '#ff0000ff' : '#999' },
          ]}
          onPress={handleCancelarAlerta}
          disabled={!alertaActiva}
        >
          <Icon name="close-circle-outline" size={20} color="#FFF" style={styles.iconLeft} />
          <Text style={styles.sendButtonText}>Cancelar Alerta</Text>
        </TouchableOpacity>

          <Text style={styles.notas}>Tu alerta será anónima ante el mapa, solo se compartirá la ubicación si está activada.</Text>

          <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
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

    smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 10, 
    marginBottom: 15,
  },
      notas: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 25, 
    marginBottom: 10,
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
    marginTop: 40,
    width: '70%',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default AlertScreen;