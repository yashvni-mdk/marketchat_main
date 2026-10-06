import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Image, ToastAndroid } from 'react-native';
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
import { useSelector } from 'react-redux';
import welcome from '../../../assets/image/img/backgrounds/welcome.jpg';
import sent from '../../../assets/image/img/createPage/sent.png';
import background from '../../../assets/image/img/backgrounds/background.jpg';
import love from '../../../assets/image/img/createPage/love.png';
import CommonDetails from '../../components/CommonDetails';
import { onCreateAlbumApi, sendPushNotification } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';


const CreateAlbums = () => {
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
  const [albumName, setAlbumName] = useState('');
  const [modelVisible, setModelVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [imageContainerHeight, setImageContainerHeight] = useState(200);
  const [messageText, setMessageText] = useState('')
  const [profile, setProfile] = useState(null)
  const [profileImages, setprofileImages] = useState([])
  const [profileType, setProfileType] = useState('')
  const [loading, setLoading] = useState(false)

  const navigationOptions = [
    { text: 'Create Albums', image: gallery, navigateTo: 'CreateAlbum' },
    { text: 'Create Ad', image: dollar, navigateTo: 'CreateAd' },
    { text: 'Create Blog', image: calendar, navigateTo: 'CreateBlog' },
    { text: 'Create Event', image: add, navigateTo: 'CreateEvent' },
    { text: 'Create Group', image: users, navigateTo: 'CreateGroup' },
    { text: 'Create Page', image: flag, navigateTo: 'CreatePage' },
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

  // Function to open image picker for selecting from gallery
  const openImagePicker = async () => {
    try {
      if(selectedImage.length != 6) {
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
          profileImages.push({
            uri: image.path,
            type: image.mime,
            name: filename,
          })
          setProfile(imageData);
          setProfileType(image.mime)
        }); // Set the selected image path to state

        // Calculate the height based on the number of images selected
        const minHeight = 200; // Default height
        const additionalHeight = (image.length - 1) * 110; // Calculate additional height based on the number of images
        const newHeight = minHeight + additionalHeight;
        setImageContainerHeight(newHeight);
      } else {
        console.log('No image selected');
      }
    }
    else {
      ToastAndroid.show('Maximum 6 images uploaded.', ToastAndroid.SHORT);
    }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const onSubmitAlbum = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        var formdata = new FormData();
        formdata.append("server_key", serverkey);
        formdata.append("type", "create");
        formdata.append("album_name", albumName);
        profileImages.map((images, index) => {
          formdata.append("postPhotos[]", images);
        })
        console.log('this is the created events', profileImages)
        const response = await onCreateAlbumApi(formdata, token)
        console.log('this is the created events', response.data)
        if (response.data.api_status === 200) {
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
          navigation.navigate('TabStack')
        } else if (response.data.api_status === 400 || 404) {
          setLoading(false)
          console.log('error for createing the event', response.data.errors.error_text)
          ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
        }
      }
    }
    catch (err) {
      setLoading(false)
      console.log("Error::", err)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
      <View style={styles.headerView}>
        <BasicHeader onPress={() => navigation.goBack()} title={'Create Albums'} />
      </View>
      <View style={styles.secondView}>
        <ScrollView contentContainerStyle={{ paddingBottom: hp(5) }}>
          <View>
            {/* Albums */}
            {/* <View>
                        <View style={styles.albumsContainer}>
                            <Materialicons name="photo-library" size={22} color={COLORS.gray} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 5 }} />
                            <Text style={styles.albumsText}>{translations.create_albums}</Text>
                        </View>
                    </View> */}

            <View>


              <View style={styles.container}>
                <View style={styles.ContentContainer}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.lable}>{translations.album_name}</Text>
                      <CustomInput
                        keyboardType="default"
                        value={albumName}
                        onChangeText={text => setAlbumName(text)}
                      />
                      <Text style={styles.chooseText}>Choose your album name</Text>
                    </View>
                    {/* Image selection */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.lable}>{translations.Image}</Text>
                      <TouchableOpacity onPress={openImagePicker} style={[styles.imagePicker, { height: imageContainerHeight }]}>
                        {selectedImage.length > 0 ? (
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                            {selectedImage.map((image, index) => {
                              if(index < 6){
                                return (
                                  <View key={index} style={{ margin: 6 }}>
                                    <Image
                                      source={{ uri: image }}
                                      style={{ width: 100, height: 100, borderRadius: 10 }}
                                    />
                                  </View>
                                )
                              }
                            })}
                          </View>
                        ) : <View style={{height:hp(30),alignItems:'center',justifyContent:'center' }}>
                          <Text style={{ textAlign: 'center',fontSize:hp(2),fontFamily:fontFamily.FONTS.Medium,color:COLORS.darkgray1}}>Select Images</Text>
                          </View> 
                          }
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, borderRadius: 10, justifyContent: 'center' }}>
                      <TouchableOpacity onPress={() => navigation.navigate('TabStack')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <AntDesign name="arrowleft" size={22} color={COLORS.gray} />
                          <Text style={{ padding: 5, fontSize: hp(2.2), color: global.text2.color, fontFamily: fontFamily.FONTS.regular }}>{translations.go_back}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{
                        height: hp(4.8),
                        width: wp(38),
                        backgroundColor: COLORS.red,
                        // borderColor: COLORS.black,
                        // borderWidth: 2,
                        borderRadius: 12,
                        marginLeft: wp(5),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }} onPress={onSubmitAlbum}>
                        {loading ? (
                          <Loader isLoading={loading} color='white' />
                        ) : (
                          <View>
                            <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>{translations.create}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                </View>
              </View>

              {/* <CommonDetails 
                userData={userData} 
                groupOptions={groupOptions} 
                usersOptions={usersOptions} 
                messageText={messageText}
                setMessageText={(text)=>{setMessageText(text)}}
                /> */}


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

export default CreateAlbums;

const localStyles = (theme) => {
  const global = globalStyles(theme);

  return StyleSheet.create({
    container: {
      backgroundColor: global.container.backgroundColor,
      marginTop: hp(2),
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
      color: COLORS.darkgray1,
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
      paddingBottom: hp(2)
    },
    imagePicker: {
      width: '100%',
      minHeight: hp(31.5),
      maxHeight: hp(35),
      padding: 7,
      // marginHorizontal: 15,
      backgroundColor: global.textInput.backgroundColor,
      color: global.inputText.color,
      borderColor: '#eeeff0',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingBottom: hp(2)
    },
    lable: {
      fontSize: 16,
      color: global.text2.color,
      fontWeight: '600',
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
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(198,77,83,0.5)',
    },
    textOverlay: {
      position: 'absolute',
      bottom: 0, // Adjust the position from the bottom as needed
      left: 0,
      right: 0,
      top: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlayText: {
      color: COLORS.white,
      fontSize: 22,
      fontWeight: 'bold',
      flexWrap: 'wrap',
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
    overlay: {
      position: 'absolute',
      top: 5,
      right: 0,
      backgroundColor: COLORS.secondaryGray,
      borderRadius: 10,
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