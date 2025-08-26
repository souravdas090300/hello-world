import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation, db }) => {
  const { name, backgroundColor, userID } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
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

  useEffect(() => {
    navigation.setOptions({ title: name });

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];
      documentsSnapshot.forEach(doc => {
        newMessages.push({ 
          id: doc.id, 
          ...doc.data(), 
          createdAt: new Date(doc.data().createdAt.toMillis()) 
        })
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
 container: {
   flex: 1
 }
});

export default Chat;
