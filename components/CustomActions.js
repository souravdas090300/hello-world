// Import necessary dependencies for communication features
import { useActionSheet } from '@expo/react-native-action-sheet';
import { AudioRecorder, AudioPlayer } from 'expo-audio';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * CustomActions Component
 * 
 * Provides communication features for the chat application including:
 * - Camera photo capture
 * - Photo library image selection  
 * - GPS location sharing
 * - Audio recording and playback
 * - Firebase Storage integration for uploads
 * 
 * Uses Expo ActionSheet for native mobile interaction patterns
 */
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, auth, userID, userName }) => {
  const actionSheet = useActionSheet();
  let recordingObject = null;

  /**
   * Displays ActionSheet with communication options and handles user selection
   */
  const onActionPress = () => {
    const options = ['Select an image from library', 'Take a photo', 'Share location', 'Record a sound', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          case 3:
            startRecording();
            return;
          default:
        }
      },
    );
  };

  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  }

  /**
   * Uploads image to Firebase Storage and sends the image message to chat
   * 
   * @param {string} imageURI - Local URI of the image to upload
   */
  const uploadAndSendImage = async (imageURI) => {
    try {
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);
      
      // Convert image URI to blob for Firebase Storage upload
      const response = await fetch(imageURI);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Upload image to Firebase Storage
      const snapshot = await uploadBytes(newUploadRef, blob);
      
      // Get download URL for the uploaded image
      const imageURL = await getDownloadURL(snapshot.ref);
      
      // Send image message to chat
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
      
    } catch (error) {
      console.error('Image upload error:', error);
      
      let errorMessage = 'Image upload failed. ';
      if (error.code === 'storage/unauthorized') {
        errorMessage += 'Storage permissions denied. Check Firebase Storage rules.';
      } else if (error.code === 'storage/canceled') {
        errorMessage += 'Upload was canceled.';
      } else if (error.code === 'storage/unknown') {
        errorMessage += 'Unknown storage error. Please check your Firebase configuration and storage rules.';
      } else {
        errorMessage += error.message;
      }
      
      Alert.alert(
        'Upload Failed', 
        errorMessage,
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
   * Allows user to select an image from device photo library
   */
  const pickImage = async () => {
    try {
      let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissions?.granted) {
        // Small delay for Android compatibility
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.7,
          base64: false,
          exif: false,
          selectionLimit: 1,
        });
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
          await uploadAndSendImage(result.assets[0].uri);
        } else if (!result.canceled) {
          Alert.alert("No Image", "No image was selected. Please try again.");
        }
      } else {
        Alert.alert(
          "Permission Required", 
          "Please grant photo library access to select images.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      
      // Handle specific Android compatibility issues
      if (error.message.includes('NullPointerException') || error.message.includes('dispatchCancelPendingInputEvents')) {
        Alert.alert(
          "Android Compatibility Issue", 
          "There's a known issue with the image picker on this Android version. Try using the camera instead, or restart the app and try again.",
          [
            { 
              text: "Use Camera", 
              onPress: () => takePhoto() 
            },
            { 
              text: "Cancel", 
              style: "cancel" 
            }
          ]
        );
      } else {
        Alert.alert(
          "Error", 
          `Failed to open photo library: ${error.message}. Please try again.`,
          [{ text: "OK" }]
        );
      }
    }
  }

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.5,
      });
      
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Camera permissions haven't been granted.");
    }
  }

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
      Alert.alert("Location permissions haven't been granted.");
    }
  }

  /**
   * Starts audio recording after requesting microphone permissions
   * Shows an alert with options to stop and send or cancel the recording
   */
  const startRecording = async () => {
    try {
      const { granted } = await AudioRecorder.requestPermissionsAsync();
      if (granted) {
        // Configure audio session for recording
        await AudioRecorder.prepareAsync({
          android: {
            extension: '.m4a',
            outputFormat: 'mpeg4',
            audioEncoder: 'aac',
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            outputFormat: 'mpeg4aac',
            audioQuality: 'max',
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        });
        
        const recording = await AudioRecorder.startAsync();
        recordingObject = recording;
        
        Alert.alert('You are recording...', undefined, [
          { text: 'Cancel', onPress: () => { stopRecording() } },
          { text: 'Stop and Send', onPress: () => { sendRecordedSound() } },
        ],
        { cancelable: false }
        );
      } else {
        Alert.alert('Permission Required', 'Please grant microphone access to record audio.');
      }
    } catch (err) {
      console.error('Recording error:', err);
      Alert.alert('Failed to record!', err.message);
    }
  }

  /**
   * Stops the current recording and unloads it from memory
   */
  const stopRecording = async () => {
    if (recordingObject) {
      await AudioRecorder.stopAsync();
      recordingObject = null;
    }
  }

  /**
   * Stops recording, uploads audio file to Firebase Storage, and sends the audio message
   */
  const sendRecordedSound = async () => {
    try {
      const uri = await AudioRecorder.stopAsync();
      const uniqueRefString = generateReference(uri);
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const snapshot = await uploadBytes(newUploadRef, blob);
      const soundURL = await getDownloadURL(snapshot.ref);
      
      onSend([{
        _id: Math.round(Math.random() * 1000000),
        text: '',
        createdAt: new Date(),
        user: {
          _id: userID,
          name: userName,
        },
        audio: soundURL,
      }]);
    } catch (error) {
      console.error('Error sending recorded sound:', error);
      Alert.alert('Error', 'Failed to send audio message. Please try again.');
    }
  }

  // Cleanup function to unload recording if component unmounts during recording
  useEffect(() => {
    return () => {
      if (recordingObject) {
        AudioRecorder.stopAsync().catch(console.error);
      }
    }
  }, []);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Choose to send an image, your location, or record audio"
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