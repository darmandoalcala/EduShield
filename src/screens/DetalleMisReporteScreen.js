import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import { ApiService } from '../config/api';
import { useUser } from '../context/UserContext';

export default function DetalleReporteScreen({ route }) {
  const navigation = useNavigation();
  const { user } = useUser();
  const { id } = route.params;
  
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        console.warn('⚠️ No hay usuario en el contexto');
        Alert.alert(
          'Sesión requerida',
          'Por favor inicia sesión para ver el reporte',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Login') 
            }
          ]
        );
        return;
      }

      console.log('👤 Usuario del contexto:', user);

      const reporteData = await ApiService.getReportById(id);
      console.log('📋 Reporte cargado:', reporteData);
      setReporte(reporteData);
      
    } catch (error) {
      console.error('❌ Error cargando reporte:', error);
      Alert.alert('Error', 'No se pudo cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = () => {
    Alert.alert(
      'Confirmar Eliminación',
      '⚠️ ¿Estás seguro de que deseas eliminar este reporte?\n\nEsta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await ApiService.deleteReport(id);
              
              Alert.alert(
                '✅ Reporte Eliminado',
                'El reporte ha sido eliminado exitosamente',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              console.error('❌ Error eliminando reporte:', error);
              Alert.alert('Error', 'No se pudo eliminar el reporte');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString.replace(' ', 'T'));
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Hora no disponible';
    
    const date = new Date(dateString.replace(' ', 'T'));
    
    if (isNaN(date.getTime())) {
      return 'Hora inválida';
    }
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderBar navigation={navigation} showBackButton={true} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="red" />
          <Text style={styles.loadingText}>Cargando reporte...</Text>
        </View>
      </View>
    );
  }

  if (!reporte) {
    return (
      <View style={styles.container}>
        <HeaderBar navigation={navigation} showBackButton={true} />
        <View style={styles.centerContent}>
          <Icon name="alert-circle-outline" size={80} color="red" />
          <Text style={styles.errorTitle}>Reporte no encontrado</Text>
          <Text style={styles.errorSubtitle}>No pudimos encontrar el reporte solicitado.</Text>
        </View>
      </View>
    );
  }

  // Normalizar los campos
  const fecha = reporte.FECHA || reporte.fecha;
  const descripcion = reporte.DESCRIPCION || reporte.descripcion;
  const foto_evidencia = reporte.FOTO_EVIDENCIA || reporte.foto_evidencia;
  const video_evidencia = reporte.VIDEO_EVIDENCIA || reporte.video_evidencia;

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Detalle del Reporte</Text>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeItem}>
              <Icon name="calendar" size={18} color="#888" />
              <Text style={styles.dateTimeText}>{formatDate(fecha)}</Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Icon name="clock-outline" size={18} color="#888" />
              <Text style={styles.dateTimeText}>{formatTime(fecha)}</Text>
            </View>
          </View>
        </View>

        {/* Descripción Card */}
        <View style={styles.contentCard}>
          <View style={styles.cardHeader}>
            <Icon name="text-box-outline" size={20} color="#888" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Descripción</Text>
          </View>
          <Text style={styles.descriptionText}>{descripcion}</Text>
        </View>

        {/* Evidencias Card */}
        {(foto_evidencia || video_evidencia) && (
          <View style={styles.contentCard}>
            <View style={styles.cardHeader}>
              <Icon name="image-multiple-outline" size={20} color="#888" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Evidencias</Text>
            </View>
            
            {/* Foto de evidencia */}
            {foto_evidencia && (
              <View style={styles.evidenceItem}>
                <View style={styles.evidenceHeader}>
                  <Icon name="camera" size={18} color="#888" />
                  <Text style={styles.evidenceLabel}>Fotografía</Text>
                </View>
                <Image 
                  source={{ uri: foto_evidencia }} 
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Video de evidencia */}
            {video_evidencia && (
              <View style={styles.evidenceItem}>
                <View style={styles.evidenceHeader}>
                  <Icon name="video" size={18} color="#888" />
                  <Text style={styles.evidenceLabel}>Video</Text>
                </View>
                <Video
                  source={{ uri: video_evidencia }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                />
              </View>
            )}
          </View>
        )}

        {/* Botón de eliminar */}
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDeleteReport}
          disabled={loading}
        >
          <Icon name="delete-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.deleteText}>Eliminar Reporte</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>EDUSHIELD 2025</Text>
          <Text style={styles.footerSubtext}>Todos los derechos reservados</Text>
        </View>
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
    paddingBottom: 100,
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  errorTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  headerSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    color: '#888',
    fontSize: 16,
  },

  contentCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 12,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  descriptionText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },

  evidenceItem: {
    marginBottom: 20,
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  evidenceLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#0a0a0a',
  },
  video: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#0a0a0a',
    alignSelf: 'center',
  },

  deleteButton: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  footer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#222',
    marginTop: 20,
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