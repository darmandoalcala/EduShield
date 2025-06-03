import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlertScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mensaje}>
        Hasta aquí llegaron, perras

        Saquen la lavada alv y unas perritas cocker
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mensaje: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default AlertScreen;
