import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
  Modal,
  TextInput,
  TouchableOpacity,
  Platform,  //PARA REALIZAR LLAMADAS
} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { ApiService } from '../config/api';
import { useUser } from '../context/UserContext';

const ContactsScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const [personalContacts, setPersonalContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados del modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF0000'); 
  const [showColorPicker, setShowColorPicker] = useState(false); 

  // Colores predefinidos
  const colors = [
    '#FF0000', // Rojo
    '#FF6B00', // Naranja
    '#FFD700', // Dorado
    '#00FF00', // Verde
    '#00CED1', // Turquesa
    '#0000FF', // Azul
    '#8B00FF', // Violeta
    '#FF1493', // Rosa
    '#808080', // Gris
    '#000000', // Negro
  ];

  // Obtener userId del login
  const userId = user?.codigo_estudiante || route.params?.userId;

  // Verificar que tengamos un userId válido
  useEffect(() => {
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener el usuario. Por favor inicia sesión de nuevo.');
      navigation.navigate('Login');
      return;
    }
  }, [userId]);

  // Contactos fijos (emergencia y CUCEI)
  const emergencyContacts = [
    { id: 'e1', name: 'Policia Municipal', number: '+1234567890', emergency: true },
    { id: 'e2', name: 'Policia Estatal', number: '+0987654321', emergency: true },
  ];

  const cuceiContacts = [
    { id: 'c1', name: 'Psicologia', number: '+1122334455', emergency: false },
    { id: 'c2', name: 'Administración Social', number: '+5566778899', emergency: false },
  ];

  useEffect(() => {
    loadPersonalContacts();
  }, []);

  const loadPersonalContacts = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getPersonalContacts(userId);
      
      if (response.success && response.data) {
        setPersonalContacts(response.data);
      }
    } catch (error) {
      console.error('Error cargando contactos personales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (contact = null) => {
    if (contact) {
      // Modo edición
      setEditingContact(contact);
      setFullName(contact.nombre);
      setPhone(contact.telefono);
      setRelation(contact.relacion || '');
      setSelectedColor(contact.color || '#FF0000'); // 👈 AGREGAR
    } else {
      // Modo agregar
      setEditingContact(null);
      setFullName('');
      setPhone('');
      setRelation('');
      setSelectedColor('#FF0000'); // 👈 AGREGAR
    }
    setIsModalVisible(true);
    setShowColorPicker(false); // 👈 AGREGAR
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingContact(null);
    setFullName('');
    setPhone('');
    setRelation('');
    setSelectedColor('#FF0000'); // 👈 AGREGAR
    setShowColorPicker(false); // 👈 AGREGAR
  };

  const handleSaveContact = async () => {
    // Validaciones
    if (!fullName.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'El teléfono es obligatorio');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'El teléfono debe tener exactamente 10 dígitos');
      return;
    }

    try {
      setIsSaving(true);

      const contactData = {
        nombre: fullName.trim(),
        telefono: phone.trim(),
        relacion: relation.trim() || 'Familiar',
        color: selectedColor
      };

      if (editingContact) {
        await ApiService.updatePersonalContact(editingContact.id, contactData);
        Alert.alert('✅ Éxito', 'Contacto actualizado correctamente');
      } else {
        await ApiService.addPersonalContact(userId, contactData);
        Alert.alert('✅ Éxito', 'Contacto agregado correctamente');
      }

      closeModal();
      loadPersonalContacts();
    } catch (error) {
      console.error('Error guardando contacto:', error);
      Alert.alert('❌ Error', error.message || 'No se pudo guardar el contacto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContact = (contact) => {
    Alert.alert(
      'Eliminar contacto',
      `¿Estás seguro de eliminar a ${contact.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.deletePersonalContact(contact.id);
              Alert.alert('✅ Éxito', 'Contacto eliminado');
              loadPersonalContacts();
            } catch (error) {
              Alert.alert('❌ Error', 'No se pudo eliminar el contacto');
            }
          }
        }
      ]
    );
  };

  const handleContactPress = (contact, isPersonal = false) => {
    const phoneNumber = contact.number || contact.telefono;
    const contactName = contact.name || contact.nombre;
    const contactRelation = contact.relacion;

    if (isPersonal) {
      // Para contactos personales: Llamar, Editar, Cancelar
      Alert.alert(
        contactName,
        `${phoneNumber}${contactRelation ? '\n' + contactRelation : ''}`,
        [
          { 
            text: "Llamar", 
            onPress: () => handleCallContact(phoneNumber)
          },
          {
            text: "Editar / Eliminar",
            onPress: () => openModal(contact)
          },
          { 
            text: "Cancelar", 
            style: "cancel" 
          }
        ]
      );
    } else {
      // Para contactos fijos: Solo Llamar y Cancelar
      Alert.alert(
        contactName,
        `${phoneNumber}`,
        [
          { 
            text: "Llamar", 
            onPress: () => handleCallContact(phoneNumber)
          },
          { 
            text: "Cancelar", 
            style: "cancel" 
          }
        ]
      );
    }
  };

  const handleCallContact = (phoneNumber) => {
    // Limpiar el número (quitar espacios, guiones, paréntesis, etc.)
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    console.log('📞 Número original:', phoneNumber);
    console.log('📞 Número limpio:', cleanNumber);

    // Construir la URL
    const phoneUrl = `tel:${cleanNumber}`;
    
    console.log('📞 URL a abrir:', phoneUrl);

    // Intentar abrir directamente
    Linking.openURL(phoneUrl)
      .then(() => {
        console.log('✅ Aplicación de teléfono abierta correctamente');
      })
      .catch((error) => {
        console.error('❌ Error al abrir teléfono:', error);
        
        // Si falla, mostrar el número para que lo copien
        Alert.alert(
          'Número de teléfono',
          cleanNumber,
          [
            {
              text: 'Copiar número',
              onPress: () => {
                // Opcional: si tienes Clipboard instalado
                Alert.alert('Número', `${cleanNumber}\n\nCopia este número manualmente`);
              }
            },
            {
              text: 'Cerrar',
              style: 'cancel'
            }
          ]
        );
      });
  };

  const renderContactCard = (contact, isPersonal = false) => (
    <Pressable 
      key={contact.id}
      style={styles.contactCard}
      onPress={() => handleContactPress(contact, isPersonal)}
    >
      <View style={styles.contactTextContainer}>
        <Text style={styles.contactName}>
          {contact.name || contact.nombre}
        </Text>
        <Text style={styles.contactNumber}>
          {contact.number || contact.telefono}
        </Text>
        {contact.relacion && (
          <Text style={styles.contactRelation}>👥 {contact.relacion}</Text>
        )}
      </View>
      <View style={[
        styles.contactIcon,
        { backgroundColor: contact.color || '#FF0000' }
      ]}>
        <Image 
          source={require('../../assets/person.png')} 
          style={styles.contactLogo} 
        />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.outerContainer}>
      <HeaderBar navigation={navigation} showBackButton={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>CONTACTOS</Text>
        
        {/* Contactos de Emergencia */}
        <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
        {emergencyContacts.map(contact => renderContactCard(contact, false))}

        {/* Primer Contacto CUCEI */}
        <Text style={styles.sectionTitle}>Primer Contacto CUCEI</Text>
        {cuceiContacts.map(contact => renderContactCard(contact, false))}

        {/* Contactos Personales */}
        <Text style={styles.sectionTitle}>Contactos Personales</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="red" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        ) : personalContacts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes contactos personales</Text>
            <Text style={styles.emptySubtext}>
              Agrega uno presionando el botón "+ Agregar contacto personal"
            </Text>
          </View>
        ) : (
          personalContacts.map(contact => renderContactCard(contact, true))
        )}
          <Text style={styles.smallText}>All Rights reserved @EDUSHIELD2025</Text>
      </ScrollView>

      {/* Botón flotante */}
      <Pressable  
        onPress={() => openModal()} 
        style={styles.addContactButton}
      >
        <Image 
          source={require('../../assets/add.png')} 
          style={styles.addContactLogo} 
        />
        <Text style={styles.addContactText}>Agregar contacto personal</Text>
      </Pressable>

      {/* MODAL PARA AGREGAR/EDITAR */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header con botón eliminar (solo en modo edición) */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
              </Text>
              {editingContact && (
                <TouchableOpacity 
                  style={styles.deleteIconButton}
                  onPress={() => {
                    closeModal();
                    handleDeleteContact(editingContact);
                  }}
                  disabled={isSaving}
                >
                  <Image 
                    source={require('../../assets/trash.png')} 
                    style={styles.addContactLogo} 
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* SELECTOR DE COLOR CON ICONO */}
            <TouchableOpacity 
              style={styles.colorPickerButton} 
              onPress={() => setShowColorPicker(!showColorPicker)}
              disabled={isSaving}
            >
              <View style={[styles.photoCircle, { backgroundColor: selectedColor }]}>
                <Image
                  source={require('../../assets/person.png')} 
                  style={styles.photoLogo} 
                />
              </View>
              <Text style={styles.colorPickerText}>
                {showColorPicker ? 'Cerrar colores' : 'Seleccionar color'}
              </Text>
            </TouchableOpacity>

            {/* COLOR PICKER */}
            {showColorPicker && (
              <View style={styles.colorPickerContainer}>
                <Text style={styles.colorPickerLabel}>Elige un color:</Text>
                <View style={styles.colorsGrid}>
                  {colors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorOptionSelected
                      ]}
                      onPress={() => {
                        setSelectedColor(color);
                        setShowColorPicker(false);
                      }}
                    >
                      {selectedColor === color && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nombre completo *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa nombre completo"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                editable={!isSaving}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Número (10 dígitos) *</Text>
              <TextInput
                style={styles.input}
                placeholder="3312345678"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                editable={!isSaving}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Parentesco/Relación</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Madre, Padre, Amigo"
                placeholderTextColor="#999"
                value={relation}
                onChangeText={setRelation}
                editable={!isSaving}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={closeModal}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveContact}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingContact ? 'Actualizar' : 'Guardar'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 150,
  },

      smallText: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 10,
    textAlign: 'center',
    marginTop: 10, 
    marginBottom: 15,
  },
  
  header: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 30,
    textAlign: 'left',
  },
  sectionTitle: {
    color: 'gray',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  contactNumber: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 3,
  },
  contactRelation: {
    color: 'red',
    fontSize: 12,
    marginTop: 3,
  },
  contactLogo: {
    width: 25,
    height: 25,
    tintColor: 'white', 
    resizeMode: 'contain', 
  },
  photoLogo: {
    width: 40,
    height: 40,
    tintColor: 'white', 
    resizeMode: 'contain', 
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#aaa',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  emptySubtext: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  addContactText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  addContactLogo: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    flex: 1,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  deleteIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  deleteIcon: {
    fontSize: 24,
  },
  photoButton: {
    alignItems: 'center',
    marginBottom: 25,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
  },
  photoText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: 'red',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  colorPickerButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  photoIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain', 
  },
  colorPickerText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  colorPickerContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  colorPickerLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: 'white',
    borderWidth: 3,
  },
  checkmark: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ContactsScreen;