import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import { ApiService } from '../config/api';
import { useUser } from '../context/UserContext'; 

export default function MisReporteScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadUserReports();
    }, [user]) 
  );

  const loadUserReports = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.codigo_estudiante) {
        console.warn('No hay usuario en el contexto');
        Alert.alert(
          'Sesión requerida',
          'Por favor inicia sesión para ver tus reportes',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Login') 
            }
          ]
        );
        setReportes([]);
        setLoading(false);
        return;
      }

      console.log('Usuario del contexto:', user);

      const response = await ApiService.getUserReports(user.codigo_estudiante);
      console.log('Reportes cargados:', response.data);
      setReportes(response.data || []);
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserReports();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    // Tu lógica para parsear la fecha es correcta
    const date = new Date(dateString.replace(' ', 'T'));
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    // Opciones para el formato: día numérico, mes completo, año numérico
    const options = { 
      year: 'numeric', 
      month: 'long', // 'long' nos da el nombre completo (ej: "Octubre")
      day: 'numeric' 
    };
    
    // Usamos 'es-ES' (o 'es-MX') para español.
    // Esta función automáticamente añade el "de" necesario.
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString.replace(' ', 'T'));
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderBar navigation={navigation} showBackButton={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="red" />
          <Text style={styles.loadingText}>Cargando tus reportes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="red"
            colors={['red']}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Mis Reportes</Text>
          <Text style={styles.subtitle}>
            Consulta el historial de tus incidentes reportados
          </Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{reportes.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {reportes.filter(r => {
                const date = new Date(r.FECHA || r.fecha);
                const today = new Date();
                return date.toDateString() === today.toDateString();
              }).length}
            </Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
        </View>

        {/* Reportes List */}
        {reportes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Icon name="file-document-outline" size={80} color="#333" />
            </View>
            <Text style={styles.emptyTitle}>No tienes reportes</Text>
            <Text style={styles.emptySubtitle}>
              Los reportes que crees aparecerán aquí
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => navigation.navigate('Report')}
            >
              <Icon name="plus" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.createButtonText}>Crear reporte</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportesList}>
            <Text style={styles.listTitle}>Historial de reportes</Text>
            {reportes.map((reporte, index) => {
              const fecha = reporte.FECHA || reporte.fecha;
              return (
                <TouchableOpacity
                  key={reporte.ID || reporte.id || index}
                  style={styles.reporteCard}
                  onPress={() => navigation.navigate('DetalleMisReporte', { 
                    id: reporte.ID || reporte.id 
                  })}
                  activeOpacity={0.7}
                >
                  <View style={styles.reporteIconContainer}>
                    <Icon name="alert-circle" size={24} color="red" />
                  </View>
                  
                  <View style={styles.reporteContent}>
                    <Text style={styles.reporteDate}>{formatDate(fecha)}</Text>
                    <Text style={styles.reporteTime}>{formatTime(fecha)}</Text>
                  </View>

                  <View style={styles.reporteArrow}>
                    <Icon name="chevron-right" size={24} color="#666" />
                  </View>
                </TouchableOpacity>
              );
            })}
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
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
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

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#222',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: 'red',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333',
    marginHorizontal: 16,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Reportes List
  reportesList: {
    marginBottom: 24,
  },
  listTitle: {
    color: '#888',
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
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reporteContent: {
    flex: 1,
  },
  reporteDate: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  reporteTime: {
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