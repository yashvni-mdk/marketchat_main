/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants';

export const globalStyles = (theme) => {
    return StyleSheet.create({
        loginContainer: {
            backgroundColor: theme === 'dark' ? COLORS.black : COLORS.white,
        },
        container: {
            backgroundColor: theme === 'dark' ? COLORS.black : '#f0f2f5',
        },
        splashScreentext: {
            color: theme === 'dark' ? COLORS.white : COLORS.black
        },
        text2: {
            color: theme === 'dark' ? COLORS.gray : COLORS.black
        },
        text: {
            color: theme === 'dark' ? COLORS.secondaryGray : COLORS.black
        },
        ContentContainer: {
            backgroundColor: theme === 'dark' ? COLORS.darkgray : COLORS.white
        },
        textInput: {
            backgroundColor: theme === 'dark' ? '#3d3d3d' : '#ededed'
        },
        inputText: {
            color: theme === 'dark' ? COLORS.white : COLORS.black
        },
        loginInput: {
            backgroundColor: theme === 'dark' ? COLORS.darkgray : COLORS.lightGreyColor
        },
        iconStyle: {
            color: theme === 'dark' ? COLORS.darkgray : COLORS.gray
        }
    })
}