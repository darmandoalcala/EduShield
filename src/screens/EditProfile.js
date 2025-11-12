import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import { ApiService } from '../config/api';
import { uploadImageToS3 } from '../utils/s3Uploader';
import { useUser } from '../context/UserContext';

export default function EditProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { userId } = route.params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [codigoEstudiante, setCodigoEstudiante] = useState('');
  const [telefono, setTelefono] = useState('');
  const [campus, setCampus] = useState('CUCEI');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const campusOptions = ['CUCEI', 'CUCEA', 'CUCS'];
  const genderOptions = ['MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR'];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener la información del usuario');
      navigation.goBack();
      return;
    }

    try {
      setIsLoading(true);
      const response = await ApiService.getUserProfile(userId);

      console.log("RESPUESTA DE GETPROFILE:", JSON.stringify(response, null, 2));

      if (response.success && response.data) {
        const user = response.data;
        setFullName(user.nombre_completo || `${user.nombre} ${user.apellido}` || '');
        setEmail(user.email || '');
        setCodigoEstudiante(user.codigo_estudiante || '');
        setTelefono(user.telefono || '');
        setGender(user.sexo || '');
        setProfileImage(user.foto_perfil || null);
      }
    } catch (error) {
      console.error('❌ Error cargando perfil:', error);
      Alert.alert('Error', 'No se pudo cargar la información del perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    try {
      const options = [
        { text: 'Tomar foto', onPress: async () => pickImage(true) },
        { text: 'Elegir de galería', onPress: async () => pickImage(false) },
        { text: 'Cancelar', style: 'cancel' },
      ];

      Alert.alert('Foto de perfil', 'Selecciona una opción', options);
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  const pickImage = async (fromCamera = false) => {
    try {
      if (fromCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permiso denegado',
            'Se necesita acceso a la cámara para tomar una foto.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Abrir configuración', onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permiso denegado',
            'Se necesita acceso a la galería para elegir una foto.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Abrir configuración', onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
      }

      // 🖼️ Abrir cámara o galería
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      setProfileImage(uri);

    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo abrir la cámara o galería');
    }
  };

  const handleSave = async () => {
    // --- DEBUG 1 ---
    console.log("--- handleSave INICIADO ---");
    console.log("Validando Nombre:", fullName);
    
    if (!fullName.trim()) {
      console.log("--- FALLÓ: El nombre está vacío ---");
      Alert.alert('Error', 'El nombre completo es obligatorio');
      return;
    }

    // --- DEBUG 2 ---
    console.log("Validando Teléfono:", telefono);
    if (!telefono || !telefono.trim() || telefono.length !== 10) {
      console.log("--- FALLÓ: El teléfono no tiene 10 dígitos ---");
      Alert.alert('Error', 'El teléfono debe tener 10 dígitos');
      return;
    }

    // --- DEBUG 3 ---
    console.log("Validando Género:", gender);
    if (!gender) {
      console.log("--- FALLÓ: El género está vacío ---");
      Alert.alert('Error', 'Debes seleccionar un género');
      return;
    }

    // --- DEBUG 4 ---
    console.log("--- VALIDACIONES PASADAS. Intentando guardar... ---");
    setIsSaving(true);
    let fotoUrlParaGuardar = profileImage; 

    try {
      // 1. VERIFICA SI SE SUBIÓ UNA FOTO NUEVA
      console.log("Revisando URI de la foto:", profileImage);
      
      if (profileImage && (profileImage.startsWith('file://') || profileImage.startsWith('data:'))) {
        
        console.log('Subiendo nueva foto de perfil a S3...');
        
        // 2. SUBE LA FOTO A S3 
        const s3Url = await uploadImageToS3(profileImage, 'profiles');
        fotoUrlParaGuardar = s3Url; // Esta es la URL que se guarda en BDatos
      
      } else {
        console.log('No se seleccionó una foto nueva, guardando datos de texto.');
      }

      const nombreCompleto = fullName.trim().split(' ');
      const nombre = nombreCompleto[0];
      const apellido = nombreCompleto.slice(1).join(' ') || nombreCompleto[0];

      const updatedData = {
        nombre: nombre,
        apellido: apellido,
        telefono: telefono.trim(),
        sexo: gender,
        foto_perfil: fotoUrlParaGuardar,
      };

      // --- DEBUG 5 ---
      console.log("--- INTENTANDO GUARDAR PERFIL (Llamada a API) ---");
      console.log("Datos enviados:", JSON.stringify(updatedData, null, 2));

      const response = await ApiService.updateUserProfile(userId, updatedData);
      
      if (response.success) {
        console.log("--- ÉXITO AL GUARDAR ---");
        Alert.alert(
          'Éxito',
          'Perfil actualizado correctamente',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // Maneja el caso de que la API falle
        console.log("--- FALLÓ: La API devolvió un error ---");
        throw new Error(response.message || 'Error de la API');
      }
    } catch (error) {
      console.log("--- FALLÓ: Error en el bloque try/catch ---");
      console.error('❌ Error actualizando perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta nuevamente.');
    } finally {
      console.log("--- FIN DE handleSave ---");
      setIsSaving(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (option !== 'CUCEI') {
      Alert.alert('Información', 'Solo hay opción para CUCEI como centro universitario');
      return;
    }
    setCampus(option);
    setShowDropdown(false);
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <HeaderBar navigation={navigation} showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="red" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* 1. Sección de Cabecera (Estilo estándar) */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.subtitle}>
            Mantén tu información actualizada
          </Text>
        </View>
        
        {/* 2. Avatar */}
        <TouchableOpacity style={styles.avatarContainer} onPress={handleAddPhoto}>
          <Image
            source={
              profileImage 
                ? { uri: profileImage }
                // 🔹 Ruta relativa (más segura)
                : require('../../assets/contact.png') 
            }
            style={styles.avatar}
          />
          <View style={styles.editIcon}>
            <Icon name="camera" size={18} color="#fff" />
          </View>
          <Text style={styles.editPhotoText}>Editar foto</Text>
        </TouchableOpacity>

        {/* 3. Tarjeta de Formulario: Información Personal */}
        <Text style={styles.listTitle}>Información Personal</Text>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre completo"
              placeholderTextColor="#666"
              value={fullName}
              onChangeText={setFullName}
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="10 dígitos (ej. 3312345678)"
              placeholderTextColor="#666"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!isSaving}
            />
          </View>

          <View style={[styles.inputGroup, { marginBottom: 0 }]}>
            <Text style={styles.label}>Género</Text>
            <View style={styles.genderContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderButton,
                    gender === option && styles.genderSelected
                  ]}
                  onPress={() => handleGenderSelect(option)}
                  disabled={isSaving}
                >
                  <Text style={[
                    styles.genderText,
                    gender === option && styles.genderTextSelected
                  ]}>
                    {option === 'PREFIERO_NO_DECIR' ? 'PREFIERO NO DECIR' : option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 4. Tarjeta de Formulario: Información Académica */}
        <Text style={styles.listTitle}>Información Académica</Text>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo institucional</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false}
            />
            <Text style={styles.helperText}>El correo no se puede modificar</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código de estudiante</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={codigoEstudiante}
              editable={false}
            />
            <Text style={styles.helperText}>El código no se puede modificar</Text>
          </View>

          <View style={[styles.inputGroup, { marginBottom: 0 }]}>
            <Text style={styles.label}>Centro universitario</Text>
            <TouchableOpacity
              style={[styles.input, styles.dropdownButton]}
              onPress={() => setShowDropdown(!showDropdown)}
              disabled={isSaving}
            >
              <Text style={styles.dropdownText}>{campus}</Text>
              <Icon name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#888" />
            </TouchableOpacity>
            {showDropdown && (
              <View style={styles.dropdownContainer}>
                {campusOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.optionItem}
                    onPress={() => handleOptionSelect(option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 5. Botón de Guardar (Estilo estándar) */}
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Icon name="content-save" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>

        {/* 6. Footer (Estilo estándar) */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>EDUSHIELD 2025</Text>
          <Text style={styles.footerSubtext}>Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// --- HOJA DE ESTILOS ---
// Estilos reformados para el tema oscuro

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  
  // Header Section
  headerSection: {
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

  // Avatar
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#444',
  },
  editIcon: {
    position: 'absolute',
    bottom: 30, // Ajusta para que quede sobre la foto
    right: '35%', // Ajusta para centrar
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  editPhotoText: {
    color: '#888',
    fontSize: 14,
    marginTop: 12,
  },

  // Título de lista
  listTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 16,
  },

  // Tarjeta de Formulario
  formCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    padding: 20,
    marginBottom: 20,
  },

  // Grupo de Inputs
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#888',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#111',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputDisabled: {
    backgroundColor: '#111',
    color: '#666',
    borderColor: '#222',
  },
  helperText: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },

  // Dropdown
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  optionItem: {
    padding: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },

  // Botones de Género
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexGrow: 1,
    alignItems: 'center',
    minWidth: '48%',
  },
  genderSelected: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
  genderText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Botón de Guardar
  saveButton: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Footer
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