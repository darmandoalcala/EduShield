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
import HeaderBar from '../components/HeaderBar';
import { ApiService } from '../config/api';
import { useUser } from '../context/UserContext'; // 👈 AGREGAR

export default function DetalleReporteScreen({ route }) {
  const navigation = useNavigation();
  const { user } = useUser(); // 👈 OBTENER USUARIO DEL CONTEXTO
  const { id } = route.params;
  
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  // 👇 SIMPLIFICAR - ya no necesitamos cargar userData
  const loadReport = async () => {
    try {
      setLoading(true);
      
      // Verificar que hay usuario
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

      // Cargar el reporte específico
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
      '¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.',
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
                'Reporte Eliminado',
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
    
    // La fecha viene en formato: "2025-10-22 02:54:49.018552"
    const date = new Date(dateString.replace(' ', 'T'));
    
    // Validar que la fecha es válida
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ color: 'white', marginTop: 10 }}>Cargando reporte...</Text>
        </View>
      </View>
    );
  }

  if (!reporte) {
    return (
      <View style={styles.container}>
        <HeaderBar navigation={navigation} showBackButton={true} />
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 100 }}>
          Reporte no encontrado
        </Text>
      </View>
    );
  }

  // Normalizar los campos (soportar mayúsculas y minúsculas)
  const fecha = reporte.FECHA || reporte.fecha;
  const descripcion = reporte.DESCRIPCION || reporte.descripcion;
  const foto_evidencia = reporte.FOTO_EVIDENCIA || reporte.foto_evidencia;

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Fecha reporte: {formatDate(fecha)}</Text>
        <Text style={styles.label}>Hora: {formatTime(fecha)}</Text>
        <Text style={styles.label}>Descripción:</Text>
        <View style={styles.descripcion}>
          <Text style={styles.text}>{descripcion}</Text>
        </View>

        {foto_evidencia && (
          <>
            <Text style={styles.label}>Evidencias:</Text>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: foto_evidencia }} 
                style={styles.image}
              />
            </View>
          </>
        )}

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDeleteReport}
          disabled={loading}
        >
          <Text style={styles.deleteText}>Eliminar Reporte</Text>
        </TouchableOpacity>

        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 10,
    backgroundColor: '#000',
    flexGrow: 1,
  },
  label: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 5,
  },
  descripcion: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 10,
  },
  text: {
    color: '#000',
    fontSize: 18,
    marginTop: 1,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '70%',
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  smallText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
});