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
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.welcomeTitle}>Centro de Seguridad</Text>
          <Text style={styles.welcomeSubtitle}>
            Tu bienestar es nuestra prioridad
          </Text>
        </View>

        {/* SOS Section */}
        <View style={styles.sosSection}>
          <View style={styles.instructionCard}>
            <Icon name="alert-circle" size={24} color="red" style={styles.instructionIcon} />
            <Text style={styles.instructionText}>
              Usa el botón SOS en caso de emergencia para alertar tu ubicación
            </Text>
          </View>

          <Pressable 
            onPress={() => navigation.navigate('Alert')} 
            style={styles.sosButton}
          >
            <View style={styles.sosGlow} />
            <Image
              source={require('../../assets/alert.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o reporta un incidente</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          {/* Report Button */}
          <TouchableOpacity 
            onPress={() => navigation.navigate("Inicio", { screen: "Report" })}
            style={styles.actionCard}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="file-document-edit" size={32} color="red" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Reportar Incidente</Text>
              <Text style={styles.actionDescription}>
                Informa sobre un suceso que requiera atención
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          {/* Chatbot Button */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Chatbot')} 
            style={styles.actionCard}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="robot" size={32} color="red" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Chat de Ayuda</Text>
              <Text style={styles.actionDescription}>
                Obtén asistencia inmediata de nuestro asistente
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Icon name="shield-check" size={24} color="#4A90E2" />
            <Text style={styles.infoText}>Respuesta rápida garantizada</Text>
          </View>
          <View style={styles.infoCard}>
            <Icon name="lock" size={24} color="#4A90E2" />
            <Text style={styles.infoText}>Información protegida</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>EDUSHIELD 2025</Text>
          <Text style={styles.footerSubtext}>Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  // SOS Section
  sosSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.2)',
  },
  instructionIcon: {
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  sosButton: {
    position: 'relative',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  logo: {
    width: 240,
    height: 180,
    zIndex: 1,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    fontSize: 14,
    marginHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },

  // Actions Section
  actionsSection: {
    marginBottom: 32,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    color: '#888',
    fontSize: 14,
    lineHeight: 18,
  },

  // Info Section
  infoSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: '#888',
    fontSize: 12,
    lineHeight: 16,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#222',
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

export default Home1;

