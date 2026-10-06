/* eslint-disable prettier/prettier */
import React, { Children, createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        async function fetchTheme() {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme !== null) {
                    setTheme(savedTheme);
                }
            } catch (error) {
                console.log('Error fetching theme', error)
            }
        }
        fetchTheme();
    }, [])

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('theme', newTheme)
            console.log(newTheme)
        } catch (error) {
            console.log('Error setting theme to AsyncStorage', error)
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
}
