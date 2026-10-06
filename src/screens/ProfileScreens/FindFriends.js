/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Slider from '@react-native-community/slider';
import CustomInput from '../../components/CustomInput'
import { COLORS } from '../../../constants'
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import { ToastAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import translations from '../../utils/localization/traslations';
import LinearGradient from 'react-native-linear-gradient';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import { onFindFriendsApi } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onFollowUser } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';

const FindFriends = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const [friends, setFriends] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedGender, setSelectedGender] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedRelationship, setSelectedRelationship] = useState('all');
    const [sliderValue, setSliderValue] = useState(0);
    const [loading, setLoading] = useState(false)

    const handleSliderChange = (value) => {
        setSliderValue(value); // Set slider value when it changes
        findFriends(search); // Call findFriends function when slider value changes
    };


    const initialRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const [region, setRegion] = useState(initialRegion);


    const ZoomIn = () => {
        const newRegion = {
            ...region,
            latitudeDelta: region.latitudeDelta * 0.5,
            longitudeDelta: region.longitudeDelta * 0.5
        }
        setRegion(newRegion)
    }
    const ZoomOut = () => {
        const newRegion = {
            ...region,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2
        }
        setRegion(newRegion)
    }

    const handleFilterSelection = async (selectedOption, filterType) => {
        // setLoading(true);

        switch (filterType) {
            case 'gender':
                setSelectedGender(selectedOption);
                break;
            case 'status':
                setSelectedStatus(selectedOption);
                break;
            case 'relationship':
                setSelectedRelationship(selectedOption);
                break;
            default:
                break;
        }

        // await findFriends(); // Call findFriends function after setting the selected filter
        // setLoading(false);
    };

    useEffect(() => {
        findFriends();
    }, [selectedGender, selectedStatus, selectedRelationship]);

    const findFriends = async (text) => {
        try {
            setLoading(true)
            setSearch(text);
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                if (selectedGender) {
                    formData.append('gender', selectedGender)
                    console.log('gender', selectedGender)
                }
                if (text && text!='') {
                    formData.append('keyword', text)
                    console.log('keyword', text)
                }
                if (selectedStatus) {
                    formData.append('status', selectedStatus)
                    console.log('status', selectedStatus)
                }
                if (sliderValue) {
                    console.log(sliderValue)
                    formData.append('distance', sliderValue)
                }
                if (selectedRelationship) {
                    formData.append('relationship', selectedRelationship)
                    console.log('relationship', selectedRelationship)
                }
                console.log('data Get >>>>>>>', selectedGender, text, selectedStatus, sliderValue, selectedRelationship)
                const response = await onFindFriendsApi(formData, token)
                if (response.data.api_status === 200) {
                    setFriends(response.data.nearby_users)
                    setLoading(false)
                    console.log('this is the friends', response.data.nearby_users)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('somthing went wrong fatching friends', response.data.errors.error_text)
                }

            } else {
                setLoading(false)
                console.log('Error::', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    const handleFollowUser = async (userId) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('user_id', userId);

                const response = await onFollowUser(formData, token);
                if (response.data.api_status === 200) {
                    console.log('follow status', response.data.follow_status);
                    ToastAndroid.show(response.data.follow_status, ToastAndroid.SHORT);
                    // Update the state or data if necessary
                    setFriends((prevData) => {
                        // Check if prevData is truthy and has a users property
                        if (prevData && prevData.users) {
                            const updatedUsers = prevData.users.map((user) => {
                                if (user.user_id === userId) {
                                    // Update the is_following status for the specific user
                                    return { ...user, is_following: !user.is_following };
                                }
                                return user;
                            });
                            return { ...prevData, users: updatedUsers };
                        } else {
                            // Set initial state for friends or handle the error accordingly
                            return { users: [] };
                        }
                    });
                } else if (response.data.api_status === 400 || response.data.api_status === 404) {
                    console.log('error to follow user', response.data.errors.error_text);
                }
            } else {
                console.log('user token not found', error.message);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };
    const onRegionChange = (region) => {
        setRegion(region);
      }
      

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={t('Find_friends')} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <LinearGradient
                            colors={['#2292f0', '#2b7ddd', '#3b58bb']} // Replace these colors with your gradient colors
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ height: hp(26), padding: hp(3) }}>
                            <View>
                                <View style={styles.textOverlay}>
                                    <MaterialIcons name='person-search' size={30} color={COLORS.white} style={{ paddingHorizontal: wp(2) }} />
                                    <Text style={styles.overlayText}>{t('Find_friends')}</Text>
                                </View>
                                <View style={{ marginTop: hp(9) }}>
                                    <TextInput
                                        keyboardType='default'
                                        value={search}
                                        placeholder='Search for Users'
                                        placeholderTextColor={COLORS.white}
                                        onChangeText={findFriends}
                                        style={styles.searchBar}
                                        onSubmitEditing={() => {setSearch('')}}
                                    />
                                </View>
                            </View>
                        </LinearGradient>

                        <View style={styles.container}>
                            <View style={styles.ContentContainer}>
                            <View style={{ height: hp(30), width: wp(90), borderRadius: 10 }}>
                                <MapView
                                style={{width: '100%', height: '100%'}}
                                onRegionChange={onRegionChange}
                                region={{
                                    latitude: 21.78825,
                                    longitude: -121.4324,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}>
                                    <Marker
                                        coordinate={region} // Set marker coordinates
                                        title="Marker Title" // Set marker title (optional)
                                        description="Marker Description" // Set marker description (optional)
                                    />
                                </MapView>
                                </View>
                                <View style={styles.horizontalLine} />
                                <View style={styles.filterContainer}>
                                    <Text style={styles.lable}>{t('gender')}</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <TouchableOpacity
                                            style={[styles.filter, {backgroundColor: selectedGender == 'all' ? COLORS.select_box : COLORS.gray}]}
                                            onPress={() => handleFilterSelection('all', 'gender')}
                                        >
                                            <Text style={[styles.filterText, {color: selectedGender == 'all' ? COLORS.select_box_text : COLORS.black}]}>{t('all')}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.filter, {backgroundColor: selectedGender == 'male' ? COLORS.select_box : COLORS.gray}]}
                                            onPress={() => handleFilterSelection('male', 'gender')}
                                        >
                                            <Text style={[styles.filterText, {color: selectedGender == 'male' ? COLORS.select_box_text : COLORS.black}]}>{t('male')}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.filter, {backgroundColor: selectedGender == 'female' ? COLORS.select_box : COLORS.gray}]}
                                            onPress={() => handleFilterSelection('female', 'gender')}
                                        >
                                            <Text style={[styles.filterText, {color: selectedGender == 'female' ? COLORS.select_box_text : COLORS.black}]}>{t('female')}</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <View style={styles.filterContainer}>
                                    <Text style={styles.lable}>{t('status')}</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <TouchableOpacity
                                          style={[styles.filter, {backgroundColor: selectedStatus == 'all' ? COLORS.select_box : COLORS.gray}]}
                                          onPress={() => handleFilterSelection('all', 'status')}>
                                            <Text style={[styles.filterText, {color: selectedStatus == 'all' ? COLORS.select_box_text : COLORS.black}]}>{t('all')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={[styles.filter, {backgroundColor: selectedStatus == 'online' ? COLORS.select_box : COLORS.gray}]}
                                          onPress={() => handleFilterSelection('online', 'status')}>
                                            <Text style={[styles.filterText, {color: selectedStatus == 'online' ? COLORS.select_box_text : COLORS.black}]}>{t('online')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={[styles.filter, {backgroundColor: selectedStatus == 'offline' ? COLORS.select_box : COLORS.gray}]}
                                          onPress={() => handleFilterSelection('offline', 'status')}>
                                            <Text style={[styles.filterText, {color: selectedStatus == 'offline' ? COLORS.select_box_text : COLORS.black}]}>{t('offline')}</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <View style={styles.filterContainer}>
                                    <Text style={styles.lable}>{t('location')}</Text>
                                    <View style={styles.sliderContainer}>
                                        <View style={styles.sliderContentContainer}>
                                            <Slider
                                                style={styles.slider}
                                                minimumValue={0}
                                                maximumValue={1000}
                                                minimumTrackTintColor="#2979ff"
                                                maximumTrackTintColor="#d0d0d0"
                                                thumbTintColor="#2979ff"
                                                step={1}
                                                value={sliderValue}
                                                onValueChange={handleSliderChange}
                                            />
                                            <Text>{sliderValue} km </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.filterContainer}>
                                    <Text style={styles.lable}>{t('relationship')}</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <TouchableOpacity
                                        style={[styles.filter, {backgroundColor: selectedRelationship == 'all' ? COLORS.select_box : COLORS.gray}]}
                                        onPress={() => handleFilterSelection('all', 'relationship')}>
                                            <Text style={[styles.filterText, {color: selectedStatus == 'all' ? COLORS.select_box_text : COLORS.black}]}>{t('all')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.filter, {backgroundColor: selectedRelationship == 'single' ? COLORS.select_box : COLORS.gray}]}
                                            onPress={() => handleFilterSelection('single', 'relationship')}>
                                            <Text style={[styles.filterText, {color: selectedStatus == 'single' ? COLORS.select_box_text : COLORS.black}]}>{t('Single')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.filter, {backgroundColor: selectedRelationship == 'in a relationship' ? COLORS.select_box : COLORS.gray}]}
                                            onPress={() => handleFilterSelection('in a relationship', 'relationship')}>
                                            <Text style={[styles.filterText, {color: selectedStatus == 'in a relationship' ? COLORS.select_box_text : COLORS.black}]}>{t('In_a_relationship')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.filter, {backgroundColor: selectedRelationship == 'married' ? COLORS.select_box : COLORS.gray}]}
                                            onPress={() => handleFilterSelection('married', 'relationship')}>
                                            <Text style={[styles.filterText, {color: selectedStatus == 'married' ? COLORS.select_box_text : COLORS.black}]}>{t('Married')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.filter, {backgroundColor: selectedRelationship == 'engaged' ? COLORS.select_box : COLORS.gray}]}
                                            onPress={() => handleFilterSelection('engaged', 'relationship')}>
                                            <Text style={[styles.filterText, {color: selectedStatus == 'engaged' ? COLORS.select_box_text : COLORS.black}]}>{t('Engaged')}</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        </View>

                        <View>
                            {loading ? (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: hp(7) }}>
                                    <Loader isLoading={true} />
                                </View>
                            ) : (
                                <FlatList
                                    data={friends} // Replace 'users' with the correct key in your API response for users' data
                                    renderItem={({ item }) => (
                                        <View style={{ flex: 1, marginVertical: hp(1), marginHorizontal: wp(2), }}>
                                            <View style={{
                                                backgroundColor: '#FFFFFF',
                                                flexDirection: 'row',
                                                paddingHorizontal: wp(4),
                                                alignItems: 'center',
                                                borderRadius: 8,
                                                height: hp(13),
                                                // Apply shadow styles based on the platform
                                                ...Platform.select({
                                                    ios: {
                                                        shadowColor: 'black',
                                                        shadowOffset: { width: 0, height: 1 },
                                                        shadowOpacity: 0.1,
                                                        shadowRadius: 4,
                                                    },
                                                    android: {
                                                        elevation: 1.2,
                                                        overflow: 'hidden',
                                                    },
                                                }),
                                            }}>
                                                <View style={styles.imageContainer}>
                                                    <TouchableOpacity onPress={() => navigation.navigate('GroupDetails', { GroupId: item.group_id })}>
                                                        <Image source={{ uri: item.avatar }} style={{ height: wp(18), borderRadius: wp(18), width: wp(18), }} />
                                                    </TouchableOpacity>
                                                    {/**  <View style={styles.Blogoverlay} />  */}
                                                    <View style={{ flex: 1, paddingHorizontal: wp(2), width: '80%' }}>
                                                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.user_id })} >
                                                            <Text style={styles.title} numberOfLines={1}>{item.username}</Text>
                                                        </TouchableOpacity>

                                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                                                            <MaterialIcons name='group' size={20} color={COLORS.secondaryGray} />
                                                            <Text style={styles.category} numberOfLines={1}>{item.details.followers_count} followers</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <MaterialIcons name='group' size={20} color={COLORS.secondaryGray} />
                                                            <Text style={styles.category} numberOfLines={1}>{item.details.post_count} posts</Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity
                                                        style={styles.followButton}
                                                        onPress={() => handleFollowUser(item.user_id)} // Pass the user ID to the follow function
                                                    >
                                                        <Text style={styles.followButtonText}>
                                                            {item.is_following ? 'Following' : 'Follow'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    ListEmptyComponent={() => (
                                        <View style={{ marginVertical: hp(4) }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <MaterialIcons name="group" size={hp(5)} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: hp(2) }} />
                                                <Text style={{ paddingTop: hp(3), color: COLORS.secondaryGray, fontSize: hp(2.2) }}>No users to show</Text>
                                            </View>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default FindFriends

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor

        },
        imageContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: wp(2),
        },
        title: {
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.black,
            fontSize: hp(2.2)
        },
        category: {
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.secondaryGray,
            fontSize: hp(2)
        },
        groupTitle: {
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.black,
            fontSize: hp(2.2),
            paddingVertical: 3,
        },
        image: {
            width: '100%',
            height: 180,
            // marginVertical: 10,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(198,77,83,0.5)',
        },
        searchBar: {
            width: '100%',
            height: 40,
            marginTop: hp(3),
            paddingHorizontal: wp(4),
            backgroundColor: '#96bcec',
            color: COLORS.white,
            borderRadius: 8,
            justifyContent: 'center',
        },
        inputText: {
            color: global.inputText.color
        },
        Blogoverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: wp(2)
        },
        textOverlay: {
            position: 'absolute',
            // bottom: 0, // Adjust the position from the bottom as needed
            left: 0,
            right: 0,
            top: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        overlayText: {
            color: COLORS.white,
            fontSize: wp(8),
            paddingHorizontal: wp(1),
            fontFamily: fontFamily.FONTS.regular,
            flexWrap: 'wrap',
        },
        ContentContainer: {
            marginTop: 15,
            marginHorizontal: 10,
            borderRadius: 10,
            padding: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        lable: {
            fontSize: hp(2.2),
            color: global.text2.color,
            fontWeight: '600',
            marginVertical: 4,
        },
        filterContainer: {
            margin: 5,
            borderRadius: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        filter: {
            marginHorizontal: 2,
            backgroundColor: '#c6cfff',
            borderRadius: 50,
            marginTop: 5
        },
        filterText: {
            color: '#3f51b6',
            fontFamily: fontFamily.FONTS.regular,
            padding: 5,
            paddingHorizontal: 20,
            fontSize: hp(2.2)
        },
        overlayText2: {
            // paddingTop: 5,
            // paddingHorizontal: 8,
            color: COLORS.white,
            fontFamily: fontFamily.FONTS.regular,
            fontSize: hp(2),
            paddingHorizontal: 8,
            flexWrap: 'wrap',
        },
        slider: {
            width: wp(75)
        },
        sliderContainer: {
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        sliderContentContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        BlogTextOverlay: {
            position: 'absolute',
            bottom: hp(2), // Adjust the position from the bottom as needed
            left: 20,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        username: {
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: hp(2.6),
            color: COLORS.white
        },
        followButton: {
            // position: 'absolute',
            // top: hp(2), // Adjust the top value to place it at the desired position
            // right: wp(3),
            justifyContent: 'flex-start',
            backgroundColor: COLORS.red,
            paddingHorizontal: wp(2.4),
            paddingVertical: hp(1),
            borderRadius: wp(2),
        },
        followButtonText: {
            color: COLORS.white,
            fontSize: hp(2.2),
            fontFamily: fontFamily.FONTS.regular
        },
        DisplayFriends: {
            marginVertical: hp(15),
            justifyContent: 'center',
            alignItems: 'center'
        },
    })
}