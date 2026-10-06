/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, RefreshControl, TextInput, StyleSheet, Text, FlatList, TouchableOpacity, View, Modal, Image, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import translations from '../../utils/localization/traslations';
import LinearGradient from 'react-native-linear-gradient';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCreateFunding } from '../../Service/Api';
import { useDispatch, useSelector } from 'react-redux';
import { createFundings } from '../../redux/reducer';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const Funding = () => {
    const {t} = useTranslation();
    const user_data = useSelector(state => state.user_data.user_id);
    console.log(user_data)
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [fundings, setFundings] = useState([])
    const [userFundings, setUserFundings] = useState([])
    const [fromVisible, setFromVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [money, setMoney] = useState('');
    const [selectedImage, setSelectedImage] = useState([]);
    const [fundingImage, setFundingImage] = useState([])
    const [fundingImageType, setFundingImageType] = useState([])
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editMoney, setEditMoney] = useState('');
    const [loading, setLoading] = useState(false)
    const [selectedOption, setSelectedOption] = useState('Browse Funding')
    const [editModel, setEditModel] = useState(false)
    const [editId, setEditId] = useState('')
    const [refreshing, setRefreshing] = useState(false);

    // const [editData, setEditData] = useState(null)

    // console.log(editData)

    const toggelFrom = () => {
        setFromVisible(!fromVisible)
    }

    const toggelEditModel = (id, title, description, image, amount) => {

        setEditId(id)
        setEditTitle(title)
        setEditDescription(description)
        // setSelectedImage(image)
        setEditMoney(amount)
        console.log(id),
            console.log(title),
            console.log(description),
            console.log(image),
            console.log(amount),
            setEditModel(!editModel)
    }

    handleTabClick = (tab) => {
        setSelectedOption(tab)
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
                    setFundingImage(imageData);
                    setFundingImageType(image.mime)
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
    useEffect(() => {
        fetchFundings(null, 'funding')
    }, [])

    const fetchFundings = async (id, type) => {
        try {
            setRefreshing(loading ? true : false)
            setLoading(refreshing ? false : true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('type', type)
                if (type === 'delete') {
                    formData.append('type', 'delete')
                    formData.append('id', id)
                    await fetchFundings(null, 'user_funding')
                }
                if (type === 'edit') {
                    formData.append('id', id)
                    formData.append('type', 'edit')
                    formData.append('title', editTitle)
                    formData.append('description', editDescription)
                    formData.append('amount', editMoney)
                    await fetchFundings(null, 'user_funding')
                }

                const response = await onCreateFunding(formData, token)
                if (response.data.api_status === 200) {
                    if (type === 'user_funding') {
                        setUserFundings(response.data.data)
                    } else if (type === 'funding') {
                        setFundings(response.data.data)
                    }
                    setRefreshing(false)
                    setLoading(false)
                    console.log('all Fundings', response.data)
                    dispatch(createFundings(response.data))
                } else if (response.data.api_status === 400 || 404) {
                    setRefreshing(false)
                    setLoading(false)
                    console.log('error for create funding request', response.data.errors.error_text)
                    ToastAndroid.show('Somthing Went Wrong Please try again', ToastAndroid.SHORT)
                }
            } else {
                setRefreshing(false)
            setLoading(false)
                console.log('Somthing went wrong', error.message)
            }
        } catch (error) {
            setRefreshing(false)
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    const createFunding = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('title', title)
                formData.append('type', 'create')
                // formData.append('type', 'funding')
                formData.append('amount', money)
                formData.append('description', description)
                formData.append('image', fundingImage)


                const response = await onCreateFunding(formData, token)
                if (response.data.api_status === 200) {
                    // setFundings(response.data.data)
                    console.log('Created Fundings', response.data)
                    fetchFundings(null, 'user_funding')
                    dispatch(createFundings(response.data))
                    setLoading(false)
                    setFromVisible(false)
                    // ToastAndroid.show('All Fundings ', ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('error for create funding request', response.data.errors.error_text)
                    ToastAndroid.show('Somthing Went Wrong Please try again', ToastAndroid.SHORT)
                }
            } else {
                setLoading(false)
                console.log('Somthing went wrong', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }



    const isCreateFundingButtonDisabled = !(title && money && description && selectedImage);

    // Function to format the current date as "14 Dec 2023"
    const getCurrentDate = () => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const currentDate = new Date();
        return currentDate.toLocaleDateString(undefined, options);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => fetchFundings(null, selectedOption === 'My Funding Request' ? 'user_funding' : 'funding')} />
            } showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Funding'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <View>
                            {!fromVisible && !editModel && (
                                <View>
                                    <LinearGradient
                                        colors={['#bd1a57', '#cb2635', '#d52e1e']} // Replace these colors with your gradient colors
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{ height: hp(18), padding: hp(3) }}
                                    >
                                        <View style={styles.headingContainer}>
                                            <FontAwesome5 name="hands-helping" size={24} color={COLORS.white} />
                                            <Text style={styles.headingText}>{t('Funding')}</Text>
                                        </View>
                                    </LinearGradient>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(6), backgroundColor: global.ContentContainer.backgroundColor, borderRadius: 10, justifyContent: 'space-between' }}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                                            <TouchableOpacity onPress={() => { fetchFundings(null, 'funding'); handleTabClick('Browse Funding') }} style={[styles.optionButtonView, { borderBottomColor: selectedOption == 'Browse Funding' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                                <Text style={{ paddingHorizontal: 5, fontSize: 16, color: global.text2.color }}>Browser Funding</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { fetchFundings(null, 'user_funding'); handleTabClick('My Funding Request') }} style={[styles.optionButtonView, { borderBottomColor: selectedOption == 'My Funding Request' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                                <Text style={{ paddingHorizontal: 5, fontSize: 16, color: global.text2.color }}>My Funding Requests</Text>
                                            </TouchableOpacity>
                                        </ScrollView>
                                    </View>

                                    <View>
                                        {loading ? (
                                            <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                                <Loader isLoading={loading} />
                                            </View>
                                        ) : (
                                            <>
                                                {selectedOption === 'Browse Funding' && (
                                                    <FlatList
                                                        data={fundings}
                                                        keyExtractor={(item) => item.id.toString()}
                                                        renderItem={({ item }) => (
                                                            <View >
                                                                <View style={{ marginTop: 15, backgroundColor: COLORS.white, marginHorizontal: 15, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, overflow: 'hidden' }}>
                                                                    <TouchableOpacity onPress={() => navigation.navigate('FundingDetails', { FundingData: item })}>
                                                                        <Image source={{ uri: item.image }} style={{ height: hp(26), width: '100%' }} />
                                                                    </TouchableOpacity>
                                                                    <View style={styles.Blogoverlay} />

                                                                    <View style={styles.BlogTextOverlay}>
                                                                        <View>
                                                                            <TouchableOpacity onPress={() => navigation.navigate('FundingDetails', { FundingData: item })}>
                                                                                <Text style={styles.BlogTitle}>{item.title}</Text>
                                                                            </TouchableOpacity>

                                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(1) }}>
                                                                                <Image source={{ uri: item.user_data.avatar }} style={{ height: hp(3.5), width: wp(7), borderRadius: 70 }} />
                                                                                <Text style={styles.overlayBlogText}>{item.user_data.username}</Text>
                                                                                <Text style={styles.overlayBlogText}>{getCurrentDate()}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                    <View style={[styles.AmountDetails,]}>
                                                                        <Text style={styles.AmountDetailsText}>$ {item.raised} Raised of $ {item.amount}</Text>
                                                                        <View style={styles.horizontalLine} />
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )}
                                                        ListEmptyComponent={() => (
                                                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                                                                <FontAwesome5 name="hands-helping" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                                                <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No Funding to Show</Text>
                                                            </View>
                                                        )}
                                                    />
                                                )}

                                                {selectedOption === 'My Funding Request' && (
                                                    <FlatList
                                                        data={userFundings}
                                                        keyExtractor={(item) => item.id.toString()}
                                                        renderItem={({ item }) => (
                                                            <View >
                                                                <View style={{ marginTop: 15, backgroundColor: COLORS.white, marginHorizontal: 15, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, overflow: 'hidden' }}>
                                                                    <TouchableOpacity onPress={() => navigation.navigate('FundingDetails', { FundingData: item })}>
                                                                        <Image source={{ uri: item.image }} style={{ height: hp(26), width: '100%' }} />
                                                                    </TouchableOpacity>
                                                                    <View style={styles.Blogoverlay} />

                                                                    <View style={styles.BlogTextOverlay}>
                                                                        <View>
                                                                            <TouchableOpacity onPress={() => navigation.navigate('FundingDetails', { FundingData: item })}>
                                                                                <Text style={styles.BlogTitle}>{item.title}</Text>
                                                                            </TouchableOpacity>

                                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(1) }}>
                                                                                <Image source={{ uri: item.user_data.avatar }} style={{ height: hp(3.5), width: wp(7), borderRadius: 70 }} />
                                                                                <Text style={styles.overlayBlogText}>{item.user_data.username}</Text>
                                                                                <Text style={styles.overlayBlogText}>{getCurrentDate()}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                    <View style={[styles.AmountDetails,]}>
                                                                        <Text style={styles.AmountDetailsText}>$ {item.raised} Raised of $ {item.amount}</Text>
                                                                        <View style={styles.horizontalLine} />
                                                                    </View>
                                                                    <View style={{
                                                                        flexDirection: 'row',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        marginVertical: hp(2),
                                                                        marginBottom: hp(1)
                                                                    }}>
                                                                        <TouchableOpacity style={{
                                                                            flexDirection: 'row',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            backgroundColor: '#f7e5e5',
                                                                            borderRadius: 8,
                                                                            padding: 8,
                                                                            paddingHorizontal: wp(4),
                                                                            marginHorizontal: 5
                                                                        }} onPress={() => { toggelEditModel(item.id, item.title, item.description, item.image, item.amount) }}>
                                                                            <Feather name="edit-2" size={18} color={COLORS.red} />
                                                                            <Text style={{
                                                                                color: COLORS.red,
                                                                                fontFamily: fontFamily.FONTS.regular,
                                                                                fontSize: hp(2.2)
                                                                            }}>Edit Event</Text>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity style={{
                                                                            flexDirection: 'row',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            backgroundColor: '#f7e5e5',
                                                                            borderRadius: 8,
                                                                            padding: 8,
                                                                            paddingHorizontal: wp(4),
                                                                            marginHorizontal: 5
                                                                        }} onPress={() => fetchFundings(item.id, 'delete')} >
                                                                            <MaterialCommunityIcons name="delete" size={20} color={COLORS.red} />
                                                                            <Text style={{
                                                                                color: COLORS.red,
                                                                                fontFamily: fontFamily.FONTS.regular,
                                                                                fontSize: hp(2.2)
                                                                            }}>Delete</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )}
                                                        ListEmptyComponent={() => (
                                                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                                                                <FontAwesome5 name="hands-helping" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                                                <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No Funding to Show</Text>
                                                            </View>
                                                        )}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </View>

                                </View>
                            )}
                            {fromVisible && !editModel(
                                <View>
                                    {/**  <View style={styles.albumsContainer}>
                                            <FontAwesome5 name="hands-helping" size={20} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 5 }} />
                                            <Text style={styles.albumsText}>Create new funding request</Text>
                                        </View>  */}

                                    <View style={styles.container}>
                                        <View style={styles.ContentContainer}>
                                            <View style={styles.content}>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>{t('Title')}</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        value={title}
                                                        onChangeText={text => setTitle(text)}
                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>{t('How_much_money_you_would_like_to_receive')}</Text>
                                                    <CustomInput
                                                        keyboardType="numeric"
                                                        value={money}
                                                        onChangeText={text => setMoney(text)}
                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>{t('description')}</Text>
                                                    <TextInput
                                                        keyboardType="default"
                                                        multiline={true}
                                                        numberOfLines={7}
                                                        value={description}
                                                        onChangeText={text => setDescription(text)}
                                                        style={styles.descriptionInput}
                                                        textAlignVertical="top"
                                                    />
                                                </View>
                                                {/* Image selection */}
                                                {/* <View style={styles.inputContainer}>
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
                                                </View> */}
                                                <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                                                    <TouchableOpacity onPress={toggelFrom}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                                            <Text style={{ padding: 5, fontSize: 16, color: '#737373', }}>{t('go_back')}</Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={{
                                                        height: hp(4.8),
                                                        width: wp(38),
                                                        backgroundColor: COLORS.red,
                                                        // borderColor: COLORS.black,
                                                        // borderWidth: 2,
                                                        borderRadius: 12,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }} onPress={createFunding} disabled={isCreateFundingButtonDisabled}>
                                                        {loading ? (
                                                            <Loader isLoading={loading} color='white' />
                                                        ) : (
                                                            <Text style={{ paddingHorizontal: wp(10), fontSize: 17, color: COLORS.white }}>{t('publish')}</Text>
                                                        )}
                                                    </TouchableOpacity>

                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {editModel && (
                                <View>
                                    <View style={styles.container}>
                                        <View style={styles.ContentContainer}>
                                            <View style={styles.content}>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>{t('Title')}</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        value={editTitle}
                                                        onChangeText={text => setEditTitle(text)}
                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>{t('How_much_money_you_would_like_to_receive')}</Text>
                                                    <CustomInput
                                                        keyboardType="numeric"
                                                        value={editMoney}
                                                        onChangeText={text => setEditMoney(text)}
                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>{t('description')}</Text>
                                                    <TextInput
                                                        keyboardType="default"
                                                        multiline={true}
                                                        numberOfLines={7}
                                                        value={editDescription}
                                                        onChangeText={text => setEditDescription(text)}
                                                        style={styles.descriptionInput}
                                                        textAlignVertical="top"
                                                    />
                                                </View>
                                                {/* Image selection */}
                                                {/* <View style={styles.inputContainer}>
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
                                                </View> */}
                                                <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                                                    <TouchableOpacity onPress={toggelEditModel}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                                            <Text style={{ padding: 5, fontSize: 16, color: '#737373', }}>{t('go_back')}</Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={{
                                                        height: hp(4.8),
                                                        width: wp(38),
                                                        backgroundColor: COLORS.red,
                                                        // borderColor: COLORS.black,
                                                        // borderWidth: 2,
                                                        borderRadius: 12,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }} onPress={() => { fetchFundings(editId, 'edit') }}>
                                                        {loading ? (
                                                            <Loader isLoading={loading} color='white' />
                                                        ) : (
                                                            <Text style={{ paddingHorizontal: wp(10), fontSize: 17, color: COLORS.white }}>{t('publish')}</Text>
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
                    <Text style={{ fontSize: 24, color: 'white' }}>+</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default Funding;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: 20,
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
        emptyMessage: {
            // margin: 10,
            borderRadius: 10,
            padding: 20,
        },
        inputContainer: {
            marginTop: 10,
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
        lable: {
            fontSize: wp(4),
            fontFamily: fontFamily.FONTS.Medium,
            color: global.text2.color,
            // fontWeight: '600',
            marginVertical: 4,
        },
        CheckBoxContainer: {
            flexDirection: 'row',
            paddingTop: 10,
        },
        checkBoxtext: {
            color: global.text2.color,
            fontSize: 15,
        },
        albumsContainer: {
            padding: 10,
            paddingHorizontal: 15,
            marginTop: 25,
            flexDirection: 'row',
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            alignItems: 'center',
            borderRadius: 10,
        },
        headingContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp(3)
        },
        BlogTextOverlay: {
            padding: 10
        },
        BlogTitle: {
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: 18,
            color: COLORS.black,
            paddingVertical: 4
        },
        overlayBlogText: {
            fontFamily: fontFamily.FONTS.regular,
            fontSize: 15,
            paddingHorizontal: wp(2),
            color: COLORS.secondaryGray
        },
        AmountDetails: {
            backgroundColor: '#f8fafb',
            padding: 10
        },
        AmountDetailsText: {
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: 15,
            color: COLORS.black
        },
        albumsText: {
            marginHorizontal: 10,
            fontSize: 18,
            color: global.text2.color
        },
        headingText: {
            marginHorizontal: 10,
            fontSize: hp(4),
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.white
        },
        horizontalLine: {
            borderRadius: 2,
            borderBottomColor: '#eaebec',
            borderBottomWidth: 6,
            padding: 5,
            marginHorizontal: 15,
        },
        horizontalLine2: {
            borderBottomColor: '#eaebec',
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15,
        },
    });
};