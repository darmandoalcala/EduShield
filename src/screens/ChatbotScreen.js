import React, { useState, useRef } from "react";
import { 
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderBar from "../components/HeaderBar";
import { classifyByBackend } from "../chatbot/api";

export default function ChatbotScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: "sys-1", role: "bot", text: "Hola, soy el asistente de EduShield. Cuéntame tu situación." }
  ]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages(prev => [userMsg, ...prev]);
    setInput("");

    try {
      const data = await classifyByBackend(trimmed); // llama al backend
      const botMsg = { 
        id: `b-${Date.now()}`, 
        role: "bot", 
        text: `${data.reply}\n\n(Detectado: ${data.category})` 
      };
      setMessages(prev => [botMsg, ...prev]);
    } catch (err) {
      const errorMsg = { 
        id: `b-${Date.now()}`, 
        role: "bot", 
        text: "⚠️ No pude conectar con el servidor. Intenta de nuevo." 
      };
      setMessages(prev => [errorMsg, ...prev]);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
    Keyboard.dismiss();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.bubble, item.role === "user" ? styles.user : styles.bot]}>
      <Text style={[styles.text, { color: "#fff" }]}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
      <HeaderBar navigation={navigation} showBackButton={true} />
      <FlatList
        ref={flatListRef}
        style={styles.list}
        inverted
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu reporte..."
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
          <Text style={styles.btnText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  list: { flex: 1, paddingHorizontal: 12, backgroundColor: "black" },
  bubble: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    maxWidth: "85%",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  user: { alignSelf: "flex-end", backgroundColor: "#9e2b2bff" },
  bot: { alignSelf: "flex-start", backgroundColor: "#696969ff" },
  text: { color: "#fff", fontSize: 15 },
  inputBar: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "black",
    alignItems: "center",
    borderTopWidth: 0,
    borderTopColor: "black"
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#747474ff",
    color: "#fff",
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "red",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20
  },
  btnText: { color: "#fff", fontWeight: "600" }
});
