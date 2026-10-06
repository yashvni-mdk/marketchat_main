/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../CustomInput';
import Button from '../Button';
import Footer from '../Footer';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
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

const NotificationSettings = () => {
    const user_data = useSelector(state => state.user_data);
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });


    const [likedPostChecked, setLikedPostChecked] = useState(false)
    const [commentedPost, setCommentedPost] = useState(false)
    const [sharedPost, setSharedPost] = useState(false)
    const [followedMe, setFollowedMe] = useState(false)
    const [likedPage, setLikedPage] = useState(false)
    const [visitedProfile, setVisitedProfile] = useState(false)
    const [mentioned, setMentioned] = useState(false)
    const [joinedGroup, setJoinedGroup] = useState(false)
    const [acceptedRequest, setAcceptedRequest] = useState(false)
    const [postedMyTime, setPostedMyTime] = useState(false)
    const [remembrance, setRemembrance] = useState(false)



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
                                            <MaterialIcons name='notifications-on' size={19} color={COLORS.white} style={{ backgroundColor: '#1da1f2', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(5) }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            Notification Settings
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginTop: hp(3) }}>
                                    <Text style={{
                                        fontFamily: fontFamily.FONTS.Medium,
                                        color: COLORS.black,
                                        fontSize: hp(2.5),
                                        flex: 1,
                                    }}>Notify me when</Text>

                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <AntDesign name="like1" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone liked my posts</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={likedPostChecked} handleCheck={() => setLikedPostChecked(!likedPostChecked)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="message-text" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone commented on my posts</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={commentedPost} handleCheck={() => setCommentedPost(!commentedPost)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="share-variant" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone shared on my posts</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={sharedPost} handleCheck={() => setSharedPost(!sharedPost)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialIcons name="person-add" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone followed me</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={followedMe} handleCheck={() => setFollowedMe(!followedMe)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="flag" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone liked my page</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={likedPage} handleCheck={() => setLikedPage(!likedPage)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="eye" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone visited my profile</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={visitedProfile} handleCheck={() => setVisitedProfile(!visitedProfile)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Octicons name="mention" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone mentioned me</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={mentioned} handleCheck={() => setMentioned(!mentioned)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="account-group" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone joined my group</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={joinedGroup} handleCheck={() => setJoinedGroup(!joinedGroup)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="account-check" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone accepted my friend/follow request</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={acceptedRequest} handleCheck={() => setAcceptedRequest(!acceptedRequest)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="timeline" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>Someone posted on my timeline</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={postedMyTime} handleCheck={() => setPostedMyTime(!postedMyTime)} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="clock-time-four-outline" size={20} color={'#333333'} style={{ backgroundColor: '#e5e5e5', borderRadius: 10, padding: 7 }} />
                                            <Text style={styles.optionsText}>You have remembrance on this day</Text>
                                            <View style={styles.CheckBoxContainer}>
                                                <CheckBox isChecked={remembrance} handleCheck={() => setRemembrance(!remembrance)} />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(3), borderRadius: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5, }} onPress={handelContactUs} >
                                        <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotificationSettings

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
            borderColor: '#e2f7fa',
            backgroundColor: '#f5fcfd',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#1da1f2',
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
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: '#f0f0f0'
        },
        optionsText: {
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.darkgray1,
            fontSize:  hp(2.2),
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
            color: '#1da1f2',
            fontFamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        checkBoxtext: {
            color: global.text.color,
            fontSize: hp(2.1)
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