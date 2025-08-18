import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

/**
 * Chat component following tutor instructions - Custom implementation
 * Implements Gifted Chat-like interface without external dependencies
 * @param {Object} route - Navigation route object containing parameters
 * @param {Object} navigation - Navigation object for screen transitions
 */
const Chat = ({ route, navigation }) => {
  // Extract name and backgroundColor from navigation parameters
  const { name, backgroundColor } = route.params;

  // State for managing chat messages following Gifted Chat format
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Set the navigation header title to display user's name
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  // Initialize chat with static messages when component mounts
  // Following tutor instructions: at least two static messages (system + user)
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
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

  // Handle sending new messages - implements Gifted Chat-like append functionality
  // Uses callback function to access previous messages and append new ones
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
      // Append new message to existing messages (like GiftedChat.append)
      setMessages(previousMessages => [newMessage, ...previousMessages]);
      setInputText('');
    }
  };

  // Custom render function for message bubbles
  // Implements bubble styling: black for sender (right), white for receiver (left)
  const renderMessage = (message) => {
    if (message.system) {
      // System messages appear in center without bubble (like Gifted Chat)
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
      {/* Messages container - scrollable like Gifted Chat */}
      <ScrollView 
        style={styles.messagesContainer}
        inverted
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input container - positioned like Gifted Chat */}
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

      {/* Platform-specific KeyboardAvoidingView following tutor instructions */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>
  );
};

// Styles implementing Gifted Chat-like appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginVertical: 4,
    borderRadius: 15,
  },
  // Black bubble for sender messages (right side) - per tutor instructions
  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#000',
  },
  // White bubble for receiver messages (left side) - per tutor instructions  
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
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Chat;