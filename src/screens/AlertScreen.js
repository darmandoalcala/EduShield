import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import { LocationContext } from '../context/LocationContext';
import { useUser } from '../context/UserContext';

const AlertScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [usuariosAlerta, setUsuariosAlerta] = useState([]);
  const [alertaActiva, setAlertaActiva] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { locationEnabled, setLocationEnabled } = useContext(LocationContext);
  const { user } = useUser();

  // Conexión al backend
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
            nombre: user?.nombre || 'Usuario',
            apellido: user?.apellido || '',
            codigo_estudiante: user?.codigo_estudiante,
            lat: location.latitude,
            lng: location.longitude,
            alerta: true,
          });
        },
      },
    ]);
  };

  // Mostrar las zonas de alertas
  const handleMostrarZonas = () => {
    // Si no hay alertas en absoluto
    if (usuariosAlerta.length === 0) {
      Alert.alert(
        '🗺️ Zonas de alerta',
        'No hay alertas activas en este momento.\n\nTodos los estudiantes están seguros.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    // Usar SOLO la lista del servidor (sin agregar tu alerta manualmente)
    // El servidor ya incluye tu alerta si está activa
    const alertasList = usuariosAlerta;

    // Crear mensaje formateado
    const mensaje = alertasList
      .map((u, index) => {
        const esTuAlerta = u.userId === socket.id;
        
        // Mostrar nombre completo si existe, sino mostrar ID corto
        let nombreUsuario;
        if (esTuAlerta) {
          nombreUsuario = `${user?.nombre || 'Tú'} ${user?.apellido || ''}`.trim();
        } else if (u.nombre) {
          nombreUsuario = `${u.nombre} ${u.apellido || ''}`.trim();
        } else {
          nombreUsuario = u.userId ? u.userId.substring(0, 8) : 'Anónimo';
        }
        
        const emoji = esTuAlerta ? '👤' : '👥';
        
        return `━━━━━━━━━━━━━━━━━━━
📍 Alerta ${index + 1}
${emoji} Usuario: ${nombreUsuario}${esTuAlerta ? ' (Tú)' : ''}
📌 Lat: ${u.lat.toFixed(4)}
📌 Lng: ${u.lng.toFixed(4)}`;
      })
      .join('\n\n');

    Alert.alert(
      '🚨 Zonas de alerta activas',
      `${mensaje}\n━━━━━━━━━━━━━━━━━━━\n\n⚠️ Total: ${alertasList.length} alerta(s)`,
      [{ text: 'Cerrar', style: 'cancel' }]
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
          text: 'Sí, cancelar',
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }]}>
        <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 15, fontSize: 16 }}>
          La localización está desactivada. Actívala en Configuración para usar alertas.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#E53935',
            paddingVertical: 12,
            paddingHorizontal: 24,
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
            {/* Tu marcador (siempre visible) */}
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={user?.nombre ? `${user.nombre} ${user.apellido || ''}` : "Tú"}
              description={alertaActiva ? "Alerta activa" : "Ubicación actual"}
              pinColor={alertaActiva ? "red" : "#3ca33c"}
            />

            {/* Marcadores de otros usuarios en alerta */}
            {usuariosAlerta
              .filter(u => u.userId !== socket.id)
              .map(u => (
                <Marker
                  key={u.userId}
                  coordinate={{ latitude: u.lat, longitude: u.lng }}
                  title={u.nombre ? `${u.nombre} ${u.apellido || ''}` : "Usuario en alerta"}
                  description={u.codigo_estudiante || `ID: ${u.userId.substring(0, 8)}`}
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
              { 
                backgroundColor: alertaActiva ? '#fc0000' : '#2C2C2E',
                borderColor: alertaActiva ? '#FF6B64' : '#3A3A3C',
              },
            ]}
            onPress={handleActivarAlerta}
            disabled={alertaActiva}
            activeOpacity={0.7}
          >
            <Icon
              name={alertaActiva ? 'alert' : 'crosshairs-gps'}
              size={28}
              color="#FFFFFF"
              style={styles.iconLeft}
            />
            <Text style={styles.evidenceText}>
              {alertaActiva ? 'Alerta activa' : 'Activar mi alerta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.evidenceButton} 
            onPress={handleMostrarZonas}
            activeOpacity={0.7}
          >
            <Icon name="map-marker-alert" size={28} color="#FF3B30" style={styles.iconLeft} />
            <Text style={styles.evidenceText}>Mostrar zonas de alerta</Text>
          </TouchableOpacity>
        </View>

        {/* Cancelar alerta */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            { 
              backgroundColor: alertaActiva ? '#FF3B30' : '#4A4A4A',
              opacity: alertaActiva ? 1 : 0.5,
            },
          ]}
          onPress={handleCancelarAlerta}
          disabled={!alertaActiva}
          activeOpacity={0.8}
        >
          <Icon name="close-circle-outline" size={24} color="#FFF" style={styles.iconLeft} />
          <Text style={styles.sendButtonText}>Cancelar Alerta</Text>
        </TouchableOpacity>

        <Text style={styles.notas}>
          Tu alerta será anónima ante el mapa, solo se compartirá la ubicación si está activada.
        </Text>

        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    paddingBottom: 120,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  smallText: {
    color: '#6E6E73',
    fontSize: 11,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 15, 
    marginBottom: 20,
    letterSpacing: 0.5,
    fontWeight: '400',
  },
  notas: {
    color: '#B4B4B8',
    fontSize: 13,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 35, 
    marginBottom: 15,
    lineHeight: 19,
    paddingHorizontal: 15,
    fontWeight: '400',
  },
  mensaje: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  header: {
    width: '100%',
    marginTop: 50,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#FFFFFF',
  },
  mapSection: {
    marginBottom: 24,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  map: {
    width: '100%',
    height: 380,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    width: '100%',
    gap: 14,
  },
  evidenceButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minHeight: 90,
    borderWidth: 2,
    borderColor: '#3A3A3C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  evidenceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  iconLeft: {
    marginBottom: 4,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginTop: 45,
    width: '90%',
    minHeight: 65,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF6B64',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.8,
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
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navImage: {
    width: 30,
    height: 30,
    tintColor: '#8E8E93',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default AlertScreen;