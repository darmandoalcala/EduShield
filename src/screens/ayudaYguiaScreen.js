import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
} from 'react-native';

export default function AyudaGuia() {
  const [showVideo, setShowVideo] = useState(false);

  const handleEmailPress = () => {
    Linking.openURL('mailto:edushield@gmail.com');
  };

    return (
        <>
        {showVideo && (
            <Modal transparent={true} animationType="slide">
            <View style={styles.videoModal}>
                {/* Aquí coloca tu componente de video */}
                <View style={styles.videoContent} />
                <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowVideo(false)}
                >
                <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
            </Modal>
        )}
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
            <Text style={styles.title}>Ayuda & Guide</Text>
            <Text style={styles.subtitle}>- Cómo usar EDUSHIELD?</Text>

            {!showVideo && (
                <TouchableOpacity
                style={styles.videoPlaceholder}
                onPress={() => setShowVideo(true)}
                >
                <Text style={styles.videoPlaceholderText}>Demo Video</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.subtitle}>- Qué hacer durante una emergencia?</Text>
            <Text style={styles.questionText}>
                Recuerda detalles del agresor, ubicación, posibles riesgos y busca un lugar seguro.
            </Text>

            <Text style={styles.infoText}>
                Más información escríbenos al correo{' '}
                <Text style={styles.link} onPress={handleEmailPress}>
                edushield@gmail.com
                </Text>
            </Text>
            </View>
            <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
        </ScrollView>
        </>
    );
    }

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 20,
    marginTop: 120,
    marginBottom:'auto',
  },
  title: {
    color: '#e74c3c',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    fontSize: 17,
    marginVertical: 10,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: '#333',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  videoPlaceholderText: {
    color: '#fff',
    fontSize: 16,
  },
  videoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContent: {
    width: '90%',
    height: 220,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  questionText: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 20,
  },
  infoText: {
    color: '#fff',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    color: '#e74c3c',
    textDecorationLine: 'underline',
  },
        // EDUSHIELD2025
    smallText: {
      color: '#aaa',
      fontSize: 12,
      marginVertical: 10,
      textAlign: 'center',
      marginTop:20,
      marginBottom:20,
  },
});
