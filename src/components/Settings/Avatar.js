import { SafeAreaView, ScrollView, StyleSheet, Text, FlatList, ImageBackground, TextInput, TouchableOpacity, View, Modal, ToastAndroid, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ImagePicker from 'react-native-image-crop-picker';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import Footer from '../../components/Footer';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../utils/localization/Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserDataApi, onUpdateUserDataApi } from '../../Service/Api';
import { Loader } from '../Loader';
import { fetchUserDataSuccess } from '../../redux/reducer';

const Avatar = () => {
    const user_data = useSelector(state => state.user_data);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    //Avatar & Cover States
    const [coverImage, setCoverImage] = useState(null);
    const [coverImageType, setCoverImageType] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const [avatarType, setAvatarType] = useState(null)
    const [loading, setLoading] = useState(false)


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

    useEffect(() => {
        console.log('get Value::::', user_data?.avatar);
        if(user_data?.avatar) {
            setAvatar({uri: user_data?.avatar})
            setCoverImage({uri: user_data?.cover})
        }
    }, [])

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

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    const onCheckAuth = async (user) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {

                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('user_id', user.userData.user_id);
                formData.append('fetch', 'user_data,followers,following');
                formData.append('server_key', serverkey);

                const response = await getUserDataApi(formData, token)
                console.log("Get Response DAtaLLL", response.data)
                if (response.data.api_status === 200) {
                    dispatch(fetchUserDataSuccess(response.data.user_data))
                    navigation.navigate('ProfileScreen')
                } else if (response.data.api_status === 400 || 404) {
                    console.log('Error fetching profile data', response.data);
                    navigation.navigate('Login');
                }
            }
            else {
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 2000);
            }
        }
        catch (err) {
            console.log("Get Error::", err)
        }
    }

    const updateData = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null ) {
                if (coverImage.name || avatar.name) {
                    const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                    const formData = new FormData();
                    if (coverImage.name) {
                        formData.append('cover', coverImage)
                    }
                    if (avatar.name) {
                        formData.append('avatar', avatar)
                    }
                    formData.append('server_key', serverkey)
    
                    const response = await onUpdateUserDataApi(formData, token)
                    if (response.data.api_status === 200) {
                        const user = await getUserData()
                         onCheckAuth(user)
                        setLoading(false)
                        console.log('update successful', response.data)
                        // ToastAndroid.show(response.data.message, TouchableOpacity.SHORT)
                        // navigation.navigate('Profile')
                    } else if (response.data.api_status === 400 || 404) {
                        setLoading(false)
                        console.log('this is the error', response.data.errors.error_text)
                        ToastAndroid.show(response.data.errors.error_text, ToastAndroid.SHORT)
                    }
                } else {
                    setLoading(false)
                    alert('Please select profile or cover picture.');
                }
                
            } else {
                setLoading(false)
                console.log('User Token not Found ', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }



    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={styles.ContentContainer}>
                        <View style={styles.AvatarContentContainer}>
                            <View style={styles.content}>
                                <View style={styles.HandingtextContainer}>
                                    <View>
                                        <Image source={{ uri: user_data?.avatar }} style={{ height: hp(10), width: wp(20), borderRadius: 70 }} />
                                        <View style={{ position: 'absolute', top: hp(5.5), left: wp(14) }}>
                                            <MaterialCommunityIcons name='camera' size={19} color={COLORS.white} style={{ backgroundColor: '#1da1f2', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(5) }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            Avatar & Cover
                                        </Text>
                                    </View>
                                </View>

                                {/* Image selection */}
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: hp(2)
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
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5, margin: 5, borderRadius: 10, justifyContent: 'center' }}>
                            <TouchableOpacity style={{
                                height: hp(4.8),
                                backgroundColor: COLORS.red,
                                // borderColor: COLORS.black,
                                // borderWidth: 2,
                                borderRadius: 12,
                                width: wp(35),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }} onPress={updateData}>
                                {loading ? (
                                    <Loader isLoading={loading} color='white' />
                                ) : (
                                    <Text style={{ paddingHorizontal: wp(10), fontSize: 17, color: COLORS.white, fontFamily: fontFamily.FONTS.Medium, }}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default Avatar

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            // marginTop: 20,
        },
        HandingtextContainer: {
            padding: wp(5),
            height: hp(15),
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#e2f7fa',
            backgroundColor: '#f5fcfd',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#1da1f2',
            fontSize: wp(6),
            fontFamily: fontFamily.FONTS.Medium,
            marginBottom: 10,
            // padding: 5,
        },
        username: {
            fontSize: 16,
            color: '#1da1f2',
            fontFamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        AvatarContentContainer: {
            // margin: 10,
            height: hp(60),
            // marginHorizontal: wp(4),
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            padding: 10,
            paddingHorizontal: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
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
        ContentContainer: {
            margin: 10,
            borderRadius: 10,
            backgroundColor: global.ContentContainer.backgroundColor
        },
    })
}
