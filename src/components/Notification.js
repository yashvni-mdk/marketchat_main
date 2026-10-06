import { View, Text, Platform, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';

import messaging from '@react-native-firebase/messaging';

import { useDispatch, useSelector } from 'react-redux';

// import isEmpty from 'lodash/isEmpty';
import { navigate } from './routeNotification';
import { HEIGHT, WIDTH } from './dimension';
import fontFamily from '../../constants/fontFamily';

const inputValue = Platform.OS == 'android' ? -HEIGHT * 0.15 : -HEIGHT * 0.2;
const outputValue =
  Platform.OS == 'android' ? WIDTH * 0.025 : WIDTH * 0.025 + HEIGHT * 0.05;

const Notification = () => {
  const [notificationData, setNotificationData] = useState({});
  const [type, setType] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(async data => {
        if (data?.data?.notifiable_type === 'dm') {
          // if (res) {
          navigate('ChatScreen', { fromNotification: true });
          // }
        }
      });
    messaging().onMessage(msg => {
      setType(msg?.data?.notifiable_type);
      setNotificationData(msg.notification);
    });
    messaging().onNotificationOpenedApp(dm => {
      if (dm?.data?.notifiable_type === 'dm') {
        navigate('ChatScreen');
      } else {
        console.log("===coming here===");
        navigate('TabScreens');
      }
    });
  }, []);

//   const timeOut = setTimeout(() => {
//     if (!isEmpty(notificationData)) {
//       startAnimation(outputValue, inputValue);
//       setTimeout(() => {
//         !isEmpty(notificationData) && setNotificationData({});
//       }, 200);
//     }
//   }, 3500);



  return (
        <View
        style={[
          {
            backgroundColor: '#FFF',
            margin: WIDTH * 0.025,
            borderRadius: WIDTH * 0.025,
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
          }
        ]}>
      
            <Pressable
              onPress={() => {
               
              }}
              style={{ padding: WIDTH * 0.025 }}>
              <Text
                style={[
                  { color: '#000', fontSize: 16,fontFamily:fontFamily.FONTS.Medium ,textAlign:'left'},
                ]}>
                {notificationData.title}
              </Text>
              <Text
                numberOfLines={3}
                style={[{
                    fontFamily:fontFamily.FONTS.regular,
                    color: '#000030',
                    fontSize: 14,
                    marginTop: WIDTH * 0.015,
                    lineHeight: 15,
                    textAlign:'left'
                  }
                ]}>
                {notificationData.body}
              </Text>
            </Pressable>
      </View>
  );
};

export default Notification;
