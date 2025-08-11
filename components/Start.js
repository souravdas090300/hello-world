import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// The app's start screen component that allows users to enter their name and choose a background color
const Start = ({ navigation }) => {
  // State for storing user's name input
  const [name, setName] = useState('');
  // State for storing selected background color (default to first option)
  const [backgroundColor, setBackgroundColor] = useState('#090C08');

  // Background color options for the chat screen
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  // Function to handle navigation to chat screen with validation
  const handleStartChat = () => {
    if (name.trim()) {
      // Navigate to Chat screen and pass user's name and selected background color
      navigation.navigate('Chat', { 
        name: name.trim(), 
        backgroundColor: backgroundColor 
      });
    } else {
      // Show alert if user hasn't entered a name
      Alert.alert('Please enter your name');
    }
  };

  return (
    <View style={[styles.backgroundImage, { backgroundColor: '#757083' }]}>
      <View style={styles.container}>
        {/* Main app title */}
        <Text style={styles.title}>Chat App</Text>
        
        {/* Main input container with white background */}
        <View style={styles.inputContainer}>
          {/* Text input field for user's name */}
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#757083"
          />
          
          {/* Color selection instruction */}
          <Text style={styles.colorText}>Choose Background Color:</Text>
          
          {/* Container for color selection circles */}
          <View style={styles.colorContainer}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  backgroundColor === color && styles.selectedColor
                ]}
                onPress={() => setBackgroundColor(color)}
              />
            ))}
          </View>
          
          {/* Start chatting button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleStartChat}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 50,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '88%',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 5,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 20,
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 10,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#757083',
  },
  button: {
    backgroundColor: '#757083',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Start;
