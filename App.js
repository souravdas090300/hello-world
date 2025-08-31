/**
 * App.js - Main application entry point
 * 
 * This file initializes the React Native chat application with:
 * - Firebase configuration (Firestore, Storage, Authentication)
 * - Navigation setup with React Navigation
 * - ActionSheet provider for communication features
 * - Network connectivity monitoring
 * 
 * The app provides a complete chat experience with real-time messaging,
 * image sharing, location services, and offline functionality.
 */
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { disableNetwork, enableNetwork, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useEffect, useState } from "react";
import { Alert, LogBox } from 'react-native';

// Import the application screens
import Chat from './components/Chat';
import Start from './components/Start';

// Create the navigation stack
const Stack = createNativeStackNavigator();

// Your Firebase configuration - CORRECTED to match Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCQbV9xrL13sOssae19uFWGPkqGBF76AuY",
  authDomain: "shopping-lists-demo-c71aa.firebaseapp.com",
  projectId: "shopping-lists-demo-c71aa",
  storageBucket: "shopping-lists-demo-c71aa.firebasestorage.app", // ← CORRECT bucket from your console
  messagingSenderId: "248904910931",
  appId: "1:248904910931:web:d665f2f853f38a53e4dea6",
  measurementId: "G-97L1RF2LL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Storage with CORRECT bucket
const storage = getStorage(app); // ← Remove explicit bucket, use default

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Ignore warnings
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  const connectionStatus = useNetInfo();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        console.log('User authenticated:', user.uid);
      } else {
        // Sign in anonymously if no user
        signInAnonymously(auth)
          .then((result) => {
            console.log('Anonymous sign-in successful:', result.user.uid);
            setIsAuthenticated(true);
          })
          .catch((error) => {
            console.error('Anonymous sign-in failed:', error);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen
            name="Start"
            options={{ headerShown: false }}
          >
            {props => <Start {...props} auth={auth} isAuthenticated={isAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen 
            name="Chat"
          >
            {props => <Chat 
              {...props} 
              db={db} 
              storage={storage}
              auth={auth} // ← Pass auth to Chat component
              isConnected={connectionStatus.isConnected} 
            />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}

export { auth, db, storage }; // ← Export for use in other components
export default App;