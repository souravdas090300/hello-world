import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
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
      const cachedMessages = await AsyncStorage.getItem("messages") || '[]';
      setMessages(JSON.parse(cachedMessages));
    } catch (error) {
      console.log(error.message);
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
    if (isConnected === false) {
      return null;
    } else {
      return (
        <InputToolbar 
          {...props} 
          containerStyle={styles.inputToolbar}
          primaryStyle={styles.inputPrimary}
          textInputStyle={styles.textInput}
          textInputProps={{
            ...props.textInputProps,
            editable: isConnected,
            placeholder: isConnected ? 'Type a message...' : 'You are offline',
            style: styles.textInput
          }}
        />
      );
    }
  }

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} {...props} />;
  };

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
    // Dismiss keyboard when navigating back
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      Keyboard.dismiss();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (isConnected === true) {
      unsubMessages = onSnapshot(
        query(collection(db, "messages"), orderBy("createdAt", "desc")), 
        (docs) => {
          let newMessages = [];
          docs.forEach(doc => {
            newMessages.push({
              id: doc.id,
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
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderUsernameOnMessage={true}
        keyboardShouldPersistTaps={'never'}
        minInputToolbarHeight={Platform.OS === 'ios' ? 44 : 50}
        alwaysShowSend={true}
        bottomOffset={Platform.OS === 'ios' ? 0 : 0}
        messagesContainerStyle={{ paddingBottom: 0 }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 0,
    minHeight: Platform.OS === 'ios' ? 44 : 50,
  },
  inputPrimary: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    marginVertical: 0,
    flex: 1,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 2,
    marginBottom: 2,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 12,
    minHeight: Platform.OS === 'ios' ? 36 : 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
});

export default Chat;