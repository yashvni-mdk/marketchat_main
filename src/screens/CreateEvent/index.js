import { SafeAreaView, ScrollView, StyleSheet, ToastAndroid, Text, TouchableOpacity, View, Modal, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Footer from '../../components/Footer';
import translations from '../../utils/localization/traslations';
import ImagePicker from 'react-native-image-crop-picker';
import CommonHeader from '../../components/CommonHeader';
import plus from '../../../assets/icons/png/add-1.png';
import users from '../../../assets/image/img/createPage/users.png';
import gallery from '../../../assets/image/img/createPage/gallery.png';
import flag from '../../../assets/image/img/createPage/flag.png';
import dollar from '../../../assets/image/img/createPage/dollar.png';
import calendar from '../../../assets/image/img/createPage/calendar.png';
import add from '../../../assets/image/img/createPage/add.png';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import { useSelector } from 'react-redux';
import welcome from '../../../assets/image/img/backgrounds/welcome.jpg';
import sent from '../../../assets/image/img/createPage/sent.png';
import background from '../../../assets/image/img/backgrounds/background.jpg';
import love from '../../../assets/image/img/createPage/love.png';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch } from 'react-redux';
import { fetchAllEvents } from '../../redux/reducer';
import { onCreateEventApi, onEventUserApi } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getUserData } from '../../utils/localization/Storage';
import CommonDetails from '../../components/CommonDetails';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const CreateEvent = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const global = globalStyles(theme);
  const userData = useSelector(state => state.user_data);

  // Merge global styles with local component styles
  const styles = StyleSheet.create({
    ...global,
    ...localStyles(theme),
  });

  const [modelVisible, setModelVisible] = useState(false);
  const [fromVisible, setFromVisible] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [eventStart, setEventStart] = useState({ date: new Date().toISOString().split('T')[0], time: '--:--' });
  const [eventEnd, setEventEnd] = useState({ date: new Date().toISOString().split('T')[0], time: '--:--' });
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState([]);
  const [eventImage, setEventImage] = useState(null)
  const [eventImageType, setEventImageType] = useState(null)
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false)

  const navigationOptions = [
    { text: 'Create Albums', image: gallery, navigateTo: 'CreateAlbum' },
    { text: 'Create Ad', image: dollar, navigateTo: 'CreateAd' },
    { text: 'Create Blog', image: calendar, navigateTo: 'CreateBlog' },
    { text: 'Create Event', image: add, navigateTo: 'CreateEvent' },
    { text: 'Create Group', image: users, navigateTo: 'CreateGroup' },
    { text: 'Create Page', image: flag, navigateTo: 'CreatePage' },
  ];

  const usersOptions = [
    { text: 'Yash vaishnani', image: welcome },
    { text: 'Dipak Pakhake', image: background },
    { text: 'Mohil Thummar', image: background },
    { text: 'Dipak Pakhake', image: welcome },
  ];

  const groupOptions = [
    { text: 'first Group', member: 1, image: welcome }
  ];

  const toggleStartDatePicker = () => {
    setStartDatePickerVisibility((prevState) => !prevState);
  };

  const toggleStartTimePicker = () => {
    setStartTimePickerVisibility((prevState) => !prevState);
  };

  const toggleEndDatePicker = () => {
    setEndDatePickerVisibility((prevState) => !prevState);
  };

  const toggleEndTimePicker = () => {
    setEndTimePickerVisibility((prevState) => !prevState);
  };

  const handleStartDateConfirm = (date) => {
    setEventStart((prevState) => ({
      ...prevState,
      date: formatDate(date),
    }));
    toggleStartDatePicker(); // Hide the start date picker after confirming the date
  };

  const handleStartTimeConfirm = (time) => {
    setEventStart((prevState) => ({
      ...prevState,
      time: formatTime(time),
    }));
    toggleStartTimePicker(); // Hide the start time picker after confirming the time
  };

  const handleEndDateConfirm = (date) => {
    setEventEnd((prevState) => ({
      ...prevState,
      date: formatDate(date),
    }));
    toggleEndDatePicker(); // Hide the end date picker after confirming the date
  };

  const handleEndTimeConfirm = (time) => {
    setEventEnd((prevState) => ({
      ...prevState,
      time: formatTime(time),
    }));
    toggleEndTimePicker(); // Hide the end time picker after confirming the time
  };
  // Helper function to format date and time
  const formatDate = (date) => {
    // Format your date here (e.g., using date-fns or native methods)
    return date.toISOString().split('T')[0]; // Example: returns 'YYYY-MM-DD'
  };

  const formatTime = (time) => {
    // Format your time here (e.g., using date-fns or native methods)
    return time.toTimeString().split(' ')[0]; // Example: returns 'HH:MM:SS'
  };


  const toggelModel = () => {
    setModelVisible(prevVisible => !prevVisible);
  };

  const toggelFrom = () => {
    setFromVisible(!fromVisible)
  }


  const renderModelItems = () => {
    return navigationOptions.map((option, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setModelVisible(false)
          option.navigateTo && navigation.navigate(option.navigateTo)
        }}
        style={styles.OptionView}>
        <Image
          style={{ width: wp(7), height: hp(5), resizeMode: 'contain' }}
          source={option.image}
        />
        <Text style={styles.modelText}>{option.text}</Text>
      </TouchableOpacity>
    ));
  };

  // Function to open image picker for selecting from gallery
  const openImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        multiple: true, // Allow selecting only one image
      });

      if (image && image.length > 0) {
        image.map(image => {
          selectedImage.push(image.path);
          var filename = image.path.substring(
            image.path.lastIndexOf("/") + 1
          );
          let imageData = {
            uri: image.path,
            type: image.mime,
            name: filename,
          };
          setEventImage(imageData);
          setEventImageType(image.mime)
        });
        // Set the selected image path to state
        console.log("GEt REsponsE::", image)
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const createEvent = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('event_name', eventName);
        formData.append('event_location', location);
        formData.append('event_description', description);
        formData.append('event_start_date', eventStart.date);
        formData.append('event_end_date', eventEnd.date);
        formData.append('event_start_time', eventStart.time);
        formData.append('event_end_time', eventEnd.time);
        formData.append('event_cover', eventImage);
        formData.append('server_key', serverkey);
        console.log('event end date', eventEnd.date, eventStart.date, eventStart.time, eventEnd.time);
        const response = await onCreateEventApi(formData, token)

        if (response.data.api_status === 200) {
          setMyEvents(response.data)
          console.log('this is the created events', response.data)
          setLoading(false)
          setFromVisible(false)
          navigation.goBack();
          ToastAndroid.show('Event created', ToastAndroid.SHORT)
        } else if (response.data.api_status === 400 || 404) {
          setLoading(false)
          console.log('error for createing the event', response.data.errors.error_text)
          ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
        }
      } else {
        setLoading(false)
        console.log('Somthing went wrong', error.message)
      }
    } catch (err) {
      setLoading(false)
      console.log("Get Error::", err)
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
      <View style={styles.headerView}>
        <BasicHeader onPress={() => navigation.goBack()} title={t('create_new_event')} />
      </View>
      <View style={styles.secondView}>
        <ScrollView contentContainerStyle={{ paddingBottom: hp(5) }}>
          <View>
            {/*     <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 25, backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10 }}>
            <MaterialIcons name="event" size={20} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 20, padding: 4 }} />
            <Text style={{ marginHorizontal: 10, fontSize: 18, color: global.text2.color, }}>Create new event</Text>
        </View> */}

            <View style={styles.container}>
              <View style={styles.ContentContainer}>
                <View style={styles.content}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('Event_name')}</Text>
                    <CustomInput
                      keyboardType="default"
                      value={eventName}
                      onChangeText={text => setEventName(text)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('location')}</Text>
                    <CustomInput
                      keyboardType="default"
                      value={location}
                      onChangeText={text => setLocation(text)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('When_this_events_will_start')}</Text>
                    <TouchableOpacity onPress={toggleStartDatePicker} style={styles.timepickerContainer}>
                      <Text style={styles.selctedDate}>{eventStart.date}</Text>
                      <MaterialIcons name='date-range' size={20} color={COLORS.secondaryGray} />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isStartDatePickerVisible}
                      mode="date"
                      onConfirm={handleStartDateConfirm}
                      onCancel={toggleStartDatePicker}
                    />
                    <View >
                      <TouchableOpacity onPress={toggleStartTimePicker} style={styles.timepickerContainer}>
                        <Text style={styles.selctedDate}>{eventStart.time}</Text>
                        <MaterialIcons name='watch-later' size={20} color={COLORS.secondaryGray} />
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isStartTimePickerVisible}
                        mode="time"
                        onConfirm={handleStartTimeConfirm}
                        onCancel={toggleStartTimePicker}
                      />
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('When_this_events_will_end')}</Text>
                    <TouchableOpacity onPress={toggleEndDatePicker} style={styles.timepickerContainer}>
                      <Text style={styles.selctedDate}>{eventEnd.date}</Text>
                      <MaterialIcons name='date-range' size={20} color={COLORS.secondaryGray} />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isEndDatePickerVisible}
                      mode="date"
                      onConfirm={handleEndDateConfirm}
                      onCancel={toggleEndDatePicker}
                    />
                    <View >
                      <TouchableOpacity onPress={toggleEndTimePicker} style={styles.timepickerContainer}>
                        <Text style={styles.selctedDate}>{eventEnd.time}</Text>
                        <MaterialIcons name='watch-later' size={20} color={COLORS.secondaryGray} />
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isEndTimePickerVisible}
                        mode="time"
                        onConfirm={handleEndTimeConfirm}
                        onCancel={toggleEndTimePicker}
                      />
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('description')}</Text>
                    <TextInput
                      keyboardType="default"
                      multiline={true}
                      numberOfLines={6}
                      value={description}
                      onChangeText={text => setDescription(text)}
                      style={styles.descriptionInput}
                      textAlignVertical="top"
                    />
                  </View>
                  {/* Image selection */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.lable}>{t('Image')}</Text>
                    <TouchableOpacity onPress={openImagePicker} style={styles.imagePicker}>
                      {eventImage != null ? (
                          <Image
                              source={{ uri: eventImage?.uri }}
                              style={{ width: wp(90), height: hp(35), borderRadius: 10 }}
                          />
                      ) : (
                        <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                          <MaterialCommunityIcons name='image' size={24} color={COLORS.white} />
                          <Text style={{ color: COLORS.white, padding: 6, fontFamily: fontFamily.FONTS.Medium }}>Choose Image</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>


                  <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AntDesign name="arrowleft" size={17} color={'#737373'} />
                        <Text style={{ padding: 5, fontSize: 16, color: '#737373' }}>{t('go_back')}</Text>
                      </View>
                    </TouchableOpacity>
                    <View>
                      <TouchableOpacity style={{
                        height: hp(4.8),
                        width: wp(38),
                        backgroundColor: COLORS.red,
                        // borderColor: COLORS.black,
                        // borderWidth: 2,
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }} onPress={createEvent}>
                        {loading ? (
                          <Loader isLoading={loading} color='white' />
                        ) : (
                          <View>
                            <Text style={{ paddingHorizontal: wp(10), fontSize: 17, color: COLORS.white }}>{t('publish')}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* Right side menu Model */}
          <Modal visible={modelVisible} transparent animationType="none">
            <TouchableOpacity onPress={toggelModel}>
              <View style={styles.conteredView}>
                <View style={styles.modelView}>{renderModelItems()}</View>
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateEvent;

const localStyles = (theme) => {
  const global = globalStyles(theme);

  return StyleSheet.create({
    container: {
      backgroundColor: global.container.backgroundColor,
      marginTop: 20,
    },
    headerView: {
      flex: 0.08,
      width: '100%',
      justifyContent: 'center',
    },
    secondView: {
      flex: 0.92,
      width: '100%',
    },
    BlogTextOverlay: {
      position: 'absolute',
      bottom: 60, // Adjust the position from the bottom as needed
      left: 20,
      top: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    overlayBlog: {
      position: 'absolute',
      top: 10,
      right: 10,
      alignItems: 'center',
      backgroundColor: COLORS.darkgray,
      borderRadius: 50
    },
    customInput: {
      width: '100%',
      height: 40,
      paddingHorizontal: 4,
      // backgroundColor: global.textInput.backgroundColor,
      color: global.inputText.color,
      borderColor: '#eeeff0',
      borderWidth: 0.5,
      borderRadius: 8,
      justifyContent: 'center',
      // alignItems: 'center'
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
    imagePicker: {
      width: '100%',
      height: hp(35),
      // marginHorizontal: 15,
      backgroundColor: '#eaeaea',
      color: global.inputText.color,
      // borderColor: COLORS.secondaryBlack,
      borderRadius: 8,
      justifyContent: 'space-between'
    },
    inputText: {
      color: global.inputText.color,
      justifyContent: 'center',
      alignItems: 'center'
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
    overlayBlogText: {
      padding: 5,
      paddingHorizontal: 10,
      color: COLORS.gray, // Set your desired text color
      fontSize: 16, // Adjust the font size as needed
      fontWeight: 'bold', // Set the font weight if necessary
      flexWrap: 'wrap',
    },
    overlayText: {
      color: COLORS.white,
      fontSize: 28,
      fontWeight: 'bold',
      flexWrap: 'wrap',
    },
    overlayText2: {
      paddingTop: 7,
      paddingHorizontal: 8,
      color: COLORS.black, // Set your desired text color
      fontSize: 18, // Adjust the font size as needed
      fontFamily: fontFamily.FONTS.regular
    },
    BlogTitle: {
      color: COLORS.white,
      fontSize: 17,
      fontWeight: 'bold',
      flexWrap: 'wrap',
    },
    ContentContainer: {
      // margin: 10,
      borderRadius: 10,
      padding: 20,
      backgroundColor: global.ContentContainer.backgroundColor,
    },
    inputContainer: {
      marginTop: 10,
    },
    lable: {
      fontSize: 16,
      color: global.text2.color,
      fontWeight: '600',
      marginVertical: 4,
    },
    selctedDate: {
      fontSize: 16,
      paddingHorizontal: 10,
      color: global.text2.color,
      fontWeight: '600',
    },
    horizontalTabMenu: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginTop: 25,
      backgroundColor: global.ContentContainer.backgroundColor,
      marginHorizontal: 10,
      borderRadius: 10,
      justifyContent: 'space-between'
    },
    horizontalText: {
      paddingHorizontal: 10,
      fontSize: 16,
      color: '#766b66'
    },
    CheckBoxContainer: {
      flexDirection: 'row',
      paddingTop: 10,
    },
    checkBoxtext: {
      color: global.text.color,
      fontSize: 15,
    },
    horizontalLine: {
      borderBottomColor: COLORS.secondaryGray,
      borderBottomWidth: 1,
      padding: 5,
      marginHorizontal: 15,
    },
  });
};