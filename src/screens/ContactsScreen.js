import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert
} from 'react-native';

const ContactsScreen = ({ navigation }) => {
  // Datos de ejemplo
  const contacts = [
    { id: 1, name: 'Policia Municipal', number: '+1234567890', emergency: true },
    { id: 2, name: 'Policia Estatal', number: '+0987654321', emergency: true },
    { id: 3, name: 'Psicologia', number: '+1122334455', emergency: false },
    { id: 4, name: 'Administración Social', number: '+5566778899', emergency: false },
  ];

  const handleAddContact = () => {
    navigation.navigate('AddContact');
  };

  const handleContactPress = (contact) => {
    Alert.alert(
      contact.name,
      contact.number,
      [
        { text: "Llamar", onPress: () => console.log('Llamando...') },
        { text: "Editar", onPress: () => navigation.navigate('EditContact') },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>CONTACTOS</Text>
        
        <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
        {contacts.filter(c => c.emergency).map(contact => (
          <Pressable 
            key={contact.id}
            style={styles.contactCard}
            onPress={() => handleContactPress(contact)}
          >
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
            <Image 
              source={require('../../assets/person.png')} 
              style={styles.contactLogo} 
            />
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Primer Contacto CUCEI</Text>
        {contacts.filter(c => !c.emergency).map(contact => (
          <Pressable 
            key={contact.id}
            style={styles.contactCard}
            onPress={() => handleContactPress(contact)}
          >
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
            <Image 
              source={require('../../assets/person.png')} 
              style={styles.contactLogo} 
            />
          </Pressable>
        ))}
      </ScrollView>

      <Pressable 
        onPress={() => navigation.navigate('AddContact')} 
        style={styles.addContactButton}
      >
        <Image 
          source={require('../../assets/add.png')} 
          style={styles.addContactLogo} 
        />
        <Text style={styles.addContactText}>Agregar contactos personales</Text>
      </Pressable>
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
    paddingBottom: 150, // Aumentado para el botón inferior
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
    justifyContent: 'space-between', // Esto alinea los elementos a los extremos
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactTextContainer: {
    flex: 1, // Toma todo el espacio disponible
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
  contactLogo: {
    width: 30,
    height: 30,
    tintColor: 'red',
    marginLeft: 15, // Espacio entre texto e icono
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
});

export default ContactsScreen;