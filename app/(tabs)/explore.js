import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ChatScreen() {
  const { name = 'User', backgroundColor = '#090C08' } = useLocalSearchParams();
  const navigation = useNavigation();

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
}

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
