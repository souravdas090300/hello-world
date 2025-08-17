import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
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
    <ImageBackground 
      source={require('../assets/images/Background Image.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Main app title */}
        <Text style={styles.title}>App Title</Text>
        
        {/* Main input container with white background */}
        <View style={styles.inputContainer}>
          {/* Name input section with avatar icon */}
          <View style={styles.nameInputContainer}>
            <Image
              source={require('../assets/images/avatar-icon.png')}
              style={styles.avatarIcon}
            />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="rgba(117, 112, 131, 0.5)"
            />
          </View>
          
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end', // Position content at bottom
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 30, // Increased padding for better spacing
    marginHorizontal: 20, // Equal left and right margins
    marginBottom: 20, // Bottom margin from screen edge
    borderRadius: 10,
    width: '88%',
    alignItems: 'center',
    minHeight: 300, // Ensure adequate height for content
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 30, // Added spacing below name input
  },
  avatarIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    opacity: 0.5,
  },
  textInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 15, // Spacing below text
    alignSelf: 'flex-start', // Align to left
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30, // Added spacing below color buttons
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
