import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import { reportesMock } from '../data/mockReportes';

export default function SeleccionarReporteScreen() {
  const navigation = useNavigation();

  return (

    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Reportes</Text>
          <Text style={styles.subtitle}>
            Aquí podrás estar informado sobre lo que pasa en tu centro universitario
          </Text>
        </View>
        
        {/* LISTA */}
        <View style={styles.reportesList}>
          <Text style={styles.listTitle}>
            Selecciona el reporte que quieras ver
          </Text>

          {reportesMock.map(reporte => (
            // Item tarjeta de reporte
            <TouchableOpacity
              key={reporte.id}
              style={styles.reporteCard} 
              onPress={() => navigation.navigate('DetalleReporte', { id: reporte.id })}
              activeOpacity={0.7}
            >
              {/* ICONO */}
              <View style={styles.reporteIconContainer}>
                <Icon name="chat-alert-outline" size={24} color="red" />
              </View>
              
              {/* CONTENIDO */}
              <View style={styles.reporteContent}>
                <Text style={styles.reporteDescription}>
                  {reporte.descripcion.length > 30 // Damos un poco más de espacio
                    ? `${reporte.descripcion.slice(0, 30)}...`
                    : reporte.descripcion}
                </Text>
                {/* SUBTEXT */}
                <Text style={styles.reporteSubtext}>Reporte de la comunidad</Text>
              </View>

              {/* Flecha */}
              <View style={styles.reporteArrow}>
                <Icon name="chevron-right" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* FOOTER bonito xd */}
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