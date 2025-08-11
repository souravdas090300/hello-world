import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Client or in a native build,
// the environment is set up appropriately
// This is the entry point that registers our main App component
registerRootComponent(App);
