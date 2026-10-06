import { SafeAreaView, ScrollView, StyleSheet, Text, FlatList, TextInput, TouchableOpacity, View, Modal, Image, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityicons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import { useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import translations from '../../utils/localization/traslations';
import { useSelector } from 'react-redux';
import Footer from '../../components/Footer';
import BasicHeader from '../../components/BasicHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onUpdatedGroupApi, onSearchApi, onDeleteGroup, getgroupMembers, removeGroupMember, makeGroupAdmin } from '../../Service/Api';
import { fetchUserGroups } from '../../redux/reducer';
import { Loader } from '../../components/Loader';
import Button from '../../components/Button';
import {useTranslation} from 'react-i18next';

const EditGroup = ({ route }) => {
    const {t} = useTranslation();
    const { groupData } = route.params;
    console.log('Group Data for edit', groupData)
    const dispatch = useDispatch();
    const user_data = useSelector(state => state.user_data)
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [groupName, setGroupName] = useState(groupData?.group_title );
    const [groupUrl, setGroupUrl] = useState(groupData?.group_name );
    const [description, setDescription] = useState(groupData?.about );
    const [groupType, setGroupType] = useState(groupData?.privacy );
    const [request, setRequest] = useState('');

    const [selectedCategory, setSelectedCategory] = useState(groupData?.category);
    const [categoryID, setCategoryID] = useState(null)
    const [coverImage, setCoverImage] = useState(null);
    const [coverImageType, setCoverImageType] = useState(null);
    const [avatar, setAvatar] = useState(null)
    const [avatarType, setAvatarType] = useState(null)
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [members, setMembers] = useState([]);

    const [selectedSection, setSelectedSection] = useState('GeneralSetting'); // State to manage the selected section

    const Categories = [
        // { id:  , label: 'Categories', value: '' },
        { id: 1, label: 'Other', value: 'Other' },
        { id: 2, label: 'Cars and Vehicles', value: 'Cars and Vehicles' },
        { id: 3, label: 'Comedy', value: 'Comedy' },
        { id: 4, label: 'Econoimics and Trade', value: 'Econoimics and Trade' },
        { id: 5, label: 'Education', value: 'Education' },
        { id: 6, label: 'Entertainment', value: 'Entertainment' },
        { id: 7, label: 'Movies & Animation', value: 'Movies & Animation' },
        { id: 8, label: 'Gaming', value: 'Gaming' },
        { id: 9, label: 'History and Facts', value: 'History and Facts' },
        { id: 10, label: 'Live Style', value: 'Live Style' },
        { id: 11, label: 'Natural', value: 'Natural' },
        { id: 12, label: 'News and Politics', value: 'News and Politics' },
        { id: 13, label: 'People and Nations', value: 'People and Nations' },
        { id: 14, label: 'Pets and Animals', value: 'Pets and Animals' },
        { id: 15, label: 'Places and Regions', value: 'Places and Regions' },
        { id: 16, label: 'Science and Technology', value: 'Science and Technology' },
        { id: 17, label: 'Sport', value: 'Sport' },
        { id: 18, label: 'Travel and Events', value: 'Travel and Events' },

    ]

    // Function to open image picker for selecting from gallery
    const openCoverImagePicker = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                multiple: false, // Allow selecting only one image
            });

            if (image && image.path) {
                if (image && image.path) {
                    var filename = image.path.substring(
                        image.path.lastIndexOf("/") + 1
                    );
                    let imageData = {
                        uri: image.path,
                        type: image.mime,
                        name: filename,
                    };
                    setCoverImage(imageData);
                    setCoverImageType(image.mime)

                    console.log('selected Cover Image', coverImage)
                }
            } else {
                console.log('No image selected');
            }
        } catch (error) {
            console.log('Error selecting image:', error);
        }
    };

    // Function to open image picker for selecting from gallery
    const openProfileImagePicker = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                multiple: false, // Allow selecting only one image
            });

            if (image && image.path) {
                if (image && image.path) {
                    var filename = image.path.substring(
                        image.path.lastIndexOf("/") + 1
                    );
                    let imageData = {
                        uri: image.path,
                        type: image.mime,
                        name: filename,
                    };
                    setAvatar(imageData);
                    setAvatarType(image.mime)

                    console.log('Selected image:', avatar);
                }
            } else {
                console.log('No image selected');
            }
        } catch (error) {
            console.log('Error selecting image:', error);
        }
    };

    const fetchGroups = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)

                const response = await onSearchApi(formData, token);
                if (response.data.api_status === 200) {
                    // setGroups(response.data.groups)
                    setLoading(false)
                    console.log('this is the groups', response.data.groups)
                    dispatch(fetchUserGroups(response.data.groups))
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('Error fetching events', response.data.errors.error_text)
                }
            }
            else {
                setLoading(false)
                console.log('Token not found', error.message)
            }
        } catch (err) {
            setLoading(false)
            console.log("Get Error::", err)
        }
    }

    const editGroupSetting = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('group_id', groupData.group_id)
                if (groupUrl !== groupData.group_name) {
                    formData.append('group_name', groupUrl || groupData.group_name)
                }
                if (groupName !== groupData.group_title) {
                    formData.append('group_title', groupName || groupData.group_title)
                }
                if (description !== groupData.about) {
                    formData.append('about', description || groupData.about)
                }
                if (categoryID !== groupData.category) {
                    formData.append('category', categoryID || groupData.category)
                }
                if (groupType !== groupData.privacy) {
                    formData.append('privacy', groupType || groupData.privacy)
                }
                if (avatar && avatar.uri !== groupData.avatar) {
                    formData.append('avatar', avatar, avatarType || pageData.avatar)
                }
                if (coverImage && coverImage.uri !== groupData.cover) {
                    formData.append('cover', coverImage, coverImageType || pageData.coverImage)
                }

                const response = await onUpdatedGroupApi(formData, token)

                if (response.data.api_status === 200) {
                    console.log('group data updated', response.data)
                    ToastAndroid.show(response.data.message, ToastAndroid.SHORT)
                    fetchGroups()
                    setLoading(false)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('error fetching for update the group', response.data.errors.error_text)
                    ToastAndroid.show('somthing went wrong', ToastAndroid.SHORT)
                }

            } else {
                setLoading(false)
                console.log('User Token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    const deleteGroup = async (group_id) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('group_id', group_id)
                formData.append('password', password)

                const response = await onDeleteGroup(formData, token)
                if (response.data.api_status === 200) {
                    ToastAndroid.show('Group deleted ', ToastAndroid.SHORT)
                    setLoading(false)
                    navigation.navigate('Groups')
                    fetchGroups()
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('somthing went wrong', response.data.errors.error_text)
                    ToastAndroid.show('something went wrong', ToastAndroid.SHORT)
                }
            } else {
                setLoading(false)
                console.log('User token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    const getMembers = async (group_id) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('group_id', group_id);

                const response = await getgroupMembers(formData, token)
                if (response.data.api_status === 200) {
                    setMembers(response.data.users)
                    console.log('this is all members in this  group', response.data)
                    // ToastAndroid.show('member found', ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('error to fetch members group', response.data);
                    ToastAndroid.show('Something went wrong please try again', ToastAndroid.SHORT);
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    const removeMember = async (group_id, user_id) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('group_id', group_id);
                formData.append('user_id', user_id)

                const response = await removeGroupMember(formData, token)
                console.log('group_id', group_id)
                console.log('user_id', user_id)
                if (response.data.api_status === 200) {
                    setLoading(false)
                    console.log('User Remove', response.data.message)
                    ToastAndroid.show('Member removed', ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('somthing went wrong', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong please try again', ToastAndroid.SHORT)
                }
            } else {
                setLoading(false)
                console.log('User token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    const MakeGroupAdmin = async (group_id, user_id) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('group_id', group_id);
                formData.append('user_id', user_id)

                const response = await makeGroupAdmin(formData, token)
                if (response.data.api_status === 200) {
                    setLoading(false)
                    console.log('Added', response.data.message)
                    ToastAndroid.show('Added', ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('somthing went wrong', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong please try again', ToastAndroid.SHORT)
                }
            } else {
                setLoading(false)
                console.log('User token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    const getTimeDifference = (timestamp) => {
        const currentTime = Date.now() / 1000; // Current time in seconds
        const difference = currentTime - timestamp; // Calculate the difference

        const secondsInYear = 31536000;
        const secondsInMonth = 2592000;
        const secondsInDay = 86400;
        const secondsInHour = 3600;

        const years = Math.floor(difference / secondsInYear);
        const months = Math.floor(difference / secondsInMonth);
        const days = Math.floor(difference / secondsInDay);
        const hours = Math.floor(difference / secondsInHour);

        if (years > 0) {
            return `${years}Y`;
        } else if (months > 0) {
            return `${months}M`;
        } else if (days > 0) {
            return `${days} day`;
        } else {
            return `${hours}Hr`;
        }
    };

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Edit Group'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: hp(1.5), marginTop: hp(2.5), backgroundColor: '#03a9f4', marginHorizontal: wp(1), borderRadius: wp(3), justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => setSelectedSection('GeneralSetting')}>
                                <Ionicons name="settings-outline" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedSection('PrivacySetting')}>
                                <MaterialCommunityicons name="shield-outline" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedSection('Avatar&Cover')} >
                                <Ionicons name="image-outline" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { getMembers(groupData.group_id), setSelectedSection('Members') }}>
                                <MaterialIcons name="group" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <MaterialCommunityicons name="trending-up" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedSection('DeleteGroup')}>
                                <AntDesign name="delete" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>

                        {/* GeneralSetting */}
                        {selectedSection === 'GeneralSetting' && (
                            <View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(2) }}>
                                            <Feather name="tool" size={wp(6)} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: wp(6), padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>General Setting</Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>{t('group_name')}</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                value={groupName}
                                                onChangeText={text => setGroupName(text)}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>{t('category')}</Text>
                                            <View style={styles.dropDownContainer}>
                                                <Picker
                                                    selectedValue={selectedCategory}
                                                    onValueChange={(itemValue, itemIndex) => {
                                                        const selectedCategory = Categories[itemIndex]; // Get the selected category object
                                                        setSelectedCategory(itemValue);
                                                        setCategoryID(selectedCategory.id); // Set categoryID based on the selected category's id
                                                    }}
                                                    style={styles.dropDown}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    {Categories.map((category, index) => (
                                                        <Picker.Item key={category.id} label={category.label} value={category.value} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        </View>


                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>{t('group_url')}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={{ padding: 13, backgroundColor: '#eeeeee', color: '#766b66', borderRadius: 2 }}>https://marketchat.in/</Text>
                                                <TextInput
                                                    keyboardType="default"
                                                    value={groupUrl}
                                                    onChangeText={text => setGroupUrl(text)}
                                                    style={styles.customInput}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>{t('description')}</Text>
                                            <TextInput
                                                keyboardType="default"
                                                multiline={true}
                                                numberOfLines={5}
                                                value={description}
                                                onChangeText={text => setDescription(text)}
                                                style={styles.descriptionInput}
                                                textAlignVertical="top"
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                                            <TouchableOpacity style={{
                                                marginTop: hp(3),
                                                height: hp(4.8),
                                                backgroundColor: COLORS.red,
                                                // borderColor: COLORS.black,
                                                // borderWidth: 2,
                                                borderRadius: 12,
                                                width: wp(35),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }} onPress={editGroupSetting}>
                                                {loading ? (
                                                    <Loader isLoading={loading} color='white' />
                                                ) : (
                                                    <View style={{ padding: 5, paddingHorizontal: wp(10) }}>
                                                        <Text style={{ fontSize: hp(2.3), color: COLORS.white }}>Save</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>


                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Privacy Setting */}
                        {selectedSection === 'PrivacySetting' && (
                            <View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginBottom: hp(2) }}>
                                            <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>Privacy Setting</Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.PrivacyLable}>{t('group_type')}</Text>
                                            <View style={styles.dropDownContainer}>
                                                <Picker
                                                    selectedValue={groupType}
                                                    onValueChange={(itemValue, itemIndex) => setGroupType(itemValue)}
                                                    style={styles.dropDown} itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='Public' value={'Public'} style={styles.lable} />
                                                    <Picker.Item label='Private' value={'Private'} style={styles.lable} />
                                                </Picker>
                                            </View>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.PrivacyLable}>Confirm request when somone joining this group ?</Text>
                                            <View style={styles.dropDownContainer}>
                                                <Picker
                                                    selectedValue={request}
                                                    onValueChange={(itemValue, itemIndex) => setRequest(itemValue)}
                                                    style={styles.dropDown} itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='Yes' value={'Yes'} style={styles.lable} />
                                                    <Picker.Item label='No' value={'No'} style={styles.lable} />
                                                </Picker>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                                            <TouchableOpacity style={{
                                                marginTop: hp(3),
                                                height: hp(4.8),
                                                backgroundColor: COLORS.red,
                                                // borderColor: COLORS.black,
                                                // borderWidth: 2,
                                                borderRadius: 12,
                                                width: wp(35),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }} onPress={editGroupSetting}>
                                                {loading ? (
                                                    <Loader isLoading={loading} color='white' />
                                                ) : (
                                                    <View style={{ padding: 5, paddingHorizontal: wp(10) }}>
                                                        <Text style={{ fontSize: hp(2.3), color: COLORS.white }}>Save</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}


                        {/* Avatar & Cover */}
                        {selectedSection === 'Avatar&Cover' && (
                            <View style={styles.container}>
                                <View style={styles.AvatarContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, }}>
                                            <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>Avatar & Cover</Text>
                                        </View>

                                        {/* Image selection */}
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: hp(5)
                                        }}>
                                            {/* First Image Picker */}
                                            <TouchableOpacity onPress={openCoverImagePicker} style={styles.CoverImagePicker}>
                                                {coverImage && coverImage.uri ? (
                                                    <Image source={{ uri: coverImage.uri }} style={styles.backgroundImage} />
                                                ) : (
                                                    <View style={styles.placeholderImage}>
                                                        <Feather name='image' size={30} color={COLORS.secondaryGray} />
                                                    </View>
                                                )}
                                            </TouchableOpacity>

                                            {/* Second Image Picker (Overlay) */}
                                            <TouchableOpacity onPress={openProfileImagePicker} style={styles.userImagePickerContainer}>
                                                {avatar && avatar.uri ? (
                                                    <Image source={{ uri: avatar.uri }} style={styles.userImage} />
                                                ) : (
                                                    <View style={styles.roundPlaceholder}>
                                                        <Feather name='image' size={30} color={COLORS.secondaryGray} />
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(12), marginHorizontal: 10, borderRadius: 10, justifyContent: 'center' }}>
                                        <TouchableOpacity style={{
                                            marginTop: hp(3),
                                            height: hp(4.8),
                                            backgroundColor: COLORS.red,
                                            // borderColor: COLORS.black,
                                            // borderWidth: 2,
                                            borderRadius: 12,
                                            width: wp(35),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} onPress={editGroupSetting}>
                                            {loading ? (
                                                <Loader isLoading={loading} color='white' />
                                            ) : (
                                                <View style={{ padding: 5, paddingHorizontal: wp(10) }}>
                                                    <Text style={{ fontSize: hp(2.3), color: COLORS.white }}>Save</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        )}

                        {/* Members */}
                        {selectedSection === 'Members' && (
                            <View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginBottom: hp(1) }}>
                                            <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>Members</Text>
                                        </View>
                                        <FlatList
                                            data={members}
                                            keyExtractor={(item, index) => item.user_id.toString()}
                                            renderItem={({ item }) => (
                                                <View style={{ marginTop: hp(2), padding: 7, paddingHorizontal: wp(2), borderRadius: wp(1), borderWidth: 0.5, borderColor: COLORS.gray, paddingBottom: hp(1), flexDirection: 'row', }}>
                                                    <View>
                                                        <Image
                                                            source={{ uri: item?.avatar }}
                                                            style={{ height: hp(12), width: wp(24), borderRadius: 100 }}
                                                        />

                                                    </View>
                                                    <View style={{ paddingHorizontal: wp(4), }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={styles.username}>{item?.username}</Text>
                                                            {item.is_verified ? (
                                                                <MaterialIcons name="verified" size={24} color={'#55acee'} style={{ paddingHorizontal: wp(2) }} />
                                                            ) : null}
                                                        </View>
                                                        <Text style={styles.Status}>{getTimeDifference(item?.lastseen)}</Text>

                                                        <TouchableOpacity style={{ padding: 5, marginTop: hp(1), width: wp(35), height: hp(4.8), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#ebeef0', }} onPress={() => removeMember(groupData.group_id, item.user_id)}>
                                                            {loading ? (
                                                                <Loader isLoading={loading} color='red' />
                                                            ) : (
                                                                <Text style={{ fontSize: hp(2.2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>Remove</Text>

                                                            )}
                                                        </TouchableOpacity>
                                                        {/*   {item.is_owner ? (
                                                            <TouchableOpacity style={{ padding: 5, marginTop: hp(1), width: wp(35), height: hp(4.8), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#ebeef0', }} onPress={() => removeMember(groupData.group_id, item.user_id)}>
                                                                {loading ? (
                                                                    <Loader isLoading={loading} color='red' />
                                                                ) : (
                                                                    <Text style={{ fontSize: hp(2.2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>Remove</Text>

                                                                )}
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <TouchableOpacity style={{ padding: 5, marginTop: hp(1), width: wp(35), height: hp(4.8), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#ebeef0', }} onPress={() => MakeGroupAdmin(groupData.group_id, item.user_id)}>
                                                                {loading ? (
                                                                    <Loader isLoading={loading} color='red' />
                                                                ) : (
                                                                    <Text style={{ fontSize: hp(2.2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>Add</Text>
                                                                )}
                                                            </TouchableOpacity>
                                                        )}
                                                    */}
                                                    </View>
                                                </View>
                                            )}
                                        />


                                    </View>
                                </View>


                            </View>

                        )}

                        {/* Delete Group */}
                        {selectedSection === 'DeleteGroup' && (
                            <View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginBottom: hp(2) }}>
                                            <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>Delete Group</Text>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>{t('password')}</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                value={password}
                                                onChangeText={text => setPassword(text)}
                                                secureTextEntry={true}
                                            />
                                        </View>
                                        <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }} >
                                            <TouchableOpacity style={{
                                                height: hp(4.8),
                                                backgroundColor: COLORS.red,
                                                // borderColor: COLORS.black,
                                                // borderWidth: 2,
                                                borderRadius: 12,
                                                width: wp(35),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }} onPress={() => deleteGroup(groupData.group_id)}>
                                                {loading ? (
                                                    <Loader isLoading={loading} color='white' />
                                                ) : (
                                                    <View style={{ padding: 5, paddingHorizontal: wp(10) }}>
                                                        <Text style={{ fontSize: hp(2.3), color: COLORS.white }}>Delete</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditGroup

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            // marginTop: 20,
        },
        imageContainer: {
            marginTop: hp(3),
            // padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        backgroundImage: {
            height: hp(30),
            width: '100%',
            borderRadius: 10
        },
        userImageContainer: {
            position: 'absolute',
            bottom: -60,
            alignSelf: 'center'
        },
        userImage: {
            height: hp(17),
            width: wp(34),
            borderRadius: 100
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
        customInput: {
            width: '50%',
            height: 48,
            paddingHorizontal: 4,
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
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
        dropDown: {
            width: '100%',
            minHeight: 40,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
        },
        ContentContainer: {
            // margin: 10,
            height: 'auto',
            marginHorizontal: wp(4),
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            padding: 20,
            paddingHorizontal: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        AvatarContentContainer: {
            // margin: 10,
            height: hp(70),
            marginHorizontal: wp(4),
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            padding: 20,
            paddingHorizontal: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        backgroundImage: {
            height: hp(30),
            width: '100%',
            borderRadius: 10
        },

        userImage: {
            height: hp(17),
            width: wp(34),
            // borderWidth: 4,
            // borderColor: COLORS.white,
            borderRadius: 100
        },
        imagePicker: {
            width: '100%',
            height: hp(35),
            marginHorizontal: 20,
            // marginHorizontal: 15,
            backgroundColor: '#eaeaea',
            color: global.inputText.color,
            // borderColor: COLORS.secondaryBlack,
            borderRadius: 8,
            justifyContent: 'space-between'
        },
        CoverImagePicker: {
            width: '95%',
            height: hp(28),
            // marginHorizontal: 15,
            backgroundColor: '#eaeaea',
            color: global.inputText.color,
            // borderColor: COLORS.secondaryBlack,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        userImagePickerContainer: {
            width: wp(36),
            height: hp(18),
            position: 'absolute',
            bottom: -80,
            // marginBottom: 30,
            borderWidth: 4,
            borderColor: COLORS.white,
            borderRadius: 100,
            backgroundColor: '#eaeaea',
            justifyContent: 'center',
            alignItems: 'center',
        },
        UserContentContainer: {
            // margin: 10,
            marginHorizontal: wp(4),
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            padding: 20,
            paddingHorizontal: 10,
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
        username: {
            // padding: 5,
            fontSize: hp(2.4),
            fontfamily: fontFamily.FONTS.regular,
            color: '#6c788a'
        },
        Status: {
            // padding: 5,
            fontSize: hp(1.8),
            fontfamily: fontFamily.FONTS.regular,
            color: COLORS.darkGreeen
        },
        PrivacyLable: {
            fontSize: hp(2),
            paddingHorizontal: 1,
            color: global.text2.color,
            fontfamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        title: {
            fontSize: hp(2.3),
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.black

        },
        CheckBoxContainer: {
            flexDirection: 'row',
            paddingTop: 10,
        },
        checkBoxtext: {
            color: global.text.color,
            fontSize: hp(2.1),
        },
        details: {
            padding: 10
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15,
        },


    })
}