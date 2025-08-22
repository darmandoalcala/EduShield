import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import { reportesMock } from '../data/mockReportes'; //Cambiar en back 

export default function DetalleReporteScreen({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;
  const reporte = reportesMock.find(r => r.id === id);

  if (!reporte) return <Text style={{ color: 'white' }}>Reporte no encontrado</Text>;

  return (
    <View style={styles.container}>
      {/* 🔹 Header con botón de regreso */}
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Fecha reporte: {reporte.fecha}</Text>
        <Text style={styles.label}>Hora: {reporte.hora}</Text>

        <Text style={styles.label}>Descripción:</Text>
        <View style={styles.descripcion}>
          <Text style={styles.text}>{reporte.descripcion}</Text>
        </View>

        <Text style={styles.label}>Evidencias:</Text>
        <View style={styles.imageContainer}>
          {reporte.evidencias.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))}
        </View>

        <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, paddingTop: 10 },
  label: { color: '#fff', fontSize: 20, marginBottom: 5, marginTop: 10},
  descripcion: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  text: { color: '#000', fontSize:18, marginTop: 10 },
  imageContainer: { flexDirection: 'row', gap: 10, marginBottom: 20, marginTop: 10 },
  image: { width: 100, height: 100, borderRadius: 8 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
    smallText: {
      color: '#aaa',
      fontSize: 12,
      marginVertical: 10,
      textAlign: 'center',
      marginTop:20,
      marginBottom:20,
  },
});
