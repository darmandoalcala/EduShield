import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { useUser } from '../context/UserContext';

const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { user } = useUser();

  const toggleNotifications = () => {
    if (notificationsEnabled) {
      // Desactivar
      Alert.alert(
        'Desactivar notificaciones',
        '¿Estás seguro? Ya no recibirás alertas de emergencia.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desactivar',
            style: 'destructive',
            onPress: () => {
              setNotificationsEnabled(false);
              console.log('🔕 Notificaciones desactivadas');
            }
          }
        ]
      );
    } else {
      // Activar
      setNotificationsEnabled(true);
      Alert.alert(
        'Notificaciones activadas',
        'Recibirás alertas de emergencia en tiempo real'
      );
      console.log('Notificaciones activadas');
    }
  };

  //const toggleDarkMode = () => {
    //setIsDarkMode(!isDarkMode);
    //console.log('🌓 Modo oscuro:', !isDarkMode);
  //};

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres salir de la aplicación?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          onPress: () => {
            console.log('🚪 Usuario cerró sesión');
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const handleProfilePress = () => {
    if (user?.id || user?.codigo_estudiante) {
      navigation.navigate('EditP', { userId: user.codigo_estudiante || user.id });
    } else {
      console.warn('⚠️ No hay usuario logueado');
      Alert.alert('Error', 'No se encontró información del usuario');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <HeaderBar navigation={navigation} showBackButton={false} /> 
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>CONFIGURACIÓN</Text>
        
        {/* APARIENCIA */}
          {/* 
            <Text style={styles.sectionTitle}>Apariencia</Text>
                  
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingText}>
                  Modo oscuro
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "red" }}
                thumbColor="#f4f3f4"
                onValueChange={toggleDarkMode}
                value={isDarkMode}
              />
            </View>
          */}

        {/* NOTIFICACIONES */}
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>
              Notificaciones
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "red" }}
            thumbColor="#f4f3f4"
            onValueChange={toggleNotifications}
            value={notificationsEnabled}
          />
        </View>

        {notificationsEnabled && (
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationInfoText}>
              Recibirás notificaciones de la app.
            </Text>
          </View>
        )}

        {/* CUENTA */}
        <Text style={styles.sectionTitle}>Cuenta</Text>

        <Pressable 
          style={styles.settingItem}
          onPress={handleProfilePress}
        >
          <View style={styles.settingInfo}>  
            <Text style={styles.settingText}>Editar perfil</Text>
          </View>
        </Pressable>

        <Pressable 
          style={styles.settingItem}
          onPress={() => navigation.navigate('Privacy')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Configuración de privacidad</Text>
          </View>
        </Pressable>

        <Pressable 
          style={styles.settingItem}
          onPress={() => navigation.navigate('Location')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Configuración de localización</Text>
          </View>
        </Pressable>

        <Pressable 
          style={styles.settingItem}
          onPress={() => navigation.navigate('CentroU')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Cambiar centro universitario</Text>
          </View>
        </Pressable>

        {/* REPORTES */}
        <Text style={styles.sectionTitle}>Reportes</Text>

        <Pressable 
          style={styles.settingItem}
          onPress={() => navigation.navigate('SeleccionarReporte')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Historial de incidentes</Text>
          </View>
        </Pressable>

        <Pressable 
          style={styles.settingItem}
          onPress={() => navigation.navigate('MisReportes')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Mis Reportes</Text>
          </View>
        </Pressable>

        {/* AYUDA */}
        <Pressable
          style={styles.cardContainer}
          onPress={() => navigation.navigate('AyudaGuia')}
        >
          <Text style={styles.title}>Ayuda & Guía</Text>
          <Text style={styles.item}>- ¿Cómo usar EDUSHIELD?</Text>
          <Text style={styles.item}>- ¿Qué hacer durante una emergencia?</Text>
        </Pressable>

        {/* Botones de cierre */}
        <Pressable 
          style={[styles.logoutButton, { marginTop: 20 }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>

        <Pressable 
          style={[styles.logoutButton, { marginTop: 10, backgroundColor: '#8B0000' }]}
          onPress={() => navigation.navigate('EliminarCuenta')}
        >
          <Text style={styles.logoutText}>Eliminar cuenta</Text>
        </Pressable>

        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'left',
  },
  sectionTitle: {
    color: 'gray',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    color: 'white',
    fontSize: 16,
  },
  notificationInfo: {
    backgroundColor: '#d43b3bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff0000ff',
  },
  notificationInfoText: {
    color: '#ffffffff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 25, 
    marginBottom: 55,
  },
  cardContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 17,
    marginBottom: 5,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  item: {
    color: '#ff4d4d',
    fontSize: 16,
    marginBottom: 8,
  },
});

export default SettingsScreen;