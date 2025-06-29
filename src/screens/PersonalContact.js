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

export default function PersonalContact() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  const handleAddPhoto = () => {
    // lógica para seleccionar o tomar foto
    console.log('Agregar foto');
  };

  const handleSaveContact = () => {
    // lógica para guardar el contacto
    console.log({ fullName, phone, relation });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.photoButton} onPress={handleAddPhoto}>
        <Image
          source={require('/workspaces/EduShield/assets/contact.png')}
          style={styles.photo}
        />
        <Text style={styles.photoText}>Agregar foto</Text>
      </TouchableOpacity>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa nombre completo de tu contacto"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa número celular"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Parentesco</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el parentesco"
          placeholderTextColor="#999"
          value={relation}
          onChangeText={setRelation}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveContact}>
        <Text style={styles.saveButtonText}>Agregar contacto</Text>
      </TouchableOpacity>
        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 130,
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 5,
  },
  photoButton: {
    marginBottom: 35,
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 50,
    backgroundColor: '#333',
  },
  photoText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  fieldContainer: {
    width: '90%',
    marginBottom: 25,
  },
  label: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f7f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    color: '#000',
  },
  saveButton: {
    marginTop: 'auto',
    backgroundColor: '#e60000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
        // EDUSHIELD2025
    smallText: {
      color: '#aaa',
      fontSize: 12,
      marginVertical: 10,
      textAlign: 'center',
      marginTop:20,
      marginBottom:20,
  },
});
