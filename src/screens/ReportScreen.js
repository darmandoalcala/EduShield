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
  // Inicializas el estado al primer elemento del array
  const [selectedCenter, setSelectedCenter] = useState(centers[0]);

  const handleEditCenter = () => {
    console.log('Editar selección de centro universitario');
    // Aquí, si lo deseas, puedes mostrar un modal u otra UI para editar.
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

      {/* ----------------------- */}
      {/* ScrollView con las nuevas secciones */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* ---------------------------------------------------
             1) SECCIÓN: Combobox para "Seleccion de Centro Universitario"
           --------------------------------------------------- */}
      <Text style={styles.instructionAText}>
          Selecciona tu centro universitario.
        </Text>
        
        <View style={styles.sectionBox}>
          <View style={styles.row}>
            {/* Ícono placeholder (más adelante puedes reemplazarlo por <Icon> o <Image>) */}
            <Text style={styles.iconLeft}>🎓</Text>

            <View style={styles.pickerPlaceholder}>
              <Text style={styles.pickerText}>CUCEI ▼</Text>

        {/* Contenedor del Picker, ocupa el espacio central */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCenter}
                onValueChange={(itemValue) => setSelectedCenter(itemValue)}
                style={styles.picker}
                dropdownIconColor="#FFF"  // para que la flecha salga blanca en Android
                mode="dropdown"
              >
                <Picker.Item label="CUCEI" value="CUCEI" />
                <Picker.Item label="CUAAD" value="CUAAD" />
                <Picker.Item label="CUCEV" value="CUCEV" />
                <Picker.Item label="CUCS" value="CUCS" />
              </Picker>
            </View>

            {/* Ícono de lápiz a la derecha */}
            <TouchableOpacity onPress={handleEditCenter} style={styles.iconSide}>
              <Icon name="pencil-outline" size={20} color="#FFF" marginBottom = {10} marginLeft = {285}/>
            </TouchableOpacity>

            </View>
          </View>
        </View>

        {/* ---------------------------------------------------
             2) SECCIÓN: Fecha y hora con ícono lápiz a la izquierda
           --------------------------------------------------- */}
      <Text style={styles.instructionAText}>
          Fecha y hora exacta del incidente.
        </Text>

          <View style={styles.sectionBox}>
            <View style={styles.row}> 
              {/* Ícono de calendario a la izquierda */}
              <Icon name="calendar-outline" size={20} color="#FFF" style={styles.iconLeft}  marginTop = {10} />

              {/* Texto de fecha/hora ocupa el resto del espacio */}
              <Text style={styles.textInfo} marginTop = {8}>
                02/11/2024, 07:30 PM
                {/* Si usas estado: {dateTime} */}
              </Text>
            </View>
          </View>

        {/* ---------------------------------------------------
             3) SECCIÓN: Descripción de los hechos
           --------------------------------------------------- */}
        <Text style={styles.instructionAText}>
          Da un breve resumen de los hechos.
        </Text>
        <View style={styles.sectionBox}>
          <View style={styles.rowWithSpace}>
            {/* Ícono de alerta a la izquierda (solo diseño, sin Touchable) */}
            <Icon
              name="alert-circle-outline"
              size={20}
              color="#FFF"
              style={styles.iconLeft}
              marginBottom = {20}
            />
          {/* contenedor central: instrucción + campo editable */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* texto de instrucción */}
            <Text style={styles.instructionText}>
              
            </Text>

            {/* TextInput centrado verticalmente */}
            <TextInput
              style={styles.textInputFlex}
              placeholder="Escribe aqui..."
              placeholderTextColor="#888"
              multiline
            />
          </View>
            {/* Ícono de lápiz a la derecha, dentro de Touchable para editar */}
            <TouchableOpacity onPress={() => console.log('Editar descripción')}>
              <Icon
                name="pencil-outline"
                size={20}
                color="#FFF"
                style={styles.iconRight}
                marginBottom = {20}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ---------------------------------------------------
             4) SECCIÓN: Botones de evidencia (Video y Foto)
           --------------------------------------------------- */}

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
          Cualquier evidencia queda respaldada por la ley de proteccion de datos.
        </Text>

        {/* ---------------------------------------------------
             5) BOTÓN FINAL: Reporte de incidente
           --------------------------------------------------- */}
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
    fontSize: 25,
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
    height:65,
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
  marginTop: 75,
},
  textInputFlex: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    minHeight: 60,
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
    minHeight: 60,
    textAlignVertical: 'Top',
    padding: 0,
    marginHorizontal: 8,
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

