/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, ToastAndroid, ScrollView, Linking, TouchableWithoutFeedback, TextInput, TouchableOpacity, Modal, FlatList, Share } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Entypo from 'react-native-vector-icons/Entypo';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Octicons from 'react-native-vector-icons/Octicons'
import Foundation from 'react-native-vector-icons/Foundation'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutuser, fetchUserPost } from '../../redux/reducer';
import fontFamily from '../../../constants/fontFamily';
import { onLogOutApi, onGetPostApi, onPageLikeApi, commentonPost, onCreateNewPostApi, onSearchApi, MidjeournyImage, reportComments, onGetActivities, onGetPostData, onCreateAlbumApi } from '../../Service/Api';
import { Loader } from '../../components/Loader';
import RBSheet from 'react-native-raw-bottom-sheet'; // Import RBSheet
import ImagePicker from 'react-native-image-crop-picker';
import CheckBox from '../../components/CheckBox';
import users from '../../../assets/image/img/createPage/users.png';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Collapsible from 'react-native-collapsible';
import EmojiPicker from 'emoji-picker-react';
import MasonryList from 'react-native-masonry-list';
import BasicHeader from '../../components/BasicHeader';
import FBCollage from 'react-native-fb-collage';
import Gallery from 'react-native-image-gallery';

