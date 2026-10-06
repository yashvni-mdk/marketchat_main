/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import { Image, Platform, StyleSheet, Text, View, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../../constants';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../utils/localization/Storage';
import { getUserDataApi, onFetchGroups, onGetPostApi, onGetUserDataApi, onSearchApi } from '../../Service/Api';
import { fetchUserDataSuccess, fetchUserGroups, fetchUserList, fetchUserPost } from '../../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '../../components/Loader';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import LottieView from 'lottie-react-native';
import stock from '../../../assets/image/stock.png';
import messaging from '@react-native-firebase/messaging';
import {useTranslation} from 'react-i18next';

const SplashScreen = ({ navigation }) => {
    const {i18n} = useTranslation();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    // const styles = StyleSheet.create({
    //     ...global,
    //     ...localStyles(theme)
    // });

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        requestUserPermission();
      }, []);
    
      const requestUserPermission = async () => {
        if (Platform.OS === 'ios') {
          //Request iOS permission
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
          if (enabled) {
            console.log('Authorization status:', authStatus);
          }
        } else if (Platform.OS === 'android') {
          //Request Android permission (For API level 33+, for 32 or below is not required)
          const res = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }
      };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await onGetAllData();
            // await onGetPostData();
            await fetchUserData();
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const onGetAllData = async () => {
        try {
            const language = await AsyncStorage.getItem('language');
            if (language != null) {
              i18n.changeLanguage(language);
            } else {
              AsyncStorage.setItem('language', 'en');
            }
            const token = await AsyncStorage.getItem('access_token');
            console.log('get Token >>>>>>>>>>>>>', token);
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                const response = await onGetUserDataApi();
                console.log('get Response:>:>', response);
                // const response = await onSearchApi(formData, token);
                if (response.data) {
                    // dispatch(fetchUserGroups(response.data))
                    dispatch(fetchUserList(response.data))
                }
                // if (response.data.api_status === 200) {
                //     dispatch(fetchUserGroups(response.data))
                //     dispatch(fetchUserList(response.data.users))
                // } else if (response.data.api_status === 400 || 404) {

                // }
            }
        }
        catch (err) {
            console.log("Get Error::", err)
        }
    }


    const fetchUserData = async () => {
        try {
           const user = await getUserData();
            if (user) {
                onCheckAuth(user)
            } else {
                navigation.replace('Login');
            }
        } catch (error) {
            console.log('Error fetching user data:', error.message);
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
                console.log("Get Response DAtaLLL", response.data)
                if (response.data.api_status === 200) {
                    // await onGetAllData()
                    dispatch(fetchUserDataSuccess(response.data.user_data, response.data.followers, response.data.following, response.data.liked_pages, response.data.joined_groups))
                    navigation.replace('TabStack');
                } else if (response.data.api_status === 400 || 404) {
                    console.log('Error fetching profile data', response.data);
                    navigation.replace('Login');
                }
            }
            else {
                setTimeout(() => {
                    navigation.replace('Login');
                }, 2000);
            }
        }
        catch (err) {
            console.log("Get Error::", err)
        }
    }

    return (
        <View style={styles.container}>
            <Image
            style ={{width: "50%", height:"45%", resizeMode: 'contain'}} 
            source={stock} 
          />
        </View>
    )
}

export default SplashScreen;

// const localStyles = (theme) => {
//     const global = globalStyles(theme);

const styles = StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: '#000',
            fontSize: 36,
            fontFamily: fontFamily.FONTS.bold
        }
    })


            {/*  <LottieView
                source={require('../../../assets/image/img/SplashAnimation/Animation - 1706440302011.json')} // Replace with the path to your Lottie animation file
                autoPlay
                loop={false} // Set to true if you want the animation to loop
            />  */}
            
           