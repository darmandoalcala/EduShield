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
  ActivityIndicator,
} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { useNavigation } from '@react-navigation/native';
import { ApiService } from '../config/api';
import { useUser } from '../context/UserContext';

export default function EliminarCuenta() {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { user, logoutUser } = useUser();

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
      '⚠️ Esta acción es PERMANENTE y eliminará:\n\n• Tu cuenta y perfil\n• Todos tus reportes\n• Tu información personal\n\n¿Estás seguro de continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar definitivamente',
          style: 'destructive',
          onPress: doDelete,
        },
      ],
    );
  };

  const doDelete = async () => {
    try {
      setLoading(true);

      // Verificar que hay usuario logueado
      if (!user || !user.codigo_estudiante) {
        Alert.alert('Error', 'No se encontró información de usuario');
        return;
      }

      console.log('🗑️ Eliminando cuenta:', user.codigo_estudiante);
      console.log('📝 Razón:', reason);

      // Llamar al API para eliminar la cuenta
      await ApiService.deleteAccount(user.codigo_estudiante, reason);

      console.log('✅ Cuenta eliminada exitosamente');

      // Cerrar sesión y redirigir
      await logoutUser();

      Alert.alert(
        'Cuenta eliminada',
        'Tu cuenta ha sido eliminada exitosamente. Lamentamos verte partir.\n\nGracias por tu retroalimentación.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.error('❌ Error eliminando cuenta:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo eliminar la cuenta. Por favor, intenta nuevamente o contáctanos.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!canDelete) {
      Alert.alert('Atención', 'Por favor cuéntanos un poco más (mínimo 10 caracteres).');
      return;
    }
    confirmDelete();
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <HeaderBar navigation={navigation} showBackButton={true} />

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
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.deleteButton, !canDelete && styles.deleteButtonDisabled]}
          onPress={handleDelete}
          disabled={!canDelete || loading}
          accessibilityRole="button"
          accessibilityLabel="Eliminar cuenta"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
          )}
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
    </View>
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
