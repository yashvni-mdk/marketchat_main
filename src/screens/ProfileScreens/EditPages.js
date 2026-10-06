import { SafeAreaView, ScrollView, StyleSheet, Text, FlatList, ImageBackground, ToastAndroid, TextInput, TouchableOpacity, View, Modal, Image } from 'react-native';
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
import Octicons from 'react-native-vector-icons/Octicons'
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
import CheckBox from '../../components/CheckBox';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../../utils/localization/Storage';
import { onDeletePage, onUpdatedPageApi, onSearchApi } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { fetchAllPage } from '../../redux/reducer';
import {useTranslation} from 'react-i18next';

const EditPages = ({ route }) => {
    const {t} = useTranslation();
    const { pageData } = route.params;
    console.log('Page Data for edit', pageData)
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }, { value: 70 }, { value: 70 }]

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [pages, setPages] = useState([])

    // General Setting States
    const [pageName, setPageName] = useState(pageData?.page_title);
    const [selectedCategory, setSelectedCategory] = useState(pageData?.category);
    const [categoryID, setCategoryID] = useState(null)
    const [pageUrl, setPageUrl] = useState(pageData?.page_name);
    const [callToAction, setCallToAction] = useState('');
    const [callToActionId, setCallActionId] = useState(null);
    const [callToTarget, setCallToTarget] = useState('');
    const [isEnable, setIsEnable] = useState(false)
    const [isDisable, setIsDisable] = useState(true)
    const [verificationRequestStatus, setVerificationRequestStatus] = useState();

    // page Information States 
    const [company, setCompany] = useState(pageData?.company || '');
    const [phone, setPhone] = useState(pageData?.phone || '');
    const [location, setLocation] = useState(pageData?.address || '');
    const [website, setWebsite] = useState(pageData?.website || '');
    const [about, setAbout] = useState(pageData?.about || '');

    //social links States
    const [facebook, setFacebook] = useState(pageData?.facebook || '')
    const [twitter, setTwitter] = useState(pageData?.twitter || '')
    const [instagram, setInstagram] = useState(pageData?.instagram || '')
    const [vkontakte, setVkontakte] = useState(pageData?.vk || '')
    const [linkedin, setLinkedin] = useState(pageData?.linkedin || '')
    const [youtube, setYouTube] = useState(pageData?.youtube || '')

    //Avatar & Cover States
    const [coverImage, setCoverImage] = useState(null);
    const [coverImageType, setCoverImageType] = useState(null);
    const [avatar, setAvatar] = useState(null)
    const [avatarType, setAvatarType] = useState(null)

    //Design States
    const [background, setBackground] = useState(null)
    const [backgroundType, setBackgroundType] = useState(null)

    //Delete States
    const [password, setPassword] = useState('')

    const [selectedSection, setSelectedSection] = useState('GeneralSetting'); // State to manage the selected section

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

    const Action = [
        { id: 0, label: 'Read More', value: 'Read More' },
        { id: 1, label: 'Shop More', value: 'Shop More' },
        { id: 2, label: 'View More', value: 'View More' },
        { id: 2, label: 'Vist now', value: 'Vist now' },
        { id: 3, label: 'Book now', value: 'Book now' },
        { id: 4, label: 'Learn More', value: 'Learn More' },
        { id: 5, label: 'Play More', value: 'Play More' },
        { id: 6, label: 'Bet More', value: 'Bet More' },
        { id: 7, label: 'Donate', value: 'Donate' },
        { id: 8, label: 'Apply here', value: 'Apply here' },
        { id: 9, label: 'Quote here', value: 'Quote here' },
        { id: 10, label: 'Order now', value: 'Order now' },
        { id: 11, label: 'Book tickets', value: 'Book tickets' },
        { id: 12, label: 'Enroll now', value: 'Enroll now' },
        { id: 13, label: 'Find a card', value: 'Find a card' },
        { id: 14, label: 'Get a quote', value: 'Get a quote' },
        { id: 15, label: 'Locate a dealer', value: 'Locate a dealer' },
        { id: 16, label: 'Order online', value: 'Order online' },
        { id: 17, label: 'Preorder now', value: 'Preorder now' },
        { id: 18, label: 'Schedule now', value: 'Schedule now' },
        { id: 19, label: 'Sign up now', value: 'Sign up now' },
        { id: 20, label: 'Subscribe', value: 'Subscribe' },
        { id: 21, label: 'Register now', value: 'Register now' },

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

    // Function to open image picker for selecting from gallery
    const openBackgroundImagePicker = async () => {
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
                    setBackground(imageData);
                    setBackgroundType(image.mime)

                    console.log('Selected image:', background);
                }
            } else {
                console.log('No image selected');
            }
        } catch (error) {
            console.log('Error selecting image:', error);
        }
    };


    const [loading, setLoading] = useState(false)

    const fetchPages = async () => {
        try {
            // setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData()
                formData.append('server_key', serverkey)

                const response = await onSearchApi(formData, token)
                if (response.data.api_status === 200) {
                    setPages(response.data.pages)
                    // setPagesData(response.data.pages)
                    console.log('this is the pages', response.data.pages)
                    dispatch(fetchAllPage(response.data.pages))
                } else if (response.data.api_status === 400 || 404) {
                    console.log('Error fetching events', response.data.errors.error_text)
                }
            } else {
                console.log('Token not found', error.message)
            }
        } catch (err) {
            console.log("Get Error::", err)
        }
    }


    const updatePage = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('page_id', pageData.page_id)
                if (pageUrl !== pageData.page_name) {
                    formData.append('page_name', pageUrl || pageData.page_name)
                }
                if (categoryID !== pageData.page_category) {
                    formData.append('page_category', categoryID || pageData.category)
                }
                if (pageName !== pageData.page_title) {
                    formData.append('page_title', pageName || pageData.page_title)
                }
                if (callToActionId !== pageData.call_action_type) {
                    formData.append('call_action_type', callToActionId || pageData.call_action_type)
                }
                if (callToTarget !== pageData.call_action_type_url) {
                    formData.append('call_action_type_url', callToTarget || pageData.call_action_type_url)
                }
                if (about !== pageData.about) {
                    formData.append('page_description', about || pageData.about)
                }
                if (avatar && avatar.uri !== pageData.avatar) {
                    formData.append('avatar', avatar, avatarType || pageData.avatar)
                }
                if (coverImage && coverImage.uri !== pageData.cover) {
                    formData.append('cover', coverImage, coverImageType || pageData.coverImage)
                }


                // if (verificationRequestStatus !== pageData.verified) {
                //     formData.append('verified', verificationRequestStatus || pageData.verificationRequestStatus)
                // }
                if (company !== pageData.company) {
                    formData.append('company', company || pageData.company);
                }
                if (phone !== pageData.phone) {
                    formData.append('phone', phone || pageData.phone);
                }
                if (location !== pageData.address) {
                    formData.append('address', location || pageData.location);
                }
                if (website !== pageData.website) {
                    formData.append('website', website || pageData.website);
                }
                if (facebook !== pageData.facebook) {
                    formData.append('facebook', facebook || pageData.facebook);
                }
                if (twitter !== pageData.twitter) {
                    formData.append('twitter', twitter || pageData.twitter);
                }
                if (instagram !== pageData.instagram) {
                    formData.append('instgram', instagram || pageData.instagram);
                }
                if (vkontakte !== pageData.vk) {
                    formData.append('vk', vkontakte || pageData.vk);
                }
                if (linkedin !== pageData.linkedin) {
                    formData.append('linkedin', linkedin || pageData.linkedin);
                }
                if (youtube !== pageData.youtube) {
                    formData.append('youtube', youtube || pageData.youtube);
                }
                if (background && background !== pageData.background_image) {
                    formData.append('background_image', background || pageData.background_image);
                }
                formData.append('server_key', serverkey);

                const response = await onUpdatedPageApi(formData, token);
                if (response.data.api_status === 200) {
                    setLoading(false)
                    console.log('this is the updated page Data', response.data.message)
                    ToastAndroid.show(response.data.message, ToastAndroid.SHORT)
                    await fetchPages()
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('Error Updateing the page data', response.data.errors)
                    ToastAndroid.show('somthing went wrong', ToastAndroid.SHORT)
                }
            } else {
                setLoading(false)
                console.log('token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log("get Error", error)
        }
    }

    const deleteGroup = async (page_id) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('page_id', page_id)
                formData.append('password', password)

                const response = await onDeletePage(formData, token)
                if (response.data.api_status === 200) {
                    ToastAndroid.show('Page deleted ', ToastAndroid.SHORT)
                    setLoading(false)
                    navigation.navigate('Pages')
                    fetchPages()
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

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Edit Page'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, marginTop: 25, backgroundColor: '#f79f58', marginHorizontal: 6, borderRadius: 10, justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => setSelectedSection('GeneralSetting')}>
                                <Ionicons name="settings-outline" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedSection('PageInformation')}>
                                <MaterialIcons name="flag" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedSection('SocialLInks')}>
                                <Feather name="facebook" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedSection('Avatar&Cover')} >
                                <Ionicons name="image-outline" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedSection('Design')} >
                                <Octicons name="paintbrush" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedSection('Admin')}>
                                <Feather name="user-check" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedSection('Likes')}>
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
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginTop: hp(2), marginBottom: hp(2) }}>
                                            <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>General Setting</Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Page name</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                value={pageName}
                                                onChangeText={text => setPageName(text)}
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
                                            <Text style={styles.lable}>Page URL</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={{ padding: 13, backgroundColor: '#eeeeee', color: '#766b66', borderRadius: 2 }}>https://marketchat.in/</Text>
                                                <TextInput
                                                    keyboardType="default"
                                                    value={pageUrl || pageData.page_name || ''}
                                                    onChangeText={text => setPageUrl(text)}
                                                    style={styles.customInput}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Call to action</Text>
                                            <View style={styles.dropDownContainer}>
                                                <Picker
                                                    selectedValue={callToAction}
                                                    onValueChange={(itemValue, itemIndex) => {
                                                        const selectedAction = Action[itemIndex];
                                                        setCallToAction(itemValue)
                                                        setCallActionId(selectedAction.id)
                                                    }
                                                    }
                                                    style={styles.dropDown} itemStyle={styles.pickerItem}
                                                >
                                                    {Action.map((action, index) => (
                                                        <Picker.Item key={action.id} label={action.label} value={action.value} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Call to target url</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                value={callToTarget || pageData.call_action_type_url || ''}
                                                onChangeText={text => setCallToTarget(text)}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Users can post on my page</Text>
                                            <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <CheckBox
                                                        isChecked={isEnable}
                                                        handleCheck={() => {setIsEnable(!isEnable), setIsDisable(!isDisable)}}
                                                    />
                                                    <Text style={styles.checkBoxtext}>Enable</Text>

                                                    <View style={{ flexDirection: 'row', marginHorizontal: 14 }}>
                                                        <CheckBox
                                                            isChecked={isDisable}
                                                            handleCheck={() => {setIsDisable(!isDisable), setIsEnable(!isEnable)}}
                                                        />
                                                        <Text style={styles.checkBoxtext}>Disable</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>verification</Text>
                                            <View style={{ flexDirection: 'row', paddingTop: hp(1), borderRadius: 10, }}>
                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        backgroundColor:
                                                            verificationRequestStatus === 'pending'
                                                                ? COLORS.red
                                                                : '#5cb85c',
                                                        borderRadius: 5,
                                                        padding: 5,
                                                    }}
                                                    onPress={() => {
                                                        // Toggle verification status on button press
                                                        if (verificationRequestStatus !== 'pending') {
                                                            setVerificationRequestStatus('pending');
                                                        } else {
                                                            setVerificationRequestStatus(null); // Change 'pending' to 'null' or any other initial state
                                                        }
                                                    }}
                                                >
                                                    {verificationRequestStatus === 'pending' ? (
                                                        <MaterialIcons
                                                            name="watch-later"
                                                            size={20}
                                                            color={COLORS.white}
                                                            style={{ marginRight: 6 }}
                                                        />
                                                    ) : (
                                                        <MaterialIcons
                                                            name="verified"
                                                            size={20}
                                                            color={COLORS.white}
                                                            style={{ marginRight: 6 }}
                                                        />
                                                    )}
                                                    <Text
                                                        style={{
                                                            paddingHorizontal: 6,
                                                            fontSize: hp(2.3),
                                                            color: COLORS.white,
                                                        }}
                                                    >
                                                        {verificationRequestStatus === 'pending'
                                                            ? 'Pending'
                                                            : 'Request'}
                                                    </Text>
                                                </TouchableOpacity>
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
                                            }} onPress={updatePage}>
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

                        {/* Page Information */}
                        {selectedSection === 'PageInformation' && (
                            <View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginTop: hp(2), marginBottom: hp(2) }}>
                                            <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>Privacy Setting</Text>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Company</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                value={company}
                                                onChangeText={text => setCompany(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Phone</Text>
                                            <CustomInput
                                                keyboardType="numeric"
                                                value={phone}
                                                onChangeText={text => setPhone(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Location</Text>
                                            <CustomInput
                                                placeholder="Enter a location"
                                                placeholderTextColor={COLORS.secondaryGray}
                                                keyboardType="default"
                                                value={location}
                                                onChangeText={text => setLocation(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Website</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                value={website}
                                                onChangeText={text => setWebsite(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>About</Text>
                                            <TextInput
                                                keyboardType="default"
                                                multiline={true}
                                                numberOfLines={5}
                                                value={about}
                                                onChangeText={text => setAbout(text)}
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
                                            }} onPress={updatePage}>
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


                        {/* Social Links */}
                        {selectedSection === 'SocialLInks' && (
                            < View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginTop: hp(2), marginBottom: hp(2) }}>
                                            <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>SocialLInks</Text>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Facebook</Text>
                                            <CustomInput
                                                placeholder="Username"
                                                placeholderTextColor={COLORS.secondaryGray}
                                                keyboardType="default"
                                                value={facebook}
                                                onChangeText={text => setFacebook(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Twitter</Text>
                                            <CustomInput
                                                placeholder="Username"
                                                placeholderTextColor={COLORS.secondaryGray}
                                                keyboardType="default"
                                                value={twitter}
                                                onChangeText={text => setTwitter(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Instagram</Text>
                                            <CustomInput
                                                placeholder="Username"
                                                placeholderTextColor={COLORS.secondaryGray}
                                                keyboardType="default"
                                                value={instagram}
                                                onChangeText={text => setInstagram(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Vkontakte</Text>
                                            <CustomInput
                                                placeholder="Username"
                                                placeholderTextColor={COLORS.secondaryGray}
                                                keyboardType="default"
                                                value={vkontakte}
                                                onChangeText={text => setVkontakte(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Linkedin</Text>
                                            <CustomInput
                                                placeholder="Username"
                                                placeholderTextColor={COLORS.secondaryGray}
                                                keyboardType="default"
                                                value={linkedin}
                                                onChangeText={text => setLinkedin(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>YouTube</Text>
                                            <CustomInput
                                                placeholder="Username"
                                                placeholderTextColor={COLORS.secondaryGray}
                                                keyboardType="default"
                                                value={youtube}
                                                onChangeText={text => setYouTube(text)}
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
                                            }} onPress={updatePage}>
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
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginTop: hp(2), }}>
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
                                        }} onPress={updatePage}>
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

                        {/* Design */}
                        {selectedSection === 'Design' && (
                            <View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginTop: hp(2), marginBottom: hp(2) }}>
                                            <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>Design</Text>
                                        </View>


                                        {/* Image selection */}
                                        <View style={styles.DesignImageContainer}>
                                            <Text style={styles.label}>Background</Text>
                                            <TouchableOpacity onPress={openBackgroundImagePicker} style={styles.DesignImagePicker}>
                                                {background && background.uri ? (
                                                    <Image
                                                        source={{ uri: background.uri }}
                                                        style={styles.backgroundImage}
                                                    />
                                                ) : (
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                                        <Feather name='image' size={30} color={COLORS.secondaryGray} />
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>


                                        <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(5), marginHorizontal: wp(2), borderRadius: wp(2), justifyContent: 'space-evenly' }}>
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
                                            }} onPress={updatePage}>
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

                        {/* Admin */}
                        {selectedSection === 'Admin' && (
                            <View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', marginTop: hp(2), alignItems: 'center', borderRadius: 10, marginBottom: hp(2) }}>
                                            <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: global.text2.color, }}>Members</Text>
                                        </View>
                                        <View>

                                            <View style={{ margin: hp(4), justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                                                <MaterialIcons name="group" size={26} color={COLORS.white} style={{ backgroundColor: '#8fa4ae', borderRadius: 50, padding: 15 }} />
                                                <Text style={{ paddingTop: 25, fontSize: hp(2.2) }}>No members to show</Text>
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            </View>

                        )}

                        {selectedSection === 'Likes' && (
                            <View style={styles.container}>
                                <View style={{
                                    // margin: 10,
                                    height: 'auto',
                                    marginHorizontal: wp(4),
                                    borderBottomRightRadius: 10,
                                    borderBottomLeftRadius: 10,
                                    backgroundColor: global.ContentContainer.backgroundColor,
                                }}>
                                    <View style={{ paddingTop: hp(3), flexDirection: 'row', paddingHorizontal: 10, marginTop: hp(2), alignItems: 'center', borderRadius: 10, marginBottom: hp(2) }}>
                                        <Feather name="tool" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                        <Text style={{ paddingHorizontal: 10, fontSize: hp(2.4), fontFamily: fontFamily.FONTS.Medium, color: '#5ab55d' }}>({pages?.likes_count}) Total Likes</Text>
                                    </View>
                                    <LineChart data={data} />
                                </View>
                            </View>
                        )}


                        {/* Delete Group */}
                        {selectedSection === 'DeleteGroup' && (
                            <View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginTop: hp(2), marginBottom: hp(2) }}>
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
                                            }} onPress={() => deleteGroup(pageData.page_id)}>
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

export default EditPages

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            // marginTop: 20,
        },
        imageContainer: {
            // marginTop: hp(3),
            height: hp(40),
            width: wp(75),
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
        DesignImageContainer: {
            marginTop: hp(2),
            marginHorizontal: wp(2),
            width: '60%'
        },
        DesignImagePicker: {
            width: '100%',
            height: hp(25),
            // marginHorizontal: 15,
            // backgroundColor: '#eaeaea',
            borderStyle: 'dashed',
            borderWidth: 1.1,
            color: global.inputText.color,
            borderColor: COLORS.gray,
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
            fontSize: hp(2.2),
            fontfamily: fontFamily.FONTS.regular,
            color: COLORS.green
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
        CheckBoxContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
        },
        checkBoxtext: {
            color: global.text.color,
            paddingLeft: 10
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15,
        },


    })
}