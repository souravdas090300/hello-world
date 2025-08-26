import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { disableNetwork, enableNetwork, getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { Alert, LogBox } from 'react-native';

// Import the application screens
import Chat from './components/Chat';
import Start from './components/Start';

// Create the navigation stack
const Stack = createNativeStackNavigator();

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQbV9xrL13sOssae19uFWGPkqGBF76AuY",
  authDomain: "shopping-lists-demo-c71aa.firebaseapp.com",
  projectId: "shopping-lists-demo-c71aa",
  storageBucket: "shopping-lists-demo-c71aa.firebasestorage.app",
  messagingSenderId: "248904910931",
  appId: "1:248904910931:web:d665f2f853f38a53e4dea6",
  measurementId: "G-97L1RF2LL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Ignore warnings
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          options={{ headerShown: false }}
        >
          {props => <Start {...props} auth={auth} />}
        </Stack.Screen>
        <Stack.Screen 
          name="Chat"
        >
          {props => <Chat {...props} db={db} isConnected={connectionStatus.isConnected} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

