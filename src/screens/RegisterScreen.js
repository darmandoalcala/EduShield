import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert, ToastAndroid, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../theme/ThemeContext";

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [centro, setCentro] = useState("CUCEI"); // valor por defecto

  // Función para mostrar toast multiplataforma
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Información", message);
    }
  };

  // Función para cuando se toca el picker (aunque esté deshabilitado)
  const handlePickerTouch = () => {
    showToast("Proximamente más centros de la red universitaria");
  };

  // Validación de email UDG - SOLO @alumnos.udg.mx
  const validateUDGEmail = (email) => {
    const udqEmailRegex = /^[a-zA-Z0-9._%+-]+@alumnos\.udg\.mx$/;
    return udqEmailRegex.test(email.toLowerCase());
  };

  const handleContinue = () => {
    // Validaciones
    if (!email.trim()) {
      Alert.alert("Error", "El correo electrónico es obligatorio.");
      return;
    }

    if (!validateUDGEmail(email)) {
      Alert.alert("Error", "Debe ser un correo institucional válido con terminación @alumnos.udg.mx");
      return;
    }

    if (!centro) {
      Alert.alert("Error", "Debes seleccionar un centro universitario.");
      return;
    }

    // Si pasa validación, enviamos datos a Register2
    const userData = {
      email: email.trim().toLowerCase(),
      centro: centro.toUpperCase(),
    };

    navigation.navigate("Register2", { userData });
  };

  return (
    <View style={[styles.container, { backgroundColor: "black" }]}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: "white" }]}>EDUSHIELD</Text>
        <Image
          source={require("../../assets/edushield-high-resolution-logo-transparent (1).png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* TEXTO DE BIENVENIDA */}
      <View style={styles.textContainer}>
        <Text style={[styles.welcome, { color: "white" }]}>¡BIENVENIDO!</Text>
        <Text style={[styles.subtext, { color: "white" }]}>
          Verifica tu identidad estudiantil para comenzar
        </Text>
      </View>

      {/* INPUT EMAIL INSTITUCIONAL */}
      <Text style={[styles.fieldLabel, { color: "white" }]}>Correo institucional</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="usuario@alumnos.udg.mx"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        maxLength={100}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />

      {/* PICKER CENTRO */}
      <Text style={[styles.fieldLabel, { color: "white" }]}>Centro universitario</Text>
      <TouchableOpacity
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            padding: 0,
          },
        ]}
        onPress={handlePickerTouch}
        activeOpacity={0.7}
      >
        <View pointerEvents="none">
          <Picker
            selectedValue={centro}
            onValueChange={(value) => setCentro(value)}
            enabled={false}
            dropdownIconColor={colors.text}
            style={{ color: colors.text, fontSize: 18 }}
          >
            <Picker.Item label="CUCEI - Centro Universitario de Ciencias Exactas e Ingenierías" value="CUCEI" />
          </Picker>
        </View>
      </TouchableOpacity>

      {/* INFORMACIÓN ADICIONAL */}
      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: "white" }]}>
          ℹ️ Solo estudiantes con correo institucional @alumnos.udg.mx pueden registrarse
        </Text>
      </View>

      {/* BOTÓN CONTINUAR */}
      <TouchableOpacity
        style={[
          styles.button, 
          { 
            backgroundColor: "red",
            opacity: email.trim() && validateUDGEmail(email) ? 1 : 0.6 // Visual feedback
          }
        ]}
        onPress={handleContinue}
        disabled={!email.trim() || !validateUDGEmail(email)}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText || "white" }]}>
          Continuar
        </Text>
      </TouchableOpacity>

      {/* INDICADOR DE PROGRESO */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
        <Text style={[styles.progressText, { color: "white" }]}>
          Paso 1 de 3
        </Text>
      </View>

      {/* ENLACE A LOGIN */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, { color: "white" }]}>
          ¿Ya tienes cuenta? <Text style={{ color: "red", fontWeight: "bold" }}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
    marginTop: -50,
  },
  logo: {
    width: 100,
    height: 60,
    marginRight: -40,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
  },
  textContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtext: {
    fontSize: 17,
    textAlign: "center",
    opacity: 0.9,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 17,
    justifyContent: "center",
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 20,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "red",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.8,
  },
  backText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});