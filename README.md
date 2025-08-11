# Chat App

A React Native chat application built with Expo for Achievement 5 of the Full-Stack Immersion course.

## Features

- **Start Screen**: Enter your name and choose a background color for the chat
- **Chat Screen**: Main chat interface with personalized background color
- **Navigation**: Seamless navigation between screens using React Navigation
- **Responsive Design**: Optimized for mobile devices

## Screenshots

The app consists of two main screens:

1. **Start Screen**: Users enter their name and select a background color
2. **Chat Screen**: Main chat interface (chat functionality will be implemented in the next exercise)

## Technologies Used

- React Native
- Expo
- React Navigation
- JavaScript ES6+

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd hello-world
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your device:
   - Install Expo Go app on your mobile device
   - Scan the QR code displayed in the terminal
   - Alternatively, press 'a' for Android emulator or 'w' for web

## Project Structure

```
hello-world/
├── components/
│   ├── Start.js          # Start screen component
│   └── Chat.js           # Chat screen component
├── App.js                # Main app component with navigation
├── index.js              # App entry point
└── assets/               # Images and other assets
```

## How to Use

1. **Start Screen**: 
   - Enter your name in the text input field
   - Choose your preferred background color by tapping one of the color options
   - Tap "Start Chatting" to proceed to the chat screen

2. **Chat Screen**: 
   - Your name appears in the navigation header
   - The background color you selected is applied
   - Chat functionality will be added in the next exercise

## Next Steps

This is the foundation for a chat app. In the next exercise, we will implement:
- Real-time messaging
- Image sharing
- Location sharing
- Offline message storage

## Development Notes

- Uses traditional React Navigation setup instead of Expo Router for learning purposes
- Follows the tutorial instructions from Achievement 5
- Implements proper state management and prop passing between screens
- Uses TouchableOpacity for better button customization

## Author

Created as part of the CareerFoundry Full-Stack Web Development Course.