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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import { ApiService } from '../config/api';

export default function EditProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Obtener el userId desde los parámetros de navegación
  const { userId } = route.params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados del formulario
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

  // Cargar datos del usuario al montar el componente
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

      if (response.success && response.data) {
        const user = response.data;
        
        // Llenar los campos con los datos del usuario
        setFullName(user.nombre_completo || `${user.nombre} ${user.apellido}` || '');
        setEmail(user.email || '');
        setCodigoEstudiante(user.codigo_estudiante || '');
        setTelefono(user.telefono || '');
        setGender(user.sexo || '');
        setProfileImage(user.foto_perfil || null);
        // setCampus se mantiene en CUCEI por defecto

        console.log('✅ Datos del usuario cargados:', user);
      }
    } catch (error) {
      console.error('❌ Error cargando perfil:', error);
      Alert.alert('Error', 'No se pudo cargar la información del perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhoto = () => {
    Alert.alert('Próximamente', 'La función de cambiar foto estará disponible pronto');
    // Aquí irá la lógica para seleccionar/tomar foto
  };

  const handleSave = async () => {
    // Validaciones
    if (!fullName.trim()) {
      Alert.alert('Error', 'El nombre completo es obligatorio');
      return;
    }

    if (!telefono.trim() || telefono.length !== 10) {
      Alert.alert('Error', 'El teléfono debe tener 10 dígitos');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Debes seleccionar un género');
      return;
    }

    // Dividir nombre completo
    const nombreCompleto = fullName.trim().split(' ');
    const nombre = nombreCompleto[0];
    const apellido = nombreCompleto.slice(1).join(' ') || nombreCompleto[0];

    const updatedData = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono.trim(),
      sexo: gender,
    };

    setIsSaving(true);

    try {
      const response = await ApiService.updateUserProfile(userId, updatedData);

      if (response.success) {
        Alert.alert(
          'Éxito',
          'Perfil actualizado correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta nuevamente.');
    } finally {
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
        <TouchableOpacity style={styles.avatarContainer} onPress={handleAddPhoto}>
          <Image
            source={
              profileImage 
                ? { uri: profileImage }
                : require('/workspaces/EduShield/assets/contact.png')
            }
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
            editable={!isSaving}
          />
        </View>

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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="10 dígitos"
            placeholderTextColor="#aaa"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            maxLength={10}
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Centro universitario</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
            disabled={isSaving}
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
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
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

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#333',
  },
  editPhotoText: {
    color: '#fff',
    fontSize: 16,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f7f5f5',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    color: '#000',
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#d3d3d3',
    color: '#666',
  },
  helperText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f5f5',
    padding: 15,
    borderRadius: 8,
    height: 50,
  },
  dropdownText: {
    color: '#000',
    flex: 1,
    fontSize: 16,
  },
  dropdownArrow: {
    color: '#000',
    marginLeft: 10,
    fontSize: 12,
  },
  dropdownContainer: {
    backgroundColor: '#f7f5f5',
    borderRadius: 8,
    marginTop: 5,
  },
  optionItem: {
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  optionText: {
    color: '#000',
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    minWidth: '48%',
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
  genderText: {
    color: '#fff',
    fontSize: 14,
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    paddingVertical: 15,
    width: '60%',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 30,
  },
});