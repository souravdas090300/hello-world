import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

/**
 * The app's main Chat component that renders the chat UI using GiftedChat
 * @param {Object} route - Navigation route object containing parameters
 * @param {Object} navigation - Navigation object for screen transitions
 */
const Chat = ({ route, navigation }) => {
  // Extract name and backgroundColor from navigation parameters
  const { name, backgroundColor } = route.params;

  /**
   * State hook for managing chat messages array
   * @type {[Array, Function]} messages - Array of message objects, setMessages - Function to update the messages array
   */
  const [messages, setMessages] = useState([]);

  // Set the navigation header title to display user's name
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  /**
   * Initialize chat with default messages when component mounts
   * Sets up a system message and a welcome message as required by the exercise
   */
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
        text: 'You have entered the chat',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, [name]);

  /**
   * Handles sending new messages
   * Appends new messages to the existing messages array
   * @param {Array} newMessages - Array of new message objects to add
   */
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

  /**
   * Custom bubble renderer for styling message bubbles
   * Sets black background for sender (right) and white for receiver (left) as per exercise requirements
   * @param {Object} props - Props passed from GiftedChat
   * @returns {JSX.Element} Custom styled bubble component
   */
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#FFF',
          }
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      {/* GiftedChat component with proper configuration */}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
          name: name,
        }}
        renderBubble={renderBubble}
      />
      {/* KeyboardAvoidingView for Android to prevent keyboard overlap */}
      <KeyboardAvoidingView behavior="height" />
    </View>
  );
};

export default Chat;