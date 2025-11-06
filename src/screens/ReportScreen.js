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
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
            const options = {
              mediaType: 'photo',
              quality: 0.8,
              maxWidth: 1024,
              maxHeight: 1024,
            };

            try {
              const result = await launchCamera(options);
              
              if (result.didCancel) {
                console.log('Usuario canceló la foto');
                return;
              }

              if (result.errorCode) {
                Alert.alert('Error', 'No se pudo acceder a la cámara');
                return;
              }

              if (result.assets && result.assets[0]) {
                const photo = result.assets[0];
                setPhotoUri(photo.uri);
                await uploadPhoto(photo.uri, photo.type);
              }
            } catch (error) {
              console.error('Error al tomar foto:', error);
              Alert.alert('Error', 'No se pudo tomar la foto');
            }
          }
        },
        { 
          text: 'Seleccionar', 
          onPress: async () => {
            const options = {
              mediaType: 'photo',
              quality: 0.8,
              maxWidth: 1024,
              maxHeight: 1024,
            };

            try {
              const result = await launchImageLibrary(options);
              
              if (result.didCancel) {
                console.log('Usuario canceló la selección');
                return;
              }

              if (result.errorCode) {
                Alert.alert('Error', 'No se pudo acceder a la galería');
                return;
              }

              if (result.assets && result.assets[0]) {
                const photo = result.assets[0];
                setPhotoUri(photo.uri);
                await uploadPhoto(photo.uri, photo.type);
              }
            } catch (error) {
              console.error('Error al seleccionar foto:', error);
              Alert.alert('Error', 'No se pudo seleccionar la foto');
            }
          }
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
            const options = {
              mediaType: 'video',
              videoQuality: 'medium',
              durationLimit: 60,
            };

            try {
              const result = await launchCamera(options);
              
              if (result.didCancel) {
                console.log('Usuario canceló el video');
                return;
              }

              if (result.errorCode) {
                Alert.alert('Error', 'No se pudo acceder a la cámara');
                return;
              }

              if (result.assets && result.assets[0]) {
                const video = result.assets[0];
                setVideoUri(video.uri);
                await uploadVideo(video.uri, video.type);
              }
            } catch (error) {
              console.error('Error al grabar video:', error);
              Alert.alert('Error', 'No se pudo grabar el video');
            }
          }
        },
        { 
          text: 'Seleccionar', 
          onPress: async () => {
            const options = {
              mediaType: 'video',
              videoQuality: 'medium',
            };

            try {
              const result = await launchImageLibrary(options);
              
              if (result.didCancel) {
                console.log('Usuario canceló la selección');
                return;
              }

              if (result.errorCode) {
                Alert.alert('Error', 'No se pudo acceder a la galería');
                return;
              }

              if (result.assets && result.assets[0]) {
                const video = result.assets[0];
                setVideoUri(video.uri);
                await uploadVideo(video.uri, video.type);
              }
            } catch (error) {
              console.error('Error al seleccionar video:', error);
              Alert.alert('Error', 'No se pudo seleccionar el video');
            }
          }
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
                      setDescripcion('');
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
            </View>
            <TouchableOpacity onPress={handleEditDescription}>
              <Icon name="pencil-outline" size={20} color="#FFF" marginTop={-25} style={styles.iconRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionBox}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <TouchableOpacity
              style={styles.evidenceButtonPlaceholder}
              onPress={handleVideoEvidence}
              disabled={loading || uploadingFile}
            >
              <Text style={styles.evidenceText}>
                {videoUri ? 'Video seleccionado ✓' : 'Evidencia en video'}
              </Text>
              <Text style={styles.iconRight}>🎥</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.evidenceButtonPlaceholder}
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
    backgroundColor: 'black',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    width: '100%',
    marginTop: 50,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    tintColor: 'white',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mensaje: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: '#333333',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navImage: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  sectionBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    width: '100%',
    height: 55,
  },
  sectionBoxes: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    width: '100%',
    height: 150,
  },
  instructionAText: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    fontSize: 18,
    color: '#FFF',
    marginRight: 8,
  },
  iconSide: {
    zIndex: 1,
    position: 'absolute',
  },
  pickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
  },
  pickerText: {
    color: '#FFF',
    fontSize: 17,
  },
  pickerContainer: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textInfo: {
    flex: 1,
    color: '#FFF',
    fontSize: 17,
  },
  instructionText: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
    marginTop: 40,
  },
  textInputFlex: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    minHeight: 90,
    textAlignVertical: 'top',
    padding: 0,
    marginHorizontal: 8,
    marginTop: 55,
  },
  evidenceButtonPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  evidenceText: {
    flex: 1,
    color: '#FFF',
    fontSize: 14.5,
  },
  iconRight: {
    fontSize: 18,
    color: '#FFF',
    marginLeft: 8,
  },
  rowWithSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sendButtonPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 20,
    marginLeft: '60',
    height: 60,
    width: '70%',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default ReportScreen;