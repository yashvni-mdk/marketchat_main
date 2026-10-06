/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, Aelrt } from 'react-native';
import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { COLORS } from '../../../constants';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '../../components/CheckBox';
import translations from '../../utils/localization/traslations';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { onIndicatorRegistrationApi, onRegistrationApi } from '../../Service/Api';
import FlashMessage, { showMessage, hideMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import icon from '../../../assets/image/img/icon.png'
import fontFamily from '../../../constants/fontFamily';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from '../../components/Pixel';
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const Register = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
    const [confirm_password, setConfirm_password] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
    const [loading, setLoading] = useState(false);

    const isLoginButtonDisabled = !(username && password && isChecked);

    const register = async () => {
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirm_password', confirm_password);
            formData.append('server_key', serverkey);


            const response = await onRegistrationApi(formData);
            console.log('Register SuccesFull', response.data);

            if (response.data.api_status === 220) {
                let raw = JSON.stringify({
                    email: email,
                    password: password,
                  });
                const response1 = await onIndicatorRegistrationApi(raw)
                console.log('Register SuccesFull', response1.data);
                if (response1.data) {
                const userData = {
                    username,
                    email,
                    password,
                };

                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                showMessage({
                    message: response.data.message,
                    type: 'success',
                    duration: 4000,
                });

                // Delay navigation to the login screen after 4 seconds
                setTimeout(() => {
                    setLoading(false)
                    navigation.navigate('Login');
                }, 4000);
            } else {
                setLoading(false)
                showMessage({
                    message: 'An error occurred. Please try again.',
                    type: 'danger',
                    duration: 6000,
                    icon: 'danger',
                });
            }
            } else {
                if (response.data.errors && response.data.errors.error_text) {
                    setLoading(false)
                    // Display the error_text message in ToastAndroid
                    // ToastAndroid.show(response.data.errors.error_text, ToastAndroid.SHORT);
                    showMessage({
                        message: response.data.errors ? response.data.errors.error_text : 'Unknown error occurred',
                        type: 'danger',
                        duration: 6000,
                        icon: 'danger',
                    });
                } else {
                    setLoading(false)
                    // ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT);
                    showMessage({
                        message: 'An error occurred. Please try again.',
                        type: 'danger',
                        duration: 6000,
                        icon: 'danger',
                    });
                }
            }
        } catch (error) {
            setLoading(false)
            console.log('error login', error.message);
        }
    };



    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.safeAreaStyle}>
            <View style={styles.container}>
                <View>
                    <Image style={styles.iconImage} source={icon} />
                    <Text style={{ color: COLORS.default, fontSize: hp(3), fontWeight: 'bold', marginBottom: 6 }}>
                        {'Sign up'}
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('username')}</Text>
                    <View style={styles.CustomInputView}>
                        <TextInput
                            keyboardType="default"
                            value={username}
                            onChangeText={text => setUserName(text)}
                            style={styles.CustomInput}
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('new_email')}</Text>
                    <View style={styles.CustomInputView}>
                        <TextInput
                            keyboardType="email-address"
                            value={email}
                            onChangeText={text => setEmail(text)}
                            style={styles.CustomInput}
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('password')}</Text>
                    <View style={styles.CustomInputView}>
                        <TextInput
                            secureTextEntry={isPasswordShown}
                            keyboardType="default"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            style={[styles.CustomInput, {width: '90%'}]}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Icon name="visibility" size={24} color={COLORS.darkgray1} />
                                ) : (
                                    <Icon name="visibility-off" size={24} color={COLORS.darkgray1} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('confirm_password')}</Text>
                    <View style={styles.CustomInputView}>
                        <TextInput
                            secureTextEntry={isPasswordShown}
                            keyboardType="default"
                            value={confirm_password}
                            onChangeText={text => setConfirm_password(text)}
                            style={[styles.CustomInput, {width: '90%'}]}
                        />
                        <TouchableOpacity
                            onPress={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                        >
                            { isConfirmPasswordShown == true ? (
                                    <Icon name="visibility" size={24} color={COLORS.darkgray1} />
                                ) : (
                                    <Icon name="visibility-off" size={24} color={COLORS.darkgray1} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.CheckBoxContainer}>
                    <CheckBox isChecked={isChecked} handleCheck={() => setIsChecked(!isChecked)} />
                    <Text style={styles.checkBoxtext}>
                        <Text style={styles.link}>{t('terms_of_use')}</Text>
                        {" & "}<Text style={styles.link}>{t('privacy')}</Text>
                    </Text>
                </View>
                <TouchableOpacity style={{ ...styles.button }} onPress={() => register()} disabled={loading} >
                    {loading ? (
                        <Loader isLoading={loading} color={COLORS.secondaryWhite} />
                    ) : (
                        <Text style={{ ...styles.buttonText, color: COLORS.white }}>{'Sign up'} </Text>
                    )}
                </TouchableOpacity>
                <View style={styles.RegisterLink}>
                    <Text style={styles.linkText}>{t('Already_have_anaccount')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkbutton} >
                        <Text style={styles.link}>{t('login')}</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <FlashMessage position='top' />
        </KeyboardAwareScrollView>
    );
};

