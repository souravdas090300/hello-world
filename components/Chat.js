import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// The app's main Chat component that renders the chat UI
const Chat = ({ route, navigation }) => {
  // Extract name and backgroundColor from navigation parameters
  const { name, backgroundColor } = route.params;

  // Set the navigation header title to display user's name
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  return (
    // Main chat container with user's selected background color
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      {/* Welcome message with user's name */}
      <Text style={styles.text}>Welcome to the chat, {name}!</Text>
      {/* Placeholder text for future chat functionality */}
      <Text style={styles.text}>Chat functionality will be implemented in the next exercise.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Chat;
