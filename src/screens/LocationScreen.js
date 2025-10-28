import React, { useContext } from 'react'; // 🔹 agrega useContext
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import { LocationContext } from '../context/LocationContext';

export default function Location() {
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

  const renderToggle = (label, value, onToggle) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
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
    await updateLocationSettings(settings);
    alert('Configuraciones guardadas con éxito');
  };

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={false} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Configuración de localización</Text>
          <Icon name="cog" size={30} color="#fff" style={{ marginTop: 20 }} />
        </View>

        {renderToggle('Activar localización', locationEnabled, setLocationEnabled)}
        {renderToggle('Precisión GPS ALTA', highPrecision, setHighPrecision)}
        {renderToggle('Historial de ubicaciones ACTIVO', historyEnabled, setHistoryEnabled)}
        {renderToggle('Compartir ubicación con mis contactos', shareLocation, setShareLocation)}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>

        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 10,
    paddingTop: 2,
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
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 25,
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
    fontSize: 21,
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
    marginTop: 100,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 22,

  },
    smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop:20,
  }
})