const AlbumsDetails = ({ route }) => {
    const user_data = useSelector(state => state.user_data)
    const { postId } = route.params
    console.log(postId)

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme, WD, WH),
    });

    const [userPost, setUserPost] = useState([])
    const [postData, setPostData] = useState([])
    const [loadingUserPosts, setLoadingUserPosts] = useState(false)
    const [commentImage, setCommentImage] = useState(null)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const [commentImageType, setCommentImageType] = useState('')
    const rbSheetRef = useRef(null); // Reference for RBSheet
    const [longPressedComment, setLongPressedComment] = useState(null);
    const [longPressedCommentReply, setLongPressedCommentReply] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [deleteModel, setDeleteModel] = useState(false)
    const [editModel, setEditModel] = useState(false)
    const [addImageModel, setAddImageModel] = useState(false)
    const postActionMenuRef = useRef(null);
    const [editText, setEditText] = useState(null)
    const [editImage, setEditImage] = useState([])
    const [edit, setEdit] = useState(userPost.Orginaltext || '')
    const [loading, setLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState([]);
    const [postEditPhotos, setPostEditPhotos] = useState([]);
    const [postEditPhotosType, setPostEditPhotosType] = useState([]);
    const [selectedEditImage, setSelectedEditImage] = useState([]);
    const [loadingLikePages, setLoadingLikePages] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false)
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [albumsImage, setAlbumsImage] = useState([])
    const [albumsType, setAlbumsType] = useState(null);
    const [postPhotos, setPostPhotos] = useState([])
    const [postPhotosType, setPostPhotosType] = useState([])
    const [isGalleryVisible, setGalleryVisible] = useState(false);
    const [commentStatus, setCommentStatus] = useState(null)
    const [postSavedStatus, setPostSavedStatus] = useState(null)
    const [commentsReply, setCommentsReply] = useState([])
    const [commentsReplyVisible, setCommentsReplyVisible] = useState({})
    const [commentReplyText, setCommentReplyText] = useState('')

    const toggleMenu = (value, postId, Orginaltext, photo_album, postFile, comments_status, is_post_saved) => {
        if (value === null) {
            setSelectedPostId(postId)
            setEditText(Orginaltext)
            setEditImage(postFile)
            setCommentStatus(comments_status)
            setPostSavedStatus(is_post_saved)
        }
        if (value === 'edit') {
            toggelEditModel()
        }
        if (value === 'add') {
            toggelAddImageModel()
        }
        if (value === 'delete') {
            toggleDeleteModel()
        }
        if (value === 'boostPost') {
            navigation.navigate('UpgradeToPro')
        } if (value === 'disable_comments') {
            handlePostActions(selectedPostId, 'disable_comments')
        }
        console.log('this is the selcted value', value)
        console.log('this is the selcted post id', selectedPostId)
        console.log('this is the selcted post body', editText)
        console.log('this is the selcted post image', editImage)
        // console.log('this is the selcted post body', editImage)
        console.log('this is the selcted post body', commentStatus)
        console.log('this is the selcted post body', postSavedStatus)
        // console.log('this is the selcted post body', photo_album)
    };

    const toggleDeleteModel = (selectedPostId) => {
        setDeleteModel((prevVisible) => !prevVisible)
    }
    const toggelEditModel = () => {
        setEditModel((prevVisible) => !prevVisible)
    }

    const toggelAddImageModel = () => {
        setAddImageModel((prevVisible) => !prevVisible)
    }

    const handleLongPress = (item) => {
        setLongPressedComment(item);
        rbSheetRef.current.open(); // Open the RBSheet to display actions
    };

    const handleCommentReplyLongPress = (item) => {
        setLongPressedCommentReply(item);
        rbSheetRef.current.open(); // Open the RBSheet to display actions
    };

    const toggleCommentInput = () => {
        setShowCommentInput(!showCommentInput);
        rbSheetRef.current?.open(); // Open RBSheet first
    };


    const fetchUserPosts = async (postId) => {
        try {
            setLoadingUserPosts(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('fetch', 'post_data')
                formData.append('post_id', postId)

                const response = await onGetPostData(formData, token)
                if (response.data.api_status === 200) {
                    setUserPost(response.data.post_data)
                    setPostData(response.data.post_data)
                    setLoadingUserPosts(false)
                    console.log('This is USerPost', response.data.post_data)
                } else if (response.data.api_status === 400 || 404) {
                    setLoadingUserPosts(false)
                    console.log('Error fetching UserPost', response.data.errors.error_text)
                }
            }
            else {
                setLoadingUserPosts(false)
                console.log('Token not found', error.message)
            }
        } catch (err) {
            setLoadingUserPosts(false)
            console.log("Get Error::", err)
        }
    };

    useEffect(() => {
        fetchUserPosts(postId)
    }, [])


    const addImage = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('access_token');

            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('type', 'add');
                formData.append('id', postId);
                formData.append('album_name', postData.album_name);

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
                    fetchUserPosts(postId);
                    setLoading(false);
                    setAddImageModel(false)
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

    const handleLikepages = async (postId) => {
        try {
            setPostData((prevData) => ({
                ...prevData,
                is_liked: !prevData.is_liked,
                post_likes: prevData.is_liked ? prevData.post_likes - 1 : prevData.post_likes + 1,
                // You may also need to update other related properties like post_likes if needed
            }));
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('post_id', postId);
                formData.append('action', 'like');

                const response = await onPageLikeApi(formData, token);
                if (response.data.api_status === 200) {
                    console.log('Page Liked', response.data);
                } else if (response.data.api_status === 400 || response.data.api_status === 404) {
                    console.log('Something went wrong', response.data.errors.error_text);
                }
            } else {
                console.log('User Token not found');
                // Handle the absence of user token (e.g., redirect to login)
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleComments = async (postId, id, type) => {
        try {
            console.log('this is the post id and type', postData, type)
            if (type === 'fetch_comments') {
                setLoadingComments(true); // Show loading only when fetching comments
            }
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('post_id', postId);

                if (type === 'create') {
                    // If commentText exists, create a comment
                    formData.append('type', 'create');
                    if (commentText) {
                        formData.append('text', commentText);
                    } else if (commentImage) {
                        formData.append('image_url', commentImage)
                    }
                } else if (type === 'delete') {
                    formData.append('type', 'delete');
                    formData.append('comment_id', id)
                } else if (type === 'comment_like') {
                    formData.append('type', 'comment_like');
                    formData.append('comment_id', id)
                } else if (type === 'comment_dislike') {
                    formData.append('type', 'comment_dislike');
                    formData.append('comment_id', id)
                } else if (type === 'fetch_comments_reply') {
                    formData.append('type', 'fetch_comments_reply')
                    formData.append('comment_id', id)
                } else if (type === 'create_reply') {
                    formData.append('type', 'create_reply')
                    formData.append('comment_id', id)
                    formData.append('text', commentReplyText)
                }
                else {
                    // If commentText doesn't exist, fetch comments
                    formData.append('type', type);
                    console.log('this is the post id and type', postId, type)

                }

                const response = await commentonPost(formData, token);
                if (response.data.api_status === 200) {
                    if (commentText || commentImage) {
                        // If a comment or image was sent, update comments state accordingly
                        const updatedComments = [...comments, response.data.data];
                        setComments(updatedComments);
                        setCommentText(''); // Clear the TextInput if a comment was sent
                        setCommentImage(null); // Clear the selected image if an image was sent
                        ToastAndroid.show('Comment/Image posted successfully', ToastAndroid.SHORT);
                    } else if (type === 'delete') {
                        // Remove the deleted comment from the comments array
                        setComments(prevComments => {
                            const updatedCommentList = prevComments.filter(comment => comment.id !== id);
                            console.log('Comment deleted successfully');
                            ToastAndroid.show('Comment deleted successfully', ToastAndroid.SHORT);
                            return updatedCommentList;
                        });
                    } else if (type === 'comment_like') {
                        console.log('comment like');
                        // Update comments state to reflect the like
                        setComments(prevComments => {
                            const updatedCommentList = prevComments.map(comment => {
                                if (comment.id === id) {
                                    // Assuming there is a property like `is_comment_liked` that needs to be updated
                                    return { ...comment, is_comment_liked: true, comment_likes: comment.comment_likes + 1 };
                                }
                                return comment;
                            });
                            return updatedCommentList;
                        });
                        ToastAndroid.show('Comment liked', ToastAndroid.SHORT);
                    }
                    else if (type === 'comment_dislike') {
                        console.log('comment dislike');
                        // Update comments state to reflect the dislike
                        setComments(prevComments => {
                            const updatedCommentList = prevComments.map(comment => {
                                if (comment.id === id) {
                                    // Assuming there is a property like `is_comment_liked` that needs to be updated
                                    return { ...comment, is_comment_liked: true, comment_likes: comment.comment_likes - 1 };
                                }
                                return comment;
                            });
                            return updatedCommentList;
                        });
                        ToastAndroid.show('Comment disliked', ToastAndroid.SHORT);
                    } else if (type === 'fetch_comments_reply') {
                        console.log('comments reply ', response.data)
                        console.log('this is the post id and type', postId, id, type)
                        setCommentsReply(response.data.data)
                    } else if (type === 'create_reply') {
                        // If a comment or image was sent, update comments state accordingly
                        const updatedComments = [...comments, response.data.data];
                        setCommentsReply(updatedComments);
                        setCommentReplyText(''); // Clear the TextInput if a comment was sent
                        // setCommentImage(null); // Clear the selected image if an image was sent
                        ToastAndroid.show('Reply successfully', ToastAndroid.SHORT);
                    }
                    else {
                        // If commentText doesn't exist, update comments state
                        setComments(response.data.data);
                        console.log('Fetched comments:', response.data);
                        console.log('this is the post id and type', postId, type)

                    }
                } else if (response.data.api_status === 400 || response.data.api_status === 404) {
                    if (commentText) {
                        console.log('Error while posting comment:', response.data.errors.error_text);
                    } else {
                        console.log('Error while fetching comments:', response.data.errors.error_text);
                    }
                }
            } else {
                console.log('User Token not found', error.message);
            }
        } catch (error) {
            console.log('Error:', error);
        }
        finally {
            if (type === 'fetch_comments') {
                setLoadingComments(false); // Hide loading after fetching comments
            }
        }
    };


    const handlePostActions = async (selectedPostId, action) => {
        try {
            // setLoading(true)

            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('post_id', selectedPostId)

                if (action === 'edit') {
                    formData.append('action', 'edit')
                    if (editText) {
                        formData.append('text', editText)
                    }
                    if (editImage) {
                        // If postPhotos contains multiple images, append them individually
                        if (Array.isArray(postPhotos)) {
                            postPhotos.forEach((image, index) => {
                                formData.append(`postPhotos[${index}]`, image);
                            });
                        } else {
                            formData.append('postPhotos[0]', postPhotos);
                        }
                    }
                }
                else if (action === 'delete') {
                    formData.append('action', 'delete')
                } else if (action === 'savePost') {
                    formData.append('action', 'save')
                } else if (action === 'reportPost') {
                    formData.append('action', 'report')
                } else if (action === 'hidePost') {
                    await hidePost(selectedPostId)
                } else if (action === 'unsavePost') {
                    formData.append('action', 'unsave')
                } else if (action === 'disable_comments') {
                    formData.append('action', commentStatus === '0' ? 'enable_comments' : 'disable_comments');
                }
                const response = await onPageLikeApi(formData, token)
                if (response.data.api_status === 200) {
                    // Display messages for successful actions
                    if (action === 'edit') {
                        setEditModel(false)
                         fetchUserPosts(postId)
                        console.log('Post edited successfully', response.data);
                        ToastAndroid.show('Post edited successfully', ToastAndroid.SHORT);
                    } else if (action === 'delete') {
                        setDeleteModel(false)
                        setModelVisible(false)
                         fetchUserPosts(postId)
                        console.log('Post deleted successfully', response.data);
                        ToastAndroid.show('Post deleted successfully', ToastAndroid.SHORT);
                    } else if (action === 'savePost') {
                        console.log('Post saved', response.data);
                        ToastAndroid.show(response.data.action, ToastAndroid.SHORT);
                    } else if (action === 'reportPost') {
                        // await fetchUserPost(UserId)
                        console.log('report successfully', response.data);
                        ToastAndroid.show(response.data.action, ToastAndroid.SHORT);
                    } else if (action === 'unsavePost') {
                        console.log('Post Unsaved', response.data);
                        ToastAndroid.show(response.data.action, ToastAndroid.SHORT);
                    } else if (action === 'disable_comments') {
                        console.log('disable_comments', response.data);
                         fetchUserPosts(postId)
                        ToastAndroid.show(response.data.action, ToastAndroid.SHORT);
                    }
                } else if (response.data.api_status === 400) {
                    console.log('somthing went wrong:', response.data.errors.error_text)
                    ToastAndroid.show('somthing went wrong please try again', ToastAndroid.SHORT)
                }
            } else {
                console.log('User Token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
        // finally {
        //     setLoading(false)
        // }
    }

    const handleShare = (item) => {
        Share.share({
            message: `Check out this post: ${item.url}`, // Customize the shared message here
        })
            .then(result => console.log(result))
            .catch(errorMsg => console.error(errorMsg));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView contentContainerStyle={{ paddingBottom: hp(10) }} showsVerticalScrollIndicator={false}>
                {!isGalleryVisible ? (
                    <View style={styles.headerView}>
                        <BasicHeader onPress={() => navigation.goBack()} title={'Album info'} />
                    </View>
                ) : null}
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>


                    {loadingUserPosts ? (
                        <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                            <Loader isLoading={loadingUserPosts} />
                        </View>
                    ) : (
                        isGalleryVisible ? (
                            <>
                                <Gallery
                                    style={{ flex: 1, height: '100%', backgroundColor: 'black' }}
                                    images={userPost.photo_album.map(albumImage => ({ source: { uri: albumImage.image } }))}
                                    onSingleTapConfirmed={() => setGalleryVisible(false)}
                                />
                                <TouchableOpacity onPress={() => setGalleryVisible(false)} style={{ position: 'absolute', top: hp(1), left: wp(1) }}>
                                    <MaterialCommunityIcons name='close-circle' size={wp(8)} color={COLORS.white} />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.ProfileComplitionContainer}>
                                <View style={{ marginTop: hp(1), marginHorizontal: wp(4), justifyContent: 'space-evenly', width: '92%', flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', width:    '94%' }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: userPost.publisher.user_id })}>
                                            <Image
                                                style={{ height: hp(5), width: hp(5), borderRadius: hp(5) }}
                                                source={{ uri: userPost?.publisher?.avatar }}
                                            />
                                        </TouchableOpacity>
                                        <View style={{ marginVertical: hp(1), justifyContent: 'space-between', marginLeft: wp(2), flexWrap: 'wrap', width: '80%' }}>
                                            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: userPost.publisher.user_id })}>
                                                <Text style={{
                                                    fontSize: hp(2),
                                                    fontFamily: fontFamily.FONTS.bold,
                                                    color: COLORS.black,
                                                }} numberOfLines={1}>{userPost?.publisher?.username}</Text>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(1.9), }} numberOfLines={1}>{`added new photos to ${userPost?.album_name}`}</Text>
                                                <Text
                                                    style={{
                                                        fontSize: hp(1.9),
                                                        paddingHorizontal: wp(3),
                                                        fontFamily: fontFamily.FONTS.regular,
                                                        color: COLORS.gray,
                                                    }}>
                                                    ({postData?.post_time})
                                                </Text>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: wp(1) }}>
                                        <TouchableOpacity onPress={() => { toggleMenu(null, postData.post_id, postData.Orginaltext, postData.postFile, postData.photo_album, postData.comments_status, postData.is_post_saved); postActionMenuRef.current.open() }}>
                                            <Entypo name="dots-three-vertical" size={20} color={COLORS.darkgray1} />
                                        </TouchableOpacity>
                                        {/*<TouchableOpacity onPress={() => toggelModel(item.post_id)}>
                                              <AntDesign name="down" size={20} color={COLORS.darkgray1} />
                                        </TouchableOpacity> */}
                                    </View>
                                    <RBSheet
                                        ref={postActionMenuRef}
                                        closeOnDragDown={true}
                                        height={400}
                                        dragFromTopOnly={true}
                                        openDuration={250}
                                        customStyles={{
                                            container: {
                                                borderTopLeftRadius: 20,
                                                borderTopRightRadius: 20,
                                                backgroundColor: 'white',
                                            },
                                        }}
                                    >
                                        <View style={{ marginHorizontal: wp(3), marginVertical: hp(2), width: '90%' }}>
                                            <TouchableOpacity onPress={() => {
                                                toggleMenu('edit', null, null, null); postActionMenuRef.current.close();
                                            }}>
                                                <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center' }}>
                                                    <MaterialCommunityIcons name='pencil-outline' size={24} color={COLORS.black} />
                                                    <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Edit Post</Text>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Edit post information</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => { toggleMenu('delete', null, null, null); postActionMenuRef.current.close(); }}>
                                                <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                    <Materialicons name='delete-outline' size={24} color={COLORS.red} />
                                                    <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.red }}>Delete Post</Text>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.red }}>Delete this post completely</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => { toggleMenu('disable_comments', null, null, null); postActionMenuRef.current.close(); }}>
                                                <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                    <MaterialCommunityIcons name='comment-text-outline' size={24} color={COLORS.black} />
                                                    <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Disable Comments</Text>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Allow or Disallow members to comment on this post</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => { toggleMenu('pinPost', null, null, null); postActionMenuRef.current.close(); }}>
                                                <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                    <AntDesign name='pushpino' size={24} color={COLORS.black} />
                                                    <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Pin Post</Text>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Pin this post to the top of your profile</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => toggleMenu('add', postData.post_id, postData.Orginaltext, postData.photo_album)}>
                                                <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center' }}>
                                                    <Ionicons name='camera-outline' size={24} color={COLORS.black} />
                                                    <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Add Photos</Text>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Add more photos to this album.</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => navigation.navigate('UpgradeToPro')}>
                                                <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                    <MaterialCommunityIcons name='lightning-bolt-outline' size={24} color={COLORS.black} />
                                                    <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Boost Post</Text>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Add this post from the boosted list</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </RBSheet>
                                </View>

                                <View>
                                    {postData.Orginaltext && (
                                        <View>
                                            <Text style={styles.postDetails}>{userPost.Orginaltext}</Text>
                                        </View>
                                    )}
                                    <FBCollage
                                        images={postData?.photo_album?.map(albumImage => albumImage.image) || []}
                                        imageOnPress={() => setGalleryVisible(true)}
                                        borderRadius={2}
                                        spacing={2}
                                    />

                                    <View style={styles.likesAndCommentView}>
                                        <View style={styles.likesCountView}>
                                            <AntDesign name="like2" size={20} color={COLORS.darkgray} />
                                            <Text style={[styles.postDetails3, { marginLeft: wp(1) }]}>{postData?.post_likes}</Text>
                                        </View>

                                        {postData.comments_status === "1" ? (
                                            <TouchableOpacity onPress={() => { toggleCommentInput(); handleComments(postData.post_id, null, 'fetch_comments'); }}>
                                                <Text style={styles.postDetails3} >{postData?.post_comments} comments</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View>
                                                <Text style={styles.postDetails3}>Comments disabled</Text>
                                            </View>
                                        )}

                                    </View>

                                    {/* <View style={{ padding: 10, flexDirection: 'row',   justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Materialicons name="insert-comment" size={20} color={COLORS.gray} />
                                    </View> */}
                                </View>

                                <View style={styles.FollowinghorizontalLine} />
                                <View style={{ paddingTop: hp(1.5), marginBottom: hp(1.5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', alignSelf: "center" }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleLikepages(postId)} >
                                            <AntDesign name={postData.is_liked ? 'heart' : 'hearto'} size={24} color={postData.is_liked ? COLORS.red1 : COLORS.darkgray} />
                                            {/** <Text style={[styles.postDetails3, { color: item.is_liked ? COLORS.red : COLORS.black }]}>Likes</Text> */}
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => { toggleCommentInput(); handleComments(postId, null, 'fetch_comments'); }} disabled={postData.comments_status === '0'}>
                                            <Feather name="message-circle" size={24} color={COLORS.darkgray} />
                                            {/**  <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.darkgray1 }}>Comment</Text> */}
                                        </TouchableOpacity>


                                        <TouchableOpacity style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleShare(postData)} >
                                            <Feather name="send" size={22} color={COLORS.darkgray} />
                                            {/**    <Text style={styles.postDetails3}>Share</Text> */}
                                        </TouchableOpacity>
                                    </View>


                                </View>

                                <RBSheet
                                    ref={rbSheetRef}
                                    closeOnDragDown={true}
                                    height={500}
                                    dragFromTopOnly={true}
                                    openDuration={250}
                                    onClose={() => {setShowCommentInput(false)}}
                                    customStyles={{
                                        container: {
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                            backgroundColor: 'white',
                                        },
                                    }}
                                >
                                    {showCommentInput && (
                                        <View style={{ flex: 1 }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: hp(1) }}>
                                                <Text style={{ color: COLORS.darkgray1, fontFamily: fontFamily.FONTS.regular, fontSize: 16 }}>Comments</Text>
                                            </View>
                                            {/* Your comment input UI */}
                                            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f2f5', width: '100%' }}>
                                                <Image source={{ uri: user_data?.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
                                                <View style={{ flex: 1, marginHorizontal: wp(2), height: 40, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ededed', borderRadius: wp(2) }}>
                                                    <TextInput
                                                        placeholder=' Write a comment and press enter'
                                                        placeholderTextColor={COLORS.secondaryGray}
                                                        style={styles.CommentInput}
                                                        value={commentText}
                                                        onChangeText={text => setCommentText(text)}
                                                    />
                                                    <TouchableOpacity onPress={openImagePicker}>
                                                        <Ionicons name='camera-outline' size={23} color={COLORS.darkgray1} />
                                                    </TouchableOpacity>
                                                </View>
                                                <TouchableOpacity onPress={() => handleComments(postId, null, 'create')}>
                                                    < Materialicons name='send' size={23} color={COLORS.darkgray1} />
                                                </TouchableOpacity>

                                            </View>
                                            {/* Display comments */}
                                            {loadingComments ? (
                                                <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                                    <Loader isLoading={loadingComments} />
                                                </View>
                                            ) : (
                                                <FlatList
                                                    data={comments}
                                                    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                                                    renderItem={({ item }) => (
                                                        <>
                                                            {longPressedComment === item && (
                                                                <View style={{ backgroundColor: COLORS.lightBlue }}>
                                                                    <View style={{ flexDirection: 'row', height: hp(7), justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.7), color: COLORS.white, paddingHorizontal: wp(4) }}>1 Selected</Text>
                                                                        {item.onwer ? (
                                                                            <View style={{ flexDirection: 'row', paddingHorizontal: wp(2), alignItems: 'center' }}>
                                                                                <TouchableOpacity onPress={() => handleComments(postId, item.id, 'edit')} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                    <Feather name="edit-2" size={hp(3)} color={COLORS.white} />
                                                                                </TouchableOpacity>
                                                                                <TouchableOpacity onPress={() => handleComments(postId, item.id, 'delete')} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                    <MaterialCommunityIcons name="delete-outline" size={hp(3.5)} color={COLORS.white} />
                                                                                </TouchableOpacity>
                                                                                <TouchableOpacity onPress={() => setLongPressedComment(null)} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                    <Entypo name="cross" size={hp(4)} color={COLORS.white} />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        ) : (
                                                                            <View style={{ flexDirection: 'row', paddingHorizontal: wp(2), alignItems: 'center' }}>
                                                                                <TouchableOpacity onPress={() => reportComment(item.id)} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                    <Materialicons name="report-gmailerrorred" size={hp(3)} color={COLORS.white} />
                                                                                </TouchableOpacity>
                                                                                <TouchableOpacity onPress={() => setLongPressedComment(null)} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                    <Entypo name="cross" size={hp(4)} color={COLORS.white} />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        )}
                                                                    </View>
                                                                </View>
                                                            )}
                                                            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <View style={{ flexDirection: 'row', }}>
                                                                    <Image source={{ uri: item.publisher?.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
                                                                    <TouchableOpacity
                                                                        onLongPress={() => handleLongPress(item)}
                                                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                                                    >
                                                                        <View style={{ marginHorizontal: wp(3), height: 'auto', maxWidth: '100%', padding: 10, borderRadius: 8, backgroundColor: '#f0f2f5' }}>
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.publisher.user_id })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2), color: COLORS.black }}>{item.publisher?.username}</Text>
                                                                                    <Materialicons name="check-circle" size={18} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(1) }} />
                                                                                </TouchableOpacity>

                                                                            </View>
                                                                            <View>
                                                                                {item.c_file != "" ? (
                                                                                    <Image source={{ uri: item.c_file }} style={{ height: hp(10), width: wp(30), marginTop: hp(1) }} />
                                                                                ) : (
                                                                                    <View>
                                                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.primarygray }}>{item.text}</Text>

                                                                                    </View>
                                                                                )}
                                                                            </View>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', }}>
                                                                    <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'column' }} onPress={() => handleComments(postId, item.id, item.is_comment_liked ? 'comment_dislike' : 'comment_like')}>
                                                                        <MaterialCommunityIcons name={item.is_comment_liked ? "heart" : "heart-outline"} size={21} color={item.is_comment_liked ? COLORS.red : COLORS.darkgray1} />
                                                                        <Text style={{ color: COLORS.darkgray1, fontSize: hp(2.2) }}>{item.comment_likes}</Text>
                                                                        {/* <MaterialCommunityIcons name="heart" size={18} color={COLORS.darkgray1} /> */}
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </>
                                                    )}
                                                    contentContainerStyle={{ flexGrow: 1 }}
                                                    ListEmptyComponent={() => (
                                                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 15, color: COLORS.darkgray1 }}>No comments to show</Text>
                                                        </View>
                                                    )}
                                                />
                                            )}
                                        </View>
                                    )
                                    }
                                </RBSheet>

                            </View>
                        )
                    )}


                    {/* edit model */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={editModel}
                        onRequestClose={toggelEditModel}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.reportModelContainer}>
                                <View style={{ paddingBottom: hp(2), flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.black }}>Edit Post</Text>
                                    </View>
                                    <TouchableOpacity onPress={toggelEditModel}>
                                        <Entypo name="cross" size={18} color={COLORS.darkgray} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ paddingHorizontal: 4, }}>
                                    <TextInput
                                        placeholder="type text"
                                        placeholderTextColor={COLORS.secondaryGray}
                                        multiline={true}
                                        numberOfLines={5}
                                        value={editText}
                                        onChangeText={text => setEditText(text)}
                                        textAlignVertical="top"
                                        style={styles.descriptionInput}
                                    />
                                </View>



                                <View style={{ flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                                    <TouchableOpacity style={{ backgroundColor: '#f7e5e5', borderRadius: 10, padding: 5, }} onPress={() => handlePostActions(selectedPostId, 'edit')} >
                                        <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.red }}>Update</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>

                    {/* add Image model */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={addImageModel}
                        onRequestClose={toggelAddImageModel}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.reportModelContainer}>
                                <View style={{ paddingBottom: hp(2), flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.black }}>Add Images</Text>
                                    </View>
                                    <TouchableOpacity onPress={toggelAddImageModel}>
                                        <Entypo name="cross" size={18} color={COLORS.darkgray} />
                                    </TouchableOpacity>
                                </View>

                                {editImage && editImage.length > 0 && (
                                    <View style={{ marginVertical: hp(1), flexDirection: 'row' }}>
                                        <View style={{ marginHorizontal: wp(1), alignItems: 'center' }}>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                <View>
                                                    <TouchableOpacity onPress={openImagePicker} style={styles.imagePicker}>
                                                        <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                                                            <MaterialCommunityIcons name='image' size={24} color={COLORS.white} />
                                                            <Text style={{ color: COLORS.white, padding: 6, fontFamily: fontFamily.FONTS.Medium }}>Choose Image</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                {editImage.map((imageObj, index) => (
                                                    <Image key={imageObj.id} source={{ uri: imageObj.image }} style={{ marginHorizontal: wp(2), height: wp(30), width: wp(30), borderRadius: wp(2) }} />
                                                ))}

                                                {selectedImages.length > 0 && (
                                                    <View style={{ flexDirection: 'row', }}>
                                                        {selectedImages.map((image, index) => (
                                                            <View key={index} >
                                                                <Image
                                                                    source={{ uri: image }}
                                                                    style={{ marginHorizontal: wp(2), height: wp(30), width: wp(30), borderRadius: wp(2) }}
                                                                />
                                                                {/* Cancel button for the selected image */}
                                                                <TouchableOpacity
                                                                    onPress={() => removeSelectedImage(image)}
                                                                    style={{ position: 'absolute', top: 3, right: 10 }}
                                                                >
                                                                    <MaterialCommunityIcons name='close-circle' size={wp(6)} color={COLORS.red} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        ))}
                                                    </View>
                                                )}
                                            </ScrollView>
                                        </View>
                                    </View>
                                )}

                                <View style={{ flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                                    <TouchableOpacity style={{ backgroundColor: '#f7e5e5', borderRadius: 10, padding: 5, }} onPress={() => addImage()} >
                                        <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.red }}>Add</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>

                    {/* delete model */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={deleteModel}
                        onRequestClose={toggleDeleteModel}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{
                                marginTop: hp(2),
                                // padding: 15,
                                width: '70%',
                                height: 'auto',
                                backgroundColor: global.ContentContainer.backgroundColor,
                                marginHorizontal: wp(2),
                                borderRadius: 10
                            }}>
                                <View style={{ padding: hp(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.8), color: COLORS.black }}>Delete this Post?</Text>
                                    </View>
                                </View>
                                <View>
                                    <View style={{ marginHorizontal: wp(7) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2), textAlign: 'justify' }}>Are you sure that you want to delete this post once you delete it you can not recover it; it will be deleted permanently.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', marginTop: hp(1.5), justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity style={{
                                            // backgroundColor: '#f7e5e5',
                                            // borderRadius: 10,
                                            // padding: 3,
                                            // borderWidth: 0.5,
                                            height: hp(6),
                                            borderTopWidth: 0.4,
                                            paddingVertical: hp(1.3),
                                            borderColor: COLORS.secondaryGray,
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} onPress={() => handlePostActions(selectedPostId, 'delete')} >
                                            {loading ? (
                                                <Loader isLoading={loading} />
                                            ) : (
                                                <Text style={{ paddingHorizontal: wp(4), fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.red }}>Delete</Text>
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            // borderRadius: 10,
                                            // padding: 3,
                                            height: hp(6),
                                            paddingVertical: hp(1.3),
                                            borderTopWidth: 0.4,
                                            borderColor: COLORS.secondaryGray,
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} onPress={toggleDeleteModel}>
                                            <Text style={{ paddingHorizontal: wp(4), fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.darkgray1 }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AlbumsDetails;

const localStyles = (theme, WD, WH) => {
    const global = globalStyles(theme);

    return StyleSheet.create({

        container: {
            marginHorizontal: wp(2),
            backgroundColor: global.ContentContainer.backgroundColor,
            borderRadius: 10,
        },
        imagePicker: {
            width: wp(30),
            height: wp(30),
            // marginHorizontal: 15,
            backgroundColor: '#eaeaea',
            color: global.inputText.color,
            // borderColor: COLORS.secondaryBlack,
            borderRadius: wp(2),
            justifyContent: 'space-between'
        },
        underlinedText: {
            textDecorationLine: 'line-through',
            color: COLORS.secondaryGray
        },
        imageContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        inputContainer: {
            marginTop: hp(5)
        },
        lable: {
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.darkgray1,
            fontSize: hp(2.1)
        },
        backgroundImage: {
            height: hp(22),
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            width: '100%'
        },
        overlay: {
            position: 'absolute',
            top: 5,
            right: 0,
        },

        inputText: {
            color: global.inputText.color
        },
        conteredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
            // marginTop: hp(20),
            paddingHorizontal: wp(2)
        },
        modelView: {
            borderRadius: 10,
            padding: 13,
            width: '80%',
            height: 'auto',
            backgroundColor: global.ContentContainer.backgroundColor,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,

        },

        modelContent: {
            padding: 3,
            flexDirection: 'row',
            paddingHorizontal: 6
        },
        modelText: {
            fontSize: hp(2.2),
            padding: 4,
            paddingHorizontal: 15,
            fontFamily: fontFamily.FONTS.regular,
            color: '#555555',
        },
        userDetails: {
            width: '100%',
            // padding: 10,
            borderRadius: 10,
            backgroundColor: '#f5f5f5'
        },
        userName: {
            padding: 5,
            fontSize: hp(2.2),
            fontFamily: fontFamily.FONTS.Medium,
            color: global.text2.color
        },
        userImageContainer: {
            borderRadius: 100,
            padding: 4,
            backgroundColor: COLORS.secondaryWhite,
            position: 'absolute',
            top: hp(15),
            alignSelf: 'center'
        },
        userImage: {
            height: hp(15),
            width: wp(30),
            borderRadius: 100
        },
        userNameContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp(10)
        },
        username: {
            fontSize: hp(2.8),
            color: global.text2.color,
        },
        profilePartButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: hp(2.5)
        },
        EditButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e0e0e0',
            borderRadius: 10,
            paddingHorizontal: wp(2.5),
            marginHorizontal: wp(2.5)
        },
        EditButtonText: {
            padding: 5,
            marginHorizontal: 5,
            color: COLORS.black,
            fontFamily: fontFamily.FONTS.regular,
            fontSize: hp(2.2)
        },
        horizontalTab: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: hp(3.5),
            flexWrap: 'wrap'
        },
        horizontalTabText: {
            padding: 5,
            marginHorizontal: wp(3.2),
            fontSize: hp(2.1),
            color: COLORS.black,
        },
        PostModel: {
            marginTop: hp(2),
            width: '100%',
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: 10
        },
        ProfileComplitionContainer: {
            marginTop: hp(2),
            width: '100%',
            backgroundColor: global.ContentContainer.backgroundColor,
            // marginHorizontal: wp(2),
            borderRadius: 10
        },
        firstView1: {
            width: '94%',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 10,
            alignSelf: 'center',
            marginBottom: hp(2),
            paddingBottom: hp(2),
        },
        ProfileComplitionButton: {
            flexDirection: 'row',
            paddingHorizontal: wp(2),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderColor: COLORS.secondaryWhite,
            borderWidth: 1,
            marginTop: hp(1.5),
            marginHorizontal: 5
        },
        ProfileComplitionHading: {
            padding: 5,
            marginHorizontal: wp(3),
            fontSize: hp(3.2),
            color: global.text2.color
        },
        ProfileComplitionButtonText: {
            padding: 5,
            // marginHorizontal: 18,
            fontSize: hp(2.2),
            color: global.text2.color
        },
        InfoContainer: {
            // marginTop: hp(1),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: 10
        },
        infoContent: {
            padding: 10,
            paddingHorizontal: wp(2.5),
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'sp',
        },
        infoContentContainer: {
            flexDirection: 'row',
            alignItems: "center",
            paddingHorizontal: wp(2.5)
        },
        infoContentText: {
            padding: 10,
            paddingHorizontal: 'auto',
            fontSize: hp(2.2),
            color: global.text2.color
        },
        infoContentPost: {
            // padding: 10,
            paddingHorizontal: 'auto',
            fontSize: hp(2.2),
            color: global.text2.color
        },
        albumsContainer: {
            padding: 10,
            paddingHorizontal: wp(2.5),
            marginTop: hp(3),
            flexDirection: 'row',
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2.5),
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 10
        },
        horizontalMenu: {
            padding: 10,
            paddingHorizontal: 15,
            marginTop: 25,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            alignItems: 'center',
            borderRadius: 10
        },
        albumsText: {
            marginHorizontal: wp(2),
            fontSize: hp(2.2),
            fontFamily: fontFamily.FONTS.Medium,
            color: global.text2.color
        },
        postTitle: {
            marginHorizontal: wp(2),
            marginBottom: hp(1.3),
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.regular,
            color: global.text2.color
        },
        postDetails: {
            marginVertical: hp(2),
            paddingHorizontal: wp(5),
            fontSize: hp(1.9),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            width: '96%'
        },
        postDetails1: {
            marginVertical: hp(2),
            paddingLeft: wp(5),
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            textAlign: 'justify',
            width: '96%'
        },
        postDetails2: {
            paddingLeft: wp(5),
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            textAlign: 'justify',
            width: '96%'
        },
        donationText: {
            fontSize: hp(2.2),
            fontFamily: fontFamily.FONTS.bold,
            color: COLORS.white
        },
        donationButton: {
            width: wp(20),
            height: hp(3),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            backgroundColor: COLORS.white
        },
        donationView: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        donationText1: {
            fontSize: hp(1.8),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.white
        },
        customInput: {
            width: '96%',
            height: hp(6),
            marginHorizontal: wp(2),
            backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: COLORS.secondaryBlack,
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        CommentInput: {
            width: '85%',
            height: 40,
            marginHorizontal: 4,
            backgroundColor: '#ededed',
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 10,
            justifyContent: 'center',
        },
        showMoreView: {
            width: '45%',
            height: hp(5),
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: COLORS.white,
            borderRadius: hp(5),
            marginBottom: hp(2),
            marginTop: hp(2),
            alignSelf: 'center',
        },
        loadText: {
            fontSize: hp(1.9),
            paddingHorizontal: 4,
            fontFamily: fontFamily.FONTS.Medium,
            color: '#555555',
        },
        FollowingContainer: {
            marginTop: hp(2.5),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: 10
        },
        SearchContainer: {
            marginTop: hp(2),
            padding: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: 10
        },
        FollowingContent: {
            padding: 10,
            paddingHorizontal: wp(2),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        FollowingHading: {
            padding: 5,
            marginHorizontal: 5,
            fontSize: hp(2.4),
            color: global.text2.color
        },
        FollowersName: {
            padding: 5,
            fontSize: hp(2),
            color: global.text2.color
        },
        iconStyle: {
            backgroundColor: COLORS.red,
            borderRadius: 50,
            padding: 4
        },
        postIconStyle: {
            backgroundColor: '#f3f3f3',
            borderRadius: 100,
            padding: 8
        },
        reportModelContainer: {
            marginTop: hp(2),
            padding: 15,
            width: wp(90),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: 10
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
        horizontalLine: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 0.5,
            padding: 5,
            // marginHorizontal: 15,
        },
        FollowinghorizontalLine: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 0.5,
            // padding: 5,
            // marginHorizontal: 15,
        },
        likesAndCommentView: {
            width: '100%',
            height: hp(4),
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal: wp(4),
            marginTop: hp(1),
            marginBottom: hp(0.5)
        },
        likesCountView: {
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row'
        },
        commentCountView: {
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row'
        },
        postDetails3: {
            fontSize: hp(1.9),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            textAlign: 'center'
        },
        dropDownContainer: {
            // marginTop: 10,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            justifyContent: 'space-between',
            height: 45,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: wp(3)
        },
        optionView: {
            width: '100%',
            height: hp(6),
            marginLeft: wp(3),
            justifyContent: 'center'
        },
        collapsView: {
            width: '100%',
            minHeight: hp(12),
            backgroundColor: '#fff',
            borderWidth: 0.5,
            borderColor: '#eeeff0',
        },
        titleText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
        optionText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
    });
}