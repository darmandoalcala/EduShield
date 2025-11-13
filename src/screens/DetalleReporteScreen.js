import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
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

  const fecha = reporte.FECHA || 'Sin fecha';
  const hora = reporte.HORA || '';
  const descripcion = reporte.DESCRIPCION || 'Sin descripción';

  // Separar evidencias de foto y video
  const fotoEvidencia = reporte.FOTO_EVIDENCIA;
  const videoEvidencia = reporte.VIDEO_EVIDENCIA;

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Detalle del Reporte</Text>
          <Text style={styles.subtitle}>{`${fecha} ${hora}`}</Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.cardHeader}>
            <Icon name="text-box-outline" size={20} color="#888" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Descripción</Text>
          </View>
          <Text style={styles.descriptionText}>{descripcion}</Text>
        </View>

        {/* Sección de evidencias */}
        {(fotoEvidencia || videoEvidencia) && (
          <View style={styles.contentCard}>
            <View style={styles.cardHeader}>
              <Icon name="image-multiple-outline" size={20} color="#888" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Evidencias</Text>
            </View>

            {/* Foto de evidencia */}
            {fotoEvidencia && (
              <View style={styles.evidenceItem}>
                <View style={styles.evidenceHeader}>
                  <Icon name="camera" size={18} color="#888" />
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
                  <Icon name="video" size={18} color="#888" />
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
        )}

        {/* Mensaje si no hay evidencias */}
        {!fotoEvidencia && !videoEvidencia && (
          <View style={styles.contentCard}>
            <View style={styles.cardHeader}>
              <Icon name="image-off-outline" size={20} color="#888" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Evidencias</Text>
            </View>
            <View style={styles.noEvidenceContainer}>
              <Icon name="file-document-outline" size={48} color="#333" />
              <Text style={styles.noEvidenceText}>No se adjuntaron evidencias</Text>
            </View>
          </View>
        )}

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
    backgroundColor: '#000' 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 100 
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
    marginBottom: 8 
  },
  errorSubtitle: { 
    color: '#888', 
    fontSize: 16, 
    textAlign: 'center',
    lineHeight: 22,
  },

  headerSection: { 
    marginTop: 20, 
    marginBottom: 24 
  },
  title: { 
    color: 'white', 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  subtitle: { 
    color: '#888', 
    fontSize: 18, 
    lineHeight: 22 
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
    paddingBottom: 12 
  },
  cardIcon: { 
    marginRight: 10 
  },
  cardTitle: { 
    color: '#888', 
    fontSize: 14, 
    fontWeight: '600', 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  descriptionText: { 
    color: 'white', 
    fontSize: 16, 
    lineHeight: 24 
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

  noEvidenceContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noEvidenceText: { 
    color: '#666', 
    fontSize: 14, 
    fontStyle: 'italic',
    marginTop: 12,
  },

  footer: { 
    alignItems: 'center', 
    paddingTop: 40, 
    paddingBottom: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#222', 
    marginTop: 20 
  },
  footerText: { 
    color: '#444', 
    fontSize: 12, 
    fontWeight: '600', 
    letterSpacing: 2, 
    marginBottom: 4 
  },
  footerSubtext: { 
    color: '#333', 
    fontSize: 10 
  },
});