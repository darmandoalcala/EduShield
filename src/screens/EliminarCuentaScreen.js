import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

export default function EliminarCuenta() {
  const [reason, setReason] = useState('');

  const handleEmailPress = () => {
    Linking.openURL('mailto:edushield@gmail.com');
  };

  const handleDelete = () => {
    if (!reason.trim()) {
      Alert.alert('Atención', 'Por favor escribe tu experiencia antes de eliminar tu cuenta.');
      return;
    }
    // Aquí iría la lógica para procesar la eliminación, usando `reason`
    Alert.alert(
      'Eliminar cuenta',
      `Motivo de eliminación: ${reason}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cuéntanos tu experiencia :)</Text>

      <TextInput
        style={styles.textBox}
        placeholder="Cuentanos tu experiencia con la app :)"
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
      </TouchableOpacity>

            <Text style={styles.infoText}>
                Más información escríbenos al correo{' '}
                <Text style={styles.link} onPress={handleEmailPress}>
                edushield@gmail.com
                </Text>
            </Text>

        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,

  },
  textBox: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    color: '#000',
    fontSize: 16,
    minHeight: 200,
    textAlignVertical: 'top',
    marginBottom: 50,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '60%',
    marginLeft:70,
    height: 50,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
    smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop:20,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 25,
    textAlign: 'center',
  },
  link: {
    color: '#e74c3c',
    textDecorationLine: 'underline',
  },

});
