import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { reportesMock } from '../data/mockReportes';

export default function SeleccionarReporteScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Aquí podrás estar informado sobre lo que pasa en tu centro universitario
      </Text>

      <Text style={styles.instruccion}>
        Selecciona el reporte que quieras ver
      </Text>

      {reportesMock.map(reporte => (
        <TouchableOpacity
          key={reporte.id}
          style={styles.item}
          onPress={() => navigation.navigate('DetalleReporte', { id: reporte.id })}
        >
          <Text style={styles.text}>
            {reporte.descripcion.length > 20
              ? `${reporte.descripcion.slice(0, 20)}...`
              : reporte.descripcion}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.nota}>
        Nota: Cualquier reporte será anónimo ante este público.
      </Text>
      <Text style={styles.smallText}>
        All Rights reserved @EDUSHIELD2025
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 150,
    backgroundColor: '#000',
    flexGrow: 1, 
    paddingBottom: 100, // importante para ScrollView
  },
  title: {
    color: '#fff',
    fontSize: 25,
    marginBottom: 10,
    textAlign: 'center',
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
  nota: {
    color: '#aaa',
    fontSize: 15,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
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
