/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, RefreshControl, ToastAndroid, Text, FlatList, TextInput, TouchableOpacity, View, Modal, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityicons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Picker } from '@react-native-picker/picker';
import translations from '../../utils/localization/traslations';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import { getUserData } from '../../utils/localization/Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCreateGroups, onCreateGroupsApi, onFetchGroups, onJoinGroup, onSearchApi } from '../../Service/Api';
import { useDispatch } from 'react-redux';
import { createGroups, fetchUserGroups } from '../../redux/reducer';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const Groups = () => {
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

    const [groupsdata, setGroupsData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [userId, setUserId] = useState('');
    const [fromVisible, setFromVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupUrl, setGroupUrl] = useState('');
    const [description, setDescription] = useState('');
    const [groupType, setGroupType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryID, setCategoryID] = useState(0)
    const [groupTypeId, setGroupTypeId] = useState(1);
    const [selectedTab, setSelectedTab] = useState('My Groups');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const toggelFrom = () => {
        setFromVisible(!fromVisible)
    }

    const Categories = [
        { id:0, label: 'Categories', value: 'Categories' },
        { id:1, label: 'Cars and Vehicles', value: 'Cars and Vehicles' },
        { id:2, label: 'Comedy', value: 'Comedy' },
        { id:3, label: 'Econoimics and Trade', value: 'Econoimics and Trade' },
        { id:4, label: 'Education', value: 'Education' },
        { id:5, label: 'Entertainment', value: 'Entertainment' },
        { id:6, label: 'Movies & Animation', value: 'Movies & Animation' },
        { id:7, label: 'Gaming', value: 'Gaming' },
        { id:8, label: 'History and Facts', value: 'History and Facts' },
        { id:9, label: 'Live Style', value: 'Live Style' },
        { id:10, label: 'Natural', value: 'Natural' },
        { id:11, label: 'News and Politics', value: 'News and Politics' },
        { id:12, label: 'People and Nations', value: 'People and Nations' },
        { id:13, label: 'Pets and Animals', value: 'Pets and Animals' },
        { id:14, label: 'Places and Regions', value: 'Places and Regions' },
        { id:15, label: 'Science and Technology', value: 'Science and Technology' },
        { id:16, label: 'Sport', value: 'Sport' },
        { id:17, label: 'Travel and Events', value: 'Travel and Events' },
        { id:18, label: 'Other', value: 'Other' },
    ]

    useEffect(() => {
        const subscribe = navigation.addListener('focus', () => {
            fetchUserData()
        })
    }, []);

    const fetchUserData = async () => {
        try {
            const user = await getUserData()
            if (user) {
                fetchGroups(user)
                setUserId(user.userData.user_id)
                console.log(user.userData.user_id)
            } else {
                navigation.navigate('Login')
            }
        } catch (error) {
            console.log('Error fetching user accessToken', error.message)
        }
    }

    const createGroup = async () => {
        try {
            if(categoryID == 0) {
                alert('Please first select category.')
            } else {
                const token = await AsyncStorage.getItem('access_token')
                if (token != null) {
                    const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                    const formData = new FormData();
                    formData.append('group_name', groupName);
                    formData.append('group_title', groupUrl);
                    formData.append('about', description);
                    formData.append('group_type', groupType);
                    formData.append('group_sub_category', groupTypeId);
                    formData.append('category', categoryID);
                    formData.append('server_key', serverkey);

                    const response = await onCreateGroupsApi(formData, token)

                    if (response.data.api_status == 200) {
                        // setGroups(response.data)
                        fetchGroups()
                        console.log('this is the created group', response.data)
                        dispatch(createGroups(response.data))
                        setFromVisible(false)
                    } else if (response.data.api_status === 400 || 404) {
                        console.log('error to crateing the group', response.data.errors.error_text)
                        ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
                    }
                } else {
                    console.log('Somthing went wrong', error.message)
                }
            }
        } catch (err) {
            console.log("Get Error::", err)
        }
    }

    const fetchGroups = async () => {
        try {
            setRefreshing(loading ? true : false)
            setLoading(refreshing ? false : true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)

                const response = await onSearchApi(formData, token);
                if (response.data.api_status === 200) {
                    setGroups(response.data.groups)
                    setGroupsData(response.data.groups)
                    setRefreshing(false)
                    setLoading(false)
                    console.log('this is the groups', response.data.groups)
                    dispatch(fetchUserGroups(response.data.groups))
                } else if (response.data.api_status === 400 || 404) {
                    setRefreshing(false)
                    setLoading(false)
                    console.log('Error fetching events', response.data.errors.error_text)
                }
            }
            else {
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

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    }

    const renderGroupData = () => {

        let groupsToDisplay = []

        switch (selectedTab) {
            case 'My Groups':
                groupsToDisplay = groupsdata.filter(item => item.user_id === userId) || []
                break;
            case 'Suggested Groups':
                groupsToDisplay = groupsdata.filter(item => item.user_id !== userId && item.is_joined !== 'yes') || [];
                break;
            case 'Joined Groups':
                groupsToDisplay = groupsdata.filter(item => {
                    return item.user_id === userId || (item.user_id !== userId && item.is_joined === 'yes');
                });
                break;

            default:
                groupsToDisplay = [];
                break;
        }

        if (loading) {
            return (
                <View style={{ flex: 1, marginVertical: hp(30), justifyContent: 'center', alignItems: 'center' }}>
                    <Loader isLoading={true} />
                </View>
            );
        }


        if (groupsToDisplay.length === 0) {
            return (
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                        <MaterialIcons name="event" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No Groups to Show</Text>
                    </View>
                </View>
            )
        }

        return (
            <FlatList
                data={groupsToDisplay}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGroups}
            />
        )

    }

    const renderGroups = ({ item }) => {
        const navigateToEditGroup = () => {
            navigation.navigate('EditGroup', { groupData: item }); // Pass the group data to the EditGroup screen
        };

        if (selectedTab === 'Suggested Groups') {
            displayActionButton = (
                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: COLORS.red, justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 5, }} onPress={() => handleJoinedGroup(item.group_id)}>
                    <AntDesign name='pluscircleo' size={20} color={COLORS.white} />
                    <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>Join</Text>
                </TouchableOpacity>
            )
        } else if (selectedTab === 'My Groups') {
            displayActionButton = (
                <TouchableOpacity onPress={navigateToEditGroup}>
                    <MaterialCommunityicons name="file-document-edit-outline" size={22} color={COLORS.white} style={{ backgroundColor: '#2196f3', borderRadius: 50, padding: 10 }} />
                </TouchableOpacity>
            )
        } else if (selectedTab === 'Joined Groups') {
            displayActionButton = (
                <View>
                    {item.user_id !== userId ? (
                        <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#f77411', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 5, }} onPress={() => handleJoinedGroup(item.group_id)}>
                            <Feather name='check-circle' size={20} color={COLORS.white} />
                            <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>Joined</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            );
        }


        return (
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
                                style={{ height: wp(18), width: wp(18), borderRadius: wp(18), }}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 1, paddingHorizontal: wp(2), width: '80%' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('GroupDetails', { GroupId: item.group_id })}>
                                <Text style={styles.title}>{item.group_title}</Text>
                            </TouchableOpacity>

                            <View style={{ paddingVertical: 3, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.category} numberOfLines={1}>{item.members_count} Members</Text>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: wp(1), alignItems: 'center', justifyContent: 'center' }}>
                            {displayActionButton}
                        </View>
                    </View>
                </View>
            </View>


        )
    }

    const handleJoinedGroup = async (group_id) => {
        try {
            // setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('group_id', group_id);

                const response = await onJoinGroup(formData, token)
                if (response.data.api_status === 200) {
                    ToastAndroid.show(response.data.join_status, ToastAndroid.SHORT)

                    const updatedGroupData = groupsdata.map(item => {
                        if (item.group_id === group_id) {
                            item.is_joined = response.data.join_status === 'joined' ? 'yes' : 'no';
                        }
                        return item;
                    })
                    setGroupsData(updatedGroupData)
                    setLoading(false)
                    // console.log('Your Joined into group', response.data.join_status)
                    // await fetchGroups()
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('error to joined into group', response.data.errors.error_text);
                    ToastAndroid.show('Something went wrong please try again', ToastAndroid.SHORT);
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



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchGroups} />
            } showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={t('groups')} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        {fromVisible === false ? (
                            <View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(5), backgroundColor: global.ContentContainer.backgroundColor, borderRadius: 10, justifyContent: 'space-between' }}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{}}>
                                        <TouchableOpacity
                                            style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'My Groups' ? COLORS.red : global.ContentContainer.backgroundColor }]}
                                            onPress={() => handleTabClick('My Groups')}>
                                            <Text style={{ paddingHorizontal: 10, fontSize: 16, color: '#766b66' }}>{t('my_groups')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'Suggested Groups' ? COLORS.red : global.ContentContainer.backgroundColor }]}
                                            onPress={() => handleTabClick('Suggested Groups')}>
                                            <Text style={{ paddingHorizontal: 10, fontSize: 16, color: '#766b66' }}>{t('suggested_groups')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'Joined Groups' ? COLORS.red : global.ContentContainer.backgroundColor }]}
                                            onPress={() => handleTabClick('Joined Groups')}>
                                            <Text style={{ paddingHorizontal: 10, fontSize: 16, color: '#766b66' }}>{t('joined_group')}</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>

                                <View>
                                    {renderGroupData()}
                                </View>

                            </View>
                        ) : (
                            <View>
                                {/*   <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 25, backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10 }}>
                                    <MaterialIcons name="event" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                    <Text style={{ marginHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>Create New Group</Text>
                                </View> */}

                                <View style={styles.container}>
                                    <View style={styles.ContentContainer}>
                                        <View style={styles.content}>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>{t('group_name')}</Text>
                                                <CustomInput
                                                    keyboardType="default"
                                                    value={groupName}
                                                    onChangeText={text => setGroupName(text)}
                                                />
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

                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>{t('group_type')}</Text>
                                                <View style={styles.dropDownContainer}>
                                                    <Picker
                                                        selectedValue={groupType}
                                                        onValueChange={(itemValue, itemIndex) => [setGroupType(itemValue), itemValue == 'Public' ? setGroupTypeId(1) : setGroupTypeId(2)]}
                                                        style={styles.dropDown} itemStyle={styles.pickerItem}
                                                    >
                                                        <Picker.Item label='Public' value={'Public'} style={styles.lable} />
                                                        <Picker.Item label='Private' value={'Private'} style={styles.lable} />
                                                    </Picker>
                                                </View>
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

                                            <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                                                <TouchableOpacity onPress={toggelFrom}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                                        <Text style={{ padding: 5, fontSize: hp(2.2), color: '#737373', }}>{t('go_back')}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {loading ? (
                                                    <Loader isLoading={loading} />
                                                ) : (
                                                    <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5, }} onPress={createGroup}>
                                                        <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>{t('create')}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

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
                    <Text style={{ fontSize: 24, color: 'white' }}>+</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default Groups;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: hp(1),
        },
        headerView: {
            flex: 0.08,
            width: '100%',
            justifyContent: 'center',
        },
        optionButtonView: {
            borderBottomWidth: 2,
            alignItems: "center",
            justifyContent: 'center',
            height: hp(7)
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
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: hp(2)
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
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: hp(2)
        },
        dropDownContainer: {
            marginTop: hp(2),
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            // marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
            height: hp(5),
            overflow: 'hidden',
        },
        dropDown: {
            width: '100%',
            minHeight: hp(10), // Set minHeight or remove for explicit height
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
        },
        pickerItem: {
            height: hp(5), // Adjust Picker.Item's height
        },
        ContentContainer: {
            // margin: hp(2),
            borderRadius: 10,
            padding: 20,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        inputContainer: {
            marginTop: hp(2),
        },
        lable: {
            fontSize: hp(2.2),
            color: global.text2.color,
            fontWeight: '600',
            marginVertical: 4,
        },
        title: {
            fontSize: hp(2.3),
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.black

        },
        CheckBoxContainer: {
            flexDirection: 'row',
            paddingTop: hp(2),
        },
        checkBoxtext: {
            color: global.text.color,
            fontSize: hp(2.1),
        },
        details: {
            padding: 10
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
            marginHorizontal: wp(2),
        },
    });
};