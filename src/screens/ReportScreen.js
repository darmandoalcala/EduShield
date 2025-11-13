// src/screens/ReportScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import HeaderBar from '../components/HeaderBar';
import { ApiService } from '../config/api';
import { useUser } from '../context/UserContext';

const centers = ['CUCEI', 'CUAAD', 'CUCEV', 'CUCS'];

const ReportScreen = ({ navigation }) => {
  const { user } = useUser();
  
  // Estados
  const [selectedCenter, setSelectedCenter] = useState(centers[0]);
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [photoUri, setPhotoUri] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('Usuario del contexto:', user);
    } else {
      console.warn('No hay usuario en el contexto');
    }
  }, [user]);

  const handleEditCenter = () => {
    console.log('Editar selección de centro universitario');
  };

  const handleEditDescription = () => {
    console.log('Editar descripción');
  };

  const handlePhotoEvidence = () => {
    Alert.alert(
      'Evidencia en Foto',
      '¿Deseas tomar una foto o seleccionar una existente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Tomar foto',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              const photo = result.assets[0];
              setPhotoUri(photo.uri);
              uploadPhoto(photo.uri, photo.type || 'image/jpeg');
            }
          },
        },
        {
          text: 'Seleccionar',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              const photo = result.assets[0];
              setPhotoUri(photo.uri);
              uploadPhoto(photo.uri, photo.type || 'image/jpeg');
            }
          },
        },
      ]
    );
  };

    const handleVideoEvidence = () => {
    Alert.alert(
      'Evidencia en Video',
      '¿Deseas grabar un video o seleccionar uno existente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Grabar',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Videos,
              videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
              durationLimit: 60,
            });

            if (!result.canceled && result.assets[0]) {
              const video = result.assets[0];
              setVideoUri(video.uri);
              uploadVideo(video.uri, video.type || 'video/mp4');
            }
          },
        },
        {
          text: 'Seleccionar',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permiso requerido', 'Necesitamos acceso a tus videos');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            });

            if (!result.canceled && result.assets[0]) {
              const video = result.assets[0];
              setVideoUri(video.uri);
              uploadVideo(video.uri, video.type || 'video/mp4');
            }
          },
        },
      ]
    );
  };

  const uploadPhoto = async (uri, type) => {
    try {
      setUploadingFile(true);
      console.log('Subiendo foto a S3...');

      const result = await ApiService.uploadEvidence(uri, type || 'image/jpeg');

      if (result.success) {
        setUploadedPhotoUrl(result.fileUrl);
        Alert.alert('Éxito', 'Foto subida correctamente');
        console.log('URL de la foto:', result.fileUrl);
      }
    } catch (error) {
      console.error('Error subiendo foto:', error);
      Alert.alert('Error', 'No se pudo subir la foto. Intenta de nuevo.');
      setPhotoUri(null);
    } finally {
      setUploadingFile(false);
    }
  };

  const uploadVideo = async (uri, type) => {
    try {
      setUploadingFile(true);
      console.log('Subiendo video a S3...');

      const result = await ApiService.uploadEvidence(uri, type || 'video/mp4');

      if (result.success) {
        setUploadedVideoUrl(result.fileUrl);
        Alert.alert('Éxito', 'Video subido correctamente');
        console.log('URL del video:', result.fileUrl);
      }
    } catch (error) {
      console.error('Error subiendo video:', error);
      Alert.alert('Error', 'No se pudo subir el video. Intenta de nuevo.');
      setVideoUri(null);
    } finally {
      setUploadingFile(false);
    }
  };

  const validateReport = () => {
    if (!descripcion || descripcion.trim() === '') {
      Alert.alert('Error', 'Por favor, describe los hechos del incidente');
      return false;
    }

    if (descripcion.trim().length < 10) {
      Alert.alert('Error', 'La descripción debe tener al menos 10 caracteres');
      return false;
    }

    if (!user || !user.codigo_estudiante) {
      Alert.alert('Error', 'No se encontraron los datos del usuario. Por favor, inicia sesión nuevamente.');
      return false;
    }

    return true;
  };

  const handleSendReport = async () => {
    if (!validateReport()) {
      return;
    }

    Alert.alert(
      'Confirmar Envío',
      '¿Estás seguro de que deseas enviar este reporte de incidente?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Enviar',
          onPress: async () => {
            try {
              setLoading(true);
              let fotoEvidenciaUrl = null;
              let videoEvidenciaUrl = null;

              // 1. SUBIR FOTO A S3 SI EXISTE
              if (photoEvidence) {
                console.log('📤 Subiendo foto de evidencia a S3...');
                setIsUploadingPhoto(true);
                
                try {
                  fotoEvidenciaUrl = await uploadImageToS3(photoEvidence, 'reports');
                  console.log('✅ Foto subida exitosamente:', fotoEvidenciaUrl);
                } catch (uploadError) {
                  console.error('❌ Error subiendo foto:', uploadError);
                  Alert.alert(
                    'Error',
                    'No se pudo subir la foto de evidencia. ¿Deseas continuar sin ella?',
                    [
                      { text: 'Cancelar', style: 'cancel', onPress: () => setLoading(false) },
                      { text: 'Continuar', onPress: () => {} }
                    ]
                  );
                  return;
                } finally {
                  setIsUploadingPhoto(false);
                }
              }

              // 🆕 2. SUBIR VIDEO A S3 SI EXISTE
              if (videoEvidence) {
                console.log('📤 Subiendo video de evidencia a S3...');
                setIsUploadingVideo(true);
                
                try {
                  videoEvidenciaUrl = await uploadVideoToS3(videoEvidence, 'reports');
                  console.log('✅ Video subido exitosamente:', videoEvidenciaUrl);
                } catch (uploadError) {
                  console.error('❌ Error subiendo video:', uploadError);
                  Alert.alert(
                    'Error',
                    'No se pudo subir el video de evidencia. ¿Deseas continuar sin él?',
                    [
                      { text: 'Cancelar', style: 'cancel', onPress: () => setLoading(false) },
                      { text: 'Continuar', onPress: () => {} }
                    ]
                  );
                  return;
                } finally {
                  setIsUploadingVideo(false);
                }
              }

              const centerMap = {
                'CUCEI': 1,
                'CUAAD': 2,
                'CUCEV': 3,
                'CUCS': 4,
              };

              const reportData = {
                titulo: `Reporte de incidente - ${selectedCenter}`,
                descripcion: descripcion.trim(),
                coordenada_lat: null,
                coordenada_lng: null,
                categoria_id: 1,
                nivel_riesgo: 'medio',
                foto_evidencia: uploadedPhotoUrl || uploadedVideoUrl || null,
                codigo_estudiante: user.codigo_estudiante,
                centro_id: centerMap[selectedCenter] || 1,
              };

              console.log('Enviando reporte:', reportData);

              const response = await ApiService.createReport(reportData);
              console.log('Respuesta del servidor:', response);

              Alert.alert(
                '¡Éxito!',
                'Tu reporte ha sido enviado exitosamente. Las autoridades universitarias revisarán tu caso.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Limpiar formulario
                      setDescripcion('');
                      setPhotoEvidence(null);
                      setVideoEvidence(null);
                      setFecha(new Date());
                      setPhotoUri(null);
                      setVideoUri(null);
                      setUploadedPhotoUrl(null);
                      setUploadedVideoUrl(null);
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Error enviando reporte:', error);
              Alert.alert(
                'Error',
                error.message || 'No se pudo enviar el reporte. Por favor, intenta de nuevo.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.instructionAText}>Centro Universitario asignado:</Text>
        <View style={styles.sectionBox}>
          <View style={styles.row}>
            <Text style={styles.iconLeft}>🎓</Text>
            <View style={styles.pickerPlaceholder}>
              <Text style={styles.pickerText}>{selectedCenter}</Text>
            </View>
            <TouchableOpacity onPress={handleEditCenter} style={styles.iconSide}>
              <Icon
                name="pencil-outline"
                size={20}
                color="#FFF"
                style={{ marginTop: 10, marginLeft: 310 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.instructionAText}>Fecha y hora exacta del incidente.</Text>
        <View style={styles.sectionBox}>
          <View style={styles.row}>
            <Icon name="calendar-outline" size={20} color="#FFF" style={styles.iconLeft} />
            <Text style={styles.textInfo}>{formatDate(fecha)}</Text>
          </View>
        </View>

        <Text style={styles.instructionAText}>Da un breve resumen de los hechos.</Text>
        <View style={styles.sectionBoxes}>
          <View style={styles.rowWithSpace}>
            <Icon name="alert-circle-outline" size={20} color="#FFF" marginTop={-25} style={styles.iconLeft} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TextInput
                style={styles.textInputFlex}
                placeholder="Escribe aquí..."
                placeholderTextColor="#888"
                multiline
                value={descripcion}
                onChangeText={setDescripcion}
                editable={!loading && !uploadingFile}
              />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={handleRemovePhoto}
              >
                <Icon name="close-circle" size={30} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.sectionBox}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <TouchableOpacity
              style={[
                styles.evidenceButtonPlaceholder,
                videoEvidence && styles.evidenceButtonActive
              ]}
              onPress={handleVideoEvidence}
              disabled={loading || uploadingFile}
            >
              <Text style={styles.evidenceText}>
                {videoUri ? 'Video seleccionado ✓' : 'Evidencia en video'}
              </Text>
              <Text style={styles.iconRight}>🎥</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.evidenceButtonPlaceholder,
                photoEvidence && styles.evidenceButtonActive
              ]}
              onPress={handlePhotoEvidence}
              disabled={loading || uploadingFile}
            >
              <Text style={styles.evidenceText}>
                {photoUri ? 'Foto seleccionada ✓' : 'Evidencia en foto'}
              </Text>
              <Text style={styles.iconRight}>📸</Text>
            </TouchableOpacity>
          </View>
        </View>

        {uploadingFile && (
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ color: '#FFF', marginTop: 10 }}>Subiendo archivo...</Text>
          </View>
        )}

        <Text style={styles.instructionAText}>
          Cualquier evidencia queda respaldada por la ley de protección de datos.
        </Text>

        <TouchableOpacity
          style={[
            styles.sendButtonPlaceholder,
            (loading || uploadingFile) && { opacity: 0.5 }
          ]}
          onPress={handleSendReport}
          disabled={loading || uploadingFile}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Text style={styles.sendButtonText}>Reporte de incidente</Text>
              <Text style={styles.iconRight}>⚠️</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ... (Aquí empiezan los estilos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 120,
  },
  
  // === SECCIONES ===
  sectionBox: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    width: '100%',
    minHeight: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  
  // === NUEVO: Container mejorado para descripción ===
  descriptionContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    width: '100%',
    height: 160, // Altura fija
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  
  descriptionIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  
  descriptionInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    paddingLeft: 36, // Espacio para el icono
    paddingRight: 12,
    paddingTop: 2,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  
  // === TEXTOS ===
  instructionAText: {
    color: '#B4B4B8',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  
  textInfo: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  
  // === FILAS Y LAYOUT ===
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // === ICONOS ===
  iconLeft: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 12,
  },
  
  iconRight: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  
  iconSide: {
    zIndex: 1,
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  
  // === PICKER ===
  pickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
  },
  
  pickerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // === BOTONES DE EVIDENCIA ===
  evidenceButtonPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#3A3A3C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  
  evidenceButtonActive: {
    backgroundColor: '#1C6DD0',
    borderColor: '#2E7FE3',
    shadowColor: '#1C6DD0',
    shadowOpacity: 0.4,
  },
  
  evidenceText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // === PREVIEW DE MEDIOS ===
  photoPreviewContainer: {
    marginBottom: 20,
  },
  
  photoPreviewBox: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  
  photoPreview: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
  },
  
  removePhotoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // === BOTÓN PRINCIPAL DE ENVÍO ===
  sendButtonPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 24,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    minHeight: 60,
    width: '85%',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#FF6B64',
  },
  
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ReportScreen;