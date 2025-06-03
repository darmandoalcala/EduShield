import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const Home1 = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: 'black' }]}>
      <Text style={styles.title}>EDUSHIELD</Text>
      <Text style={styles.welcomeText}>
        Puras pinches travas lindas y metanfetaminas
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'white',
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
    color: 'white',
  },
});

export default Home1;
