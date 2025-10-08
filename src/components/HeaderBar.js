import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../context/UserContext';

const HeaderBar = ({ showBackButton = true }) => {
  const navigation = useNavigation();
  const { user } = useUser();

  const handleProfilePress = () => {
    if (user?.id) {
      navigation.navigate('EditP', { userId: user.id });
    } else {
      console.warn('⚠️ No hay usuario logueado');
      navigation.navigate('EditP');
    }
  };

  return (
    <View style={styles.header}>
      {/* Izquierda: back button o espacio */}
      {showBackButton ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      {/* Centro: título */}
      <Text style={styles.title}>EDUSHIELD</Text>

      {/* Derecha: iconos de chat y perfil */}
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbot')} style={styles.iconButton}>
          <Icon name="robot" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleProfilePress} style={{ marginLeft: 12 }}>
          <Image
            source={
              user?.foto_perfil 
                ? { uri: user.foto_perfil }
                : require('../../assets/icon.png')
            }
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: 'black',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    marginTop: 40,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
  },
  iconButton: {
    padding: 4,
  },
});

export default HeaderBar;