import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import * as Location from 'expo-location'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import { LocationContext } from '../context/LocationContext';

export default function LocationScreen() {
  const navigation = useNavigation();
  const {
    locationEnabled,
    setLocationEnabled,
    highPrecision,
    setHighPrecision,
    historyEnabled,
    setHistoryEnabled,
    shareLocation,
    setShareLocation,
    updateLocationSettings,
  } = useContext(LocationContext);

  // renderToggle ahora incluye ícono, descripción y un flag "Last"
  const renderToggle = (icon, title, description, value, onToggle, last = false) => (
    <View style={[styles.settingRow, last && styles.lastSettingRow]}>
      <Icon name={icon} size={24} color="red" style={styles.settingIcon} />
      
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingLabel}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      
      <View style={styles.toggleGroup}>
        <TouchableOpacity
          style={[styles.toggleButton, value && styles.toggleSelected]}
          onPress={() => onToggle(true)}
        >
          <Text style={[styles.toggleText, value && styles.toggleTextSelected]}>SI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !value && styles.toggleSelected]}
          onPress={() => onToggle(false)}
        >
          <Text style={[styles.toggleText, !value && styles.toggleTextSelected]}>NO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleSave = async () => {
    const settings = {
      locationEnabled,
      highPrecision,
      historyEnabled,
      shareLocation,
    };

    try {
      await updateLocationSettings(settings);
      Alert.alert('Guardado', 'Configuraciones guardadas con éxito', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al guardar las configuraciones');
    }
  };

  const handleToggleLocation = async (newValue) => {
    //Si la apaga
    if (newValue === false) {
      setLocationEnabled(false);
      return;
    }

    // Si la enciende
    try {
      // Revisa el estado actual del permiso
      let { status } = await Location.getForegroundPermissionsAsync();

      // Si el permiso no se ha preguntado, solicítalo
      if (status === Location.PermissionStatus.UNDETERMINED) {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }

      // 3. Evalúa el resultado
      if (status === Location.PermissionStatus.GRANTED) {
        // PERMISO CONCEDIDO
        setLocationEnabled(true);
        Alert.alert('Activado', 'La localización se ha activado.');
      } else if (status === Location.PermissionStatus.DENIED) {
        // PERMISO DENEGADO
        Alert.alert(
          'Permiso Requerido',
          'Para activar la localización, necesitas otorgar permisos desde la configuración de tu dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => setLocationEnabled(false) },
            { 
              text: 'Abrir Configuración', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
        setLocationEnabled(false);
      }
    } catch (error) {
      console.error('Error pidiendo permisos:', error);
      Alert.alert('Error', 'No se pudo verificar el permiso de localización.');
      setLocationEnabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* TITULO */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Localización</Text>
          <Text style={styles.subtitle}>
            Administra tus permisos y preferencias de ubicación
          </Text>
        </View>

        {/* ITEM DE TARJETA */}
        <View style={styles.settingsCard}>
          {renderToggle(
            'map-marker', 
            'Activar Localización', 
            'Permite el acceso a tu ubicación', 
            locationEnabled, 
            handleToggleLocation
          )}
          {renderToggle(
            'satellite-variant', 
            'Precisión Alta', 
            'Usa GPS para máxima exactitud', 
            highPrecision, 
            setHighPrecision
          )}
          {renderToggle(
            'history', 
            'Guardar Historial', 
            'Almacena tus ubicaciones pasadas', 
            historyEnabled, 
            setHistoryEnabled
          )}
          {renderToggle(
            'share-variant', 
            'Compartir Ubicación', 
            'Envía tu ubicación a tus contactos', 
            shareLocation, 
            setShareLocation,
            true //ultimo item = true
          )}
        </View>

        {/* GUARDAR CAMBIOS */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="content-save" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>EDUSHIELD 2025</Text>
          <Text style={styles.footerSubtext}>Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    lineHeight: 22,
  },
  settingsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden', 
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333', 
  },
  lastSettingRow: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#555',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#333', 
  },
  toggleSelected: {
    backgroundColor: 'red', 
  },
  toggleText: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  toggleTextSelected: {
    color: 'white', 
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // Centra el botón
    marginTop: 32,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#222',
    marginTop: 40,
  },
  footerText: {
    color: '#444',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 4,
  },
  footerSubtext: {
    color: '#333',
    fontSize: 10,
  },
});