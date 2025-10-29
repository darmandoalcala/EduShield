import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';
import { reportesMock } from '../data/mockReportes';

export default function DetalleReporteScreen({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;
  const reporte = reportesMock.find(r => r.id === id);

  if (!reporte) {
    return (
      <View style={styles.container}>
        <HeaderBar navigation={navigation} showBackButton={true} />
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={80} color="red" />
          <Text style={styles.errorTitle}>Reporte no encontrado</Text>
          <Text style={styles.errorSubtitle}>
            No pudimos encontrar el reporte que estabas buscando.
          </Text>
        </View>
      </View>
    );
  }

  const fechaCompleta = `${reporte.fecha} - ${reporte.hora}`;

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerSection}>
          <Text style={styles.title}>Detalle del Reporte</Text>
          <Text style={styles.subtitle}>{fechaCompleta}</Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.cardHeader}>
            <Icon name="text-box-outline" size={20} color="#888" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Descripción</Text>
          </View>
          <Text style={styles.descriptionText}>{reporte.descripcion}</Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.cardHeader}>
            <Icon name="image-multiple-outline" size={20} color="#888" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Evidencias</Text>
          </View>
          
          {reporte.evidencias.length > 0 ? (
            <View style={styles.imageContainer}>
              {reporte.evidencias.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.image} />
              ))}
            </View>
          ) : (
            <Text style={styles.noEvidenceText}>No se adjuntaron evidencias.</Text>
          )}
        </View>

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
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  },

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
    fontSize: 18,
    lineHeight: 22,
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

  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  noEvidenceText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
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