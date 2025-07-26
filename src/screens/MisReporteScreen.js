import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { misreportesMock } from '../data/mockMisReportes';

export default function MisReporteScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Aquí podrás consultar tus últimos reportes en EDUSHIELD
      </Text>

      <Text style={styles.instruccion}>
        Selecciona el reporte que quieras ver
      </Text>

      {misreportesMock.map(reporte => (
        <TouchableOpacity
          key={reporte.id}
          style={styles.item}
          onPress={() => navigation.navigate('DetalleMisReporte', { id: reporte.id })}
        >
          <Text style={styles.text}>{reporte.fecha}</Text>
        </TouchableOpacity>
      ))}

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
    paddingBottom:150,
  },
  title: {
    color: '#fff',
    fontSize: 23,
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
  smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});

