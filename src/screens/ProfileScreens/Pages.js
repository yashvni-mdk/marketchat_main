/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, FlatList, RefreshControl, ToastAndroid, StyleSheet, Text, TouchableOpacity, View, Modal, Image, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import { Picker } from '@react-native-picker/picker';
import translations from '../../utils/localization/traslations';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import { useSelector } from 'react-redux';
import fontFamily from '../../../constants/fontFamily';
import { getUserData } from '../../utils/localization/Storage';
import { onCreatePageApi, onFetchGroups, onLikePage, onSearchApi } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPages, fetchAllPage } from '../../redux/reducer';
import { useDispatch } from 'react-redux';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import { Platform } from 'react-native';
import {useTranslation} from 'react-i18next';

const Pages = () => {
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

    const [pagesData, setPagesData] = useState([])
    const [pages, setPages] = useState([])
    const [userId, setUserId] = useState('');
    const [fromVisible, setFromVisible] = useState(false);
    const [pageName, setPageName] = useState('');
    const [pageUrl, setPageUrl] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryID, setCategoryID] = useState(null)
    const [pageDescription, setPageDescription] = useState('');
    const [selectedTab, setSelectedTab] = useState('My Pages');
    const [loading, setLoading] = useState(false)
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
        const subscribe = navigation.addListener('focus', () =>{
            fetchUserData()
        })
    }, []);

    const fetchUserData = async () => {
        try {
            const user = await getUserData()
            if (user) {
                fetchPages(user)
                setUserId(user.userData.user_id)
                console.log(user.userData.user_id)
            } else {
                navigation.navigate('Login')
            }
        } catch (error) {
            console.log('Error fetching user accessToken', error.message)
        }
    }


    const createPage = async () => {
        try {
            if(categoryID == 0) {
                alert('Please first select category.')
            } else {
                setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('page_name', pageName);
                formData.append('page_title', pageUrl);
                formData.append('page_description', pageDescription);
                formData.append('page_category', categoryID);
                formData.append('server_key', serverkey);

                const response = await onCreatePageApi(formData, token)

                if (response.data.api_status == 200) {
                    fetchPages()
                    // setPages(response.data)
                    console.log('this is the created page', response.data)
                    setLoading(false)
                    setFromVisible(false)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('error to crateing the page', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
                }
            } else {
                setLoading(false)
                console.log('Somthing went wrong', error.message)
            }
            }
            
        } catch (err) {
            setLoading(false)
            console.log("Get Error::", err)
        }
    }

    const fetchPages = async () => {
        try {
            setRefreshing(loading ? true : false)
            setLoading(refreshing ? false : true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData()
                formData.append('server_key', serverkey)

                const response = await onSearchApi(formData, token)
                if (response.data.api_status === 200) {
                    setPages(response.data.pages)
                    setPagesData(response.data.pages)
                    setRefreshing(false)
                    setLoading(false)
                    console.log('this is the pages', response.data.pages)
                    dispatch(fetchAllPage(response.data.pages))
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

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    }

    const renderPageData = () => {
        let pagesToDisplay = []

        if (loading) {
            return (
                <View style={{ flex: 1, marginVertical: hp(30), justifyContent: 'center', alignItems: 'center' }}>
                    <Loader isLoading={true} />
                </View>
            );
        }

        switch (selectedTab) {
            case 'My Pages':
                pagesToDisplay = pagesData.filter(item => item.user_id === userId) || []
                break;
            case 'Suggested Pages':
                pagesToDisplay = pagesData.filter(item => item.user_id !== userId && item.is_liked !== 'yes') || [];
                break;
            case 'Liked Pages':
                pagesToDisplay = pagesData.filter(item => item.user_id !== userId && item.is_liked === 'yes') || [];
                break;
            default:
                pagesToDisplay = [];
                break;
        }



        if (pagesToDisplay.length === 0) {
            return (
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                        <MaterialIcons name="event" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No Pages to Display</Text>
                    </View>
                </View>
            )
        }

        return (
            <FlatList
                data={pagesToDisplay}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderAllPages}
            />
        )

    }

    const renderAllPages = ({ item }) => {
        const navigateToEditGroup = () => {
            navigation.navigate('EditPages', { pageData: item }); // Pass the page data to the Editpage screen
        };

        const userMatches = item.user_id === userId;
        let displayActionButton;

        if (selectedTab === 'Suggested Pages' && !userMatches) {
            displayActionButton = (
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 6, borderRadius: 5, backgroundColor: item.is_liked === 'yes' ? '#f8842f' : COLORS.red, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleLikepages(item.page_id)}>
                    <AntDesign name="like2" size={20} color={COLORS.white} />
                    <Text style={{ color: COLORS.white, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), paddingHorizontal: 5 }}>Like</Text>
                </TouchableOpacity>
            );
        } else if (selectedTab === 'My Pages' && userMatches) {
            displayActionButton = (
                <TouchableOpacity onPress={navigateToEditGroup}>
                    <MaterialCommunityIcons name="file-document-edit-outline" size={22} color={COLORS.white} style={{ backgroundColor: '#2196f3', borderRadius: 50, padding: 10 }} />
                </TouchableOpacity>
            );
        } else if (selectedTab === 'Liked Pages' && !userMatches && item.is_liked === 'yes') {
            displayActionButton = (
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 6, borderRadius: 5, backgroundColor: item.is_liked === 'yes' ? '#f8842f' : COLORS.red, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleLikepages(item.page_id)}>
                    <AntDesign name="like2" size={20} color={COLORS.white} />
                    <Text style={{ color: COLORS.white, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), paddingHorizontal: 5 }}>Liked</Text>
                </TouchableOpacity>
            );
        } else {
            displayActionButton = null;
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
                        <TouchableOpacity onPress={() => navigation.navigate('PageDetails', { PageId: item.page_id })}>
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ height: wp(18), width: wp(18), borderRadius: wp(18), }}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 1, paddingHorizontal: wp(2), width: '80%' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('PageDetails', { PageId: item.page_id })}>
                                <Text style={styles.title}>{item.page_name}</Text>
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
                        <View style={{ paddingHorizontal: wp(1), alignItems: 'center', justifyContent: 'center' }}>
                            {displayActionButton}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const handleLikepages = async (pageId) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('page_id', pageId);

                const response = await onLikePage(formData, token)
                if (response.data.api_status === 200) {
                    ToastAndroid.show(response.data.like_status, ToastAndroid.SHORT)
                    // Update the state or trigger a re-render based on the like_status
                    const updatedPagesData = pagesData.map(item => {
                        if (item.page_id === pageId) {
                            item.is_liked = response.data.like_status === 'liked' ? 'yes' : 'no';
                        }
                        return item;
                    });
                    setPagesData(updatedPagesData);
                } else if (response.data.api_status === 400 || 404) {
                    ToastAndroid.show(response.data.errors.error_text)
                }
            } else {
                console.log('User Token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchPages} />
            } showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={t('pages')} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        {fromVisible === false ? (
                            <View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(5), backgroundColor: global.ContentContainer.backgroundColor, borderRadius: wp(2), justifyContent: 'space-between' }}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                                        <TouchableOpacity onPress={() => handleTabClick('My Pages')} style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'My Pages' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                            <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.2), color: global.text2.color, }}>{t('my_pages')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleTabClick('Suggested Pages')} style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'Suggested Pages' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                            <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.2), color: global.text2.color, }}>{t('suggested_pages')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleTabClick('Liked Pages')} style={[styles.optionButtonView, { borderBottomColor: selectedTab == 'Liked Pages' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                            <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.2), color: global.text2.color, }}>{t('liked_page')}</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>

                                <View style={{ marginVertical: hp(2) }}>
                                    {renderPageData()}
                                </View>

                            </View>
                        ) : (
                            <View>
                                <View style={styles.container}>
                                    <View style={styles.ContentContainer}>
                                        <View style={styles.content}>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>{t('page_name')}</Text>
                                                <CustomInput
                                                    keyboardType="default"
                                                    value={pageName}
                                                    onChangeText={text => setPageName(text)}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>{t('group_url')}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ padding: 13, backgroundColor: '#eeeeee', color: '#766b66', borderRadius: 2 }}>https://marketchat.in/</Text>
                                                    <TextInput
                                                        keyboardType="default"
                                                        value={pageUrl}
                                                        onChangeText={text => setPageUrl(text)}
                                                        style={styles.customInput}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>{t('page_category')}</Text>
                                                <View style={styles.dropDownContainer}>
                                                    <Picker
                                                        selectedValue={selectedCategory}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            const category = Categories[itemIndex];
                                                            setSelectedCategory(itemValue);
                                                            setCategoryID(category.id);
                                                        }
                                                        }
                                                        style={styles.dropDown} itemStyle={styles.pickerItem}
                                                    >
                                                        {Categories.map((category, index) => (
                                                            <Picker.Item key={index} label={category.label} value={category.value} />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>{t('page_description')}</Text>
                                                <TextInput
                                                    keyboardType="default"
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    value={pageDescription}
                                                    onChangeText={text => setPageDescription(text)}
                                                    style={styles.descriptionInput}
                                                    textAlignVertical="top"
                                                />
                                            </View>

                                            <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                                                <TouchableOpacity onPress={toggelFrom}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                                        <Text style={{ padding: 5, fontSize: hp(2.2), color: '#737373', }}>{t('go_back')}</Text>
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
                                                    }} onPress={createPage}>
                                                        {loading ? (
                                                            <Loader isLoading={loading} color='white' />
                                                        ) : (
                                                            <View>
                                                                <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>{t('create')}</Text>
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
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

export default Pages;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: hp(1),
        },
        optionButtonView: {
            borderBottomWidth: 2,
            paddingHorizontal: wp(1),
            alignItems: "center",
            justifyContent: 'center',
            height: hp(7)
        },
        ContentContainer: {
            // margin: 10,
            borderRadius: 10,
            padding: 20,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        customInput: {
            width: '50%',
            height: 48,
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: 'center',
        },
        inputText: {
            color: global.inputText.color
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
        CheckBoxContainer: {
            flexDirection: 'row',
            paddingTop: 10,
        },
        checkBoxtext: {
            color: global.text.color,
            fontSize: hp(2.1),
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
        details: {
            // paddingTop: hp(4),
            justifyContent: 'center',
            alignItems: 'center'
        },
        dropDown: {
            width: '100%',
            minHeight: 40, // Set minHeight or remove for explicit height
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
        },
        imageContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: wp(2),
        },
        horizontalLine: {
            borderBottomColor: '#eaebec',
            borderBottomWidth: 0.5,
            padding: 5,
            marginHorizontal: 15,
        },
    });
};