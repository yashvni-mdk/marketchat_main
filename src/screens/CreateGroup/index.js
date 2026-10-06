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
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonDetails from '../../components/CommonDetails';
import BasicHeader from '../../components/BasicHeader';
import { createGroups } from '../../redux/reducer';
import { onCreateGroupsApi, sendPushNotification } from '../../Service/Api';
import { Loader } from '../../components/Loader';
import { useDispatch } from 'react-redux';
import {useTranslation} from 'react-i18next';

const CreateGroup = () => {
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

  const [fromVisible, setFromVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [messageText, setMessageText] = useState('')
  const [groupName, setGroupName] = useState('');
  const [groupUrl, setGroupUrl] = useState('');
  const [description, setDescription] = useState('');
  const [groupType, setGroupType] = useState('');
  const [groupTypeId, setGroupTypeId] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryID, setCategoryID] = useState(0)
  const [loading, setLoading] = useState(false);

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


  const navigationOptions = [
    { text: 'Create Albums', image: gallery, navigateTo: 'CreateAlbum' },
    { text: 'Create Ad', image: dollar, navigateTo: 'CreateAd' },
    { text: 'Create Blog', image: calendar, navigateTo: 'CreateBlog' },
    { text: 'Create Event', image: add, navigateTo: 'CreateEvent' },
    { text: 'Create Group', image: users, navigateTo: 'CreateGroup' },
    { text: 'Create Page', image: flag, navigateTo: 'CreatePage' },
  ];

  const usersOptions = [
    { text: 'Yash vaishnani', image: welcome },
    { text: 'Dipak Pakhake', image: background },
    { text: 'Mohil Thummar', image: background },
    { text: 'Dipak Pakhake', image: welcome },
  ];

  const groupOptions = [
    { text: 'first Group', member: 1, image: welcome }
  ];


  const toggelModel = () => {
    setModelVisible(prevVisible => !prevVisible);
  };

  const toggelFrom = () => {
    setFromVisible(!fromVisible)
  }


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

  const createGroup = async () => {
    try {
      if(categoryID == 0) {
        alert('Please first select category.')
    } else {
      setLoading(true)
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('group_name', groupName);
        formData.append('group_title', groupUrl);
        formData.append('about', description);
        formData.append('group_sub_category', groupTypeId);
        formData.append('category', categoryID);
        formData.append('server_key', serverkey);

        const response = await onCreateGroupsApi(formData, token)

        if (response.data.api_status == 200) {
          // setGroups(response.data);
          console.log('this is the created group', response.data)
          dispatch(createGroups(response.data))
          setLoading(false)
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
          // await fetchGroups()
          setFromVisible(false)
        } else if (response.data.api_status === 400 || 404) {
          setLoading(false)
          console.log('error to crateing the group', response.data.errors.error_text)
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
        <BasicHeader onPress={() => navigation.goBack()} title={t('create_new_group')} />
      </View>
      <View style={styles.secondView}>
        <ScrollView contentContainerStyle={{ paddingBottom: hp(5) }}>
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
                  <TouchableOpacity onPress={() => navigation.goBack()}>
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
                  }} onPress={createGroup}>
                    {loading ? (
                      <Loader isLoading={loading} color='white' />
                    ) : (
                      <View>
                        <Text style={{ paddingHorizontal: wp(10), fontSize: 17, color: COLORS.white }}>{t('create')}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
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

export default CreateGroup;

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
    customInput: {
      width: '53%',
      height: hp(6),
      // paddingHorizontal: 4,
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
      minHeight: 40, // Set minHeight or remove for explicit height
      // backgroundColor: global.textInput.backgroundColor,
      color: global.inputText.color,
    },
    pickerItem: {
      height: 40, // Adjust Picker.Item's height
    },
    ContentContainer: {
      // margin: 10,
      borderRadius: 10,
      padding: 20,
      backgroundColor: global.ContentContainer.backgroundColor,
    },
    inputContainer: {
      marginTop: 10,
    },
    lable: {
      fontSize: 16,
      color: global.text2.color,
      fontWeight: '600',
      marginVertical: 4,
    },
    title: {
      fontSize: 17,
      fontFamily: fontFamily.FONTS.Medium,
      color: COLORS.black

    },
    CheckBoxContainer: {
      flexDirection: 'row',
      paddingTop: 10,
    },
    checkBoxtext: {
      color: global.text.color,
      fontSize: 15,
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
  });
};