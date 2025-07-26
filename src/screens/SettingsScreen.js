import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
Switch,
} from 'react-native';
// al inicio de PrivacySettings.js
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderBar from '../components/HeaderBar';


const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);
  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
  const toggleLocation = () => setLocationEnabled(previousState => !previousState);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres salir de la aplicación?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Salir", 
          onPress: () => console.log('Usuario cerró sesión') 
        }
      ]
    );
  };

  return (
    <View style={styles.outerContainer}>
      <HeaderBar navigation={navigation} showBackButton={false} /> 
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>CONFIGURACIÓN</Text>
        
        {/* Sección Apariencia */}
        <Text style={styles.sectionTitle}>Apariencia</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Modo oscuro</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "red" }}
            thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>

        {/* Sección Notificaciones */}
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Notificaciones</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "red" }}
            thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
            onValueChange={toggleNotifications}
            value={notificationsEnabled}
          />
        </View>


        <Pressable 
          style={styles.settingItem}
          onPress={() => navigation.navigate('EditP')}
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
            <Text style={styles.settingText}>Configuracion de privacidad</Text>
          </View>
          
        </Pressable>

        <Pressable 
          style={styles.settingItem}
          onPress={() => navigation.navigate('Location')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Configuracion de localizacion</Text>
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

        <Pressable 
          style={styles.settingItem}
          onPress={() => navigation.navigate('SeleccionarReporte')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Historial de incidentes en reportes</Text>
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

          <Pressable
      style={styles.cardContainer}
      onPress={() => navigation.navigate('AyudaGuia')}
        >
      <Text style={styles.title}>Ayuda & Guía</Text>
      <Text style={styles.item}>- ¿Cómo usar EDUSHIELD?</Text>
      <Text style={styles.item}>- ¿Qué hacer durante una emergencia?</Text>
    </Pressable>

        {/* Botón de cerrar sesión */}
        <Pressable 
          style={[styles.logoutButton, { marginTop: 20 }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Cerrar sesion</Text>
        </Pressable>

                <Pressable 
          style={[styles.logoutButton, { marginTop: 10 }]}
          onPress={() => navigation.navigate('EliminarCuenta')}
        >
          <Text style={styles.logoutText}>Eliminar cuenta </Text>
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
  },
  settingText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
        // EDUSHIELD2025

  smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop:'25', 
    marginBottom: 55,
   },
    cardContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 17,
    marginBottom: 5,
    marginTop:10,
    marginHorizontal: 10,
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
    fontSize: 14,
    marginBottom: 4,
  },
});

export default SettingsScreen;