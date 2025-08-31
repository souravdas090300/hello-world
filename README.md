# Let's Chat - React Native Chat Application

A comprehensive React Native chat application built with Expo, featuring real-time messaging, image sharing, location services, and offline functionality. This project was developed as part of Achievement 5 (Exercises 5.1-5.5) in the Full-Stack Immersion course.

## 🌟 Features

### Core Chat Features
- **Real-time Messaging**: Live chat with Firebase Firestore integration
- **User Authentication**: Anonymous authentication via Firebase Auth
- **Offline Support**: Message caching with AsyncStorage for offline viewing
- **Custom UI**: Personalized background colors and custom message bubbles
- **Username Display**: Shows sender names above messages

### Communication Features (Exercise 5.5)
- **📸 Image Sharing**: 
  - Take photos with device camera
  - Select images from photo library
  - Upload to Firebase Storage with unique references
- **📍 Location Sharing**: 
  - Share current GPS location
  - Display locations as interactive maps in chat
- **🎵 Audio Recording (Bonus)**: 
  - Record voice messages using device microphone
  - Play audio messages with custom audio player
  - Upload audio files to Firebase Storage
- **♿ Accessibility**: Full accessibility support with proper labels and hints

### User Experience
- **Intuitive Design**: Clean, user-friendly interface
- **Responsive Layout**: Optimized for mobile devices
- **Keyboard Handling**: Proper keyboard behavior for seamless typing
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🛠 Technologies Used

### Core Technologies
- **React Native** - Mobile app framework
- **Expo SDK 53** - Development platform and tools
- **JavaScript (ES6+)** - Programming language

### UI/UX Libraries
- **react-native-gifted-chat 2.6.3** - Chat interface components
- **@react-navigation/native 7.1.17** - Navigation system
- **@react-navigation/native-stack 7.3.25** - Stack navigation

### Backend & Database
- **Firebase 12.1.0** - Backend as a Service
  - **Firestore** - Real-time database for messages
  - **Storage** - Cloud storage for images
  - **Authentication** - User authentication system

### Communication APIs
- **expo-image-picker 16.1.4** - Camera and photo library access
- **expo-location 18.1.6** - GPS location services
- **expo-audio** - Audio recording and playback capabilities (replaces deprecated expo-av)
- **react-native-maps 1.20.1** - Map display for locations

### Storage & Offline
- **@react-native-async-storage/async-storage 2.1.2** - Local storage
- **@react-native-community/netinfo 11.4.1** - Network connectivity detection

### UI Components & Actions
- **@expo/react-native-action-sheet 4.1.1** - Action sheet for communication options

## 📱 Screenshots

The app consists of two main screens:

1. **Start Screen**: Users enter their name and select a background color
2. **Chat Screen**: Full-featured chat interface with messaging and communication tools

*Screenshots will be added here*

## 🚀 Getting Started

### Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

3. **Mobile Development Environment** (choose one):
   
   **Option A: Physical Device**
   - Install **Expo Go** app from App Store (iOS) or Google Play Store (Android)
   
   **Option B: Android Emulator**
   - Install [Android Studio](https://developer.android.com/studio)
   - Set up Android Virtual Device (AVD)
   
   **Option C: iOS Simulator** (macOS only)
   - Install Xcode from Mac App Store
   - Install iOS Simulator

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/souravdas090300/hello-world.git
   cd hello-world
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   
   a. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable **Authentication**, **Firestore Database**, and **Storage**
   
   b. Get your Firebase configuration:
   - In your Firebase project, go to Project Settings
   - Scroll down to "Your apps" and click "Web app" icon
   - Copy the configuration object
   
   c. Update `App.js` with your Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

4. **Configure Firebase Services**
   
   a. **Firestore Database**:
   - Go to Firestore Database in Firebase Console
   - Click "Create database"
   - Choose "Start in test mode"
   - Select a location for your database
   
   b. **Firebase Storage**:
   - Go to Storage in Firebase Console
   - Click "Get started"
   - Choose "Start in test mode"
   - Update Storage rules to:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   
   c. **Authentication**:
   - Go to Authentication in Firebase Console
   - Click "Get started"
   - Enable "Anonymous" authentication method

5. **Start the Development Server**
   ```bash
   npx expo start
   ```

6. **Run the App**
   - **On Physical Device**: Scan the QR code with Expo Go app
   - **On Android Emulator**: Press 'a' in the terminal
   - **On iOS Simulator**: Press 'i' in the terminal

### Testing the Setup

After following the setup steps:

1. **Start Screen Test**:
   - Enter your name
   - Select a background color
   - Press "Start Chatting"

2. **Chat Features Test**:
   - Send text messages
   - Tap the "+" button and test:
     - "Select an image from library"
     - "Take a photo" 
     - "Share location"
     - "Record a sound"

3. **Expected Behavior**:
   - Messages appear in real-time
   - Images upload and display in chat bubbles
   - Location shows as an interactive map
   - Audio messages display with "Play Sound" button
   - Messages persist when app is restarted

## 📁 Project Structure

```
hello-world/
├── App.js                 # Main app entry point with Firebase config
├── components/
│   ├── Start.js          # Welcome screen with name input and color selection
│   ├── Chat.js           # Main chat interface with all messaging features
│   └── CustomActions.js  # Communication features (camera, images, location)
├── assets/
│   ├── images/           # App icons and background images
│   └── fonts/            # Custom fonts
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Configuration Details

### Firebase Services Setup

1. **Firestore Rules** (for development):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

2. **Storage Rules** (for development):
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```

### Required Permissions

The app requires the following device permissions:
- **Camera**: For taking photos
- **Photo Library**: For selecting existing images  
- **Location**: For sharing current location
- **Microphone**: For recording audio messages

Permissions are requested automatically when features are used.

## 🐛 Troubleshooting

### Common Issues

1. **"Expo Go keeps stopping"**
   - Ensure WiFi is enabled on your device/emulator
   - Try restarting the Expo development server

2. **Firebase Storage upload errors**
   - Verify Firebase Storage is enabled in your Firebase Console
   - Check that Storage rules allow read/write access
   - Ensure correct Firebase configuration in App.js

3. **Images not loading**
   - Check internet connection
   - Verify Firebase Storage rules and permissions
   - Review console logs for specific error messages

4. **Location not working**
   - Grant location permissions when prompted
   - Ensure device GPS is enabled
   - Test on physical device (location may not work on some emulators)

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all dependencies are installed correctly
3. Ensure Firebase services are properly configured
4. Test on a different device or emulator

## 🚀 Deployment

### Building for Production

1. **Create Expo Build**:
   ```bash
   expo build:android
   # or
   expo build:ios
   ```

2. **Update Firebase Rules** for production:
   - Implement proper authentication-based rules
   - Remove test mode configurations

## 📄 License

This project is part of an educational assignment for the Full-Stack Immersion course.

## 🙏 Acknowledgments

- **React Native Gifted Chat** - For providing excellent chat UI components
- **Expo Team** - For the comprehensive development platform
- **Firebase** - For backend services and real-time database
- **CareerFoundry** - For the educational program and guidance

---

## 🎓 Course Information

**Course**: Full-Stack Immersion  
**Achievement**: 5 (Exercises 5.1-2-3-4-5)  
**Focus**: React Native Mobile Development with Communication Features

## 👨‍💻 Author

Created as part of the CareerFoundry Full-Stack Web Development Course.