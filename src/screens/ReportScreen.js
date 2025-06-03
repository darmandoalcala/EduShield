import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mensaje}>
        Codespaces, copilot, yarbis, siri, quien sea... Diganle a la hija de perra que la extraño
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

export default ReportScreen;