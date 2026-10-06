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
import { useSelector } from 'react-redux';
import welcome from '../../../assets/image/img/backgrounds/welcome.jpg';
import sent from '../../../assets/image/img/createPage/sent.png';
import background from '../../../assets/image/img/backgrounds/background.jpg';
import love from '../../../assets/image/img/createPage/love.png';
import { Picker } from '@react-native-picker/picker';
import { onCreatePageApi, sendPushNotification } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonDetails from '../../components/CommonDetails';
import BasicHeader from '../../components/BasicHeader';
import { createPages } from '../../redux/reducer';
import { Loader } from '../../components/Loader';
import { useDispatch } from 'react-redux';
import {useTranslation} from 'react-i18next';

const CreatePage = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const global = globalStyles(theme);
  const usersList = useSelector(state => state.usersList);
  const user_data = useSelector(state => state.user_data);

  // Merge global styles with local component styles
  const styles = StyleSheet.create({
    ...global,
    ...localStyles(theme),
  });

  const [pageName, setPageName] = useState('');
  const [modelVisible, setModelVisible] = useState(false)
  const [pageUrl, setPageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryID, setCategoryID] = useState(0)
  const [pageDescription, setPageDescription] = useState('');
  const [selectedTab, setSelectedTab] = useState('My Pages');
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
        formData.append('page_name',pageName);
        formData.append('page_title', pageUrl);
        formData.append('page_description', pageDescription);
        formData.append('page_category', categoryID);
        formData.append('server_key', serverkey);

        const response = await onCreatePageApi(formData, token)

        if (response.data.api_status == 200) {
          // setPages(response.data)
          console.log('this is the created page', response.data)
          dispatch(createPages(response.data))
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
          navigation.goBack();
          setLoading(false)
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
    <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
      <View style={styles.headerView}>
        <BasicHeader onPress={() => navigation.goBack()} title={t('create_new_page')} />
      </View>
      <View style={styles.secondView}>
        <ScrollView contentContainerStyle={{ paddingBottom: hp(5) }}>
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
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AntDesign name="arrowleft" size={17} color={'#737373'} />
                      <Text style={{ padding: 5, fontSize: 16, color: '#737373', }}>{t('go_back')}</Text>
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
  );
};

export default CreatePage;

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
      marginBottom: 8
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
    customInput: {
      width: '53%',
      height: hp(6),
      // backgroundColor: global.textInput.backgroundColor,
      color: global.inputText.color,
      borderColor: '#eeeff0',
      borderWidth: 0.5,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      justifyContent: 'center',
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
      color: global.text2.color,
      fontFamily: fontFamily.FONTS.bold
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
    container1: {
      marginHorizontal: 10,
      // backgroundColor: global.ContentContainer.backgroundColor,
      backgroundColor: COLORS.white,
      borderRadius: 10,
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    backgroundImage: {
      height: hp(15),
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      width: '100%',
    },
    userImageContainer: {
      position: 'absolute',
      top: hp(10),
      alignSelf: 'center',
    },
    userImage: {
      height: 70,
      width: 70,
      borderRadius: 70,
    },
    userNameContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(5),
    },
    username: {
      fontSize: hp(2),
      // color: global.text2.color,
      color: COLORS.black,
      fontFamily: fontFamily.FONTS.Medium,
    },
    username1: {
      fontSize: hp(1.8),
      // color: global.text2.color,
      color: COLORS.black,
      fontFamily: fontFamily.FONTS.regular,
      textAlign: 'center',
    },
    followOptionView: {
      marginVertical: hp(2),
      width: '75%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      marginLeft: wp(4),
    },
    trendingTagsView: {
      width: '94%',
      alignSelf: 'center',
      padding: wp(3),
      backgroundColor: COLORS.white,
      marginTop: hp(2),
      borderRadius: 10,
    },
    trendingPost: {
      marginTop: hp(2),
    },
    trendingText: {
      fontSize: hp(1.8),
      color: COLORS.red,
      fontFamily: fontFamily.FONTS.Medium,
    },
    postCount: {
      fontSize: hp(1.7),
      // color: global.text2.color,
      color: COLORS.black,
      fontFamily: fontFamily.FONTS.regular,
    },
    usersListView: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      alignSelf: 'center',
      paddingVertical: hp(2),
    },
    userProfileView: {
      width: '48.5%',
      height: hp(20),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: COLORS.gray,
      marginBottom: hp(1.2),
      borderRadius: wp(2),
    },
    followText: {
      fontSize: hp(2),
      // color: global.text2.color,
      color: COLORS.white,
      fontFamily: fontFamily.FONTS.Medium,
    },
    followButton: {
      width: '40%',
      height: hp(4),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.red,
      borderRadius: hp(1),
      marginTop: hp(1),
    },
    userLikeView: {
      width: '94%',
      backgroundColor: '#fff',
      borderRadius: 10,
      alignSelf: 'center',
      marginTop: hp(2),
      paddingVertical: hp(2),
    },
    coverImage: {
      height: hp(15),
      width: '100%',
      marginTop: hp(1),
    },
    nameText: {
      fontSize: hp(2),
      // color: global.text2.color,
      color: COLORS.black,
      fontFamily: fontFamily.FONTS.regular,
    },
    nameText1: {
      fontSize: hp(1.6),
      color: COLORS.primarygray,
      fontFamily: fontFamily.FONTS.regular,
    },
    likeButton: {
      width: '96%',
      height: hp(4),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.red,
      borderRadius: hp(1),
      marginTop: hp(2),
      alignSelf: 'center',
    },
    groupView: {
      width: '48.5%',
      height: hp(29),
      borderWidth: 0.5,
      borderColor: COLORS.gray,
      borderRadius: wp(2),
    },
    emailView: {
      width: '94%',
      alignSelf: 'center',
      padding: wp(2),
      backgroundColor: COLORS.golden,
      marginTop: hp(2),
      borderRadius: 10,
    },
    sentText: {
      fontSize: hp(2),
      // color: global.text2.color,
      color: COLORS.darkGolden,
      fontFamily: fontFamily.FONTS.Medium,
    },
    mailIconView: {
      height: hp(16),
      width: '100%',
      alignItems: 'center',
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
    messageView: {
      width: '94%',
      backgroundColor: COLORS.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.4,
      borderColor: COLORS.darkGolden,
      height: hp(6),
      alignSelf: 'center',
      borderRadius: 5,
      flexDirection: 'row'
    },
  });
};