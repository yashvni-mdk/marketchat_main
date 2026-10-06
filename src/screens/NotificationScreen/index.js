import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Image, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import styles from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import { COLORS } from '../../../constants';
import BasicHeader from '../../components/BasicHeader';
import { onNotificationDataApi, onNotificationDelete } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '../../components/Loader';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet'; // Import RBSheet
import {useTranslation} from 'react-i18next';

const NotificationScreen = ({ navigation }) => {
  const {t} = useTranslation();
  const [notification, setNotification] = useState([])
  const [loading, setLoading] = useState(false)
  const postActionMenuRef = useRef(null);

  const notificationData = [
    {
      id: 1,
      name: 'Yash Vaishnani',
      time: '6 minutes ago',
      msg: 'like your photo.'
    },
    {
      id: 2,
      name: 'Yash Vaishnani',
      time: '6 minutes ago',
      msg: 'like your story.'
    }
  ]

  useEffect(() => {
    const subscribe = navigation.addListener('focus', async () => {
        onGetNotification();
    });
  }, []);

  const onGetNotification = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('fetch', 'notifications');
        formData.append('server_key', serverkey);

        const response = await onNotificationDataApi(formData, token)
        if (response.data.api_status === 200) {
          setLoading(false);
          setNotification(response.data.notifications)
          console.log('this is the created events', response.data)
        } else if (response.data.api_status === 400 || 404) {
          setLoading(false);
          console.log('error for createing the event', response.data.errors.error_text)
        } else {
          setLoading(false);
        }
      }
      else {
        setLoading(false);
      }
    }
    catch (err) {
      setLoading(false);
      console.log("Get Error:", err)
    }
  }

  const onDeleteNotification = async (id) => {
    try {
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('type', 'delete');
        formData.append('id', id);
        formData.append('server_key', serverkey);

        const response = await onNotificationDelete(formData, token)
        if (response.data.api_status === 200) {
           onGetNotification()
          // setNotification(response.data.notifications)
          ToastAndroid.show(response.data.message_data, ToastAndroid.SHORT)
          console.log('this is the created events', id)
        } else if (response.data.api_status === 400 || 404) {
          console.log('error for createing the event', response.data.errors.error_text)
        }
      }
    }
    catch (err) {
      console.log("Get Error:", err)
    }
  }

  const renderItem = ({ item, index }) => {
    console.log("notifier data>>>>", item.notifier)
    return (
      <>
        <View style={styles.notificationView}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <View style={styles.subProfileView}>
              <Image style={styles.userImage} source={{ uri: item.notifier.avatar }} />
            </View>
            <View style={styles.profileDataView}>
              <View style={styles.nameView}>
               <Text style={styles.desText} numberOfLines={2}><Text style={styles.nameText}>{item.notifier.username}</Text>  {item.type_text}</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.timeText}>{item.time_text_string.replace(/\s+/g, '')}</Text>
                <TouchableOpacity style={{ paddingVertical: hp(0.5) }} onPress={() => postActionMenuRef.current.open()}>
                  <MaterialCommunityIcons name="dots-horizontal" size={hp(2.6)} color={COLORS.secondaryGray} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>


        <RBSheet
          ref={postActionMenuRef}
          closeOnDragDown={true}
          height={100}
          dragFromTopOnly={true}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: 'white',
            },
          }}
        >
          <TouchableOpacity onPress={() => onDeleteNotification(item.id)}>
            <View style={{ paddingBottom: hp(1), marginVertical: hp(2), marginHorizontal: wp(5), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
              <MaterialIcons name='delete-outline' size={hp(3.8)} color={COLORS.darkgray1} />
              <View style={{ padding: 5, paddingHorizontal: wp(2) }}>
                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.4), color: COLORS.darkgray1 }}>{t('delete_notification')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </RBSheet>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <BasicHeader onPress={() => navigation.goBack()} title={t('notification')} />
      </View>
      <View style={styles.secondView}>
        {loading ? (
          <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
            <Loader isLoading={loading} />
          </View>
        ) : (
          notification.length > 0 ?
            <FlatList
              data={notification}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            :
            <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center', height: hp(10), alignSelf: 'center' }}>
              <Text style={[styles.albumsText, { textAlign: 'center' }]}>{t('no_notification_found')}</Text>
            </View>
        )}


      </View>
    </View>
  )
}

export default NotificationScreen;
