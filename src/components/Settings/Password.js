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
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../Pixel/index';
import fontFamily from '../../../constants/fontFamily';
import { getUserData } from '../../utils/localization/Storage';
import { getUserDataApi, onUpdateUserDataApi } from '../../Service/Api';
import { fetchUserDataSuccess } from '../../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { Loader } from '../Loader';

const Password = () => {
    const user_data = useSelector(state => state.user_data);
    const navigation = useNavigation();
    const dispatch = useDispatch();
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

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [authentication, setAuthentication] = useState('Disable')
    const [loading, setLoading] = useState(false)

    const onCheckAuth = async (user) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {

                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('user_id', user.userData.user_id);
                formData.append('fetch', 'user_data,followers,following,liked_pages,joined_groups');
                formData.append('server_key', serverkey);

                const response = await getUserDataApi(formData, token)
                console.log("Get Response DAtaLLL", response.data)
                if (response.data.api_status === 200) {
                    dispatch(fetchUserDataSuccess(response.data.user_data, response.data.followers, response.data.following, response.data.liked_pages, response.data.joined_groups))
                } else if (response.data.api_status === 400 || 404) {
                    console.log('Error fetching profile data', response.data);
                    navigation.navigate('Login');
                }
            }
            else {
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 2000);
            }
        }
        catch (err) {
            console.log("Get Error::", err)
        }
    }

    const updateData = async () => {
        if (newPassword !== repeatPassword) {
            ToastAndroid.show('New password and repeat password do not match', ToastAndroid.SHORT);
            return; // Return early if passwords don't match
        }
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                // Check if user_data exists and fields are not empty before updating
                if (currentPassword || user_data?.current_password) {
                    formData.append('current_password', currentPassword || user_data.currentPassword);
                }
                if (newPassword || user_data?.new_password) {
                    formData.append('new_password', newPassword || user_data.newPassword);
                }

                const response = await onUpdateUserDataApi(formData, token)
                if (response.data.api_status === 200) {
                    const user = await getUserData()
                     onCheckAuth(user)
                    setLoading(false)
                    console.log('update successful', response.data)
                    ToastAndroid.show('Password update successfully', TouchableOpacity.SHORT)
                    navigation.navigate('Profile')
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('this is the error', response.data.errors.error_text)
                    ToastAndroid.show(response.data.errors.error_text, ToastAndroid.SHORT)
                }
            } else {
                setLoading(false)
                console.log('User Token not Found ', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
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
                                            <MaterialIcons name='lock' size={19} color={COLORS.white} style={{ backgroundColor: '#00bcd4', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(5) }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            Change Password
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Current Password</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={currentPassword}
                                        onChangeText={text => setCurrentPassword(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>New Password</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={newPassword}
                                        onChangeText={text => setNewPassword(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Repeat Password</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={repeatPassword}
                                        onChangeText={text => setRepeatPassword(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Two-factor authentication</Text>
                                    <View style={styles.dropDownContainer}>
                                        <Picker
                                            selectedValue={authentication}
                                            onValueChange={(itemValue, itemIndex) => setAuthentication(itemValue)}
                                            style={styles.dropDown} itemStyle={styles.pickerItem}
                                        >
                                            <Picker.Item label='Disable' value={'Disable'} style={styles.lable} />
                                            <Picker.Item label='Enable' value={'Enable'} style={styles.lable} />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(3), borderRadius: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity style={{
                                        height: hp(4.8),
                                        backgroundColor: COLORS.red,
                                        // borderColor: COLORS.black,
                                        // borderWidth: 2,
                                        borderRadius: 12,
                                        width: wp(35),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }} onPress={updateData}>
                                        {loading ? (
                                            <Loader isLoading={loading} color='white' />
                                        ) : (
                                            <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>Save</Text>
                                        )}
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

export default Password

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
            // flexWrap: 'wrap',ss
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#e2f7fa',
            backgroundColor: '#f5fcfd',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#00bcd4',
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
            marginTop: 10,
        },
        lable: {
            fontSize: 16,
            color: global.text.color,
            fontWeight: '600',
            marginTop: 4,
        },
        username: {
            fontSize: 16,
            color: '#00bcd4',
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
        },
        checkBoxtext: {
            color: global.text.color,
            paddingLeft: 10
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
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};