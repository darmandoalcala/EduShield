import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import { Picker } from '@react-native-picker/picker';

export default function EditP() {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState('');
  const [campus, setCampus] = useState('CUCEI');
  const [gender, setGender] = useState('MASCULINO');
  const [showDropdown, setShowDropdown] = useState(false);
  const campusOptions = ['CUCEI', 'CUCEA', 'CUCS'];

  const handleAddPhoto = () => {
    console.log('Editar foto');
  };

  const handleSave = () => {
    console.log({ fullName, major, campus, gender });
  };

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={false} />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.avatarContainer} onPress={handleAddPhoto}>
          <Image
            source={require('/workspaces/EduShield/assets/contact.png')}
            style={styles.avatar}
          />
          <Text style={styles.editPhotoText}>Editar foto</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre completo"
            placeholderTextColor="#aaa"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Carrera</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu carrera"
            placeholderTextColor="#aaa"
            value={major}
            onChangeText={setMajor}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Centro universitario</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.dropdownText}>{campus}</Text>
            <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdownContainer}>
              {campusOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionItem}
                  onPress={() => {
                    setCampus(option);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Género *</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'MASCULINO' && styles.genderSelected,
              ]}
              onPress={() => setGender('MASCULINO')}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === 'MASCULINO' && styles.genderTextSelected,
                ]}
              >
                MASCULINO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'FEMENINO' && styles.genderSelected,
              ]}
              onPress={() => setGender('FEMENINO')}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === 'FEMENINO' && styles.genderTextSelected,
                ]}
              >
                FEMENINO
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>


        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 10,

  },
  avatarContainer: {
    paddingTop: 10,
    alignItems: 'center',
    marginBottom: 35,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#333',
  },
  editPhotoText: {
    color: '#fff',
    fontSize: 16,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 25,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f7f5f5',
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    color: '#000',
    fontSize: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f5f5',
    padding: 12,
    borderRadius: 5,
  },
  dropdownText: {
    color: '#000',
    flex: 1,
    fontSize: 16,
  },
  dropdownArrow: {
    color: '#000',
    marginLeft: 10,
  },
  dropdownContainer: {
    backgroundColor: '#f7f5f5',
    borderRadius: 5,
    marginTop: 5,
  },
  optionItem: {
    padding: 10,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  optionText: {
    color: '#000',
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  genderSelected: {
    backgroundColor: '#fff',
  },
  genderText: {
    color: '#fff',
  },
  genderTextSelected: {
    color: '#000',
  },
  saveButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
    width: '50%',
    alignItems: 'center',
  },

  
bottomButtonContainer: {
  alignItems: 'center',
},


  saveButtonText: {
    color: '#fff',
    fontSize: 20,
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
