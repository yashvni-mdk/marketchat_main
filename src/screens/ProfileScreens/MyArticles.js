import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View, Modal, FlatList, Image, ToastAndroid } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Materialicons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Footer from '../../components/Footer';
import translations from '../../utils/localization/traslations';
import { getUserData } from '../../utils/localization/Storage';
import { useDispatch } from 'react-redux';
import { getUserArticles } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Picker } from '@react-native-picker/picker';
import { fetchArticles } from '../../redux/reducer';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import {useTranslation} from 'react-i18next';

const MyArticles = () => {
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
    const [myArticles, setMyArticles] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tages, setTages] = useState('');
    const [selectedThumbnail, setSelctedThumbnail] = useState('');
    const [imageContainerHeight, setImageContainerHeight] = useState(200);
    const [loading, setLoading] = useState(false)

    const toggelFrom = () => {
        setFromVisible(!fromVisible)
    }

    useEffect(() => {
        fetchUserData()
    }, []);

    const fetchUserData = async () => {
        try {
            const user = await getUserData();
            if (user) {
                fetchUsersArticles(user)
                // console.log('this is the user accessToken', user.accessToken)
            } else {
                navigation.navigate('Login');
                console.log('user accessToken not found')
            }
        } catch (error) {
            console.log('Error fetching user accessToken', error.message)
        }
    };

    const fetchUsersArticles = async (user) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('user_id', user.userData.user_id);
                formData.append('server_key', serverkey);

                const response = await getUserArticles(formData, token)
                console.log("Get Response DAtaLLL", response.data)
                if (response.data.api_status === 200) {
                    setMyArticles(response.data)
                    setLoading(false)
                    console.log('this is the articles', myArticles)
                    dispatch(fetchArticles(response.data))
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('Error fetching articles', response.data.errors.error_text);
                    ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
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

    const Categories = [
        { label: 'Categories', value: '' },
        { label: 'Cars and Vehicles', value: 'Cars and Vehicles' },
        { label: 'Comedy', value: 'Comedy' },
        { label: 'Econoimics and Trade', value: 'Econoimics and Trade' },
        { label: 'Education', value: 'Education' },
        { label: 'Entertainment', value: 'Entertainment' },
        { label: 'Movies & Animation', value: 'Movies & Animation' },
        { label: 'Gaming', value: 'Gaming' },
        { label: 'History and Facts', value: 'History and Facts' },
        { label: 'Live Style', value: 'Live Style' },
        { label: 'Natural', value: 'Natural' },
        { label: 'News and Politics', value: 'News and Politics' },
        { label: 'People and Nations', value: 'People and Nations' },
        { label: 'Pets and Animals', value: 'Pets and Animals' },
        { label: 'Places and Regions', value: 'Places and Regions' },
        { label: 'Science and Technology', value: 'Science and Technology' },
        { label: 'Sport', value: 'Sport' },
        { label: 'Travel and Events', value: 'Travel and Events' },
        { label: 'Other', value: 'Other' },

    ]

    // Function to open image picker for selecting from gallery
    const openImagePicker = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                multiple: false, // Allow selecting only one image
            });

            if (image && image.path) {
                setSelctedThumbnail(image.path); // Set the selected image path to state
            } else {
                console.log('No image selected');
            }
        } catch (error) {
            console.log('Error selecting image:', error);
        }
    };

    // Function to format the current date as "14 Dec 2023"
    const getCurrentDate = () => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const currentDate = new Date();
        return currentDate.toLocaleDateString(undefined, options);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={t('MyArticles')} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <View>
                            {fromVisible === false ? (
                                <View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: global.ContentContainer.backgroundColor, borderRadius: 10, justifyContent: 'center', paddingHorizontal: wp(10) }}>
                                        <TouchableOpacity style={[styles.optionButtonView, { borderBottomColor: COLORS.red }]}>
                                            <Text style={{ fontSize: 16, color: '#766b66' }}>{t('MyArticles')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate('Blog')} style={{ marginHorizontal: wp(10) }}>
                                            <Text style={{ fontSize: 16, color: '#766b66', }}>{t('Browse_articles')}</Text>
                                        </TouchableOpacity>

                                    </View>

                                    {loading ? (
                                        <View style={{ flex: 1, marginVertical: hp(30), justifyContent: 'center', alignItems: 'center' }}>
                                            <Loader isLoading={true} />
                                        </View>
                                    ) : (
                                        myArticles?.articles && myArticles.articles.length > 0 ? (

                                            <FlatList
                                                data={myArticles.articles}
                                                keyExtractor={(item, index) => item.id.toString()}
                                                renderItem={({ item }) => (
                                                    <View style={{ marginTop: hp(2), marginHorizontal: wp(7) }}>
                                                        <Image source={{ uri: item.thumbnail }} style={{ height: hp(30), width: '100%', borderRadius: 10 }} />
                                                        <View style={styles.Blogoverlay} />
                                                        <TouchableOpacity style={styles.overlayBlog} onPress={() => navigation.navigate('MyArticles', { blogId: item.id })} >
                                                            <Text style={styles.overlayBlogText}>{item.category}</Text>
                                                        </TouchableOpacity>

                                                        <View style={styles.BlogTextOverlay}>
                                                            <View>
                                                                <TouchableOpacity onPress={() => navigation.navigate('BlogDetails', { blogId: item.id })}>
                                                                    <Text style={styles.BlogTitle}>{item.title}</Text>
                                                                </TouchableOpacity>

                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Text style={styles.overlayText2}>{item.view} Views</Text>
                                                                    <Text style={styles.date}>{getCurrentDate()}</Text>
                                                                </View>

                                                            </View>
                                                        </View>
                                                        <View style={[styles.BlogEditButton, { flexDirection: 'row', }]}>
                                                            <TouchableOpacity style={{ backgroundColor: COLORS.tertiaryWhite, borderRadius: 5 }}>
                                                                <Text style={{ padding: 5, paddingHorizontal: wp(5), fontFamily: fontFamily.FONTS.regular, fontSize: 14, color: COLORS.black }}>Edit</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{ backgroundColor: COLORS.tertiaryWhite, marginHorizontal: wp(5), borderRadius: 5 }}>
                                                                <Text style={{ padding: 5, paddingHorizontal: wp(5), fontFamily: fontFamily.FONTS.regular, fontSize: 14, color: COLORS.black }}>Delete</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )}
                                            />
                                        ) : (
                                            <View style={styles.container}>
                                                <View style={styles.ContentContainer}>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 22 }}>
                                                        <MaterialCommunityIcons name="newspaper" size={40} color={COLORS.gray} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                                        <Text style={{ paddingTop: 25, color: '#8a7b78', fontSize: 16 }}>{t(You_havent_created_any_articles_yet)}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )

                                    )}
                                </View>
                            ) : (
                                <View>
                                    {/*  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 25, backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10 }}>
                                        <MaterialCommunityIcons name="newspaper" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 5 }} />
                                        <Text style={{ marginHorizontal: 10, fontSize: 18, color: global.text2.color, fontFamily: fontFamily.FONTS.Medium, }}>Create new articles</Text>
                                    </View> */}

                                    <View style={styles.container}>
                                        <View style={styles.formContainer}>
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
                                                    <Text style={styles.lable}>{t('Content')}</Text>

                                                </View>
                                                {/* Image selection */}
                                                {/* <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>{t('Image')}</Text>
                                                    <TouchableOpacity onPress={openImagePicker} style={styles.imagePicker}>
                                                        {selectedThumbnail ? (
                                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                <Image
                                                                    source={{ uri: selectedThumbnail }}
                                                                    style={{ width: 100, height: 100, borderRadius: 10 }}
                                                                />
                                                            </View>
                                                        ) : (
                                                            <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                                                                <MaterialCommunityIcons name='image' size={24} color={COLORS.white} />
                                                                <Text style={{ color: COLORS.white, padding: 8, fontFamily: fontFamily.FONTS.Medium }}>Drop Image Here OR Browse To Upload</Text>
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                </View> */}
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>{t('category')}</Text>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={selectedCategory}
                                                            onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
                                                            style={styles.dropDown} itemStyle={styles.pickerItem}
                                                        >
                                                            {Categories.map((category, index) => (
                                                                <Picker.Item key={index} label={category.label} value={category.value} />
                                                            ))}
                                                        </Picker>
                                                    </View>
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>{t('tages')}</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        value={tages}
                                                        onChangeText={text => setTages(text)}
                                                    />
                                                </View>

                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10, marginTop: 25, borderRadius: 10, justifyContent: 'space-around' }}>
                                                    <TouchableOpacity onPress={toggelFrom}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                                            <Text style={{ padding: 5, fontSize: 16, color: '#737373', }}>{t('go_back')}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5 }} onPress={toggelFrom}>
                                                        <Text style={{ paddingHorizontal: wp(5), padding: 3, fontSize: 15, color: COLORS.white }}>Generate Using AI</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5, marginTop: hp(4) }} onPress={toggelFrom}>
                                                        <Text style={{ paddingHorizontal: wp(10), fontSize: 17, color: COLORS.white }}>{t('publish')}</Text>
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
    )
};

