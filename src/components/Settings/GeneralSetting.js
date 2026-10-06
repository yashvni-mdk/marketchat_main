/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../CustomInput';
import Button from '../Button';
import Footer from '../Footer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
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
import CountryPicker from 'react-native-country-picker-modal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onUpdateUserDataApi } from '../../Service/Api';
import { getUserData } from '../../utils/localization/Storage';
import { getUserDataApi } from '../../Service/Api';
import { useDispatch } from 'react-redux';
import { fetchUserDataSuccess } from '../../redux/reducer';
import { Loader } from '../Loader';
import Collapsible from 'react-native-collapsible';


const GeneralSetting = () => {
    const user_data = useSelector(state => state.user_data);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });


    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('DD-MM-YYYY');
    const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(user_data?.country || '');
    const [genderVisible, setGenderVisible] = useState(false)
    const [gender, setGender] = useState('');
    const [isBirthDatePickerVisible, setBirthDatePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const subscribe = navigation.addListener('focus', () => {
            setUserName(user_data?.username);
            setPhone(user_data?.new_phone)
            setEmail(user_data?.email)
            setBirthday(user_data?.birthday)
            setGender(user_data?.gender)

        });
        return subscribe;
    }, [])

    const handleCountryPicker = () => {
        setCountryPickerVisibility(true); // Open the CountryPicker when the dropDownContainer is pressed
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country.name); // Set the selected country in state
        setCountryPickerVisibility(false); // Close the CountryPicker
    };

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    const toggleBirthDatePicker = () => {
        setBirthDatePickerVisibility((prevState) => !prevState);
    };

    const handleBirthDateConfirm = (date) => {
        const formattedDate = formatDate(date);
        setBirthday(formattedDate);
        toggleBirthDatePicker(); // Hide the start date picker after confirming the date
    };


    // Helper function to format date to 'dd-mm-yyyy' format
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1; // Month starts from 0, so add 1
        const year = date.getFullYear();

        // Pad single digit day/month with leading zero
        const formattedDay = day < 10 ? `0${day}` : `${day}`;
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;

        return `${formattedDay}-${formattedMonth}-${year}`;
    };


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
                    dispatch(fetchUserDataSuccess(response.data.user_data))
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
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                // Check if user_data exists and fields are not empty before updating
                    formData.append('username', userName);
                    formData.append('phone_number', phone);
                    formData.append('email', email);
                    formData.append('birthday', birthday);
                    formData.append('gender', gender);
                console.log("get Request Data:>>>", formData);
                const response = await onUpdateUserDataApi(formData, token)
                if (response.data.api_status === 200) {
                    const user = await getUserData()
                     onCheckAuth(user)
                    setLoading(false)
                    console.log('update successful', response.data)
                    navigation.navigate('ProfileScreen')
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('this is the error', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong please try again', ToastAndroid.SHORT)
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
                                            <MaterialIcons name='settings' size={19} color={COLORS.white} style={{ backgroundColor: '#363636', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(5) }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            General Setting
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Username</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={userName}
                                        onChangeText={text => setUserName(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Phone</Text>
                                    <CustomInput
                                        keyboardType="numeric"
                                        value={phone}
                                        onChangeText={text => setPhone(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>E-mail</Text>
                                    <CustomInput
                                        keyboardType="email-address"
                                        value={email}
                                        onChangeText={text => setEmail(text)}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Birthday</Text>
                                    <TouchableOpacity onPress={toggleBirthDatePicker} style={styles.timepickerContainer}>
                                        <Text style={styles.selctedDate}>{birthday !== 'DD-MM-YYYY' ? birthday : 'Select Birthday'}</Text>
                                        <MaterialIcons name='date-range' size={20} color={COLORS.secondaryGray} />
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={isBirthDatePickerVisible}
                                        mode="date"
                                        onConfirm={handleBirthDateConfirm}
                                        onCancel={toggleBirthDatePicker}
                                    />
                                </View>
                                {/* <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Country</Text>
                                    <TouchableOpacity onPress={handleCountryPicker} style={styles.dropDownContainer}>
                                        <Text style={styles.selectedCountry}>{selectedCountry || 'Select Country'}</Text>
                                    </TouchableOpacity>
                                    {isCountryPickerVisible && ( // Render CountryPicker conditionally based on isCountryPickerVisible
                                        <CountryPicker
                                            visible={isCountryPickerVisible}
                                            onClose={() => setCountryPickerVisibility(false)}
                                            onSelect={handleCountrySelect}
                                            withCountryNameButton
                                            withCloseButton
                                            containerButtonStyle={{ backgroundColor: COLORS.white }}
                                        />
                                    )}
                                </View> */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Gender</Text>
                                    <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setGenderVisible(!genderVisible) }}>
                                        <Text style={styles.titleText}>{gender}</Text>
                                        {genderVisible ?
                                            <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                            :
                                            <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                        }

                                    </TouchableOpacity>
                                    <Collapsible collapsed={!genderVisible}>
                                        <View style={styles.collapsView}>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setGender('Male'), setGenderVisible(!genderVisible) }}>
                                                <Text style={styles.optionText}>{'Male'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setGender('Female'), setGenderVisible(!genderVisible) }} >
                                                <Text style={styles.optionText}>{'Female'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.optionView} onPress={() => { setGender('Other'), setGenderVisible(!genderVisible) }} >
                                                <Text style={styles.optionText}>{'Other'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Collapsible>
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
                                            <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.6), color: COLORS.white }}>Save</Text>
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

export default GeneralSetting

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor
        },
        HandingtextContainer: {
            padding: wp(5),
            height: hp(15),
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#e2e2e2',
            backgroundColor: '#f5f5f5',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#333333',
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
            fontSize:  hp(2.2),
            color: global.text.color,
            fontWeight: '600',
            marginVertical: 4,
            fontFamily: fontFamily.FONTS.Medium,
        },
        username: {
            fontSize:  hp(2.2),
            color: '#333333',
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
        timepickerContainer: {
            width: '100%',
            height: 40,
            flexDirection: 'row',
            paddingHorizontal: 4,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: 'space-between',
            alignItems: 'center'
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
        dropDownContainer: {
            marginTop: 10,
            borderColor: '#eeeff0',
            borderWidth: 1,
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
            minHeight: 40, // Set minHeight or remove for explicit height
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
        },
        selctedDate: {
            color: COLORS.darkgray1
        },
        selectedCountry: {
            color: COLORS.darkgray1,
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};