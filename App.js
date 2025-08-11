import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the screens we want to navigate between
import Chat from './components/Chat';
import Start from './components/Start';

// Create the navigator for handling navigation between screens
const Stack = createNativeStackNavigator();

// Main App component that sets up navigation structure
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        {/* Start screen - entry point of the app */}
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        {/* Chat screen - displays chat interface with user's name in header */}
        <Stack.Screen
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
