/* eslint-disable prettier/prettier */
import { StyleSheet, View, TextInput } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants';
import { globalStyles } from './GlobalTheme';
import { useTheme } from './ThemeContext';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from './Pixel';
import fontFamily from '../../constants/fontFamily';

const CustomInput = (props, { inputTextStyle }) => {
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });
    return (
        <View style={styles.customInput}>
            <TextInput
                {...props}
                style={[styles.inputText, inputTextStyle]}
            />
        </View>
    );
};

export default CustomInput;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        customInput: {
            width: '100%',
            height: 40,
            paddingHorizontal: 4,
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: 'center',
        },
        inputText: {
            color: global.inputText.color,
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.Medium
        }
    });
};