import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import HeaderBar from '../components/HeaderBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PrivacySettings() {
  const navigation = useNavigation();

  const [cameraAccess, setCameraAccess] = useState(false);
  const [galleryAccess, setGalleryAccess] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // ✅ Llamadas correctas
        const { status: cameraStatus } = await Camera.getCameraPermissionsAsync();
        setCameraAccess(cameraStatus === 'granted');

        const { status: galleryStatus } = await MediaLibrary.getPermissionsAsync();
        setGalleryAccess(galleryStatus === 'granted');
      } catch (e) {
        console.error('Error en checkPermissions (useEffect):', e);
      }
    };
    checkPermissions();
  }, []);

  const handleToggleCamera = async (newValue) => {
    try {
      if (newValue === false) {
        setCameraAccess(false);
        Alert.alert(
          'Acceso Desactivado',
          'Has desactivado el uso de la cámara en la app...',
          [{ text: 'OK' }]
        );
        return;
      }

      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();

      if (cameraStatus === 'granted' && micStatus === 'granted') {
        setCameraAccess(true);
        Alert.alert('Acceso Permitido', 'La app ahora tiene acceso a la cámara y al micrófono.');
      } else {
        setCameraAccess(false);

        let errorMsg = 'Se requieren permisos para continuar:\n';
        if (cameraStatus !== 'granted') errorMsg += '- Permiso de Cámara denegado.\n';
        if (micStatus !== 'granted') errorMsg += '- Permiso de Micrófono denegado.\n';
        errorMsg += '\nPor favor, actívalos desde la configuración de la app.';

        Alert.alert('Permisos Requeridos', errorMsg, [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configuración', onPress: () => Linking.openSettings() },
        ]);
      }
    } catch (error) {
      console.error('--- ¡ERROR AL SOLICITAR PERMISOS! ---');
      console.error(error);
      Alert.alert(
        'Error de Módulo Nativo',
        `Falló la solicitud de permisos. Revisa la consola.\nError: ${error.message}`
      );
    }
  };

  const handleToggleGallery = async (newValue) => {
    if (newValue === false) {
      setGalleryAccess(false);
      Alert.alert(
        'Acceso Desactivado',
        'Has desactivado el uso de la galería en la app...',
        [{ text: 'OK' }]
      );
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      setGalleryAccess(true);
      Alert.alert('Acceso Permitido', 'La app ahora tiene acceso a la galería.');
    } else {
      setGalleryAccess(false);
      Alert.alert(
        'Permiso Requerido',
        'Para activar la galería, necesitas otorgar permisos...',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configuración', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar todo tu historial de incidentes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => console.log('Historial eliminado') },
      ]
    );
  };

  const handleSave = () => {
    console.log('Configuración guardada:', { cameraAccess, galleryAccess });
    Alert.alert('Guardado', 'Tus preferencias de privacidad han sido guardadas.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

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

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerSection}>
          <Text style={styles.title}>Privacidad</Text>
          <Text style={styles.subtitle}>
            Controla los permisos de la app y tus datos
          </Text>
        </View>

        <Text style={styles.listTitle}>Permisos de la App</Text>
        <View style={styles.settingsCard}>
          {renderToggle(
            'camera',
            'Acceso a Cámara',
            'Permitir que la app use tu cámara',
            cameraAccess,
            handleToggleCamera
          )}
          {renderToggle(
            'image-multiple',
            'Acceso a Galería',
            'Permitir que la app lea tu galería',
            galleryAccess,
            handleToggleGallery,
            true
          )}
        </View>

        <Text style={styles.listTitle}>Gestión de Datos</Text>
        <View style={styles.settingsCard}>
          <View style={styles.actionRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Historial de Incidentes</Text>
              <Text style={styles.settingDescription}>
                Elimina permanentemente todos tus reportes
              </Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={handleClearHistory}>
              <Icon name="delete-forever" size={18} color="white" />
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="content-save" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>

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

  listTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 16,
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

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#500',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  saveButton: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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