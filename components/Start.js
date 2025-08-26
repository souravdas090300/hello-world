import { signInAnonymously } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  ImageBackground,
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
        <Text style={styles.title}>Chat App</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#757083"
          />
          
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    margin: 25,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    width: '88%',
    alignItems: 'center',
  },
  textInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 5,
    padding: 15,
    width: '100%',
    marginBottom: 15,
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
