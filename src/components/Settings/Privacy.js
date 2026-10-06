/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../CustomInput';
import Button from '../Button';
import Footer from '../Footer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CheckBox from '../CheckBox';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header';
import { globalStyles } from '../GlobalTheme';
import { useTheme } from '../ThemeContext';
import { ToastAndroid } from 'react-native'
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import Collapsible from 'react-native-collapsible';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../Pixel/index';
import fontFamily from '../../../constants/fontFamily';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Privacy = () => {
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

    const [open, setOpen] = useState(false);
    const [followVisible, setFollowVisible] = useState(false)
    const [follow, setFollow] = useState('EveryOne')
    const [messageVisible, setMessageVisible] = useState(false)
    const [message, setMessage] = useState('EveryOne')
    const [seeMyFrirendsVisible, setSeeMyFriendsVisible] = useState(false)
    const [seeMyFrirends, setSeeMyFriends] = useState('EveryOne')
    const [timelineVisible, setTimelineVisible] = useState(false)
    const [timeline, setTimeline] = useState('People I Follow')
    const [seeBirthdayVisible, setSeeBirthdayVisible] = useState(false)
    const [seeBirthday, setSeeBirthday] = useState('EveryOne')
    const [confirmRequestVisible, setConfirmRequestVisible] = useState(false)
    const [confirmRequest, setConfirmRequest] = useState('No')
    const [showActivitiesVisible, setShowActivitiesVisible] = useState(false)
    const [showActivities, setShowActivities] = useState('Yes')
    const [statusVisible, setStatusVisible] = useState(false)
    const [status, setStatus] = useState('Online')
    const [locationVisible, setLocationVisible] = useState(false)
    const [location, setLocation] = useState('Yes')
    const [searchEnginesAllowVisible, setSearchEnginesAllowVisible] = useState(false)
    const [searchEnginesAllow, setSearchEnginesAllow] = useState('Yes')


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
                                            <MaterialCommunityIcons name='shield-account' size={19} color={COLORS.white} style={{ backgroundColor: '#673ab7', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: 17 }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            Privacy Settings
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Who can follow me ?</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setFollowVisible(!followVisible) }}>
                                        <Text style={styles.titleText}>{follow}</Text>
                                        {followVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!followVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setFollow('EveryOne'), setFollowVisible(!followVisible) }}>
                                                <Text style={styles.optionText}>{'EveryOne'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setFollow('People I Follow'), setFollowVisible(!followVisible) }} >
                                                <Text style={styles.optionText}>{'People I Follow'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Who can see my friends ?</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setSeeMyFriendsVisible(!seeMyFrirendsVisible) }}>
                                        <Text style={styles.titleText}>{seeMyFrirends}</Text>
                                        {seeMyFrirendsVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!seeMyFrirendsVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setSeeMyFriends('EveryOne'), setSeeMyFriendsVisible(!seeMyFrirendsVisible) }}>
                                                <Text style={styles.optionText}>{'EveryOne'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setSeeMyFriends('People I Follow'), setSeeMyFriendsVisible(!seeMyFrirendsVisible) }} >
                                                <Text style={styles.optionText}>{'People I Follow'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setSeeMyFriends('No body'), setSeeMyFriendsVisible(!seeMyFrirendsVisible) }} >
                                                <Text style={styles.optionText}>{'No body'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Who can post on my timeline ?</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setTimelineVisible(!timelineVisible) }}>
                                        <Text style={styles.titleText}>{timeline}</Text>
                                        {timelineVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!timelineVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setTimeline('EveryOne'), setTimelineVisible(!timelineVisible) }}>
                                                <Text style={styles.optionText}>{'EveryOne'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setTimeline('People I Follow'), setTimelineVisible(!timelineVisible) }} >
                                                <Text style={styles.optionText}>{'People I Follow'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setTimeline('No body'), setTimelineVisible(!timelineVisible) }} >
                                                <Text style={styles.optionText}>{'No body'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Who can see my birthday ?</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setSeeBirthdayVisible(!seeBirthdayVisible) }}>
                                        <Text style={styles.titleText}>{seeBirthday}</Text>
                                        {seeBirthdayVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!seeBirthdayVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setSeeBirthday('EveryOne'), setSeeBirthdayVisible(!seeBirthdayVisible) }}>
                                                <Text style={styles.optionText}>{'EveryOne'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setSeeBirthday('People I Follow'), setSeeBirthdayVisible(!seeBirthdayVisible) }} >
                                                <Text style={styles.optionText}>{'People I Follow'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setSeeBirthday('No body'), setSeeBirthdayVisible(!seeBirthdayVisible) }} >
                                                <Text style={styles.optionText}>{'No body'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Confirm request when someone follows you ?</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setConfirmRequestVisible(!confirmRequestVisible) }}>
                                        <Text style={styles.titleText}>{confirmRequest}</Text>
                                        {confirmRequestVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!confirmRequestVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setConfirmRequest('No'), setConfirmRequestVisible(!confirmRequestVisible) }}>
                                                <Text style={styles.optionText}>{'No'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setConfirmRequest('Yes'), setConfirmRequestVisible(!confirmRequestVisible) }} >
                                                <Text style={styles.optionText}>{'Yes'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Show my activities ?</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setShowActivitiesVisible(!showActivitiesVisible) }}>
                                        <Text style={styles.titleText}>{showActivities}</Text>
                                        {showActivitiesVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!showActivitiesVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setShowActivities('No'), setShowActivitiesVisible(!showActivitiesVisible) }}>
                                                <Text style={styles.optionText}>{'No'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setShowActivities('Yes'), setShowActivitiesVisible(!showActivitiesVisible) }} >
                                                <Text style={styles.optionText}>{'Yes'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Status</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setStatusVisible(!statusVisible) }}>
                                        <Text style={styles.titleText}>{status}</Text>
                                        {statusVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!statusVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setStatus('Online'), setStatusVisible(!statusVisible) }}>
                                                <Text style={styles.optionText}>{'Online'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setStatus('Offline'), setStatusVisible(!statusVisible) }} >
                                                <Text style={styles.optionText}>{'Offline'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Share my location with public ?</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setLocationVisible(!locationVisible) }}>
                                        <Text style={styles.titleText}>{location}</Text>
                                        {locationVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!locationVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setLocation('No'), setLocationVisible(!locationVisible) }}>
                                                <Text style={styles.optionText}>{'No'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setLocation('Yes'), setLocationVisible(!locationVisible) }} >
                                                <Text style={styles.optionText}>{'Yes'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>

                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Allow search engines to index my profile and posts ?</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setSearchEnginesAllowVisible(!searchEnginesAllowVisible) }}>
                                        <Text style={styles.titleText}>{searchEnginesAllow}</Text>
                                        {searchEnginesAllowVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!searchEnginesAllowVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setSearchEnginesAllow('No'), setSearchEnginesAllowVisible(!searchEnginesAllowVisible) }}>
                                                <Text style={styles.optionText}>{'No'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setSearchEnginesAllow('Yes'), setSearchEnginesAllowVisible(!searchEnginesAllowVisible) }} >
                                                <Text style={styles.optionText}>{'Yes'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>
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

export default Privacy

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor
        },
        optionView: {
            width: '100%',
            height: hp(6),
            marginLeft: wp(3),
            justifyContent: 'center'
        },
        collapsView: {
            width: '100%',
            minHeight: hp(12),
            backgroundColor: '#fff',
            borderWidth: 0.5,
            borderColor: COLORS.primarygray
        },
        titleText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
        optionText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
        HandingtextContainer: {
            padding: 17,
            minHeight: hp(15),
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#f0ecf7',
            backgroundColor: '#f9f7fc',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#673ab7',
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
        inputContainer: {
            // marginTop: 10,
        },
        lable: {
            fontSize:  hp(2.2),
            color: '#6a6d77',
            fontFamily: fontFamily.FONTS.regular,
            marginTop: hp(3),
        },
        username: {
            fontSize:  hp(2.2),
            color: '#673ab7',
            fontFamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        CheckBoxContainer: {
            flexDirection: 'row',
            paddingTop: 10,
        },
        checkBoxtext: {
            color: global.text.color,
            fontSize: hp(2.1)
        },
        exampleText: {
            fontFamily: fontFamily.FONTS.regular,
            fontSize: hp(2),
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
            borderColor: COLORS.primarygray,
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            justifyContent: 'space-between',
            height: 45,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: wp(3)
        },
        dropDown: {
            width: '100%',

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
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
        },
        checkBoxtext: {
            color: global.text.color,
            paddingLeft: 10
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
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};