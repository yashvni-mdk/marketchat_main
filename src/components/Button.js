/* eslint-disable prettier/prettier */
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants';
import { Loader } from './Loader';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from './Pixel';

const Button = (props) => {
    const buttonTextColor = props.disabled ? COLORS.gray : COLORS.white;


    return (
        <TouchableOpacity style={{ ...styles.button }} onPress={props.onPress} disabled={props.disabled || props.loading} >
            {props.loading ? (
                <Loader isLoading={props.loading} color={COLORS.secondaryWhite} />
            ) : (
                <Text style={{ ...styles.buttonText, color: buttonTextColor }}>{props.title} </Text>
            )}
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        marginTop: hp(3),
        height: hp(7),
        backgroundColor: COLORS.red,
        // borderColor: COLORS.black,
        // borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
    }
});
