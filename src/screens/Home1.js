import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import HeaderBar from '../components/HeaderBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Home1 = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  const handleSOSPress = () => {
    console.log('SOS activado');
  };

  const handleReportPress = () => {
    console.log('Incidente reportado');
  };

  return (
    <View style={styles.outerContainer}>
      <HeaderBar navigation={navigation} showBackButton={false} /> 
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.instructionText}>
          Toca el botón de SOS para alertar a otros usuarios tu ubicacion del incidente.
        </Text>

        <Pressable onPress={() => navigation.navigate('Alert')} style={styles.sosButton}>
          <Image
            source={require('../../assets/alert.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>

        <View style={{ height: 30 }} />
        <Text style={styles.separator}>ó</Text>


        <Pressable 
          onPress={() => navigation.navigate("Inicio", { screen: "Report" })}
          style={styles.reportButton}
        >
        <Text style={styles.reportButtonText}>Reportar un incidente</Text>
      </Pressable>

        <Text style={styles.noteText}>
          Informa tu suceso fácilmente desde la sección Reportar incidente.
        </Text>

        <Pressable  onPress={() => navigation.navigate('Chatbot')} style={styles.reportButton}>
            <Text style={styles.reportButtonText}>Chat de ayuda</Text> 
          <Icon name="robot" size={20} marginLeft={51} marginTop={5} color="white" />      
        </Pressable>
          <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>

      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'black', // Fondo negro respetado
  },
      smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 10, 
    marginBottom: 15,
  },

  scrollContainer: {
    marginTop: 50,
    paddingBottom: 100, // Espacio para el menú inferior
    alignItems: 'center',
  },
  instructionText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 300,
    height: 200,
  },
  sosButton: {
    padding: 10,
    borderRadius: 10,
  },
  separator: {
    color: '#aaa',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  reportButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 22,
  },
  noteText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom:20,
  },
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
    flex: 1, // ¡Esto es clave! Distribuye el espacio equitativamente
    alignItems: 'center'
  },
  navImage: {
    width: 30, // Tamaño de las imágenes
    height: 30,
    tintColor: 'gray', // Color gris para las imágenes
  },
});

export default Home1;



