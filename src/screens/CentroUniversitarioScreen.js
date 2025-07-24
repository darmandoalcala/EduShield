import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function CentroU() {
  const [selectedCampus, setSelectedCampus] = useState('CUCEI');
  const [showDropdown, setShowDropdown] = useState(false);

  const campusOptions = [
    'CUCEI',
    'CUCEA',
    'CUCS',
    'VOCACIONAL',
    'PREPARATORIA 12',
  ];

  const handleSave = () => {
    // Lógica para guardar selección
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Configura el Centro Universitario que quieres ver en el mapa
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Centro universitario</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.dropdownText}>{selectedCampus}</Text>
            <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownContainer}>
              {campusOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedCampus(option);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>

          <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'flex-start',


  },
  title: {
    marginTop: 80,
    color: '#fff',
    fontSize: 25,
    marginBottom: 40,
  },
  inputGroup: {
    zIndex: 2,
    position:'relative',
  },
  label: {
    color: '#aaa',
    fontSize: 25,
    marginBottom: 15,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    
  },
  dropdownText: {
    color: '#000',
    fontSize: 18,
  },
  dropdownArrow: {
    color: '#000',
    marginLeft: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 55, // ajusta según la altura del botón
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 5, // para sombra en Android
    shadowColor: '#000', // para sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999,
  },

  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    color: '#000',
    fontSize: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 50,
  },
  saveButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '60%',
    height: 50,
    marginTop: 290,   
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    
  },
  smallText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
});
