// RegisterScreen2.js - Con iconos PNG para mostrar/ocultar contraseña

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { API_BASE_URL, ApiService } from '../config/api';

const RegisterScreen2 = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { userData } = route.params || {};

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [codigoEstudiante, setCodigoEstudiante] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const genderOptions = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Femenino', value: 'FEMENINO' },
    { label: 'Otro', value: 'OTRO' },
    { label: 'Prefiero no decir', value: 'PREFIERO_NO_DECIR' }
  ];

  const validateCodigoEstudiante = (codigo) => {
    const codigoRegex = /^[0-9]{9}$/;
    return codigoRegex.test(codigo);
  };

  const validateTelefono = (telefono) => {
    const telefonoRegex = /^[0-9]{10}$/;
    return telefonoRegex.test(telefono);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const selectImage = () => {
    const options = ['Tomar foto', 'Elegir de galería', 'Cancelar'];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: options, cancelButtonIndex: 2 },
        (buttonIndex) => {
          if (buttonIndex === 0) openCamera();
          else if (buttonIndex === 1) openGallery();
        }
      );
    } else {
      Alert.alert('Seleccionar imagen', 'Elige una opción', [
        { text: 'Tomar foto', onPress: openCamera },
        { text: 'Elegir de galería', onPress: openGallery },
        { text: 'Cancelar', style: 'cancel' }
      ]);
    }
  };

  const openCamera = () => {
    console.log('Abrir cámara');
    Alert.alert('Función no implementada', 'Esta función requiere react-native-image-picker');
    setProfileImage({
      uri: 'https://via.placeholder.com/150x150/red/white?text=FOTO',
      type: 'image/jpeg',
      name: 'profile_camera.jpg'
    });
  };

  const openGallery = () => {
    console.log('Abrir galería');
    Alert.alert('Función no implementada', 'Esta función requiere react-native-image-picker');
    setProfileImage({
      uri: 'https://via.placeholder.com/150x150/blue/white?text=GALERIA',
      type: 'image/jpeg',
      name: 'profile_gallery.jpg'
    });
  };

  const removeImage = () => {
    Alert.alert('Remover foto', '¿Estás seguro de que quieres remover la foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => setProfileImage(null) }
    ]);
  };

  const renderGenderOption = (option) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.genderOption,
        {
          borderColor: colors.border,
          backgroundColor: selectedGender === option.value ? 'red' : 'transparent',
        }
      ]}
      onPress={() => setSelectedGender(option.value)}
    >
      <Text
        style={[
          styles.genderText,
          {
            color: selectedGender === option.value ? 'white' : colors.text,
            fontWeight: selectedGender === option.value ? 'bold' : 'normal',
          }
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  const handleRegister = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return;
    }

    if (nombre.trim().length < 2) {
      Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres.');
      return;
    }

    if (!apellido.trim()) {
      Alert.alert('Error', 'El apellido es obligatorio.');
      return;
    }

    if (apellido.trim().length < 2) {
      Alert.alert('Error', 'El apellido debe tener al menos 2 caracteres.');
      return;
    }

    if (!codigoEstudiante.trim()) {
      Alert.alert('Error', 'El código de estudiante es obligatorio.');
      return;
    }

    if (!validateCodigoEstudiante(codigoEstudiante)) {
      Alert.alert('Error', 'El código de estudiante debe tener 9 dígitos.');
      return;
    }

    if (!telefono.trim()) {
      Alert.alert('Error', 'El teléfono es obligatorio.');
      return;
    }

    if (!validateTelefono(telefono)) {
      Alert.alert('Error', 'El teléfono debe tener 10 dígitos.');
      return;
    }

    if (!selectedGender) {
      Alert.alert('Error', 'Debes seleccionar un género.');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'La contraseña es obligatoria.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const completeUserData = {
      codigo_estudiante: codigoEstudiante.trim(),
      nombre_completo: `${nombre.trim()} ${apellido.trim()}`,
      email: userData?.email || '',
      password: password,
      sexo: selectedGender,
      telefono: telefono.trim(),
    };

    console.log('📤 Datos para enviar:', completeUserData);

    setIsLoading(true);

    try {
      const response = await ApiService.registerUser(completeUserData);

      if (response.success) {
        Alert.alert(
          '🎉 ¡Registro exitoso!',
          `¡Bienvenido ${nombre}! Tu cuenta ha sido creada correctamente.`,
          [
            {
              text: 'Continuar',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainApp' }],
                });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Error completo:', error);

      let errorMessage = 'Hubo un problema al crear tu cuenta. Intenta nuevamente.';

      if (error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
      } else if (error.message.includes('ya existe')) {
        errorMessage = 'Ya existe una cuenta con este email o código estudiantil.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: 'black' }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: 'white' }]}>EDUSHIELD</Text>
          <Image
            source={require('../../assets/edushield-high-resolution-logo-transparent (1).png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.welcome, { color: 'white' }]}>¡COMPLETA TU PERFIL!</Text>
          <Text style={[styles.subtext, { color: 'white' }]}>
            Ingresa tus datos personales para finalizar el registro
          </Text>
        </View>

        <View style={styles.profileImageContainer}>
          <Text style={[styles.sectionTitle, { color: 'white', textAlign: 'center' }]}>
            Foto de perfil (opcional)
          </Text>

          <TouchableOpacity
            style={styles.imageSelector}
            onPress={selectImage}
            disabled={isLoading}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage.uri }}
                style={styles.profileImagePreview}
              />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.imagePlaceholderText, { color: colors.text }]}>📷</Text>
                <Text style={[styles.imagePlaceholderSubtext, { color: colors.text }]}>Toca para agregar</Text>
              </View>
            )}
          </TouchableOpacity>

          {profileImage && (
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
              disabled={isLoading}
            >
              <Text style={styles.removeImageText}>❌ Remover foto</Text>
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Nombre completo"
          placeholderTextColor={colors.textSecondary}
          value={nombre}
          onChangeText={setNombre}
          maxLength={100}
          autoCapitalize="words"
          returnKeyType="next"
          editable={!isLoading}
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Apellidos"
          placeholderTextColor={colors.textSecondary}
          value={apellido}
          onChangeText={setApellido}
          maxLength={100}
          autoCapitalize="words"
          returnKeyType="next"
          editable={!isLoading}
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Código de estudiante (9 dígitos)"
          placeholderTextColor={colors.textSecondary}
          value={codigoEstudiante}
          onChangeText={setCodigoEstudiante}
          maxLength={9}
          keyboardType="numeric"
          returnKeyType="next"
          editable={!isLoading}
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Teléfono (10 dígitos)"
          placeholderTextColor={colors.textSecondary}
          value={telefono}
          onChangeText={setTelefono}
          maxLength={10}
          keyboardType="phone-pad"
          returnKeyType="next"
          editable={!isLoading}
        />

        <Text style={[styles.sectionTitle, { color: 'white' }]}>Género</Text>
        <View style={styles.genderContainer}>
          {genderOptions.map(renderGenderOption)}
        </View>

        {/* CONTRASEÑA CON ICONO PNG */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border, paddingRight: 50 }]}
            placeholder="Contraseña"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            maxLength={255}
            secureTextEntry={!showPassword}
            returnKeyType="next"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            <Image
              source={showPassword 
                ? require('../../assets/eye-off.png') 
                : require('../../assets/eye.png')
              }
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        </View>

        {/* CONFIRMAR CONTRASEÑA CON ICONO PNG */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border, paddingRight: 50 }]}
            placeholder="Confirmar contraseña"
            placeholderTextColor={colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            maxLength={255}
            secureTextEntry={!showConfirmPassword}
            returnKeyType="done"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            <Image
              source={showConfirmPassword 
                ? require('../../assets/eye-off.png') 
                : require('../../assets/eye.png')
              }
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordHints}>
          <Text style={[styles.hintText, { color: 'white', opacity: 0.7 }]}>
            La contraseña debe contener:
          </Text>
          <Text style={[styles.hintText, { color: 'white', opacity: 0.7 }]}>
            • Al menos 8 caracteres • Mayúscula • Minúscula • Número
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: 'red',
              opacity: (nombre && apellido && codigoEstudiante && telefono && selectedGender && password && confirmPassword && !isLoading) ? 1 : 0.6
            }
          ]}
          onPress={handleRegister}
          disabled={!(nombre && apellido && codigoEstudiante && telefono && selectedGender && password && confirmPassword) || isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
              <Text style={[styles.buttonText, { color: 'white' }]}>Registrando...</Text>
            </View>
          ) : (
            <Text style={[styles.buttonText, { color: 'white' }]}>Regístrate</Text>
          )}
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={[styles.progressText, { color: 'white' }]}>Paso 2 de 3</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 60,
    marginRight: -40,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  textContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  genderOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  genderText: {
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 17,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconImage: {
    width: 24,
    height: 24,
    tintColor: '#999',
  },
  passwordHints: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  hintText: {
    fontSize: 12,
    marginBottom: 2,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'red',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.8,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageSelector: {
    marginVertical: 15,
  },
  profileImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'red',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 40,
    marginBottom: 5,
  },
  imagePlaceholderSubtext: {
    fontSize: 12,
    opacity: 0.7,
  },
  removeImageButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 15,
  },
  removeImageText: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen2;