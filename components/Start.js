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

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#090C08');
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  const handleStartChat = () => {
    if (name.trim()) {
      navigation.navigate('Chat', { 
        name: name.trim(), 
        backgroundColor: backgroundColor 
      });
    } else {
      Alert.alert('Please enter your name');
    }
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
              onPress={handleStartChat}
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
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
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 80,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 30,
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
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
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