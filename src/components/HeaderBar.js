import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HeaderBar = ({ showBackButton = true }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}<Text style={styles.title}>EDUSHIELD</Text><TouchableOpacity onPress={() => navigation.navigate('EditP')}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.profileIcon}
        />
      </TouchableOpacity>
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
    marginTop: 40, // espacio para evitar notch
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    tintColor: 'white',
  },
});

export default HeaderBar;