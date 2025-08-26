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

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate('Chat', {
          userID: result.user.uid,
          name: name,
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Chat App</Text>
            
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
          </ScrollView>
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    minHeight: '100%',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    margin: 25,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    width: '88%',
    alignItems: 'center',
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 15,
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
  },
  colorSelectorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 10,
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    color: 'white',
  },
});

export default Start;
