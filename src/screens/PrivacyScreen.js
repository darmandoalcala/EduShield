
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PrivacySettings() {
  const navigation = useNavigation();

  const [cameraAccess, setCameraAccess] = useState(false);
  const [galleryAccess, setGalleryAccess] = useState(false);


  const handleClearHistory = () => {
    console.log('Historial eliminado');
  };

  const handleSave = () => {
    console.log('Configuración guardada');
  };

  const renderToggle = (label, value, setValue) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.toggleButton, value && styles.toggleActive]}
        onPress={() => setValue(!value)}
      >
        <Text style={styles.toggleText}>{value ? 'Activado' : 'Desactivado'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={false} />

      <ScrollView contentContainerStyle={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Configuración Privacidad</Text>
            <Icon name="cog" size={30} color="#fff" style={{ marginTop: 10 }} />
          </View>

          {renderToggle('Acceso a cámara', cameraAccess, setCameraAccess)}
          {renderToggle('Acceso a galería', galleryAccess, setGalleryAccess)}


          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Eliminar todo historial de mis incidentes</Text>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
              <Text style={styles.clearButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>

          <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
        </ScrollView>
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 10,
    paddingTop: 10,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 55,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 15,

  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  settingLabel: {
    flex: 1,
    color: '#aaa',
    fontSize: 20,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  toggleSelected: {
    backgroundColor: '#D03D3D',
  },
  toggleText: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
  },
  toggleTextSelected: {
    color: '#fff',
    fontSize: 17,
  },
  clearButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 25,
    width: '60%',
    height: 50,
    marginLeft:70,
    alignItems: 'center',
    marginTop: 60,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 22,

  },
      // EDUSHIELD2025
    smallText: {
      color: '#aaa',
      fontSize: 12,
      marginVertical: 10,
      textAlign: 'center',
      marginTop:20,
      marginBottom:15,
  },
});
