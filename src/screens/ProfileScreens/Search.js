/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, FlatList, ScrollView, Image, ToastAndroid, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import CustomInput from '../../components/CustomInput';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import translations from '../../utils/localization/traslations';
import LinearGradient from 'react-native-linear-gradient';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onFollowUser, onJoinGroup, onLikePage, onSearchApi } from '../../Service/Api';
import Footer from '../../components/Footer';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import CountryPicker from 'react-native-country-picker-modal'
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';

const Search = () => {
    const user_data = useSelector(state => state.user_data);
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const filterOptions = {
        age: ['Yes', 'No'],
        Verified: ['All', 'Verified', 'Unverified'],
        Status: ['All', 'Online', 'Offline'],
        Gender: ['All', 'Female', 'Male', 'Other'],
        ProfilePicture: ['All', 'Yes', 'No']
    }

    // Function to format the current date as "14 Dec 2023"
    const getCurrentDate = () => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const currentDate = new Date();
        return currentDate.toLocaleDateString(undefined, options);
    };

    const [usersData, setUsersData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('')
    const [selectedCategoryCode, setSelectedCountryCode] = useState(null)
    const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);
    const [filter, setFilter] = useState([]);
    const [search, setSearch] = useState('')
    const [selectedFilter, setSelectedFilter] = useState(null);

    const [selectedOption, setSelectedOption] = useState('users')
    const [loading, setLoading] = useState(false)


    const handleCountryPicker = () => {
        setCountryPickerVisibility(true); // Open the CountryPicker when the dropDownContainer is pressed
    };

    const handleCountrySelect = (country) => {
        if (country.name === '') {
            // User chose 'Select Country' option
            setSelectedCountry(''); // Optionally, you can leave it as an empty string or set it to a default value
        } else {
            setSelectedCountry(country.name);
        }

        // Extract the first element from the callingCode array and remove the '+' sign
        const countryCode = country.callingCode[0].replace(/\D/g, '');

        setSelectedCountryCode(countryCode);
        setCountryPickerVisibility(false);
    };



    const handleFilterChange = (itemValue, itemIndex) => {
        setSelectedFilter(itemValue);
        if (itemValue !== null) {
            const [category, option] = itemValue.split(':');
            console.log(`${category}: ${option}`);
        }
    };

    const renderFilterItems = () => {
        const items = [];
        Object.entries(filterOptions).forEach(([category, options]) => {
            items.push(<Picker.Item label={`${category}`} value={null} key={category} />);
            options.forEach((option) => {
                const value = `${category}:${option}`;
                items.push(<Picker.Item label={option} value={value} key={value} />);
            })
        })
        return items;
    }

    // Function to handle the selection of the tab and update the selectedOption state
    const handleTabSelection = (option) => {
        setSelectedOption(option);
    };

    // const renderFilterItems = () => {
    //     const items = [];
    //     Object.entries(filterOptions).forEach(([category, options]) => {
    //         items.push(<Picker.Item label={`${category}`} value={null} key={category} />);
    //         options.forEach((option) => {
    //             const value = `${category}:${option}`;
    //             items.push(<Picker.Item label={option} value={value} key={value} />);
    //         })
    //     })
    //     return items;
    // }

    // useEffect(() => {
    //     fetchAllUsersData()
    // }, []);

    const fetchAllUsersData = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('search_key', search)

                // Add the selected filter to the FormData
                if (selectedFilter !== null) {
                    const [category, option] = selectedFilter.split(':');
                    formData.append(category.toLowerCase(), option);
                }

                // Add the selected country code to the FormData
                if (selectedCountry !== null) {
                    formData.append('country', selectedCategoryCode);
                    console.log(selectedCategoryCode)
                }

                const response = await onSearchApi(formData, token)
                if (response.data.api_status === 200) {
                    setUsersData(response.data)
                    setLoading(false)
                    console.log('this is the all search data', response.data)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('error for fetching data', response.data.errors.error_text)
                }
            } else {
                setLoading(false)
                console.log('sonthing went wrong', error.message)
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
                    setUsersData((prevData) => {
                        const updatedUsers = prevData.users.map((user) => {
                            if (user.user_id === userId) {
                                // Update the is_following status for the specific user
                                return { ...user, is_following: !user.is_following };
                            }
                            return user;
                        });
                        return { ...prevData, users: updatedUsers };
                    });
                    // Update the state or data if necessary
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

    const handelPageLike = async (pageId) => {
        try {
            setUsersData((prevData) => {
                const updatedPages = prevData.pages.map((page) =>
                    page.page_id === pageId
                        ? {
                            ...page,
                            is_liked: page.is_liked === 'yes' ? 'no' : 'yes', // Toggle the like status
                        }
                        : page
                );
                return {
                    ...prevData,
                    pages: updatedPages,
                };
            });

            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('page_id', pageId);

                const response = await onLikePage(formData, token)
                if (response.data.api_status === 200) {
                    console.log('like status', response.data.like_status);
                    ToastAndroid.show(response.data.like_status, ToastAndroid.SHORT);
                } else if (response.data.api_status === 400 || 404) {
                    console.log('error to follow user', response.data.errors.error_text);
                    ToastAndroid.show('Something went wrong please try again', ToastAndroid.SHORT);
                }
            } else {
                console.log('user token not found', error.message);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    const handleJoinedGroup = async (group_id) => {
        try {
            setUsersData((prevData) => {
                const updatedGroups = prevData.groups.map((group) =>
                    group.group_id === group_id
                        ? {
                            ...group,
                            is_joined: group.is_joined === 'yes' ? 'no' : 'yes', // Toggle the join status
                        }
                        : group
                );
                return {
                    ...prevData,
                    groups: updatedGroups,
                };
            });
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('group_id', group_id);

                const response = await onJoinGroup(formData, token)
                if (response.data.api_status === 200) {
                    console.log('Your Joined into group', response.data.join_status)
                    ToastAndroid.show(response.data.join_status, ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('error to joined into group', response.data.errors.error_text);
                    ToastAndroid.show('Something went wrong please try again', ToastAndroid.SHORT);
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    // Function to render the FlatList content based on the selected option
    const renderFlatListContent = () => {
        switch (selectedOption) {
            case 'users':
                return (
                    <View>
                        {loading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: hp(5) }}>
                                <Loader isLoading={true} />
                            </View>
                        ) : (
                            <FlatList
                                data={usersData.users} // Replace 'users' with the correct key in your API response for users' data
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
                                                        <Materialicons name='group' size={20} color={COLORS.secondaryGray} />
                                                        <Text style={styles.category} numberOfLines={1}>{item.details.followers_count} followers</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                        <Materialicons name='group' size={20} color={COLORS.secondaryGray} />
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
                                            <Materialicons name="group" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                            <Text style={{ paddingTop: 15, color: COLORS.secondaryGray, fontSize: 16 }}>No users to show</Text>
                                        </View>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                );
            case 'groups':
                return (
                    <View>
                        {loading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: hp(5) }}>
                                <Loader isLoading={true} />
                            </View>
                        ) : (
                            <FlatList
                                data={usersData.groups} // Replace 'groups' with the correct key in your API response for groups' data
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
                                                    <Image
                                                        source={{ uri: item.avatar }}
                                                        style={{ height: wp(18), borderRadius: wp(18), width: wp(18), }}
                                                    />
                                                </TouchableOpacity>
                                                <View style={{ flex: 1, paddingHorizontal: wp(2), width: '80%' }}>
                                                    <Text style={styles.groupTitle}>{item.group_title}</Text>
                                                    <Text style={styles.members}>{item.members_count} Members</Text>
                                                </View>

                                                <View style={{ marginHorizontal: wp(2), alignItems: 'center', justifyContent: 'center' }}>
                                                    {item.user_id !== user_data.user_id && (
                                                        <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: item.is_joined === 'yes' ? COLORS.yellow : COLORS.red, justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 5, }} onPress={() => handleJoinedGroup(item.group_id)}>
                                                            {item.is_joined === 'yes' ? (
                                                                <Feather name={'check-circle'} size={20} color={COLORS.white} />
                                                            ) : (
                                                                <AntDesign name='pluscircleo' size={20} color={COLORS.white} />
                                                            )}
                                                            <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>
                                                                {item.is_joined === 'yes' ? 'Joined' : 'Join'}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={() => (
                                    <View style={{ marginVertical: hp(4) }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <MaterialCommunityicons name="select-group" size={22} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                            <Text style={{ paddingTop: 15, color: COLORS.secondaryGray, fontSize: hp(2.2) }}>No Groups to show</Text>
                                        </View>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                );
            case 'pages':
                return (
                    <View>
                        {loading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: hp(5) }}>
                                <Loader isLoading={true} />
                            </View>
                        ) : (
                            <FlatList
                                data={usersData.pages} // Replace 'pages' with the correct key in your API response for pages' data
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
                                                <TouchableOpacity onPress={() => navigation.navigate('PageDetails', { PageId: item.page_id })}>
                                                    <Image
                                                        source={{ uri: item.avatar }}
                                                        style={{ height: wp(18), width: wp(18), borderRadius: wp(18), }}
                                                    />
                                                </TouchableOpacity>
                                                <View style={{ flex: 1, paddingHorizontal: wp(2), width: '80%' }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate('PageDetails', { PageId: item.page_id })}>
                                                        <Text style={styles.title}>{item.name}</Text>
                                                    </TouchableOpacity>

                                                    <View style={{ paddingVertical: 3, flexDirection: 'row', alignItems: 'center' }}>
                                                        <AntDesign name='like1' size={16} color={COLORS.secondaryGray} style={{ paddingHorizontal: 3 }} />
                                                        <Text style={styles.category} numberOfLines={1}> (0) People like this</Text>
                                                    </View>
                                                    <View style={{ paddingVertical: 3, flexDirection: 'row', alignItems: 'center' }}>
                                                        <AntDesign name='tag' size={16} color={COLORS.secondaryGray} style={{ paddingHorizontal: 6 }} />
                                                        <Text style={styles.category} numberOfLines={1}>{item.category}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ marginHorizontal: wp(2), alignItems: 'center', justifyContent: 'center' }}>
                                                    {!item.is_page_onwer && (
                                                        <TouchableOpacity style={{
                                                            flexDirection: 'row', padding: 6, borderRadius: 5, backgroundColor:
                                                                item.is_liked === 'yes' ? COLORS.yellow : COLORS.red,
                                                        }} onPress={() => handelPageLike(item.page_id)}>
                                                            <AntDesign name="like2" size={20} color={COLORS.white} />
                                                            <Text style={{
                                                                color: COLORS.white, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), paddingHorizontal:
                                                                    5
                                                            }}>
                                                                {item.is_liked === 'yes' ? 'liked' : 'like'}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                                }
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={() => (
                                    <View style={{ marginVertical: hp(4) }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Materialicons name="flag" size={22} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                            <Text style={{ paddingTop: 15, color: COLORS.secondaryGray, fontSize: 16 }}>No Pages to show</Text>
                                        </View>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                );
            default:
                return null;
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={t('search')} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <LinearGradient
                            colors={['#bda2ff', '#cac0ff', '#bbabff']} // Replace these colors with your gradient colors
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ height: hp(24), padding: hp(3) }}
                        >
                            <View >
                                <View >
                                    <Text style={styles.overlayText}>{t('search')}</Text>
                                    <Text style={styles.overlayText2}>{t('search_header_label')}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                        <View style={styles.container}>
                            <View style={styles.ContentContainer}>
                                <View style={styles.content}>
                                    <TextInput
                                        placeholder='Keyword'
                                        placeholderTextColor={COLORS.secondaryGray}
                                        style={styles.CustomInput}
                                        value={search}
                                        onChangeText={text => setSearch(text)}
                                    />
                                    <View style={{ marginTop: 20 }}>
                                        <View style={styles.inputContainer}>
                                            <TouchableOpacity onPress={handleCountryPicker} style={styles.CountrydropDownContainer}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={styles.selectedCountry}>{selectedCountry || 'Select Country'}</Text>
                                                    {/*  <Materialicons name="arrow-drop-down" size={29} color={COLORS.black} />* */}
                                                </View>
                                            </TouchableOpacity>
                                            {isCountryPickerVisible && ( // Render CountryPicker conditionally based on isCountryPickerVisible
                                                <CountryPicker
                                                    visible={isCountryPickerVisible}
                                                    onClose={() => setCountryPickerVisibility(false)}
                                                    onSelect={handleCountrySelect}
                                                    withFilter
                                                    withCountryNameButton
                                                    withCloseButton
                                                    containerButtonStyle={{ backgroundColor: COLORS.white }}
                                                />
                                            )}
                                        </View>
                                        <View style={styles.dropDownContainer}>
                                            <Picker
                                                selectedValue={selectedFilter}
                                                onValueChange={handleFilterChange}
                                                mode='DropDown'
                                                style={styles.dropDown}
                                                itemStyle={styles.pickerItem}
                                            >
                                                <Picker.Item label='Select Filters' value={null} />
                                                {renderFilterItems()}
                                            </Picker>
                                        </View>
                                        <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', }}>
                                            <TouchableOpacity style={{ backgroundColor: '#b59aff', borderRadius: 10, padding: 5 }} onPress={fetchAllUsersData}>
                                                <Text style={{ paddingHorizontal: 20, fontSize: hp(2.6), color: COLORS.white }}>{t('search')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(2), paddingHorizontal: wp(2), backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-between' }}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <TouchableOpacity onPress={() => handleTabSelection('users')} style={[styles.optionButtonView, { borderBottomColor: selectedOption == 'users' ? COLORS.darkgray1 : global.ContentContainer.backgroundColor }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Materialicons name="group" size={22} color={COLORS.gray} />
                                                <Text style={{ paddingHorizontal: wp(2.2), fontSize: hp(2.2), color: selectedOption == 'pages' ? COLORS.black : '#766b66' }}>{t('users')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleTabSelection('pages')} style={[styles.optionButtonView, { borderBottomColor: selectedOption == 'pages' ? COLORS.darkgray1 : global.ContentContainer.backgroundColor }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Materialicons name="flag" size={22} color={COLORS.gray} />
                                                <Text style={{ paddingHorizontal: wp(2.2), fontSize: hp(2.2), color: selectedOption == 'pages' ? COLORS.black : '#766b66' }}>{t('pages')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleTabSelection('groups')} style={[styles.optionButtonView, { borderBottomColor: selectedOption == 'groups' ? COLORS.darkgray1 : global.ContentContainer.backgroundColor }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <MaterialCommunityicons name="select-group" size={22} color={COLORS.gray} />
                                                <Text style={{ paddingHorizontal: wp(2.2), fontSize: hp(2.2), color: selectedOption == 'pages' ? COLORS.black : '#766b66' }}>{t('groups')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>

                            </View>
                            <View style={{ marginBottom: hp(5) }}>
                                {renderFlatListContent()}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Search;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor

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
        Exploreoverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        textOverlay: {
            position: 'absolute',
            bottom: 0, // Adjust the position from the bottom as needed
            left: 10,
            right: 0,
            top: 30,
            // justifyContent: 'center',
            alignItems: 'flex-start',
        },
        overlayText: {
            color: COLORS.white,
            // paddingHorizontal: 8,
            fontSize: hp(4),
            fontFamily: fontFamily.FONTS.bold,
            flexWrap: 'wrap',
        },

        dropDownContainer: {
            marginTop: 10,
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            // marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            overflow: 'hidden',
        },
        CountrydropDownContainer: {
            marginTop: 10,
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            // marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingHorizontal: wp(4),
            height: hp(6.5),
            overflow: 'hidden',
        },
        dropDown: {
            width: '100%',
            minHeight: 40, // Set minHeight or remove for explicit height
            // backgroundColor: global.textInput.backgroundColor,
            color: '#585858'
        },
        selectedCountry: {
            color: '#585858',
            fontSize: hp(2.2)
        },
        CustomInput: {
            width: '100%',
            height: 40,
            paddingHorizontal: 4,
            backgroundColor: '#ededed',
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        pickerItem: {
            backgroundColor: COLORS.lightGray, // Set the background color for picker items
            borderRadius: 8, // Set border radius for picker items
            flexDirection: 'row', // Set the flex direction to row for picker items
            justifyContent: 'space-between', // Adjust based on your design needs
            alignItems: 'center', // Align items as needed
            paddingHorizontal: 12, // Add horizontal padding
            marginVertical: 5, // Add vertical margin
        },
        Blogoverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: wp(2)
        },
        optionButtonView: {
            borderBottomWidth: 2,
            marginHorizontal: wp(2.4),
            alignItems: "center",
            justifyContent: 'center',
            height: hp(7)
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
        details: {
            // justifyContent: 'center',
            alignItems: 'center',
            // flexDirection: 'row',
            flexWrap: 'wrap',
            // marginHorizontal: wp(10)
        },
        groupsDetails: {
            padding: 10,
            paddingHorizontal: wp(4)
        },
        overlayBlogText: {
            padding: 3,
            paddingHorizontal: 10,
            color: COLORS.gray, // Set your desired text color
            fontSize: hp(2.2), // Adjust the font size as needed
            fontFamily: fontFamily.FONTS.regular
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
        HandingtextContainer: {
            backgroundColor: COLORS.green,
            justifyContent: 'center',
            alignItems: 'center',
        },

        Handingtext: {
            color: COLORS.red,
            fontSize: 42,
            fontWeight: 'bold',
            marginBottom: 6,
            padding: 40,
        },
        ContentContainer: {
            marginTop: hp(-5),
            margin: 15,
            borderRadius: 10,
            backgroundColor: global.ContentContainer.backgroundColor
        },
        content: {
            padding: 15,
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

        horizontalTab: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 20,
            flexWrap: 'wrap',
            paddingHorizontal: 10,
        },
        horizontalTabText: {
            padding: 5,
            // marginHorizontal: 10,
            fontSize: hp(2.1),
            color: global.text.color,
        },
        ProfileComplitionButton: {
            borderRadius: 20,
            backgroundColor: COLORS.secondaryGray,
            marginTop: 10,
            marginHorizontal: 5
        },
        Picker: {
            width: '100%',
            height: 50,
            borderRadius: 10,
            borderWidth: 1,
            // marginTop: 15,
            backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: COLORS.secondaryBlack,
        },
        members: {
            paddingVertical: 3,
            fontFamily: fontFamily.FONTS.regular,
            fontSize: hp(2),
            color: COLORS.darkgray1
        },
        imageContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: wp(2),
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};