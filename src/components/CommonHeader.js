import { StyleSheet, Text, View, TouchableOpacity, Modal, SafeAreaView, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { useTheme } from './ThemeContext';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from './Pixel';
import search from '../../assets/image/img/bottombar/search.png'
import logo from '../../assets/image/img/night-logo.jpg'
import fontFamily from '../../constants/fontFamily';

const CommonHeader = ({ image, onPress, onPressMessage, userData, searchText, onChangeText, onBlur }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, justifyContent: "center" }}>

            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: "space-between", padding: wp(3) }}>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <TouchableOpacity onPress={onPress}>
                        <Image source={{ uri: userData?.avatar }} style={{ height: wp(8), width: wp(8), borderRadius: wp(8) }} />
                    </TouchableOpacity>
                    {/* <Image source={logo} style={{height:hp(5),width:wp(40),resizeMode:'contain'}} /> */}
                </View>
                <View style={{
                    width: '78%',
                    height: hp(5),
                    backgroundColor: COLORS.box,
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: wp(2),
                    justifyContent: 'space-between'
                }}>
                    <TextInput
                        value={searchText}
                        onChangeText={onChangeText}
                        placeholderTextStyle={COLORS.darkgray1}
                        onBlur={onBlur}
                        placeholder='Search user'
                        style={{
                            width: '90%',
                            height: 40,
                            paddingHorizontal: 4,
                            color:COLORS.black,
                            justifyContent: 'center',
                        }}
                    />
                </View>
                <TouchableOpacity onPress={onPressMessage}>
                    <Image style={{ width: wp(6), height: hp(4), resizeMode: 'contain', tintColor: COLORS.black }} source={require('../../assets/image/img/createPage/chat.png')} />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default CommonHeader;

const styles = StyleSheet.create({
    conteredView: {
        alignItems: 'flex-end',
        padding: 30,
        marginTop: 20,
    },
    imageStyle: {
        height: hp(6),
        width: wp(3),
        resizeMode: 'contain',
        tintColor: COLORS.white
    },
    buttonView: {
        width: wp(10),
        height: hp(5),
        borderRadius: 5,
        backgroundColor: COLORS.red,
        alignItems: "center",
        justifyContent: 'center'
    },
});
