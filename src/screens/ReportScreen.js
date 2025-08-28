import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';

const centers = ['CUCEI', 'CUAAD', 'CUCEV', 'CUCS'];

const ReportScreen = ({ navigation }) => {
  const [selectedCenter, setSelectedCenter] = useState(centers[0]);

  const handleEditCenter = () => {
    console.log('Editar selección de centro universitario');
  };

  const handleProfilePress = () => {
    console.log('Botón de perfil presionado');
  };

  const handleButtonPress = (buttonName) => {
    console.log(`Botón ${buttonName} presionado`);
  };

  const handleEditDescription = () => {
    console.log('Editar descripción');
  };

  const handleSendReport = () => {
    console.log('Reporte enviado');
  };

  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 1) Centro Universitario fijo */}
        <Text style={styles.instructionAText}>Centro Universitario asignado:</Text>
        <View style={styles.sectionBox}>
          <View style={styles.row}>
            <Text style={styles.iconLeft}>🎓</Text>
            <View style={styles.pickerPlaceholder}>
              <Text style={styles.pickerText}>CUCEI</Text>
            </View>
            <TouchableOpacity onPress={handleEditCenter} style={styles.iconSide}>
              <Icon
                name="pencil-outline"
                size={20}
                color="#FFF"
                style={{ marginTop: 10, marginLeft: 310 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2) Fecha y hora del incidente */}
        <Text style={styles.instructionAText}>Fecha y hora exacta del incidente.</Text>
        <View style={styles.sectionBox}>
          <View style={styles.row}>
            <Icon name="calendar-outline" size={20} color="#FFF" style={styles.iconLeft} />
            <Text style={styles.textInfo}>02/11/2024, 07:30 PM</Text>
          </View>
        </View>
  
        {/* 3) Descripción de los hechos */}
        <Text style={styles.instructionAText}>Da un breve resumen de los hechos.</Text>
        <View style={styles.sectionBoxes}>
          <View style={styles.rowWithSpace}>
            <Icon name="alert-circle-outline" size={20} color="#FFF" marginTop={-25} style={styles.iconLeft} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.instructionText}></Text>
              <TextInput
                style={styles.textInputFlex}
                placeholder="Escribe aquí..."
                placeholderTextColor="#888"
                placeholderTextFontSize={20}
                multiline
              />
            </View>
            <TouchableOpacity onPress={() => console.log('Editar descripción')}>
              <Icon name="pencil-outline" size={20} color="#FFF" marginTop={-25} style={styles.iconRight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 4) Botones de evidencia */}
        <View style={styles.sectionBox}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <TouchableOpacity
              style={styles.evidenceButtonPlaceholder}
              onPress={() => console.log('Evidencia en video')}
            >
              <Text style={styles.evidenceText}>Evidencia en video</Text>
              <Text style={styles.iconRight}>🎥</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.evidenceButtonPlaceholder}
              onPress={() => console.log('Evidencia en foto')}
            >
              <Text style={styles.evidenceText}>Evidencia en foto</Text>
              <Text style={styles.iconRight}>📸</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.instructionAText}>
          Cualquier evidencia queda respaldada por la ley de protección de datos.
        </Text>

        {/* 5) Botón final */}
        <TouchableOpacity
          style={styles.sendButtonPlaceholder}
          onPress={() => console.log('Reporte enviado')}
        >
          <Text style={styles.sendButtonText}>Reporte de incidente</Text>
          <Text style={styles.iconRight}>⚠️</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  // Contenedor principal con fondo negro
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  // ScrollView container como en Home1
  scrollContainer: {
  paddingHorizontal: 16,
  paddingTop: 40,
  paddingBottom: 100,
  },

  // Header fijo en la parte superior
  header: {
    width: '100%',
    marginTop: 50,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    tintColor: 'white',
  },

  // Contenido dentro del scroll
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mensaje: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },

  // Barra de navegación inferior
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: '#333333',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navImage: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  sectionBox: {
    backgroundColor: '#1A1A1A',   // Gris muy oscuro
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    width: '100%',
    height:55,
  },
  sectionBoxes: {
    backgroundColor: '#1A1A1A',   // Gris muy oscuro
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    width: '100%',
    height:150,
  },

  instructionAText: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left', 
  },
  // ----------------------------
  // Fila horizontal alineada en eje vertical al centro
  // ----------------------------
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ----------------------------
  // Ícono o texto que va a la izquierda de cada sección
  // ----------------------------
  iconLeft: {
    fontSize: 18,
    color: '#FFF',
    marginRight: 8,
  },

  // ----------------------------
  // Placeholder del Picker (combobox):
  // fondo transparente, ocupa todo el espacio disponible
  // ----------------------------

  iconSide:{
    zIndex:1,
    position: 'absolute',

  },

  pickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    marginTop:10,
  },
  pickerText: {
    color: '#FFF',
    fontSize: 17,
  },

    pickerContainer: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#555',    // color de borde para resaltar el dropdown
    borderRadius: 4,
    justifyContent: 'center', 
    backgroundColor: 'transparent',
  },

  // ----------------------------
  // Texto para mostrar fecha/hora
  // ----------------------------
  textInfo: {
    flex: 1,
    color: '#FFF',
    fontSize: 17,
  },


  // ----------------------------
  // TextInput placeholder para descripción de los hechos
  // ----------------------------

  // TextInput editable
  instructionText: {
  color: '#aaa',
  fontSize: 14,
  fontStyle: 'italic',
  marginBottom: 4,
  marginTop: 40,
},
  textInputFlex: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    minHeight:  50,
    textAlignVertical: 'center',  // Android
    textAlign: 'center',          // horizontal

  },

  // ----------------------------
  // Botones de evidencia (video/foto) – color de fondo, padding y alineación
  // ----------------------------
  evidenceButtonPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  evidenceText: {
    flex: 1,
    color: '#FFF',
    fontSize: 14.5,
  },

  // ----------------------------
  // Ícono o texto que va a la derecha en los botones de evidencia
  // y también en el botón final “Reporte de incidente”
  // ----------------------------
  iconRight: {
    fontSize: 18,
    color: '#FFF',
    marginLeft: 8,
  },
  rowWithSpace: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
  iconLeft: {
    marginRight: 8,
  },
  textInputFlex: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    minHeight: 90,
    textAlignVertical: 'Top',
    padding: 0,
    marginHorizontal: 8,
    marginTop:55,

  },
  iconRight: {
    marginLeft: 8,
  },

  // ----------------------------
  // Botón rojo “Reporte de incidente” (solo estilo para el botón nuevo)
  // ----------------------------
  sendButtonPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',   // Rojo brillante
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 20,
    marginLeft: '60',
    height: 60,
    width: '70%',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default ReportScreen;

