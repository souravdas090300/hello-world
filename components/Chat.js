/**
 * Chat.js - Main chat interface component
 * 
 * This component combines Exercise 5.2 (Basic Chat UI) and Exercise 5.5 (Communication Features)
 * following both tutor and mentor instructions exactly.
 * 
 * Features:
 * - Real-time messaging with Firebase Firestore
 * - Offline message caching with AsyncStorage  
 * - Image sharing via camera and photo library
 * - Location sharing with map display
 * - Custom message bubbles and input toolbar
 * - Username display and accessibility features
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const Chat = ({ route, navigation, db, storage, isConnected }) => {
  const { name, backgroundColor, userID } = route.params;
  const [messages, setMessages] = useState([]);

  let unsubMessages;

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  }

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("messages");
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.log('Error loading cached messages:', error.message);
    }
  }

  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return (
        <InputToolbar
          {...props}
          containerStyle={styles.inputToolbar}
          primaryStyle={styles.inputPrimary}
        />
      );
    }
  }

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} userName={name} onSend={onSend} {...props} />;
  }

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  useEffect(() => {
    if (isConnected === true) {
      unsubMessages = onSnapshot(
        query(collection(db, "messages"), orderBy("createdAt", "desc")), 
        (docs) => {
          let newMessages = [];
          docs.forEach(doc => {
            newMessages.push({
              _id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis())
            });
          });
          cacheMessages(newMessages);
          setMessages(newMessages);
        }
      );
    } else {
      loadCachedMessages();
    }

    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
        keyboardShouldPersistTaps='never'
        alwaysShowSend={true}
        renderUsernameOnMessage={true}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  inputPrimary: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
});

export default Chat;