export default MyArticles;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: hp(1),
        },
        optionButtonView: {
            marginLeft: wp(3),
            borderBottomWidth: 2,
            alignItems: "center",
            justifyContent: 'center',
            height: hp(7)
        },
        ContentContainer: {
            margin: 10,
            borderRadius: 10,
            padding: 20,
        },
        formContainer: {
            // margin: 10,
            borderRadius: 10,
            padding: 20,
            backgroundColor: global.ContentContainer.backgroundColor,
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
        customInput: {
            borderWidth: 0.5,
            borderColor: '#CCCCCC',
            borderRadius: 8,
            padding: 10,
            width: '100%',
            height: 200,
        },
        inputText: {
            color: global.inputText.color
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
            minHeight: 40, // Set minHeight or remove for explicit height
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
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
        Blogoverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.1)',
        },
        BlogTextOverlay: {
            position: 'absolute',
            bottom: 0, // Adjust the position from the bottom as needed
            left: 20,
            top: hp(5),
            justifyContent: 'center',
            alignItems: 'center',
        },
        BlogEditButton: {
            position: 'absolute',
            bottom: 10, // Adjust the position from the bottom as needed
            left: 20,
            marginBottom: 5,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        overlayBlog: {
            position: 'absolute',
            top: 15,
            left: 15,
            alignItems: 'center',
            backgroundColor: COLORS.darkgray,
            borderRadius: 10
        },
        overlayBlogText: {
            padding: 3,
            paddingHorizontal: 10,
            color: COLORS.gray, // Set your desired text color
            fontSize: 16, // Adjust the font size as needed
            fontFamily: fontFamily.FONTS.regular
        },
        overlayText: {
            color: COLORS.white,
            fontSize: 28,
            fontWeight: 'bold',
            flexWrap: 'wrap',
        },
        BlogTitle: {
            color: COLORS.white,
            fontSize: 20,
            fontFamily: fontFamily.FONTS.Medium,
            flexWrap: 'wrap',
        },
        overlayText2: {
            paddingTop: 7,
            // paddingHorizontal: 8,
            color: COLORS.gray,
            fontSize: 14,
            fontFamily: fontFamily.FONTS.regular,
            flexWrap: 'wrap',
        },
        date: {
            paddingTop: 7,
            paddingHorizontal: 8,
            color: COLORS.gray,
            fontSize: 14,
            fontFamily: fontFamily.FONTS.regular,
            flexWrap: 'wrap',

        },
        lable: {
            fontSize: 16,
            color: global.text2.color,
            fontWeight: '600',
            marginVertical: 4,
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
        albumsText: {
            marginHorizontal: 10,
            fontSize: 18,
            color: global.text2.color
        },
        horizontalLine: {
            borderBottomColor: '#eaebec',
            borderBottomWidth: 1,
            padding: 5,
            // marginHorizontal: 15,
        },
    });
};