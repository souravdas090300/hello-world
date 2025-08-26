import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

const Chat = ({ db, route, navigation }) => {
  // Extract the database object prop (passed from the App component)
  // Extract three route parameters: the user's id, user's name, and the selected background color
  const { userID, name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);

  // Update onSend function to save sent messages on the Firestore database
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  // Customize the chat bubble appearance
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

  // Customize the input toolbar
  const renderInputToolbar = (props) => {
    return <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: "#FFF",
        borderTopColor: "#E8E8E8",
        borderTopWidth: 1
      }}
    />
  }

  // Fetch messages from the database in real time
  useEffect(() => {
    // Set the screen title to the user's name
    navigation.setOptions({ title: name });
    
    // Create a query that targets the messages collection
    // and sorts by createdAt in descending order
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    
    // Set up real-time listener using onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Check if createdAt exists and convert it to Date object
        if (data.createdAt) {
          newMessages.push({ 
            _id: doc.id, 
            text: data.text,
            createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
            user: {
              _id: data.user._id,
              name: data.user.name
            }
          });
        }
      });
      // Update messages state with the new messages
      setMessages(newMessages);
    }, (error) => {
      console.error("Error in Firestore listener: ", error);
    });

    // Clean up the listener when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
        // Ensure that GiftedChat will attach the correct user ID and name to the message
        // by updating the user prop to be an object that has two properties:
        user={{
          _id: userID, // This should have the value of the user ID route parameter
          name: name    // This should have the value of the name route parameter
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