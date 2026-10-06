/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const CheckBox = ({ isChecked, handleCheck }) => {
    // const handleCheck = () => {
    //     setIsChecked(!isChecked);
    // };
    return (
        <TouchableOpacity onPress={handleCheck}>
            <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>
                    {isChecked && <View style={styles.innerCheckbox} />}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#757575',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCheckbox: {
        width: 10,
        height: 10,
        borderRadius: 2,
        backgroundColor: COLORS.default,
    },
});

export default CheckBox;
