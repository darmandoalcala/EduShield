import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { reportesMock } from '../data/mockReportes'; //Cambiar en back 

export default function DetalleReporteScreen({ route }) {
  const { id } = route.params;
  const reporte = reportesMock.find(r => r.id === id);

  if (!reporte) return <Text style={{ color: 'white' }}>Reporte no encntrado</Text>;

  return (
    <View style={styles.container}>
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


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, paddingTop: 150 },
  label: { color: '#fff', fontSize: 20, marginBottom: 5 },
  descripcion: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  text: { color: '#000', fontSize:18},
  imageContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
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
