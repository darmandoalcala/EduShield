import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from '../components/HeaderBar';

export default function AyudaGuia() {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const navigation = useNavigation();

  const handleEmailPress = async () => {
    const subject = encodeURIComponent('Soporte EDUSHIELD');
    const body = encodeURIComponent('Hola, necesito ayuda con...');
    const url = `mailto:edushield@gmail.com?subject=${subject}&body=${body}`;

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('No se pudo abrir el correo', 'Por favor, copia el email: edushield@gmail.com');
      return;
    }
    Linking.openURL(url);
  };

  const openVideo = () => {
    setShowVideo(true);
    setIsPlaying(true);
  };

  const closeVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
      await videoRef.current.setPositionAsync(0);
    }
    setIsPlaying(false);
    setShowVideo(false);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <HeaderBar navigation={navigation} showBackButton={true} />

      {/* Modal de Video */}
      <Modal
        transparent
        animationType="fade"
        visible={showVideo}
        onRequestClose={closeVideo}
      >
        <Pressable
          style={styles.videoModal}
          onPress={closeVideo}
          accessibilityRole="button"
          accessibilityLabel="Cerrar video"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={styles.videoContent}
          >
            <Video
              ref={videoRef}
              source={require('../../assets/¿COMO USAR LA APP.mp4')}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              shouldPlay={isPlaying}
              isLooping={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  closeVideo();
                }
              }}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeVideo}
              accessibilityRole="button"
              accessibilityLabel="Cerrar modal de video"
            >
              <Icon name="close" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Icon name="help-circle" size={48} color="red" />
          </View>
          <Text style={styles.title}>Ayuda & Guía</Text>
          <Text style={styles.subtitle}>
            Aprende a usar EduShield de manera efectiva
          </Text>
        </View>

        {/* Video Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="play-circle" size={24} color="red" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Tutorial de Uso</Text>
          </View>
          
          <TouchableOpacity
            style={styles.videoPlaceholder}
            onPress={openVideo}
            activeOpacity={0.8}
          >
            <View style={styles.playOverlay}>
              <Icon name="play-circle" size={80} color="white" />
            </View>
            <View style={styles.videoBadge}>
              <Icon name="video" size={16} color="white" />
              <Text style={styles.videoBadgeText}>¿Cómo usar la app?</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.videoDescription}>
            Toca para ver el tutorial completo de cómo utilizar todas las funciones de EduShield
          </Text>
        </View>

        {/* Emergency Guide Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="alert-circle" size={24} color="red" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Guía de Emergencia</Text>
          </View>

          <View style={styles.tipContainer}>
            <View style={styles.tipItem}>
              <Icon name="eye" size={20} color="#888" style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Recuerda detalles del agresor (ropa, características físicas)
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="map-marker" size={20} color="#888" style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Toma nota de la ubicación exacta del incidente
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="shield-alert" size={20} color="#888" style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Identifica posibles riesgos en el área
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="run" size={20} color="#888" style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Busca un lugar seguro lo más rápido posible
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="email" size={24} color="red" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Contacto</Text>
          </View>
          
          <Text style={styles.contactText}>
            ¿Necesitas más información o tienes dudas?
          </Text>
          
          <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
            <Icon name="email-outline" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.emailButtonText}>edushield@gmail.com</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>EDUSHIELD 2025</Text>
          <Text style={styles.footerSubtext}>Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Card Styles
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 12,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Video Placeholder
  videoPlaceholder: {
    height: 200,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#333',
  },
  playOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  videoBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  videoDescription: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  // Video Modal
  videoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  videoContent: {
    width: '100%',
    maxWidth: 640,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  video: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  closeButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'red',
    borderRadius: 25,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Tips Container
  tipContainer: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    color: '#ccc',
    fontSize: 15,
    lineHeight: 22,
  },

  // Contact Section
  contactText: {
    color: '#888',
    fontSize: 15,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailButton: {
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'red',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  emailButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#222',
    marginTop: 20,
  },
  footerText: {
    color: '#444',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 4,
  },
  footerSubtext: {
    color: '#333',
    fontSize: 10,
  },
});