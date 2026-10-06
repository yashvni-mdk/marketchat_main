/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, ToastAndroid, FlatList, View, Modal, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Materialicons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import translations from '../../utils/localization/traslations';
import ImagePicker from 'react-native-image-crop-picker';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import BasicHeader from '../../components/BasicHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCreateAlbumApi, onGetUserAlbumsApi } from '../../Service/Api';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../utils/localization/Storage';
import { Loader } from '../../components/Loader';
import { FloatingAction } from "react-native-floating-action";

const Albums = () => {
    const user_data = useSelector(state => state.user_data)
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [fromVisible, setFromVisible] = useState(false);
    const [albums, setAlbums] = useState([])
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false)
    const [albumName, setAlbumName] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [albumsImage, setAlbumsImage] = useState([])
    const [albumsType, setAlbumsType] = useState(null);


    const toggelFrom = () => {
        setFromVisible(!fromVisible)
    }

    useEffect(() => {
        fetchAlbums()
    }, [])


    const fetchAlbums = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                var formdata = new FormData();
                formdata.append("server_key", serverkey);
                formdata.append("type", "fetch");
                formdata.append('user_id', user_data.user_id)
                const response = await onCreateAlbumApi(formdata, token)
                console.log('this is the created events', response.data.data)
                if (response.data.api_status === 200) {
                    setAlbums(response.data.data)
                    setLoading(false)
                    console.log('this is the albums', response.data.data)
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
    const createAlbums = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('access_token');

            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();

                // Add logging for debugging
                console.log('albumName:', albumName);
                console.log('albumsImage:', albumsImage);

                if (!albumName || albumsImage.length === 0) {
                    console.log('Error: albumName or albumsImage is empty');
                    return;
                }

                formData.append('server_key', serverkey);
                formData.append('type', 'create');
                formData.append('album_name', albumName);

                albumsImage.forEach((image, index) => {
                    formData.append(`postPhotos[${index}]`, {
                        uri: image.uri,
                        type: image.type,
                        name: image.name,
                    });
                });

                const response = await onCreateAlbumApi(formData, token);

                if (response.data.api_status === 200) {
                    console.log('Album created successfully', response.data);
                    ToastAndroid.show('Album created successfully', ToastAndroid.SHORT);
                    fetchAlbums();
                    setLoading(false);
                    setFromVisible(false);
                } else if (response.data.api_status === 400 || response.data.api_status === 404) {
                    setLoading(false);
                    console.log('Something went wrong', response.data.errors.error_text);
                    ToastAndroid.show('Something went wrong. Please try again', ToastAndroid.SHORT);
                }
            } else {
                setLoading(false);
                console.log('User Token not found');
            }
        } catch (error) {
            setLoading(false);
            console.log('Error:', error);
        }
    };


    // Function to open image picker for selecting from gallery
    const openImagePicker = async () => {
        try {
            const images = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                multiple: true, // Allow selecting multiple images
            });

            if (images && images.length > 0) {
                const imageDataArray = [];

                images.forEach(image => {
                    selectedImages.push(image.path);
                    var filename = image.path.substring(
                        image.path.lastIndexOf("/") + 1
                    );
                    let imageData = {
                        uri: image.path,
                        type: image.mime,
                        name: filename,
                    };
                    // Add each image data to the array
                    imageDataArray.push(imageData);
                });

                // Set the selected images array to state
                setAlbumsImage(imageDataArray);
                // Set the type of the first image (you may want to adjust this logic)
                setAlbumsType(imageDataArray[0].mime);

                // Calculate the height based on the number of images selected
                // const minHeight = 200; // Default height
                // const additionalHeight = (images.length - 1) * 110; // Calculate additional height based on the number of images
                // const newHeight = minHeight + additionalHeight;
                // setImageContainerHeight(newHeight);
            } else {
                console.log('No image selected');
            }
        } catch (error) {
            console.log('Error selecting image:', error);
        }
    };

    const removeSelectedImage = (imageUriToRemove) => {
        const updatedImages = selectedImages.filter(image => image !== imageUriToRemove);

        setSelectedImages(updatedImages)
    }

    const renderAlbumContent = () => {
        if (fromVisible === false) {
            return (
                <View>
                    {/*   <View style={styles.albumsContainer}>
                        <Materialicons name="photo-library" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 5 }} />
                        <Text style={styles.albumsText}>{translations.albums}</Text>
                    </View>*/}

                    {/** <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25, paddingHorizontal: wp(2), backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-between' }}>
                        <View style={[styles.optionButtonView, { borderBottomColor: COLORS.red }]}>
                            <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.5), color: global.text2.color }}>{translations.my_albums}</Text>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5 }} onPress={toggelFrom}>
                            <Text style={{ paddingHorizontal: 6, fontSize: hp(2.1), color: COLORS.white }}>+ {translations.create}</Text>
                        </TouchableOpacity>
                    </View> */}

                    {
                        loading ? (
                            <View style={{ marginVertical: hp(10) }}>
                                <Loader isLoading={loading} />
                            </View>
                        ) : (
                            <View style={{ marginHorizontal: wp(5) }}>
                                <FlatList
                                    data={albums}
                                    horizontal
                                    renderItem={({ item }) => (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: hp(3) }}>
                                            <TouchableOpacity onPress={() => navigation.navigate('AlbumsDetails', { postId: item.id })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: wp(2) }}>
                                                <Image
                                                    source={{ uri: item.first_image }}
                                                    style={{ height: hp(20), width: wp(40), borderRadius: wp(2) }}
                                                />
                                                <Text style={{
                                                    position: 'absolute',
                                                    bottom: -10,
                                                    // left: 0,
                                                    color: COLORS.white,
                                                    fontSize: hp(2.2),
                                                    fontFamily: fontFamily.FONTS.Medium,
                                                    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    paddingHorizontal: 4,
                                                    borderRadius: 6,
                                                    marginBottom: hp(2)
                                                }}>{item.album_name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => item.id.toString()}
                                    ListEmptyComponent={() => (
                                        <View style={styles.container}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                                                <Materialicons name="photo-library" size={40} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                                <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>You haven`t created any albums</Text>
                                            </View>
                                        </View>
                                    )}
                                />
                            </View>
                        )
                    }
                </View>
            );
        } else {
            return (
                <View>
                    {/*  <View style={styles.albumsContainer}>
                        <Materialicons name="photo-library" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 5 }} />
                        <Text style={styles.albumsText}>Create albums</Text>
                    </View>*/}

                    <View style={styles.container}>
                        <View style={styles.ContentContainer}>
                            <View style={styles.content}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>{translations.album_name}</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={albumName}
                                        onChangeText={text => setAlbumName(text)}
                                    />
                                </View>
                                {/* Image selection */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>{translations.Image}</Text>
                                    <TouchableOpacity onPress={openImagePicker} style={styles.imagePicker}>
                                        {selectedImages.length > 0 ? (
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                {selectedImages.map((image, index) => (
                                                    <View key={index} style={{ margin: 5 }}>
                                                        <Image
                                                            source={{ uri: image }}
                                                            style={{ width: 100, height: 100, borderRadius: 10 }}
                                                        />
                                                        {/* Cancel button for the selected image */}
                                                        <TouchableOpacity
                                                            onPress={() => removeSelectedImage(image)}
                                                            style={{ position: 'absolute', top: 5, right: 5 }}
                                                        >
                                                            <MaterialCommunityIcons name='close-circle' size={wp(6)} color={COLORS.red} />
                                                        </TouchableOpacity>
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
                                </View>

                                <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                                    <TouchableOpacity onPress={toggelFrom}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                            <Text style={{ padding: 5, fontSize: hp(2.2), color: '#737373', }}>{translations.go_back}</Text>
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
                                        }} onPress={createAlbums}>
                                            {loading ? (
                                                <Loader isLoading={loading} color='white' />
                                            ) : (
                                                <View>
                                                    <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>{translations.publish}</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Albums'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <View>
                            {renderAlbumContent()}
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

export default Albums;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: hp(1),
        },
        optionButtonView: {
            borderBottomWidth: 2,
            alignItems: "center",
            justifyContent: 'center',
            height: hp(7)
        },
        ContentContainer: {
            // margin: 10,
            borderRadius: wp(1),
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
        lable: {
            fontSize: hp(2.2),
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
            fontSize: hp(2.1),
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
            fontSize: hp(2.8),
            fontWeight: 'bold',
            flexWrap: 'wrap',
        },
        Blogoverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.2)',
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
            fontSize: hp(2.4),
            color: global.text2.color
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15,
        },
    });
};