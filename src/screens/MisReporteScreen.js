import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import { ApiService } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MisReporteScreen() {
  const navigation = useNavigation();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  // Cargar reportes cuando la pantalla se enfoca
  useFocusEffect(
    React.useCallback(() => {
      loadUserReports();
    }, [])
  );

  const loadUserReports = async () => {
    try {
      setLoading(true);
      
      // Cargar datos del usuario
      const userJson = await AsyncStorage.getItem('userData');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUserData(user);
        console.log('👤 Usuario cargado:', user);

        // Cargar reportes del usuario
        const response = await ApiService.getUserReports(user.codigo_estudiante);
        console.log('📋 Reportes cargados:', response.data);
        setReportes(response.data || []);
      }
    } catch (error) {
      console.error('❌ Error cargando reportes:', error);
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

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderBar navigation={navigation} showBackButton={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ color: 'white', marginTop: 10 }}>Cargando tus reportes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={false} />

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A90E2"
          />
        }
      >
        <Text style={styles.title}>
          Aquí podrás consultar tus últimos reportes en EDUSHIELD
        </Text>

        <Text style={styles.instruccion}>
          Selecciona el reporte que quieras ver
        </Text>

        {reportes.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#fff', fontSize: 18, marginBottom: 10 }}>
              No tienes reportes aún
            </Text>
            <Text style={{ color: '#aaa', fontSize: 14 }}>
              Crea tu primer reporte para que aparezca aquí
            </Text>
          </View>
        ) : (
          reportes.map(reporte => (
            <TouchableOpacity
              key={reporte.ID || reporte.id}
              style={styles.item}
              onPress={() => navigation.navigate('DetalleMisReporte', { id: reporte.ID || reporte.id })}
            >
              <Text style={styles.text}>{formatDate(reporte.FECHA || reporte.fecha)}</Text>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 1,
    backgroundColor: '#000',
    flexGrow: 1,
    paddingBottom:150,
  },
  title: {
    color: '#fff',
    fontSize: 23,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 20,
  },
  instruccion: {
    color: 'red',
    fontSize: 18,
    marginVertical: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  item: {
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});

