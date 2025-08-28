// Import necessary dependencies for communication features
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * CustomActions component provides communication features for the chat app
 * Includes image picker, camera, and location sharing functionality
 * @param {Object} props - Component props
 * @param {Object} props.storage - Firebase storage instance
 * @param {string} props.userID - Current user's ID
 * @param {string} props.userName - Current user's name
 * @param {Function} props.onSend - Function to send messages
 */
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID, userName }) => {
  // Initialize action sheet for displaying communication options
  const actionSheet = useActionSheet();

  /**
   * Display action sheet with communication options when button is pressed
   */
  const onActionPress = () => {
    const options = ['Select an image from library', 'Take a photo', 'Share location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    
    // Show action sheet with options and handle user selection
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage(); // Launch image library
            return;
          case 1:
            takePhoto(); // Launch camera
            return;
          case 2:
            getLocation(); // Get current location
          default:
        }
      },
    );
  };

  /**
   * Generate unique reference string for Firebase Storage uploads
   * Combines user ID, timestamp, and original filename for uniqueness
   * @param {string} uri - Local file URI
   * @returns {string} Unique reference string
   */
  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  }

  /**
   * Upload image to Firebase Storage and send as message
   * Handles blob conversion, storage upload, and message sending
   * @param {string} imageURI - Local image URI from camera or gallery
   */
  const uploadAndSendImage = async (imageURI) => {
    try {
      console.log('Starting upload process...');
      const uniqueRefString = generateReference(imageURI);
      console.log('Generated reference:', uniqueRefString);
      
      // Try without subfolder first
      const newUploadRef = ref(storage, uniqueRefString);
      console.log('Created storage reference');
      
      const response = await fetch(imageURI);
      console.log('Fetched image, status:', response.status);
      const blob = await response.blob();
      console.log('Created blob, size:', blob.size);
      
      // Upload the image to Firebase Storage
      console.log('Starting Firebase upload...');
      const snapshot = await uploadBytes(newUploadRef, blob);
      console.log('Upload completed successfully');
      
      // Get the download URL
      const imageURL = await getDownloadURL(snapshot.ref);
      console.log('Got download URL:', imageURL);
      
      // Send the image message
      onSend([{
        _id: Math.round(Math.random() * 1000000),
        text: '',
        createdAt: new Date(),
        user: {
          _id: userID,
          name: userName,
        },
        image: imageURL,
      }]);
      console.log('Image message sent successfully');
      
    } catch (error) {
      console.error('Image upload error:', error);
      console.error('Error details:', error.code, error.message);
      
      // Try to send a text message instead
      Alert.alert(
        'Upload Failed', 
        'Image upload failed. Send as text message instead?',
        [
          {
            text: 'Send Text',
            onPress: () => {
              onSend([{
                _id: Math.round(Math.random() * 1000000),
                text: `📸 Photo: ${imageURI.split('/').pop()}`,
                createdAt: new Date(),
                user: {
                  _id: userID,
                  name: userName,
                },
              }]);
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  }

  /**
   * Allow user to pick image from device library
   * Requests permission and launches image picker
   */
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  }

  /**
   * Allow user to take photo with device camera
   * Requests permission and launches camera
   */
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  }

  /**
   * Get user's current location and send as message
   * Requests location permission and retrieves GPS coordinates
   */
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend([{
          _id: Math.round(Math.random() * 1000000),
          text: '',
          createdAt: new Date(),
          user: {
            _id: userID,
            name: userName,
          },
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        }]);
      } else {
        Alert.alert("Error occurred while fetching location");
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Choose to send an image or your location"
      accessibilityRole="button"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;