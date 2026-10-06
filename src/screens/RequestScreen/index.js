/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, TextInput, ToastAndroid, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontFamily from '../../../constants/fontFamily';
import { getGroupRequestes, onAcceptDeclineApi, onFollowUser, onJoinGroup, sendPushNotification } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import { onNotificationDataApi } from '../../Service/Api';
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const RequestScreen = () => {
  const {t} = useTranslation();
  const user_data = useSelector(state => state.user_data);
  const groups = useSelector(state => state.groups);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const global = globalStyles(theme);

  // Merge global styles with local component styles
  const styles = StyleSheet.create({
    ...global,
    ...localStyles(theme, WD, WH),
  });


  const [friendRequests, setFriendRequests] = useState([])
  const [groupRequestes, setGroupRequestes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      onGetNotification()
      // GroupRequestes('get_requests')
    })
  }, [])

  const onGetNotification = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('fetch', 'friend_requests');
        formData.append('server_key', serverkey);

        const response = await onNotificationDataApi(formData, token)
        if (response.data.api_status === 200) {
          setLoading(false)
          setFriendRequests(response.data.friend_requests)
          console.log('this is the notification', response.data, token)
        } else if (response.data.api_status === 400 || 404) {
          setLoading(false)
          console.log('error for notification', response.data, errors.error_text)
        }
      }
    }
    catch (err) {
      setLoading(false)
      console.log("Get Error:", err)
    }
  }

  const GroupRequestes = async (type, item) => {
    try {
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('request', type);
        formData.append('user_id', user_data.user_id)
       formData.append('recipient_id', item.user_id)
        formData.append('server_key', serverkey);

        const response = await onAcceptDeclineApi(formData, token)
        if (response.data.api_status == 200) {
          const res = item.fcm_token.replace(/ /g, '')
          console.log("get Item Token ::::", res)
          if(type == 'accept') {
            sendPushNotification(
              res,
              `${user_data.username}`,
              `accept your request.`,
          );
          } else {
            sendPushNotification(
              res,
              `${user_data.username}`,
              `declined your request.`,
          );
          }
          console.log('this is the group request', response.data)
          onGetNotification()
          
        } else if (response.data.api_status == 400 || 404) {
          console.log('error for group request', response.data)
        }
      } else {
        console.log('user token not found', error.message)
      }
    }
    catch (err) {
      console.log("Get Error:", err)
    }
  }


  const renderItem = ({ item, index }) => {
    console.log("notifier data>>>>", item)
    return (
      <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.user_id })} style={styles.notificationView}>
        
        <View style={styles.profileDataView}>
          <Image style={styles.userImage} source={{ uri: item.avatar }} />
            <Text style={styles.desText}>{item.username}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => GroupRequestes('decline', item)}>
                      <AntDesign name="closecircleo" size={hp(3.5)} color={COLORS.darkgray1} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => GroupRequestes('accept', item)} style={{ marginLeft: wp(3) }}>
                      <AntDesign name="checkcircleo" size={hp(3.5)} color={COLORS.lightBlue} />
                    </TouchableOpacity>
                  </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f2f5' }}>
      <View style={styles.headerView}>
        <BasicHeader onPress={() => navigation.goBack()} title={t('request')} />
      </View>
      <View style={{
        flex: 0.92,
        width: '100%',
        backgroundColor: COLORS.white,
      }}>
        {loading ? (
          <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
            <Loader isLoading={loading} />
          </View>
        ) : (
          friendRequests.length > 0 || groupRequestes.length > 0 ? (
            // Render FlatList for friend requests if available
            <FlatList
              data={friendRequests ?? []}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center', height: hp(10), alignSelf: 'center' }}>
              <Text style={[styles.albumsText, { textAlign: 'center' }]}>{t('no_request_found')}</Text>
            </View>
          ))}

        {/** {groupRequestes.length > 0 && (
          // Render FlatList for group requests if available
          <FlatList
            data={groupRequestes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.notificationView}>
                <View style={styles.subProfileView}>
                  <Image style={styles.userImage} source={{ uri: item.avatar }} />
                </View>
                <View style={styles.profileDataView}>
                  <View style={styles.nameView}>

                    <Text style={styles.desText}> <Text style={styles.nameText}>{item.notifier.first_name} {item.notifier.last_name}</Text> {item.type_text}</Text>
                  </View>
                  <Text style={styles.timeText}>{item.time_text_string}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => GroupRequestes('delete_request')}>
                      <AntDesign name="closecircleo" size={hp(2.2)} color={COLORS.darkgray1} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => GroupRequestes('accept_request')} style={{ marginHorizontal: wp(1) }}>
                      <AntDesign name="checkcircleo" size={hp(2.2)} color={COLORS.lightBlue} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        )}  */}
      </View>
    </SafeAreaView>
  );
};

export default RequestScreen;

const localStyles = (theme, WD, WH) => {
  const global = globalStyles(theme);

  return StyleSheet.create({
    headerView: {
      flex: 0.08,
      width: '100%',
      justifyContent: 'center',
    },
    FollowingContainer: {
      marginTop: 25,
      backgroundColor: global.ContentContainer.backgroundColor,
      marginHorizontal: 10,
      borderRadius: 10
    },
    CustomInput: {
      width: '90%',
      height: 40,
      paddingHorizontal: 4,
      backgroundColor: '#ededed',
      color: global.inputText.color,
      borderColor: '#eeeff0',
      borderWidth: 0.5,
      borderRadius: 8,
      justifyContent: 'center',
    },
    FollowingContent: {
      padding: 10,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    FollowingHading: {
      padding: 5,
      marginHorizontal: 5,
      fontSize: 18,
      color: global.text2.color
    },
    FollowersName: {
      padding: 5,
      fontSize: 16,
      fontFamily: fontFamily.FONTS.regular,
      color: global.text2.color
    },
    iconStyle: {
      backgroundColor: COLORS.red,
      borderRadius: 50,
      padding: 4
    },
    FollowinghorizontalLine: {
      borderBottomColor: COLORS.gray,
      borderBottomWidth: 0.5,
      // padding: 5,
      // marginHorizontal: 15,
    },
    albumsText: {
      marginHorizontal: 10,
      fontSize: hp(2.5),
      fontFamily: fontFamily.FONTS.Medium,
      color: COLORS.darkgray1
    },
    userImage:{
      width: wp(10),
      height: wp(10),
      borderRadius: wp(10)
    },
    notificationView: {
      width: '100%',
      height: hp(8),
      backgroundColor: COLORS.white,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(3),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray,
      justifyContent: 'space-between',
    },
    desText: {
      fontSize: hp(2.2),
      fontFamily: fontFamily.FONTS.Medium,
      color: COLORS.black,
      marginLeft: wp(3)
    },
    profileDataView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });
};
