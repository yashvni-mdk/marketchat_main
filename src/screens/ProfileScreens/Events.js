/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, RefreshControl, TouchableOpacity, View, Modal, Image, FlatList, TextInput, ToastAndroid } from 'react-native';
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
import Feather from 'react-native-vector-icons/Feather'
import { onCreateEventApi, onEventUserApi, onDeleteEventApi, onInterestedEvent } from '../../Service/Api';
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

const Events = () => {
    const {t} = useTranslation();
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
    const [eventName, setEventName] = useState('');
    const [location, setLocation] = useState('');
    const [eventStart, setEventStart] = useState({ date: new Date().toISOString().split('T')[0], time: '--:--' });
    const [eventEnd, setEventEnd] = useState({ date: new Date().toISOString().split('T')[0], time: '--:--' });
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState([]);
    const [eventImage, setEventImage] = useState(null)
    const [eventImageType, setEventImageType] = useState(null)
    const [selectedTab, setSelectedTab] = useState('Browse Events');
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

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
    // const formatDate = (date) => {
    //     const day = date.getDate();
    //     const month = date.getMonth() + 1; // Month starts from 0, so add 1
    //     const year = date.getFullYear();

    //     // Pad single digit day/month with leading zero
    //     const formattedDay = day < 10 ? `0${day}` : `${day}`;
    //     const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    //     return `${formattedDay}-${formattedMonth}-${year}`;
    // };
    const formatDate = (date) => {
        const d = new Date(date),
            day = '' + d.getDate(),
            month = '' + (d.getMonth() + 1),
            year = d.getFullYear().toString().substr(-2); // get last two digits of year

        return [day.padStart(2, '0'), month.padStart(2, '0'), year].join('-');
    }

    function convertDateFormat(input) {
        // Split the input into components
        const [month, year, day] = input.split('/');

        // Create a new Date object
        const date = new Date(`${20}${year}-${month}-${day}`);

        // Define an array of month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Format the date
        const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;

        return formattedDate;
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

    const fetchEvents = async (user) => {
        try {
            setRefreshing(loading ? true : false)
            setLoading(refreshing ? false : true)
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
                    setRefreshing(false)
            setLoading(false)
                    console.log('this is the events', response.data)
                    dispatch(fetchAllEvents(response.data.events, response.data.my_events, response.data.going, response.data.interested, response.data.invited, response.data.past))
                } else if (response.data.api_status === 400 || 404) {
                    setRefreshing(false)
            setLoading(false)
                    console.log('Error fetching events', response.data.errors.error_text)
                }
            } else {
                setRefreshing(false)
            setLoading(false)
                console.log('Token not found', error.message)
            }
        } catch (err) {
            setRefreshing(false)
            setLoading(false)
            console.log("Get Error::", err)
        }
    }

    const toggelFrom = () => {
        setFromVisible(!fromVisible)
    }

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    }

    const renderEventData = () => {
        let eventsToDisplay = [];

        if (loading) {
            return (
                <View style={{ flex: 1, marginVertical: hp(30), justifyContent: 'center', alignItems: 'center' }}>
                    <Loader isLoading={true} color={COLORS.red} />
                </View>
            );
        }

        switch (selectedTab) {
            case 'My Events':
                eventsToDisplay = myEvents?.my_events || [];
                break;
            case 'Browse Events':
                eventsToDisplay = myEvents?.events || [];
                break;
            case 'Events Going':
                eventsToDisplay = myEvents?.going || [];
                break;
            case 'Invited':
                eventsToDisplay = myEvents?.invited || [];
                break;
            case 'Events Interested':
                eventsToDisplay = myEvents?.interested || [];
                break;
            case 'Past Events':
                eventsToDisplay = myEvents?.past || [];
                break;
            default:
                eventsToDisplay = [];
                break;
        }

        if (eventsToDisplay.length === 0) {
            return (
                <View style={{ marginVertical: hp(2) }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                        <MaterialIcons name="event" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.3), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>{t('It_seems_like_no_one_created_an_event_yet')}</Text>
                    </View>
                </View>
            )
        }

        return (
            <FlatList
                data={eventsToDisplay}
                keyExtractor={(item) => item.id}
                renderItem={renderEventItem}
            />
        )

    }

    const renderEventItem = ({ item }) => {
        return (
            <View style={{ marginTop: 15, marginHorizontal: 15 }}>
                <View style={{ borderRadius: 8 }}>
                    <View style={{ borderRadius: 10 }}>
                        <Image
                            source={{ uri: item.cover }}
                            style={{ height: 200, width: '100%', borderTopRightRadius: 8, borderTopLeftRadius: 8 }}
                        />
                        <TouchableOpacity style={styles.overlayBlog} >
                            <Text style={styles.overlayBlogText}>{convertDateFormat(item.start_date)}</Text>
                        </TouchableOpacity>
                        <View style={styles.BlogTextOverlay}>
                            <TouchableOpacity style={{ flexDirection: 'row', marginBottom: hp(2) }}>
                                <Ionicons name="location" size={18} color={COLORS.white} />
                                <Text style={styles.BlogTitle}>{item.location}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: COLORS.white, padding: 15, justifyContent: 'flex-start', borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }}>
                            <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { EventId: item.id })}>
                                <Text style={styles.overlayText2}>{item.name}</Text>
                            </TouchableOpacity>

                            {selectedTab === 'Events Interested' && myEvents?.interested && (
                                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#f77411', justifyContent: 'center', marginTop: hp(2), alignItems: 'center', borderRadius: 10, padding: 5, }} onPress={() => eventAction(item.id)}>
                                    <Feather name='check-circle' size={20} color={COLORS.white} />
                                    <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>Interested</Text>
                                </TouchableOpacity>
                            )}
                            {selectedTab === 'Events Going' && myEvents?.going && (
                                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#f77411', justifyContent: 'center', marginTop: hp(2), alignItems: 'center', borderRadius: 10, padding: 5, }} >
                                    <Feather name='check-circle' size={20} color={COLORS.white} />
                                    <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>Going</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
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

                console.log('event start date', eventStart.date);
                formData.append('event_start_date', eventStart.date);


                console.log('event end date', eventEnd.date);
                formData.append('event_end_date', eventEnd.date);
                formData.append('event_start_time', eventStart.time);
                formData.append('event_end_time', eventEnd.time);
                formData.append('event_cover', eventImage);
                formData.append('server_key', serverkey);

                const response = await onCreateEventApi(formData, token);

                if (response.data.api_status === 200) {
                    setMyEvents(response.data)

                    console.log('this is the created events', response.data)
                    ToastAndroid.show('Event created', ToastAndroid.SHORT)
                    const user = await getUserData();
                    fetchEvents(user)
                    setLoading(false)
                    setFromVisible(false)
                } else if (response.data.api_status === 400 || 404) {
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

    const eventAction = async (id) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                // formData.append('type', 'interested')
                formData.append('event_id', id)
                // console.log('event id', id )

                const response = await onInterestedEvent(formData, token);
                if (response.data.api_status === 200) {
                    console.log('event Interested', response.data)
                    ToastAndroid.show(response.data.interest_status, ToastAndroid.SHORT)
                    fetchEvents()
                    // navigation.navigate('Events')
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
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />
            } showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Events'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <View>
                            {fromVisible === false ? (
                                <View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(2), backgroundColor: global.ContentContainer.backgroundColor, borderRadius: 10, justifyContent: 'space-between' }}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                                            <TouchableOpacity onPress={() => handleTabClick('Browse Events')} style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'Browse Events' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                                <Text style={styles.horizontalText}>{t('Browse_Events')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTabClick('Events Going')} style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'Events Going' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                                <Text style={styles.horizontalText}>{t('Events_Going')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTabClick('Invited')} style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'Invited' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                                <Text style={styles.horizontalText}>{t('Invited')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTabClick('Events Interested')} style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'Events Interested' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                                <Text style={styles.horizontalText}>{t('Events_Interested')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTabClick('Past Events')} style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'Past Events' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                                <Text style={styles.horizontalText}>{t('Past_Events')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleTabClick('My Events')} style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'My Events' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                                <Text style={styles.horizontalText}>{t('My_Events')}</Text>
                                            </TouchableOpacity>
                                        </ScrollView>
                                    </View>
                                    <View style={{ marginBottom: hp(5) }}>
                                        {renderEventData()}
                                    </View>
                                </View>

                            ) : (
                                <View>
                                    {/*     <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 25, backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10 }}>
                                        <MaterialIcons name="event" size={20} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 20, padding: 4 }} />
                                        <Text style={{ marginHorizontal: 10, fontSize: hp(2.4), color: global.text2.color, }}>Create new event</Text>
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
                                                    <TouchableOpacity onPress={toggelFrom}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                                            <Text style={{ padding: 5, fontSize: hp(2.2), color: '#737373' }}>{t('go_back')}</Text>
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
                                                    }} onPress={createEvent}>
                                                        {loading ? (
                                                            <Loader isLoading={loading} color='white' />
                                                        ) : (
                                                            <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>{t('publish')}</Text>
                                                        )}
                                                    </TouchableOpacity>

                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
            {!fromVisible && (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        width: wp(14),
                        height: wp(14),
                        alignItems: 'center',
                        justifyContent: 'center',
                        right: 20,
                        bottom: hp(2),
                        backgroundColor: COLORS.red,
                        borderRadius: wp(14),
                        elevation: 8
                    }}
                    onPress={toggelFrom}
                >
                    <Text style={{ fontSize: hp(3.4), color: 'white' }}>+</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default Events;

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
            // position: 'absolute',
            // bottom: 60, // Adjust the position from the bottom as needed
            // left: 20,
            // top: 0,
            marginTop: hp(-5),
            marginHorizontal: wp(3),
            // justifyContent: 'flex-start',
            alignItems: 'flex-start',
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
            borderRadius: 10,
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
            fontSize: hp(2.2), // Adjust the font size as needed
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
            fontSize: hp(2.4), // Adjust the font size as needed
            fontFamily: fontFamily.FONTS.regular
        },
        BlogTitle: {
            color: COLORS.white,
            fontSize: hp(2.3),
            fontWeight: 'bold',
            flexWrap: 'wrap',
        },
        ContentContainer: {
            // margin: 10,
            borderRadius: wp(2),
            padding: 20,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        inputContainer: {
            marginTop: 10,
        },
        lable: {
            fontSize: hp(2.2),
            color: global.text2.color,
            fontWeight: '600',
            marginVertical: 4,
        },
        selctedDate: {
            fontSize: hp(2.2),
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
            fontSize: hp(2.2),
            color: '#766b66'
        },
        CheckBoxContainer: {
            flexDirection: 'row',
            paddingTop: 10,
        },
        checkBoxtext: {
            color: global.text.color,
            fontSize: hp(2),
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15,
        },
    });
};