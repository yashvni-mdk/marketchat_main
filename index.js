/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initializeApp } from '@react-native-firebase/app'; // Import the initializeApp function

// Manually initialize Firebase
initializeApp();
AppRegistry.registerComponent(appName, () => App);

