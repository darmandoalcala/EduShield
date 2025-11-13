import React, { useState, useRef } from "react";
import { 
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBar from "../components/HeaderBar";
import { classifyByBackend } from "../chatbot/api";

export default function ChatbotScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { 
      id: "sys-1", 
      role: "bot", 
      text: "👋 Hola, soy el asistente de EduShield.\n\nEstoy aquí para ayudarte. Cuéntame tu situación." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages(prev => [userMsg, ...prev]);
    setInput("");
    setIsTyping(true);

    try {
      const data = await classifyByBackend(trimmed);

      setIsTyping(false);

      const botMsg = { 
        id: `b-${Date.now()}`, 
        role: "bot", 
        text: data.text || data.reply || "🤖 ..." 
      };
      setMessages(prev => [botMsg, ...prev]);

      if (data.action === "Report") {
        navigation.navigate("MainApp", { 
          screen: "Inicio", 
          params: { screen: "Report" }
        });
      } else if (data.action === "Contacts") {
        navigation.navigate("MainApp", { 
          screen: "Contactos",
          params: { screen: "Contacts" }
        });
      }
    } catch (err) {
      setIsTyping(false);
      const errorMsg = { 
        id: `b-${Date.now()}`, 
        role: "bot", 
        text: "⚠️ No pude conectar con el servidor. Por favor, intenta de nuevo." 
      };
      setMessages(prev => [errorMsg, ...prev]);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
    Keyboard.dismiss();
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.role === "user" ? styles.userContainer : styles.botContainer
    ]}>
      {item.role === "bot" && (
        <View style={styles.botAvatar}>
          <Icon name="robot" size={20} color="white" />
        </View>
      )}
      <View style={[
        styles.bubble,
        item.role === "user" ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      {item.role === "user" && (
        <View style={styles.userAvatar}>
          <Icon name="account" size={20} color="white" />
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior="padding" 
      keyboardVerticalOffset={0}
    >
      <HeaderBar navigation={navigation} showBackButton={true} />
      
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <View style={styles.headerAvatarContainer}>
          <Icon name="robot" size={24} color="red" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Asistente EduShield</Text>
          <Text style={styles.headerStatus}>
            {isTyping ? "Escribiendo..." : "En línea"}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.list}
        inverted
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.botAvatar}>
            <Icon name="robot" size={20} color="white" />
          </View>
          <View style={styles.typingBubble}>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </View>
      )}

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#666"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} 
            onPress={onSend}
            disabled={!input.trim() || isTyping}
          >
            <Icon 
              name={input.trim() ? "send" : "send-outline"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  
  // Chat Header
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerAvatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerStatus: {
    color: '#888',
    fontSize: 12,
  },

  // Messages List
  list: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  listContent: { 
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  // Message Container
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },

  // Avatars
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },

  // Bubbles
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userBubble: { 
    backgroundColor: "red",
    borderBottomRightRadius: 4,
  },
  botBubble: { 
    backgroundColor: "#1a1a1a",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#222',
  },
  messageText: { 
    color: "#fff", 
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },

  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  typingBubble: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },

  // Input Bar
  inputBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    color: "#fff",
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "red",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: "#333",
    shadowOpacity: 0,
  },
});