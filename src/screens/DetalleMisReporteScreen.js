import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { reportesMock } from '../data/mockReportes'; //Cambiar en back 

export default function DetalleReporteScreen({ route }) {
  const { id } = route.params;
  const reporte = reportesMock.find(r => r.id === id);

  if (!reporte) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 100 }}>
          Reporte no encontrado
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <TouchableOpacity style={styles.deleteButton} onPress={() => {}}>
        <Text style={styles.deleteText}>Eliminar Reporte</Text>
      </TouchableOpacity>

      <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 150,
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
  },
  text: {
    color: '#000',
    fontSize:18,
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

