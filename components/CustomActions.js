// Import necessary dependencies for communication features
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * CustomActions component provides communication features for the chat app
 */
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, auth, userID, userName }) => { // ← Added auth prop
  const actionSheet = useActionSheet();

  const onActionPress = () => {
    console.log('Action sheet button pressed');
    const options = ['Select an image from library', 'Take a photo', 'Share location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        console.log('Action sheet option selected:', buttonIndex);
        switch (buttonIndex) {
          case 0:
            console.log('Calling pickImage...');
            pickImage();
            return;
          case 1:
            console.log('Calling takePhoto...');
            takePhoto();
            return;
          case 2:
            console.log('Calling getLocation...');
            getLocation();
          default:
            console.log('Action canceled or invalid option');
        }
      },
    );
  };

  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  }

  const uploadAndSendImage = async (imageURI) => {
    try {
      console.log('Starting upload process...');
      
      // Temporarily remove auth check for testing
      console.log('Auth current user:', auth.currentUser ? 'authenticated' : 'not authenticated');

      const uniqueRefString = generateReference(imageURI);
      console.log('Generated reference:', uniqueRefString);
      
      // Create storage reference with simplified path for testing
      const newUploadRef = ref(storage, uniqueRefString);
      console.log('Created storage reference:', newUploadRef.fullPath);
      
      const response = await fetch(imageURI);
      console.log('Fetched image, status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Created blob, size:', blob.size, 'type:', blob.type);
      
      // Upload the image to Firebase Storage with metadata
      console.log('Starting Firebase upload...');
      // Upload with minimal metadata for testing
      const metadata = {
        contentType: blob.type || 'image/jpeg'
      };
      
      console.log('Uploading with metadata:', metadata);
      const snapshot = await uploadBytes(newUploadRef, blob, metadata);
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

  const pickImage = async () => {
    try {
      console.log('Starting image picker...');
      
      let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permissions:', permissions);
      
      if (permissions?.granted) {
        console.log('Launching image library...');
        
        // Add small delay for Android compatibility
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let mediaTypes;
        if (ImagePicker.MediaType && ImagePicker.MediaType.Images) {
          mediaTypes = ImagePicker.MediaType.Images;
        } else if (ImagePicker.MediaTypeOptions) {
          mediaTypes = ImagePicker.MediaTypeOptions.Images;
        } else {
          mediaTypes = 'Images';
        }
        
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // Force use of working legacy API
          allowsEditing: false,
          quality: 0.7, // Slightly higher quality
          base64: false,
          exif: false,
          selectionLimit: 1, // Explicitly set selection limit for Android
        });
        
        console.log('Image picker result:', result);
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
          console.log('Image selected:', result.assets[0].uri);
          await uploadAndSendImage(result.assets[0].uri);
        } else if (result.canceled) {
          console.log('Image selection was canceled by user');
        } else {
          console.log('No image was selected');
          Alert.alert("No Image", "No image was selected. Please try again.");
        }
      } else {
        console.log('Media library permissions denied');
        Alert.alert(
          "Permission Required", 
          "Please grant photo library access to select images.",
          [
            { text: "OK" }
          ]
        );
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      
      // Handle specific Android NullPointerException
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
          [
            { text: "OK" }
          ]
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