export default Register;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        safeAreaStyle: {
          flex: 1,
          height: '100%',
          width: '100%',
        },
        container: {
          flex: 1,
          width: '100%',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.white,
        },
        imageContainer: {},
        image: {
          width: '100%',
          height: 160,
          // marginVertical: 10,
        },
        textOverlay: {
          position: 'absolute',
          bottom: 20, // Adjust the position from the bottom as needed
          left: 10,
          right: 0,
          alignItems: 'flex-start',
        },
        overlayImage: {
          position: 'absolute',
          bottom: 20, // Adjust the position from the bottom as needed
          left: 10,
          top: -20,
          alignSelf: 'flex-start',
          width: 170, // Adjust the image width as needed
          height: 100, // Adjust the image height as needed
        },
        overlayText: {
          color: COLORS.white,
          fontFamily: fontFamily.FONTS.Medium,  // Set your desired text color
          fontSize: hp(2.8), // Adjust the font size as needed
          flexWrap: 'wrap',
        },
        overlayText2: {
          paddingTop: 4,
          color: COLORS.gray, // Set your desired text color
          fontSize: hp(2.2), // Adjust the font size as needed
          fontWeight: 'bold', // Set the font weight if necessary
        },
        inputContainer: {
          marginTop: 10,
          width: '90%'
        },
        CustomInputView: {
          width: '100%',
          // paddingVertical: hp(0.5),
          backgroundColor: global.loginInput.backgroundColor,
          borderRadius: 8,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: wp(3),
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
        },
        CustomInput: {
          color: global.inputText.color,
          justifyContent: 'center',
          fontFamily: fontFamily.FONTS.Medium,
          fontSize: hp(2),
          width: '100%'
        },
        lable: {
          fontSize: hp(2.3),
          color: global.text.color,
          fontFamily: fontFamily.FONTS.Medium,
          marginVertical: 4,
        },
        CheckBoxContainer: {
          flexDirection: 'row',
        //   justifyContent: 'space-between',
          paddingTop: 20,
          width: '90%'
        },
        checkBoxtext: {
          color: COLORS.default,
          paddingLeft: 10,
          fontFamily: fontFamily.FONTS.Medium,
          fontSize: hp(2.2),
        },
        RegisterLink: {
          paddingTop: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 20,
        },
        linkText: {
          color: global.text.color,
          fontFamily: fontFamily.FONTS.Medium,
          fontSize: hp(2.2),
        },
        link: {
          color: COLORS.default,
          fontFamily: fontFamily.FONTS.Medium,
          fontSize: hp(2.2),
          marginLeft: wp(1),
        },
        button: {
          marginTop: hp(3),
          height: hp(7),
          backgroundColor: COLORS.default,
          borderRadius: hp(1.5),
          justifyContent: 'center',
          alignItems: 'center',
          width: '90%',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
        },
        buttonText: {
          fontSize: hp(2.5),
          fontFamily: fontFamily.FONTS.bold,
          color: COLORS.white,
        },
        iconImage: {
          width: wp(20),
          height: hp(5),
          resizeMode: 'contain',
        }
    });
};