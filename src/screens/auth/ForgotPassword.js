/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StatusBar, StyleSheet, Text, ScrollView, View, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
// import TextInput from '../../components/TextInput';
import { COLORS } from '../../../constants';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/Entypo';
import CustomInput from '../../components/CustomInput';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { ToastAndroid } from 'react-native'
import translations from '../../utils/localization/traslations';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import icon from '../../../assets/image/img/icon.png'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from '../../components/Pixel';
  import fontFamily from '../../../constants/fontFamily';
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const ForgotPassword = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });


    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handelForgotPassword = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    const isLoginButtonDisabled = !(email);

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.safeAreaStyle}>
            <View style={styles.container}>
                {/* <View style=> */}
                    <Image style={styles.iconImage} source={icon} />
                    <Text style={{ color: COLORS.default, fontSize: hp(3), fontWeight: 'bold', marginBottom: 6 }}>
                       Forgot Password
                    </Text>
                {/* </View> */}
                <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('email')}</Text>
                    <View style={styles.CustomInputView}>
                    <TextInput
                        keyboardType="email-address"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.CustomInput}
                    />
                    </View>
                </View>
                <TouchableOpacity style={{ ...styles.button }} onPress={() => handelForgotPassword()} >
                {loading ? (
                    <Loader isLoading={loading} color={COLORS.secondaryWhite} />
                ) : (
                    <Text style={{ ...styles.buttonText, color: COLORS.white }}>Recover</Text>
                )}
                </TouchableOpacity>
                <View style={styles.RegisterLink}>
                    <Text style={styles.linkText}>{t('Already_have_anaccount')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkbutton} >
                        <Text style={styles.link}>{t('login')}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </KeyboardAwareScrollView>
    );
};

export default ForgotPassword;

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
            fontFamily: fontFamily.FONTS.Medium,  // Set your desired text color
        },
        inputContainer: {
            marginTop: 10,
            width: '90%'
        },
        lable: {
            fontSize: hp(2.3),
            color: global.text.color,
            fontFamily: fontFamily.FONTS.Medium,
            marginVertical: 4,
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
        CheckBoxContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
            width: '90%'
        },
        checkBoxtext: {
            color: global.text.color,
            paddingLeft: 10,
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: hp(2),
        },
        RegisterLink: {
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 50,
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
        ForgotPassword: {
            color: COLORS.default,
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: hp(2),
        },
        footerText: {
            color: COLORS.secondaryGray,
            paddingHorizontal: 5,
        },
        button: {
            marginTop: hp(5),
            height: hp(7),
            backgroundColor: COLORS.default,
            borderRadius: 12,
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
          width: wp(15),
          height: hp(5),
          resizeMode: 'contain',
        }

    });
}