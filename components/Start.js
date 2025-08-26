import { signInAnonymously } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

  // Function to sign in user anonymously
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        // Navigate to Chat screen with user ID, name, and background color
        navigation.navigate('Chat', { 
          userID: result.user.uid,
          name: name || 'Anonymous', 
          backgroundColor: backgroundColor 
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
      });
  };

  const handleStartChat = () => {
    // Call signInUser to authenticate and navigate
    signInUser();
  };

  return (
    <ImageBackground 
      source={require('../assets/images/Background Image.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Let's Chat!</Text>
          
          <View style={styles.inputContainer}>
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
            
            <Text style={styles.colorText}>Choose Background Color:</Text>
            
            <View style={styles.colorContainer}>
              {colors.map((color, index) => (
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="More options"
                  accessibilityHint="Choose a background color for the chat screen"
                  accessibilityRole="button"
                  key={index}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    backgroundColor === color ? styles.selectedColor : null
                  ]}
                  onPress={() => setBackgroundColor(color)}
                />
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartChat}
              accessible={true}
              accessibilityLabel="Start chatting"
              accessibilityHint="Tap to start chatting"
              accessibilityRole="button"
            >
              <Text style={styles.startButtonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 'auto',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 30,
    width: '88%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 20,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#757083',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  avatarIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 15,
    textAlign: 'center',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedColor: {
    borderColor: '#757083',
    borderWidth: 3,
  },
  startButton: {
    backgroundColor: '#757083',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Start;