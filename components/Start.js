/**
 * Start.js - Welcome screen component
 * 
 * This component provides the entry point for users to join the chat.
 * Features:
 * - Name input with validation
 * - Background color selection (4 color options)
 * - Firebase anonymous authentication
 * - Navigation to chat screen with user data
 * - Responsive design with background image
 */
import { signInAnonymously } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const Start = ({ navigation, auth }) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#090C08');
  
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  const signInUser = () => {
    if (!name.trim()) {
      Alert.alert("Please enter your name");
      return;
    }
    
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate('Chat', {
          userID: result.user.uid,
          name: name.trim(),
          backgroundColor: backgroundColor
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/Background Image.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Let's Chat</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.textInputContainer}>
              <Image 
                source={require('../assets/images/avatar-icon.png')} 
                style={styles.avatarIcon}
              />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor="#757083"
              />
            </View>
            
            <Text style={styles.colorSelectorText}>Choose Background Color:</Text>
            
            <View style={styles.colorSelector}>
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
            
            <TouchableOpacity
              style={styles.button}
              onPress={signInUser}
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 0.56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: '6%',
    width: '88%',
    minHeight: '44%',
    marginBottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  avatarIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    opacity: 0.5,
  },
  textInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  colorSelectorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 15,
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000',
  },
  button: {
    backgroundColor: '#757083',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Start;