// src/screens/AyudaGuia.js
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  Pressable,
  SafeAreaView,
  StatusBar,
  Alert,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';

// YouTube player
import YoutubePlayer from 'react-native-youtube-iframe';

export default function AyudaGuia() {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigation = useNavigation();

  const handleEmailPress = async () => {
    const subject = encodeURIComponent('Soporte EDUSHIELD');
    const body = encodeURIComponent('Hola, necesito ayuda con...');
    const url = `mailto:edushield@gmail.com?subject=${subject}&body=${body}`;

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('No se pudo abrir el correo', 'Por favor, intenta nuevamente.');
      return;
    }
    Linking.openURL(url);
  };

  // Abrir/Cerrar modal y controlar reproducción
  const openVideo = () => {
    setShowVideo(true);
    setIsPlaying(true);
  };

  //Cerrar modal cuando el video finalice
  const closeVideo = () => {
    setIsPlaying(false);
    setShowVideo(false);
  };

  // Detectar cambios de reproductor (play, pause, ended, etc.)
  const onChangeState = useCallback((state) => {
    if (state === 'ended') {
      setIsPlaying(false);
      setShowVideo(false);
    }
  }, []);

  // Helper para extraer ID desde una URL de YT
  const getYouTubeId = (urlOrId) => {
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&].*)?$/;
    const match = String(urlOrId).match(regex);
    return match ? match[1] : String(urlOrId);
  };

  // URL DE VIDEO, por el momento video equis
  const videoId = getYouTubeId('https://youtu.be/3gMOYZoMtEs?si=n6uR3MDIMq9nWTda'); 

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      {/* Header con botón de regreso */}
      <HeaderBar navigation={navigation} showBackButton={true} />

      {/* 🔲 Modal de Video */}
      <Modal
        transparent
        animationType="fade"
        visible={showVideo}
        onRequestClose={closeVideo}
      >
        {/* Tap en fondo cierra el modal */}
        <Pressable
          style={styles.videoModal}
          onPress={closeVideo}
          accessibilityRole="button"
          accessibilityLabel="Cerrar video"
        >
          {/* Tap dentro NO cierra */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={styles.videoContent}
          >
            <View style={styles.youtubeWrapper}>
              <YoutubePlayer
                height={220}
                play={isPlaying}
                videoId={videoId}
                onChangeState={onChangeState}
                webViewStyle={{ backgroundColor: 'black' }}
                initialPlayerParams={{
                  controls: true,
                  modestbranding: true,
                  rel: false,
                  playsinline: true,
                }}
              />
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeVideo}
              accessibilityRole="button"
              accessibilityLabel="Cerrar modal de video"
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Ayuda & Guía</Text>
          <Text style={styles.subtitle}>- ¿Cómo usar EDUSHIELD?</Text>

          {!showVideo && (
            <TouchableOpacity
              style={styles.videoPlaceholder}
              onPress={openVideo}
              accessibilityRole="button"
              accessibilityLabel="Abrir demo en video"
            >
              <ImageBackground
                source={require('../../assets/video-image.png')} // 🔹 tu miniatura local
                style={styles.thumbnail}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={styles.playOverlay}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}

          <Text style={styles.subtitle}>- ¿Qué hacer durante una emergencia?</Text>
          <Text style={styles.questionText}>
            Recuerda detalles del agresor, ubicación, posibles riesgos y busca un lugar seguro.
          </Text>

          <Text style={styles.infoText}>
            Más información, escríbenos al correo{' '}
            <Text style={styles.link} onPress={handleEmailPress}>
              edushield@gmail.com
            </Text>
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginTop: 80,
  },
  title: {
    color: '#e74c3c',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    color: '#fff',
    fontSize: 17,
    marginVertical: 10,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: '#333',
    borderRadius: 8,
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
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  videoContent: {
    width: '100%',
    maxWidth: 640,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 12,
  },
  youtubeWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden', // respeta el borderRadius del player
    backgroundColor: '#000',
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
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
  footer: {
    marginTop: 24,
  },
  smallText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 20,
  },
  thumbnail: {
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},
playOverlay: {
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 50,
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
playIcon: {
  color: '#fff',
  fontSize: 28,
  fontWeight: 'bold',
},
});
