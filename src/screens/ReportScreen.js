import React, { useState } from 'react';
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

const ReportScreen = () => {
  // Estado para el Picker de Centros Universitarios
  const [selectedCenter, setSelectedCenter] = useState('CUCEI');

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
      {/* ----------------------- */}
      {/* Barra de Título / Header (sin cambios) */}
      <View style={styles.header}>
        <Text style={styles.title}>EDUSHIELD</Text>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}
        >
          <Image
            source={require('/workspaces/EduShield/assets/icon.png')}
            style={styles.profileIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* ----------------------- */}
      {/* ScrollView con las nuevas secciones */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* ---------------------------------------------------
             1) SECCIÓN: Combobox para "Seleccion de Centro Universitario"
           --------------------------------------------------- */}
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
              <Icon name="pencil-outline" size={20} color="#FFF" />
            </TouchableOpacity>

            </View>
          </View>
        </View>

        {/* ---------------------------------------------------
             2) SECCIÓN: Fecha y hora con ícono lápiz a la izquierda
           --------------------------------------------------- */}
          <View style={styles.sectionBox}>
            <View style={styles.row}> 
              {/* Ícono de calendario a la izquierda */}
              <Icon name="calendar-outline" size={20} color="#FFF" style={styles.iconLeft} />

              {/* Texto de fecha/hora ocupa el resto del espacio */}
              <Text style={styles.textInfo}>
                02/11/2024, 07:30 PM
                {/* Si usas estado: {dateTime} */}
              </Text>
            </View>
          </View>

        {/* ---------------------------------------------------
             3) SECCIÓN: Descripción de los hechos
           --------------------------------------------------- */}
        <View style={styles.sectionBox}>
          <View style={styles.rowWithSpace}>
            {/* Ícono de alerta a la izquierda (solo diseño, sin Touchable) */}
            <Icon
              name="alert-circle-outline"
              size={20}
              color="#FFF"
              style={styles.iconLeft}
            />

            {/* TextInput que ocupa todo el espacio intermedio */}
            <TextInput
              style={styles.textInputFlex}
              placeholder="Da un pequeño desglosé de lo que pasó"
              placeholderTextColor="#888"
              multiline
              // value={description}
              // onChangeText={setDescription}
            />

            {/* Ícono de lápiz a la derecha, dentro de Touchable para editar */}
            <TouchableOpacity onPress={() => console.log('Editar descripción')}>
              <Icon
                name="pencil-outline"
                size={20}
                color="#FFF"
                style={styles.iconRight}
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

      {/* ----------------------- */}
      {/* Barra de navegación inferior (sin cambios) */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress('Inicio')}
        >
          <Image
            source={require('/workspaces/EduShield/assets/splash-icon.png')}
            style={styles.navImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress('Buscar')}
        >
          <Image
            source={require('/workspaces/EduShield/assets/splash-icon.png')}
            style={styles.navImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress('Perfil')}
        >
          <Image
            source={require('/workspaces/EduShield/assets/splash-icon.png')}
            style={styles.navImage}
          />
        </TouchableOpacity>
      </View>
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
  paddingTop: 20,
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
    fontSize: 24,
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
    marginBottom: 16,
    width: '100%',
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
  pickerPlaceholder: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
  },
  pickerText: {
    color: '#FFF',
    fontSize: 15,
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

  // --------------------------------
  // Estilo para el Picker en sí
  // --------------------------------
  picker: {
    color: '#FFF',
    width: '100%',
    height: '100%',
  },
  
  iconSide: {
    marginLeft: 285,  
    marginTop: 5,      // Amplía la zona táctil
  },
  // ----------------------------
  // Texto para mostrar fecha/hora
  // ----------------------------
  textInfo: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
  },


  // ----------------------------
  // TextInput placeholder para descripción de los hechos
  // ----------------------------
  textInputPlaceholder: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: 'top',   // En Android, asegura que el multiline escriba desde arriba
    padding: 0,                 // Quita padding interno para que encaje bien
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
    fontSize: 14,
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
    backgroundColor: '#FF3B30',   // Rojo brillante
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
    width: '100%',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportScreen;

