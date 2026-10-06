/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Image, FlatList, TextInput, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Footer from '../../components/Footer';
import ImagePicker from 'react-native-image-crop-picker';
import translations from '../../utils/localization/traslations';
import { getUserData } from '../../utils/localization/Storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { onCreateEventApi, onEventUserApi, onDeleteEventApi } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { fetchAllEvents } from '../../redux/reducer';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const EditEvent = ({ route }) => {
    const {t} = useTranslation();
    const { eventData } = route.params;
    console.log('this is the event data for edit', eventData)
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [fromVisible, setFromVisible] = useState(false);
    const [myEvents, setMyEvents] = useState([]);
    const [eventName, setEventName] = useState(eventData?.name);
    const [location, setLocation] = useState(eventData?.location);
    const [eventStart, setEventStart] = useState({
        date: eventData?.start_date || new Date().toISOString().split('T')[0],
        time: eventData?.start_time || '--:--',
    });

    const [eventEnd, setEventEnd] = useState({
        date: eventData?.end_date || new Date().toISOString().split('T')[0],
        time: eventData?.end_time || '--:--',
    });

    const [description, setDescription] = useState(eventData?.description);
    const [selectedImage, setSelectedImage] = useState(eventData?.cover ? [eventData.cover] : []);

    console.log('selected image ', selectedImage)
    const [eventImage, setEventImage] = useState(eventData?.cover ? [eventData.cover] : [])
    const [eventImageType, setEventImageType] = useState(eventData?.cover ? 'image/jpeg' : null)
    const [selectedTab, setSelectedTab] = useState('Browse Events');
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false)

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
    // Helper function to format date to 'dd-mm-yyyy' format
    const formatDate = (date) => {
        const d = new Date(date),
            day = '' + d.getDate(),
            month = '' + (d.getMonth() + 1),
            year = d.getFullYear().toString().substr(-2); // get last two digits of year

        return [day.padStart(2, '0'), month.padStart(2, '0'), year].join('-');
    }

    const formatTime = (time) => {
        const hours = time.getHours();
        const minutes = time.getMinutes();

        // Pad single digit hours/minutes with leading zero
        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

        return `${formattedHours}:${formattedMinutes}`;
    };

    useEffect(() => {
        fetchUserData()
    }, []);

    const fetchUserData = async () => {
        try {
            const user = await getUserData();
            if (user) {
                fetchEvents(user)
                // console.log('this is the user accessToken', user.accessToken)
            } else {
                navigation.navigate('Login');
                console.log('user accessToken not found')
            }
        } catch (error) {
            console.log('Error fetching user accessToken', error.message)
        }
    };

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                // formData.append('user_id', user.userData.user_id)
                formData.append('fetch', 'events,my_events,going,interested,invited,past');
                formData.append('server_key', serverkey)

                const response = await onEventUserApi(formData, token)
                if (response.data.api_status === 200) {
                    setMyEvents(response.data)
                    setLoading(false)
                    console.log('this is the events', response.data)
                    dispatch(fetchAllEvents(response.data.events, response.data.my_events, response.data.going, response.data.interested, response.data.invited, response.data.past))
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('Error fetching events', response.data.errors.error_text)
                }
            } else {
                setLoading(false)
                console.log('Token not found', error.message)
            }
        } catch (err) {
            setLoading(false)
            console.log("Get Error::", err)
        }
    }

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

    const editEvent = async (eventId) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('type', 'edit')
                formData.append('event_id', eventId)
                if (eventName) {
                    formData.append('event_name', eventName)
                }
                if (location) {
                    formData.append('event_location', location)
                }
                if (description) {
                    formData.append('event_description', description)
                }
                if (eventStart.date) {
                    formData.append('event_start_date', eventStart.date.toString());
                }
                if (eventEnd.date) {
                    formData.append('event_end_date', eventEnd.date.toString());
                }
                if (eventStart.time) {
                    formData.append('event_start_time', eventStart.time)
                }
                if (eventEnd.time) {
                    formData.append('event_end_time', eventEnd.time)
                }
                if (eventImage) {
                    formData.append('event_cover', eventImage, eventImageType)
                }

                const response = await onDeleteEventApi(formData, token);
                if (response.data.api_status === 200) {
                    console.log('event Edited', response.data.message_data)
                    ToastAndroid.show(response.data.message_data, ToastAndroid.SHORT)
                    await fetchEvents()
                    navigation.navigate('Events')
                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong please try again later', ToastAndroid.SHORT)
                }

            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Edit Events'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <View>
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
                                                    {selectedImage.length > 0 ? (
                                                        <View style={{ flexDirection: 'row', }}>
                                                            {selectedImage.map((image, index) => (
                                                                <View key={index} style={{ margin: 5 }}>
                                                                    <Image
                                                                        source={{ uri: image }}
                                                                        style={{ width: wp(30), height: hp(15), borderRadius: 10 }}
                                                                    />
                                                                </View>
                                                            ))}
                                                        </View>
                                                    ) : (
                                                        <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                                                            <MaterialCommunityIcons name='image' size={24} color={COLORS.white} />
                                                            <Text style={{ color: COLORS.white, padding: 6, fontFamily: fontFamily.FONTS.Medium }}>Choose Image</Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            </View>


                                            <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                                                <TouchableOpacity onPress={() => navigation.goBack()} >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                                        <Text style={{ padding: 5, fontSize: 16, color: '#737373' }}>{t('go_back')}</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{
                                                    backgroundColor: COLORS.red,
                                                    borderRadius: 10,
                                                    // padding: 3,
                                                    height: hp(4.5),
                                                    width: wp(45),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={() => editEvent(eventData.id)}>
                                                    {loading ? (
                                                        <Loader isLoading={loading} color='white' />
                                                    ) : (
                                                        <Text style={{ paddingHorizontal: wp(10), fontSize: 17, color: COLORS.white }}>Update</Text>
                                                    )}
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditEvent;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: hp(1),
        },
        optionButtonView: {
            borderBottomWidth: 2,
            alignItems: "center",
            justifyContent: 'center',
            height: hp(7)
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