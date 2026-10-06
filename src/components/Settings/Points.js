/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../CustomInput';
import Button from '../Button';
import Footer from '../Footer';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import CheckBox from '../CheckBox';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header';
import { globalStyles } from '../GlobalTheme';
import { useTheme } from '../ThemeContext';
import { ToastAndroid } from 'react-native'
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../Pixel/index';
import fontFamily from '../../../constants/fontFamily';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Points = () => {
    const user_data = useSelector(state => state.user_data);
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={styles.container}>
                        <View style={styles.ContentContainer}>
                            <View style={styles.content}>
                                <View style={styles.HandingtextContainer}>
                                    <View>
                                        <Image source={{ uri: user_data?.avatar }} style={{ height: hp(10), width: wp(20), borderRadius: 70 }} />
                                        <View style={{ position: 'absolute', top: hp(5.5), left: wp(14) }}>
                                            <FontAwesome5 name='coins' size={19} color={COLORS.white} style={{ backgroundColor: '#ff7f50', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(5) }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            My Points
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginTop: hp(3) }}>

                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="message" size={25} color={'#4caf50'} style={{ backgroundColor: '#dbefdc', borderRadius: 100, padding: 7 }} />
                                            <Text style={styles.optionsText}>Earn 10 points by commenting any post</Text>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <AntDesign name="like1" size={20} color={'#3ba2f4'} style={{ backgroundColor: '#d3eafd', borderRadius: 100, padding: 7 }} />
                                            <Text style={styles.optionsText}>Earn 15 points by createing a new post</Text>

                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <FontAwesome6 name="face-smile" size={24} color={'#ffa624'} style={{ backgroundColor: '#ffeacc', borderRadius: 100, padding: 7 }} />
                                            <Text style={styles.optionsText}>Earn 5 points by reacting on any post</Text>

                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <AntDesign name="like1" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Earn 15 points by createing a new blog</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.pointsCount}>
                                    <View style={{ padding: 20 }}>
                                        <Text style={styles.pointCountText}>Points</Text>
                                        <Text style={styles.count}>{user_data.points}</Text>
                                    </View>
                                </View>
                                <View style={styles.Information}>
                                    <Ionicons name='information' size={20} color={COLORS.white} style={{ backgroundColor: '#727272', borderRadius: 100, padding: 7 }} />
                                    <View style={{ padding: 20 }}>
                                        <Text style={styles.InformationText}>Your eaned points will automatically go to Wallet</Text>
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Points

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor
        },
        HandingtextContainer: {
            padding: wp(5),
            minHeight: hp(15),
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#fff3ee',
            backgroundColor: '#fffaf8',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#ff805f',
            fontSize: wp(6),
            fontFamily: fontFamily.FONTS.Medium,
            marginBottom: 10,
            // padding: 5,
        },
        ContentContainer: {
            margin: 10,
            borderRadius: 10,
            padding: 20,
            backgroundColor: global.ContentContainer.backgroundColor
        },
        optionsContainer: {
            marginTop: 10,
            padding: 5,

        },
        optionsText: {
            fontFamily: fontFamily.FONTS.bold,
            fontSize:  hp(1.9),
            color: COLORS.black,
            flex: 1,
            paddingHorizontal: 10
        },
        lable: {
            fontSize:  hp(2.2),
            color: global.text.color,
            fontWeight: '600',
            marginVertical: 4,
        },
        username: {
            fontSize:  hp(2.2),
            color: '#ff805f',
            fontFamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        pointsCount: {
            backgroundColor: '#f5f5f5',
            height: hp(20),
            marginTop: hp(3),
            // padding: 10,
            borderRadius: 8
        },
        count: {
            fontSize: hp(5),
            color: COLORS.black
        },
        pointCountText: {
            flexDirection: 'column',
            color: COLORS.black,
            alignItems: 'center',
            fontFamily: fontFamily.FONTS.regular,
            fontSize: hp(2.5)
        },
        InformationText: {
            flexDirection: 'column',
            alignItems: 'center',
            color: COLORS.darkgray1,
            fontFamily: fontFamily.FONTS.regular,
            fontSize:  hp(2.2),
            textAlign:'center'
        },
        Information: {
            height: hp(20),
            paddingTop: hp(4),
            justifyContent: 'center',
            alignItems: 'center',
            borderStyle: 'dashed',
            borderWidth: 0.5,
            borderColor: COLORS.gray,
            // padding: 10,
            borderRadius: 8
        },
        checkBoxtext: {
            color: global.text.color,
            fontSize: 15
        },
        exampleText: {
            fontFamily: fontFamily.FONTS.regular,
            fontSize: 14,
            color: '#757575'
        },
        timepickerContainer: {
            width: '100%',
            height: 40,
            flexDirection: 'row',
            paddingHorizontal: 4,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        dropDownContainer: {
            marginTop: 10,
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            // marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            overflow: 'hidden',
        },
        dropDown: {
            width: '100%',
            minHeight: 40, // Set minHeight or remove for explicit height
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
        },
        descriptionInput: {
            width: '100%',
            height: 'auto',
            paddingHorizontal: 4,
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        CheckBoxContainer: {
            alignItems: 'center',
            paddingTop: 15,
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};