import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Image, TextInput, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Materialicons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import translations from '../../utils/localization/traslations';
import ImagePicker from 'react-native-image-crop-picker';
import CommonHeader from '../../components/CommonHeader';
import plus from '../../../assets/icons/png/add-1.png';
import users from '../../../assets/image/img/createPage/users.png';
import gallery from '../../../assets/image/img/createPage/gallery.png';
import flag from '../../../assets/image/img/createPage/flag.png';
import dollar from '../../../assets/image/img/createPage/dollar.png';
import calendar from '../../../assets/image/img/createPage/calendar.png';
import add from '../../../assets/image/img/createPage/add.png';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import { useDispatch, useSelector } from 'react-redux';
import BasicHeader from '../../components/BasicHeader';
import { AIGeneratePopup } from '../../components/AIGeneratePopup';
import { Picker } from '@react-native-picker/picker';
import { onCreatePageApi, onPostBlogDataApi, sendPushNotification } from '../../Service/Api';
import { createPages } from '../../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const CreateBlog = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);
    const usersList = useSelector(state => state.usersList);
    const user_data = useSelector(state => state.user_data);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });
    const [AiModalVisible, setAiModalVisible] = useState(false)
    const [modelVisible, setModelVisible] = useState(false);
    const [imageContainerHeight, setImageContainerHeight] = useState(200);
    const [myArticles, setMyArticles] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tags, setTags] = useState('');
    const [selectedThumbnail, setSelctedThumbnail] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [profile, setProfile] = useState(null)
    const [profileType, setProfileType] = useState('')
    const [imageVisible, setImageVisible] = useState(false);
    const [numLength, setNumLength] = useState('');
    const [contentDes, setContentDes] = useState('')
    const [categoryID, setCategoryID] = useState(0)
    const [loading, setLoading] = useState(false)

    const navigationOptions = [
        { text: 'Create Albums', image: gallery, navigateTo: 'CreateAlbum' },
        { text: 'Create Ad', image: dollar, navigateTo: 'CreateAd' },
        { text: 'Create Blog', image: calendar, navigateTo: 'CreateBlog' },
        { text: 'Create Event', image: add, navigateTo: 'CreateEvent' },
        { text: 'Create Group', image: users, navigateTo: 'CreateGroup' },
        { text: 'Create Page', image: flag, navigateTo: 'CreatePage' },
    ];

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

    const toggelModel = () => {
        setModelVisible(prevVisible => !prevVisible);
    };

    const renderModelItems = () => {
        return navigationOptions.map((option, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    setModelVisible(false)
                    option.navigateTo && navigation.navigate(option.navigateTo)
                }}
                style={styles.OptionView}>
                <Image
                    style={{ width: wp(7), height: hp(5), resizeMode: 'contain' }}
                    source={option.image}
                />
                <Text style={styles.modelText}>{option.text}</Text>
            </TouchableOpacity>
        ));
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
                    setProfile(imageData);
                    setProfileType(image.mime)
                });

                // Calculate the height based on the number of images selected
                const minHeight = 200; // Default height
                const additionalHeight = (image.length - 1) * 110; // Calculate additional height based on the number of images
                const newHeight = minHeight + additionalHeight;
                setImageContainerHeight(newHeight);
            } else {
                console.log('No image selected');
            }
        } catch (error) {
            console.log('Error selecting image:', error);
        }
    };

    const createBlog = async () => {
        try {
            if(title == '') {
                alert('Please enter blog title.')
            } else if(content == '') {
                alert('Please enter blog content.')
            } else if(description == '') {
                alert('Please enter blog description.')
            } else if(categoryID == 0) {
                alert('Please first select category.')
            } else {
          setLoading(true)
          const token = await AsyncStorage.getItem('access_token')
          if (token != null) {
            const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
            let raw = JSON.stringify({
                title: title,
                content: content,
                description: description,
                category: categoryID,
                tags: tags,
            })
            // const formData = new FormData();
            // formData.append('page_name', title);
            // formData.append('page_title', title);
            // formData.append('page_description', description);
            // formData.append('page_category', categoryID);
            // formData.append('server_key', serverkey);
    
            // const response = await onCreatePageApi(raw, token)
            const response = await onPostBlogDataApi(raw, token)
            if (response.data) {
              // setPages(response.data)
              console.log('this is the created page', response.data)
              usersList.map(item => {
                if(item.user_id != user_data.user_id) {
                  const res = item.fcm_token.replace(/ /g, '')
                  console.log("get Item Token ::::", res)
                  sendPushNotification(
                    res,
                    `Create Post`,
                    `${user_data.username} is create new post.`,
                  );
                }
              })
              setLoading(false)
              dispatch(createPages(response.data))
              navigation.goBack();
            //   setFromVisible(false)
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

    return (
        <>
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <View style={styles.headerView}>
                <BasicHeader onPress={() => navigation.goBack()} title={'Create Blog'} />
            </View>
            <View style={styles.secondView}>
                <ScrollView contentContainerStyle={{ paddingBottom: hp(5) }}>
                    <View>
                        <View>
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
                                            <CustomInput
                                                keyboardType="default"
                                                value={content}
                                                onChangeText={text => setContent(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>{t('category')}</Text>
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
                                            <Text style={styles.lable}>{t('tages')}</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                value={tags}
                                                onChangeText={text => setTags(text)}
                                            />
                                        </View>
                                        {/* <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, marginTop: hp(2),  padding: 5, width: '70%', alignSelf: 'center',alignItems: 'center' }} onPress={() => setAiModalVisible(true)}>
                                                        <Text style={{ paddingHorizontal: 20, fontSize: 20, color: COLORS.white }}>Generate Using AI</Text>
                                                    </TouchableOpacity> */}
                                        <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(2), marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                                            <TouchableOpacity onPress={() => navigation.navigate('TabStack')}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <AntDesign name="arrowleft" size={22} color={COLORS.gray} />
                                                    <Text style={{ padding: 5, fontSize: 18, color: global.text.color }}>{t('go_back')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                           
                                            <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5 }} onPress={() => createBlog()}>
                                                <Text style={{ paddingHorizontal: 20, fontSize: 20, color: COLORS.white }}>{t('publish')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Right side menu Model */}
                    <Modal visible={modelVisible} transparent animationType="none">
                        <TouchableOpacity onPress={toggelModel}>
                            <View style={styles.conteredView}>
                                <View style={styles.modelView}>{renderModelItems()}</View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </ScrollView>
            </View>
          
        </SafeAreaView>
        <AIGeneratePopup
            modalVisible={AiModalVisible}
            setModalVisible={setAiModalVisible}
            imageVisible={imageVisible}
            setImageVisible={setImageVisible}
            setContentDes={setContentDes}
            contentDes={contentDes}
            numLength={numLength}
            setNumLength={setNumLength}
         />
        </>
    );
};

export default CreateBlog;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: 20,
        },
        headerView: {
            flex: 0.08,
            width: '100%',
            justifyContent: 'center',
        },
        secondView: {
            flex: 0.92,
            width: '100%',
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
            // marginTop: 10,
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
        ProfileComplitionContainer1: {
            width: '105%',
            backgroundColor: COLORS.white,
            borderRadius: hp(2),
            marginLeft: wp(-2)
          },
        chooseText: {
            fontSize: hp(1.7),
            color: COLORS.darkgray,
            fontFamily: fontFamily.FONTS.regular,
            marginBottom: hp(1)

        },
        conteredView: {
            alignItems: 'flex-end',
            padding: 25,
            marginTop: 20,
            width: '100%',
        },
        ContentContainer: {
            // margin: 10,
            borderRadius: 10,
            padding: 20,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        inputContainer: {
            marginBottom: hp(1.5)
        },
        imagePicker: {
            width: '100%',
            height: 'auto',
            padding: 7,
            // marginHorizontal: 15,
            backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
        },
        Blogoverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        BlogTextOverlay: {
            position: 'absolute',
            bottom: 0, // Adjust the position from the bottom as needed
            left: 0,
            right: 0,
            top: 50,
            justifyContent: 'center',
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
        BlogTitle: {
            color: COLORS.white,
            fontSize: 22,
            fontWeight: 'bold',
            flexWrap: 'wrap',
        },
        overlayText2: {
            paddingTop: 7,
            paddingHorizontal: 8,
            color: COLORS.gray, // Set your desired text color
            fontSize: 16, // Adjust the font size as needed
            fontWeight: 'bold', // Set the font weight if necessary
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
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15,
        },
        modelView: {
            backgroundColor: '#fff',
            borderRadius: 5,
            borderWidth: 0.2,
            borderColor: COLORS.gray,
            padding: 20,
            justifyContent: 'space-between',
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        modelText: {
            fontSize: 16,
            padding: 4,
            color: '#000',
            fontFamily: fontFamily.FONTS.Medium,
        },
        OptionView: {
            width: wp(36),
            height: hp(10),
            borderWidth: 1,
            borderRadius: 5,
            marginTop: hp(2),
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
};