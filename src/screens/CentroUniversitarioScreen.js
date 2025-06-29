import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
    <ScrollView contentContainerStyle={styles.container}>
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
          <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 20,

  },
  title: {
    marginTop:100,
    color: '#fff',
    fontSize: 25,
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    color: '#aaa',
    fontSize: 25,
    marginBottom:15,
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
    flex: 1,
    fontSize: 18,
  },
  dropdownArrow: {
    color: '#000',
    marginLeft: 10,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
    overflow: 'hidden',
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
  saveButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 'auto',
    width: '60%',
    marginLeft:70,
    height: 50,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
    smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop:20,
  }
});