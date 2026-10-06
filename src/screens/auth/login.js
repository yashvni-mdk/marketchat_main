/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StatusBar, StyleSheet, Text, ScrollView, ToastAndroid, View, TouchableOpacity, Image, Modal, Alert, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { WD, WH, } from '../../components/Dimensions';
// import TextInput from '../../components/TextInput';
import { COLORS } from '../../../constants';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import translations from '../../utils/localization/traslations';
import CheckBox from '../../components/CheckBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { useDispatch } from 'react-redux';
import { fetchUserPost, loginFailure, loginUser } from '../../redux/reducer';
import { onLoginApi } from '../../Service/Api';
import { getUserData } from '../../utils/localization/Storage';
import { getUserDataApi, onGetPostApi } from '../../Service/Api';
import { onSearchApi } from '../../Service/Api';
import { fetchUserGroups, fetchUserDataSuccess, } from '../../redux/reducer';
import FlashMessage, { showMessage, hideMessage } from 'react-native-flash-message';
import fontFamily from '../../../constants/fontFamily';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel';
import messaging from '@react-native-firebase/messaging';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import icon from '../../../assets/image/img/icon.png'
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const Login = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const global = globalStyles(theme);

  // Merge global styles with local component styles
  const styles = StyleSheet.create({
    ...global,
    ...localStyles(theme, WD, WH)
  });

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
  const [loading, setLoading] = useState(false);
  const [shouldNavigateToTabStack, setShouldNavigateToTabStack] = useState(false);

  useEffect(() => {
    // Use useEffect to navigate after data is fetched
    if (shouldNavigateToTabStack) {
      navigation.navigate('TabStack');
    }
  }, [shouldNavigateToTabStack]);

  const onGetAllData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('server_key', serverkey)

        const response = await onSearchApi(formData, token);

        if (response.data.api_status === 200) {
          // console.log('the groups data', response.data.pages)
          dispatch(fetchUserGroups(response.data))
        } else if (response.data.api_status === 400 || 404) {

        }
      }
    }
    catch (err) {
      console.log("Get Error::", err)
    }
  }

  const onGetPostData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('server_key', serverkey);
        formData.append('search_key', '');
        formData.append('group_offset', '1');

        const response = await onSearchApi(formData, token);

        if (response.data.api_status === 200) {
          const userPostsPromises = response.data.users.map(async (item) => {
            const formdata = new FormData();
            formdata.append('id', item.user_id);
            formdata.append('server_key', serverkey);
            formdata.append('type', 'get_user_posts');
            const response1 = await onGetPostApi(formdata, token);
            if (response1.data.api_status === 200) {
              // console.log('this is the post data', response.data)
              return response1.data.data;
            }
            return [];
          });

          const userPostsArrays = await Promise.all(userPostsPromises);
          const arrayList = userPostsArrays.reduce((accumulator, currentArray) => {
            accumulator.push(...currentArray);
            return accumulator;
          }, []);


          setTimeout(() => {
            dispatch(fetchUserPost(arrayList));
          }, 800);
        } else if (response.data.api_status === 400 || response.data.api_status === 404) {
          console.log('Error fetching events', response.data.errors.error_text);
        }
      }
    } catch (err) {
      console.log('Get Error:', err);
    }
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
        console.log("Get Response DAtaLLL", response.data.user_data)
        if (response.data.api_status === 200) {
          dispatch(fetchUserDataSuccess(response.data.user_data, response.data.followers, response.data.following, response.data.liked_pages, response.data.joined_groups))
          navigation.navigate('TabStack');
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

  // const checkToken = async () => {
  //   const fcmToken = await messaging().getToken();
  //   if (fcmToken) {
  //     console.log(fcmToken);
  //     return fcmToken;
  //   }
  //   return null
  // }

  // checkToken();

  const login = async () => {
    try {
      setLoading(true);
      // Call checkToken to get the FCM token
      const fcmToken = await messaging().getToken();
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('server_key', serverkey);
      formData.append('fcm_token', fcmToken);

      // if (fcmToken) {
        console.log('fcm_token', formData)
      // }

      const response = await onLoginApi(formData);
      // console.log('login SuccesFull', response.data);
      if (response.data.api_status === 200) {

        // console.log('response by login',response.data)

        const userData = {
          user_id: response.data.user_id,
          username,
          password,
        };

        const access_token = response.data.access_token;
        AsyncStorage.setItem('access_token', access_token);
        AsyncStorage.setItem('userData', JSON.stringify(userData));
        // console.log('access_token', access_token)
        // console.log('Stored userData:', JSON.parse(await AsyncStorage.getItem('userData')));
        const user = await getUserData()
        // ToastAndroid.show('Welcome back', ToastAndroid.SHORT)
        showMessage({
          message: 'welcome back !',
          type: 'success',
          duration: 3000,
        });

        // Use Promise.all to wait for all asynchronous calls
        await Promise.all([
          onCheckAuth(user),
          onGetAllData(),
          // onGetPostData(),
        ]);

        dispatch(loginUser(userData, access_token))
        // Set a flag to indicate that navigation should occur
        setShouldNavigateToTabStack(true);

      }
      else {
        if (response.data.errors && response.data.errors.error_text) {
          // Display the error_text message in ToastAndroid
          // ToastAndroid.show(response.data.errors.error_text, ToastAndroid.SHORT);
          showMessage({
            message: response.data.errors ? response.data.errors.error_text : 'Unknown error occurred',
            type: 'danger',
            duration: 6000,
            icon: 'danger',
          });
        } else {
          // ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT);
          showMessage({
            message: 'An error occurred. Please try again.',
            type: 'danger',
            duration: 6000,
            icon: 'danger',
          });
        }
        // dispatch(loginFailure('Login failed'), response.data.errors.error_text)
      }
    } catch (error) {
      console.log('error login', error.message);
      dispatch(loginFailure('Login failed'))
    } finally {
      setLoading(false)
    }
  };


  return (
      <KeyboardAwareScrollView contentContainerStyle={styles.safeAreaStyle}>
          <View style={styles.container}>
            <View>
              <Image style={styles.iconImage} source={icon} />
              <Text style={{ color: COLORS.default, fontSize: hp(3), fontWeight: 'bold', marginBottom: 6 }}>
                {t('login')}
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
                  // onSubmitEditing={login}
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
                  // onSubmitEditing={login}
                />

                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                >
                  {
                    isPasswordShown ? (
                      <Icon name="visibility" size={24} color={COLORS.darkgray1} />
                    ) : (
                      <Icon name="visibility-off" size={24} color={COLORS.darkgray1} />
                    )
                  }

                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.CheckBoxContainer}>
              <View style={{ flexDirection: 'row' }}>
                <CheckBox isChecked={isChecked} handleCheck={() => setIsChecked(!isChecked)} />
                <Text style={styles.checkBoxtext}>{t('remember_me')}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.ForgotPassword}>{t('forget_password')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ ...styles.button }} onPress={() => login()} disabled={loading} >
              {loading ? (
                  <Loader isLoading={loading} color={COLORS.secondaryWhite} />
              ) : (
                  <Text style={{ ...styles.buttonText, color: COLORS.white }}>{t('login')} </Text>
              )}
            </TouchableOpacity>
            <View style={styles.RegisterLink}>
              <Text style={styles.linkText}>{t('dont_have_an_account')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkbutton} >
                <Text style={styles.link}>{t('register')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlashMessage position='top' />
      </KeyboardAwareScrollView>
  );
};

export default Login;
const localStyles = (theme, WD, WH) => {
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
      height: WH * 0.2,
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
      width: WD * 0.4, // Adjust the image width as needed
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
      fontSize: hp(2.2),
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
      fontSize: hp(2.2),
    },
    footerText: {
      color: COLORS.secondaryGray,
      paddingHorizontal: 5,
    },
    button: {
      marginTop: hp(3),
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