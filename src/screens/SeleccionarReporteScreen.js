import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import ApiService from '../config/api';

export default function SeleccionarReporteScreen() {
  const navigation = useNavigation();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const response = await ApiService.getAllReports();
        console.log('📦 Respuesta del backend:', response);

        // 🔹 Extraemos el arreglo de reportes
        const data = Array.isArray(response?.data) ? response.data : [];
        setReportes(data);
      } catch (error) {
        console.error('❌ Error obteniendo reportes:', error);
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Reportes</Text>
          <Text style={styles.subtitle}>
            Aquí podrás estar informado sobre lo que pasa en tu centro universitario
          </Text>
        </View>

        <View style={styles.reportesList}>
          <Text style={styles.listTitle}>Selecciona el reporte que quieras ver</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#ff3333" style={{ marginTop: 20 }} />
          ) : reportes.length === 0 ? (
            <Text style={styles.reporteSubtext}>No hay reportes disponibles.</Text>
          ) : (
            reportes.map((reporte, index) => (
              <TouchableOpacity
                key={reporte.ID || index}
                style={styles.reporteCard}
                onPress={() => navigation.navigate('DetalleReporte', { id: reporte.ID })}
                activeOpacity={0.7}
              >
                <View style={styles.reporteIconContainer}>
                  <Icon name="chat-alert-outline" size={24} color="red" />
                </View>

                <View style={styles.reporteContent}>
                  <Text style={styles.reporteDescription}>
                    {reporte.DESCRIPCION?.length > 30
                      ? `${reporte.DESCRIPCION.slice(0, 30)}...`
                      : reporte.DESCRIPCION}
                  </Text>
                  <Text style={styles.reporteSubtext}>Reporte de la comunidad</Text>
                </View>

                <View style={styles.reporteArrow}>
                  <Icon name="chevron-right" size={24} color="#666" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            Nota: Cualquier reporte será anónimo ante este público.
          </Text>
          <Text style={styles.footerText}>EDUSHIELD 2025</Text>
          <Text style={styles.footerSubtext}>Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// --- HOJA DE ESTILOS ---
// Esta es una copia de los estilos de MisReporteScreen,
// con pequeños ajustes para este contenido.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  
  // Header Section
  headerSection: {
    marginTop: 20,
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

  // Reportes List
  reportesList: {
    marginBottom: 24,
  },
  listTitle: {
    color: 'red', // Mantenemos el color rojo que tenías
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  reporteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  reporteIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 0, 0, 0.1)', // Fondo rojo traslúcido
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reporteContent: {
    flex: 1,
  },
  // Estilo para la descripción principal (basado en 'reporteDate')
  reporteDescription: {
    color: 'white',
    fontSize: 16, // Ligero ajuste para descripciones
    fontWeight: '600',
    marginBottom: 4,
  },
  // Estilo para el subtexto (basado en 'reporteTime')
  reporteSubtext: {
    color: '#888',
    fontSize: 14,
  },
  reporteArrow: {
    marginLeft: 8,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#222',
    marginTop: 20,
  },
  footerNote: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
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