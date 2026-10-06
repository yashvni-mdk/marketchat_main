/* eslint-disable prettier/prettier */
// storage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserData = async () => {
    try {
        const userDataString = await AsyncStorage.getItem('userData');
        const accessToken = await AsyncStorage.getItem('access_token');

        const userData = JSON.parse(userDataString);
        return {
            userData,
            accessToken
        };
    } catch (error) {
        console.log('Error getting user data:', error.message);
        return null;
    }
};
