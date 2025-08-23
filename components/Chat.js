import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      (event) => {
        setKeyboardOffset(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardOffset(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
        },
      },
      {
        _id: 2,
        text: `${name} has entered the chat`,
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, [name]);

  const onSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        _id: Math.random().toString(),
        text: inputText.trim(),
        createdAt: new Date(),
        user: {
          _id: 1,
          name: name,
        },
      };
      setMessages(previousMessages => [newMessage, ...previousMessages]);
      setInputText('');
      // Dismiss keyboard after sending
      Keyboard.dismiss();
    }
  };

  const renderMessage = (message) => {
    if (message.system) {
      return (
        <View key={message._id} style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{message.text}</Text>
        </View>
      );
    }

    const isCurrentUser = message.user._id === 1;
    return (
      <View key={message._id} style={[
        styles.messageBubble,
        isCurrentUser ? styles.rightBubble : styles.leftBubble
      ]}>
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.rightText : styles.leftText
        ]}>
          {message.text}
        </Text>
        <Text style={styles.userName}>{message.user.name}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      {/* Messages container */}
      <View style={[styles.messagesWrapper, { marginBottom: keyboardOffset }]}>
        <ScrollView 
          style={styles.messagesContainer}
          inverted
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(renderMessage)}
        </ScrollView>
      </View>

      {/* Input container with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={[styles.keyboardAvoidingView, { marginBottom: keyboardOffset }]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            multiline
            accessible={true}
            accessibilityLabel="Type your message"
            accessibilityHint="Enter text to send a message in the chat"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={onSend}
            accessible={true}
            accessibilityLabel="Send message"
            accessibilityHint="Sends your typed message to the chat"
            accessibilityRole="button"
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesWrapper: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginVertical: 4,
    borderRadius: 15,
  },
  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#000',
  },
  leftBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  rightText: {
    color: '#FFF',
  },
  leftText: {
    color: '#000',
  },
  userName: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    marginVertical: 10,
  },
  systemMessageText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  keyboardAvoidingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Chat;