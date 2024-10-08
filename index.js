import { AppRegistry } from 'react-native';
import App from './src/App';  // Updated path to point to src/App
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
