// src/screens/EliminarCuenta.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  StatusBar,
} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { useNavigation } from '@react-navigation/native';

export default function EliminarCuenta() {
  const [reason, setReason] = useState('');
  const navigation = useNavigation();

  const canDelete = useMemo(() => reason.trim().length >= 10, [reason]);

  const handleEmailPress = async () => {
    const subject = encodeURIComponent('Soporte EDUSHIELD - Eliminación de cuenta');
    const body = encodeURIComponent('Hola, quisiera más información sobre la eliminación de mi cuenta.');
    const url = `mailto:edushield@gmail.com?subject=${subject}&body=${body}`;

    const ok = await Linking.canOpenURL(url);
    if (!ok) {
      Alert.alert('No se pudo abrir el correo', 'Intenta nuevamente o copia el email: edushield@gmail.com');
      return;
    }
    Linking.openURL(url);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      'Esta acción es permanente. ¿Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: doDelete,
        },
      ],
    );
  };

  const doDelete = () => {
    // Logica a back para eliminar cuenta
    //await api.deleteAccount({ reason });
    Alert.alert('Cuenta eliminada', `Gracias por tu retroalimentación:\n\n${reason}`);
    // navigation.replace('Login') PARA REEMPLAZAR PANTALLA A LOGIN 
  };

  const handleDelete = () => {
    if (!canDelete) {
      Alert.alert('Atención', 'Por favor cuéntanos un poco más (mínimo 10 caracteres).');
      return;
    }
    confirmDelete();
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      {/* Header fijo */}
      <HeaderBar navigation={navigation} showBackButton={true} /* title="ELIMINAR CUENTA" */ />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cuéntanos tu experiencia 🙂</Text>

        <TextInput
          style={styles.textBox}
          placeholder="Cuéntanos tu experiencia con la app…"
          placeholderTextColor="#888"
          multiline
          numberOfLines={6}
          value={reason}
          onChangeText={setReason}
        />

        <TouchableOpacity
          style={[styles.deleteButton, !canDelete && styles.deleteButtonDisabled]}
          onPress={handleDelete}
          disabled={!canDelete}
          accessibilityRole="button"
          accessibilityLabel="Eliminar cuenta"
        >
          <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>
          Más información, escríbenos al correo{' '}
          <Text style={styles.link} onPress={handleEmailPress}>
            edushield@gmail.com
          </Text>
        </Text>

        <View style={{ height: 24 }} />
        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const THEME_RED = '#e74c3c';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 80, // separa del HeaderBar
    marginBottom: 16,
    fontWeight: '600',
  },
  textBox: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    minHeight: 160,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: THEME_RED,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  infoText: {
    color: '#fff',
    fontSize: 15,
    marginTop: 24,
    textAlign: 'center',
  },
  link: {
    color: THEME_RED,
    textDecorationLine: 'underline',
  },
  smallText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
});
