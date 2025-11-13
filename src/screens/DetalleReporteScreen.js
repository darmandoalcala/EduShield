import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import ApiService from '../config/api';

export default function DetalleReporteScreen({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;

  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await ApiService.getAllReports();
        const data = Array.isArray(response?.data) ? response.data : [];
        const encontrado = data.find(r => String(r.ID) === String(id));
        setReporte(encontrado || null);
      } catch (error) {
        console.error('❌ Error obteniendo reporte:', error);
        setReporte(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReporte();
  }, [id]);

  // 🆕 Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      let date;
      
      // Si viene en formato "YYYY-MM-DD HH:MM:SS"
      if (dateString.includes(' ')) {
        date = new Date(dateString.replace(' ', 'T'));
      } 
      // Si viene en formato ISO
      else if (dateString.includes('T')) {
        date = new Date(dateString);
      }
      // Formato alternativo
      else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Fecha inválida:', dateString);
        return 'Fecha inválida';
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('❌ Error parseando fecha:', error);
      return 'Error en fecha';
    }
  };

  // 🆕 Función para formatear hora
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      let date;
      
      // Si viene en formato "YYYY-MM-DD HH:MM:SS"
      if (dateString.includes(' ')) {
        date = new Date(dateString.replace(' ', 'T'));
      } 
      // Si viene en formato ISO
      else if (dateString.includes('T')) {
        date = new Date(dateString);
      }
      // Formato alternativo
      else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('❌ Error parseando hora:', error);
      return '';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderBar navigation={navigation} showBackButton={true} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FF3B30" />
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
          <Icon name="alert-circle-outline" size={80} color="#FF3B30" />
          <Text style={styles.errorTitle}>Reporte no encontrado</Text>
          <Text style={styles.errorSubtitle}>No pudimos encontrar el reporte solicitado.</Text>
        </View>
      </View>
    );
  }

  const fecha = reporte.FECHA || reporte.fecha;
  const descripcion = reporte.DESCRIPCION || reporte.descripcion || 'Sin descripción';
  const fotoEvidencia = reporte.FOTO_EVIDENCIA || reporte.foto_evidencia;
  const videoEvidencia = reporte.VIDEO_EVIDENCIA || reporte.video_evidencia;

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Detalle del Reporte</Text>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeItem}>
              <Icon name="calendar" size={18} color="#B4B4B8" />
              <Text style={styles.dateTimeText}>{formatDate(fecha)}</Text>
            </View>
            {formatTime(fecha) && (
              <View style={styles.dateTimeItem}>
                <Icon name="clock-outline" size={18} color="#B4B4B8" />
                <Text style={styles.dateTimeText}>{formatTime(fecha)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Descripción Card */}
        <View style={styles.contentCard}>
          <View style={styles.cardHeader}>
            <Icon name="text-box-outline" size={20} color="#B4B4B8" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Descripción</Text>
          </View>
          <Text style={styles.descriptionText}>{descripcion}</Text>
        </View>

        {/* Sección de evidencias */}
        {(fotoEvidencia || videoEvidencia) ? (
          <View style={styles.contentCard}>
            <View style={styles.cardHeader}>
              <Icon name="image-multiple-outline" size={20} color="#B4B4B8" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Evidencias</Text>
            </View>

            {/* Foto de evidencia */}
            {fotoEvidencia && (
              <View style={styles.evidenceItem}>
                <View style={styles.evidenceHeader}>
                  <Icon name="camera" size={18} color="#B4B4B8" />
                  <Text style={styles.evidenceLabel}>Fotografía</Text>
                </View>
                <Image
                  source={{ uri: fotoEvidencia }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Video de evidencia */}
            {videoEvidencia && (
              <View style={styles.evidenceItem}>
                <View style={styles.evidenceHeader}>
                  <Icon name="video" size={18} color="#B4B4B8" />
                  <Text style={styles.evidenceLabel}>Video</Text>
                </View>
                <Video
                  source={{ uri: videoEvidencia }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                />
              </View>
            )}
          </View>
        ) : (
          /* Mensaje si no hay evidencias */
          <View style={styles.contentCard}>
            <View style={styles.cardHeader}>
              <Icon name="image-off-outline" size={20} color="#B4B4B8" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Evidencias</Text>
            </View>
            <View style={styles.noEvidenceContainer}>
              <Icon name="file-document-outline" size={48} color="#3A3A3C" />
              <Text style={styles.noEvidenceText}>No se adjuntaron evidencias</Text>
            </View>
          </View>
        )}

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
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  // === LOADING Y ERRORES ===
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#B4B4B8',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  // === HEADER ===
  headerSection: {
    marginTop: 20,
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#B4B4B8',
    fontSize: 16,
    fontWeight: '500',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    color: '#B4B4B8',
    fontSize: 15,
    fontWeight: '500',
  },

  // === CARDS ===
  contentCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2C2C2E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    paddingBottom: 12,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    color: '#B4B4B8',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },

  // === EVIDENCIAS ===
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
    color: '#B4B4B8',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  video: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },

  // === SIN EVIDENCIAS ===
  noEvidenceContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noEvidenceText: {
    color: '#6E6E73',
    fontSize: 15,
    marginTop: 16,
    fontWeight: '500',
  },

  // === FOOTER ===
  footer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    marginTop: 40,
  },
  footerText: {
    color: '#6E6E73',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  footerSubtext: {
    color: '#3A3A3C',
    fontSize: 10,
    letterSpacing: 0.5,
  },
});