/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Image, FlatList, ToastAndroid } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import Materialicons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onGetPostApi, onPageLikeApi, commentonPost, getMostWatchedPost, reportComments } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import RBSheet from 'react-native-raw-bottom-sheet'; // Import RBSheet

const PopularPost = () => {
    const navigation = useNavigation();
    const user_data = useSelector(state => state.user_data)
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [modelVisible, setModelVisible] = useState(false)
    const [userPost, setUserPost] = useState([])
    const [postData, setPostData] = useState([])
    const [posts, setPosts] = useState([])
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [loading, setLoading] = useState(false)
    const [loadingUserPosts, setLoadingUserPosts] = useState(false);
    const [loadingLikePages, setLoadingLikePages] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false)

    const [selectedImage, setSelectedImage] = useState([]);
    const [postEditPhotos, setPostEditPhotos] = useState([]);
    const [postEditPhotosType, setPostEditPhotosType] = useState([]);
    const [selectedEditImage, setSelectedEditImage] = useState([]);
    const [commentImage, setCommentImage] = useState(null)
    const [commentImageType, setCommentImageType] = useState('')
    const [commentsReply, setCommentsReply] = useState([])
    const [commentsReplyVisible, setCommentsReplyVisible] = useState({})
    const rbSheetRef = useRef(null); // Reference for RBSheet
    const [longPressedComment, setLongPressedComment] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [deleteModel, setDeleteModel] = useState(false)
    const [editModel, setEditModel] = useState(false)
    const [edit, setEdit] = useState(userPost.Orginaltext || '')
    const [editText, setEditText] = useState(null)
    const [editImage, setEditImage] = useState(null)

    const toggleMenu = (value, postId, Orginaltext, postFile) => {
        setSelectedPostId(postId)
        setEditText(Orginaltext)
        setEditImage(postFile)
        if (value === 'edit') {
            toggelEditModel()
        }
        if (value === 'delete') {
            toggleDeleteModel()
        }
        if (value === 'disableComments') {
            handlePostActions('disableComments')
        }
        console.log('this is the selcted value', value)
        console.log('this is the selcted post id', postId)
    };

    const toggleDeleteModel = (selectedPostId) => {
        setDeleteModel((prevVisible) => !prevVisible)
    }
    const toggelEditModel = () => {
        setEditModel((prevVisible) => !prevVisible)
    }

    const handleLongPress = (item) => {
        setLongPressedComment(item);
        rbSheetRef.current.open(); // Open the RBSheet to display actions
    };

    const toggleCommentInput = () => {
        setShowCommentInput(!showCommentInput);
        rbSheetRef.current?.open(); // Open RBSheet first
    };


    useEffect(() => {
        fetchSavedPosts()
    }, [])

    const fetchSavedPosts = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                // formData.append('type', 'saved')
                // formData.append('limit', '1')
                // formData.append('after_post_id', '3')

                const response = await getMostWatchedPost(formData, token)
                if (response.data.api_status === 200) {
                    setPosts(response.data.data)
                    setLoading(false)
                    console.log('this is the saved Post ', response.data)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('this is the saved Post ', response.data.errors.error_text)
                }
            }
            else {
                setLoading(false)
                console.log('User token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    const handleComments = async (post_id, id, type) => {
        try {
            console.log('this is the post id and type', post_id, type)
            if (type === 'fetch_comments') {
                setLoadingComments(true); // Show loading only when fetching comments
            }
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('post_id', post_id);

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
                }
                else {
                    // If commentText doesn't exist, fetch comments
                    formData.append('type', type);
                    console.log('this is the post id and type', post_id, type)

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
                                    return { ...comment, is_comment_liked: true };
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
                                    return { ...comment, is_comment_liked: false };
                                }
                                return comment;
                            });
                            return updatedCommentList;
                        });
                        ToastAndroid.show('Comment disliked', ToastAndroid.SHORT);
                    } else if (type === 'fetch_comments_reply') {
                        console.log('comments reply ', response.data)
                        console.log('this is the post id and type', post_id, id, type)
                        setCommentsReply(response.data.data)
                    }
                    else {
                        // If commentText doesn't exist, update comments state
                        setComments(response.data.data);
                        console.log('Fetched comments:', response.data);
                        console.log('this is the post id and type', post_id, type)

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

    const reportComment = async (id) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('comment_id', id);

                const response = await reportComments(formData, token);
                if (response.data.api_status === 200) {
                    console.log('comment reported', response.data)
                    ToastAndroid.show('Reported', ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong ', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong please try again', ToastAndroid.SHORT)
                }

            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    // Function to open image picker for selecting from gallery
    const openCommentImagePicker = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                multiple: false, // Allow selecting only one image
            });

            if (image) {
                // Check if the selected image is not null or undefined
                const filename = image.path.substring(image.path.lastIndexOf("/") + 1);
                const imageData = {
                    uri: image.path,
                    type: image.mime,
                    name: filename,
                };
                setCommentImage(imageData);
                setCommentImageType(image.mime);
                console.log("Selected image:", image);
            } else {
                console.log('No image selected');
                setCommentImage(null);
            }
        } catch (error) {
            console.log('Error selecting image:', error);
        }
    };

    // Function to open image picker for selecting from gallery
    const openPostEditImagePicker = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                multiple: true, // Allow selecting only one image
            });

            if (image && image.length > 0) {
                image.map(image => {
                    selectedEditImage.push(image.path);
                    var filename = image.path.substring(
                        image.path.lastIndexOf("/") + 1
                    );
                    let imageData = {
                        uri: image.path,
                        type: image.mime,
                        name: filename,
                    };
                    setPostEditPhotos(imageData);
                    setPostEditPhotosType(image.mime)
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

    // Function to remove a selected image from the state
    const removeSelectedImage = (imageUriToRemove) => {
        // Filter out the image with the specified URI
        const updatedImages = selectedEditImage.filter(image => image !== imageUriToRemove);

        // Update the state with the new array of images
        setSelectedEditImage(updatedImages);
    };

    const handlePostActions = async (selectedPostId, action) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('post_id', selectedPostId)

                if (action === 'edit') {
                    formData.append('action', 'edit')
                    if (editText) {
                        formData.append('text', edit)
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
                } if (action === 'disableComments') {
                    formData.append('action', 'disableComments')
                }
                if (action === 'delete') {
                    formData.append('action', 'delete')
                }

                const response = await onPageLikeApi(formData, token)
                if (response.data.api_status === 200) {
                    // Display messages for successful actions
                    if (action === 'edit') {
                        console.log('Post edited successfully', response.data);
                        ToastAndroid.show('Post edited successfully', ToastAndroid.SHORT);
                    } else if (action === 'delete') {
                        setDeleteModel(false)
                        setModelVisible(false)
                        setLoading(false)
                        console.log('Post deleted successfully', response.data);
                        ToastAndroid.show('Post deleted successfully', ToastAndroid.SHORT);
                    }
                } else if (response.data.api_status === 400) {
                    setLoading(false)
                    console.log('somthing went wrong:', response.data.errors.error_text)
                    ToastAndroid.show('somthing went wrong please try again', ToastAndroid.SHORT)
                }
            } else {
                setLoading(false)
                console.log('User Token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    const toggelCommentsReply = (commentId) => {
        setCommentsReplyVisible((prevVisible) => {
            // Use the spread operator to create a copy of the previous state
            const newVisible = { ...prevVisible };

            // Toggle the visibility for the specific commentId
            newVisible[commentId] = !newVisible[commentId];

            return newVisible;
        });
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Popular Post'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    {/* Post */}
                    {
                        loadingUserPosts ? (
                            <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                <Loader isLoading={loadingUserPosts} />
                            </View>
                        ) : postData.length === 0 ? (
                            <View style={{ width: '94%', marginVertical: hp(5), alignItems: 'center', justifyContent: 'center', height: hp(30), alignSelf: 'center', borderRadius: hp(1) }}>
                                <MaterialCommunityIcons name="file-document-outline" size={35} color={COLORS.darkgray} style={{ backgroundColor: '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                <Text style={[styles.albumsText, { textAlign: 'center', marginTop: hp(2) }]}>No Posts to show</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={postData}
                                keyExtractor={(item, index) => item.user_id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.ProfileComplitionContainer}>
                                        <View style={{ marginTop: hp(1), marginHorizontal: wp(4), justifyContent: 'space-evenly', width: '92%', flexDirection: 'row' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '94%' }}>
                                                <Image
                                                    style={{ height: hp(5), width: hp(5), borderRadius: hp(5) }}
                                                    source={{ uri: item.publisher.avatar }}
                                                />
                                                <View
                                                    style={{ justifyContent: 'space-between', marginLeft: wp(2) }}>
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                                        <Text style={{
                                                            fontSize: hp(2),
                                                            fontFamily: fontFamily.FONTS.bold,
                                                            color: COLORS.black,
                                                        }}>{item.publisher.username}</Text>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: 14, marginLeft: wp(1) }}>{item.postType == 'profile_picture' ? "changed his profile picture" : item.postType == 'profile_cover_picture' ? "changed his cover profile picture" : item.fund_data.length != 0 ? "created a donation request" : item.photo_album.length > 0 ? `added new photos to ${item?.album_name}` : "Created a new article"}</Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            fontSize: hp(1.8),
                                                            fontFamily: fontFamily.FONTS.regular,
                                                            color: COLORS.gray,
                                                        }}>
                                                        {item?.post_time}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                <Menu onSelect={(value) => toggleMenu(value, item.post_id, item.Orginaltext, item.postFile)}>
                                                    <MenuTrigger>
                                                        <AntDesign name="down" size={20} color={COLORS.darkgray1} />
                                                    </MenuTrigger>
                                                    <MenuOptions customStyles={{ optionsContainer: styles.modelView }}>
                                                        {item.admin ? (
                                                            <>
                                                                <MenuOption value="edit">
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Materialicons name='mode-edit' size={24} color={COLORS.black} />
                                                                        <View style={{ padding: 5 }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Edit Post</Text>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Edit post information</Text>
                                                                        </View>
                                                                    </View>
                                                                </MenuOption>

                                                                <MenuOption value="delete">
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                        <Materialicons name='delete' size={24} color={COLORS.black} />
                                                                        <View style={{ padding: 5 }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Delete Post</Text>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Delete this post completely</Text>
                                                                        </View>
                                                                    </View>
                                                                </MenuOption>

                                                                <MenuOption value="disableComments">
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                        <MaterialCommunityicons name='comment-text' size={24} color={COLORS.black} />
                                                                        <View style={{ padding: 5 }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Disable Comments</Text>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Allow or Disallow members to comment on this post</Text>
                                                                        </View>
                                                                    </View>
                                                                </MenuOption>

                                                                <MenuOption value="pinPost">
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                        <MaterialCommunityicons name='pin' size={24} color={COLORS.black} />
                                                                        <View style={{ padding: 5 }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Pin Post</Text>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Pin this post to the top of your profile</Text>
                                                                        </View>
                                                                    </View>
                                                                </MenuOption>

                                                                <MenuOption value="boostPost">
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                        <MaterialCommunityicons name='lightning-bolt' size={24} color={COLORS.black} />
                                                                        <View style={{ padding: 5 }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Boost Post</Text>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Add this post from the boosted list</Text>
                                                                        </View>
                                                                    </View>
                                                                </MenuOption>
                                                            </>

                                                        ) : (
                                                            <>
                                                                <MenuOption value="savePost">
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                        <Ionicons name='bookmark' size={24} color={COLORS.black} />
                                                                        <View style={{ padding: 5 }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Save Post</Text>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Add this post to your favorite list</Text>
                                                                        </View>
                                                                    </View>
                                                                </MenuOption>

                                                                <MenuOption value="reportPost">
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                        <Materialicons name='report' size={24} color={COLORS.black} />
                                                                        <View style={{ padding: 5 }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Report Post</Text>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Report this post to us</Text>
                                                                        </View>
                                                                    </View>
                                                                </MenuOption>

                                                                <MenuOption value="hidePost">
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                        <Ionicons name='eye-off' size={24} color={COLORS.black} />
                                                                        <View style={{ padding: 5 }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Hide Post</Text>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>i don`t want to see this post anymore</Text>
                                                                        </View>
                                                                    </View>
                                                                </MenuOption>
                                                            </>
                                                        )}
                                                        {/* Add more MenuOptions for other actions */}
                                                    </MenuOptions>
                                                </Menu>
                                                {/*
                                            <TouchableOpacity onPress={() => toggelModel(item.post_id)}>
                                                <AntDesign name="down" size={20} color={COLORS.darkgray1} />
                                            </TouchableOpacity>
                                        */}
                                            </View>
                                        </View>

                                        <View>
                                            {console.log("response Data>>>>>>>>", item.fund_data.length != 0)}
                                            {item.postType == 'profile_picture' || item.postType == 'profile_cover_picture'  ? (
                                                <Image source={{ uri: item.postFile }} style={{ height: hp(30), width: '100%' }} />
                                            ) : (
                                                item.photo_album.length > 0 ?
                                                    <View>
                                                        <Image source={{ uri: item.photo_album[0].image }} style={{ height: hp(30), width: '100%' }} />

                                                    </View>
                                                    :
                                                    item.fund_data.length != 0 ?
                                                        <View>
                                                            <Image source={{ uri: item.fund_data.image }} style={{ height: hp(30), width: '100%' }} />
                                                            <View style={{
                                                                width: '100%',
                                                                height: hp(9),
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                backgroundColor: 'rgba(0,0,0,0.8)',
                                                                paddingHorizontal: wp(3)
                                                            }}>
                                                                <Text style={styles.donationText}>{item.fund_data.title}</Text>
                                                                <View style={styles.donationView}>
                                                                    <Text style={styles.donationText1}>{`$${item.fund_data.raised} Raised of $${item.fund_data.amount}`}</Text>
                                                                    <TouchableOpacity style={styles.donationButton}>
                                                                        <Text style={styles.albumsText}>Donate</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        :
                                                        item.blog != undefined ?
                                                            <TouchableOpacity onPress={() => navigation.navigate('BlogDetail', { blogUrl: item.blog.url })}>
                                                                <Text style={styles.postDetails1}>{item.Orginaltext}</Text>
                                                                <Image source={{ uri: item.blog.thumbnail }} style={{ height: hp(15), width: '100%' }} />
                                                                <View style={{
                                                                    width: '100%',
                                                                    paddingBottom: hp(1),
                                                                    backgroundColor: COLORS.white,
                                                                }}>
                                                                    <Text style={styles.postDetails1}>{item.blog.title}</Text>
                                                                    <Text style={styles.postDetails2}>{item.blog.description.replace(/<br\s*\/?>/gi, '\n')}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                            :
                                                            <View>
                                                                <Text style={styles.postDetails}>{item.Orginaltext}</Text>
                                                            </View>
                                            )}
                                            <View style={styles.likesAndCommentView}>
                                                <View style={styles.likesCountView}>
                                                    <AntDesign name="like2" size={20} color={COLORS.darkgray} />
                                                    <Text style={[styles.postDetails3, { marginLeft: wp(1) }]}>{item?.post_likes}</Text>
                                                </View>

                                                <TouchableOpacity onPress={() => { toggleCommentInput(); handleComments(item.post_id, 'fetch_comments'); }}>
                                                    <Text style={styles.postDetails3} >{item?.post_comments} comments</Text>
                                                </TouchableOpacity>

                                            </View>
                                            {/* <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Materialicons name="insert-comment" size={20} color={COLORS.gray} />
                                    </View> */}
                                        </View>

                                        <View style={styles.FollowinghorizontalLine} />
                                        <View style={{ padding: 12, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleLikepages(item.post_id)}>
                                                <AntDesign name="like2" size={24} color={item.is_liked ? COLORS.red : COLORS.darkgray} />
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: item.is_liked ? COLORS.red : COLORS.black }}>Likes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { handleComments(item.post_id, 'fetch_comments'); toggleCommentInput(); }}>
                                                <MaterialCommunityicons name="message-text-outline" size={22} color={COLORS.darkgray1} />
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.darkgray1 }}>Comment</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleShare(item)}>
                                                <MaterialCommunityicons name="share-outline" size={22} color={COLORS.darkgray1} />
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.darkgray1 }}>Share</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* RBSheet for comments */}
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
                                                        <Text style={{ color: COLORS.darkgray1, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2) }}>Comments</Text>
                                                    </View>
                                                    {/* Your comment input UI */}
                                                    <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f2f5', width: '95%' }}>
                                                        <Image source={{ uri: user_data?.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
                                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                            <TextInput
                                                                placeholder=' Write a comment and press enter'
                                                                placeholderTextColor={COLORS.secondaryGray}
                                                                style={styles.CommentInput}
                                                                value={commentText}
                                                                onChangeText={text => setCommentText(text)}
                                                                onSubmitEditing={() => handleComments(item.post_id, commentText, 'create')}
                                                            />
                                                            <TouchableOpacity onPress={() => handleComments(item.post_id, commentImage, 'create')}>
                                                                <Materialicons name='send' size={24} color={COLORS.darkgray1} />
                                                            </TouchableOpacity>
                                                            {/* <TouchableOpacity onPress={openCommentImagePicker} style={{ paddingHorizontal: wp(2) }}>
                                                                <Ionicons name='camera-outline' size={24} color={COLORS.darkgray1} />
                                                            </TouchableOpacity> */}
                                                        </View>
                                                    </View>

                                                    {/* Display the selected image if available */}
                                                    {commentImage && (
                                                        <View style={{ marginHorizontal: wp(3), height: 'auto', maxWidth: '100%', padding: 10, borderRadius: 8, backgroundColor: '#f0f2f5' }}>
                                                            <Image source={{ uri: commentImage.uri }} style={{ height: hp(14), width: wp(28) }} />
                                                        </View>
                                                    )}

                                                    {/* Display comments */}
                                                    {loadingComments ? (
                                                        <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                                            <Loader isLoading={loadingComments} />
                                                        </View>
                                                    ) : (

                                                        <FlatList
                                                            data={comments}
                                                            keyExtractor={(item, index) => item.user_id.toString()}
                                                            renderItem={({ item }) => (
                                                                <>
                                                                    {longPressedComment === item && (
                                                                        <View style={{ backgroundColor: COLORS.lightBlue }}>
                                                                            <View style={{ flexDirection: 'row', height: hp(7), justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.7), color: COLORS.white, paddingHorizontal: wp(4) }}>1 Selected</Text>
                                                                                {item.onwer ? (
                                                                                    <View style={{ flexDirection: 'row', paddingHorizontal: wp(2), alignItems: 'center' }}>
                                                                                        <TouchableOpacity onPress={() => handleComments(item.post_id, item.id, 'edit')} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                            <Feather name="edit-2" size={hp(3)} color={COLORS.white} />
                                                                                        </TouchableOpacity>
                                                                                        <TouchableOpacity onPress={() => handleComments(item.post_id, item.id, 'delete')} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                            <MaterialCommunityicons name="delete-outline" size={hp(3.5)} color={COLORS.white} />
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
                                                                            <Image source={{ uri: item.publisher.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
                                                                            <TouchableOpacity
                                                                                onLongPress={() => handleLongPress(item)}
                                                                                style={{ flexDirection: 'row', alignItems: 'center' }}
                                                                            >
                                                                                <View style={{ marginHorizontal: wp(3), height: 'auto', maxWidth: '100%', padding: 10, borderRadius: 8, backgroundColor: '#f0f2f5' }}>
                                                                                    <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.publisher.user_id })}>
                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2), color: COLORS.black }}>{item.publisher.username}</Text>
                                                                                            <Materialicons name="check-circle" size={18} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(1) }} />
                                                                                        </View>
                                                                                    </TouchableOpacity>
                                                                                    <View>
                                                                                        {item.c_file != "" ? (
                                                                                            <Image source={{ uri: item.c_file }} style={{ height: hp(10), width: wp(30), marginTop: hp(1) }} />
                                                                                        ) : (
                                                                                            <View>
                                                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.primarygray }}>{item.text}</Text>

                                                                                            </View>
                                                                                        )}
                                                                                    </View>
                                                                                    <View style={{ marginTop: hp(2), flexDirection: 'row', marginHorizontal: wp(1), alignItems: 'flex-end' }}>
                                                                                        <TouchableOpacity>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(1.8) }}>Reply</Text>
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                </View>
                                                                            </TouchableOpacity>
                                                                        </View>

                                                                        <View style={{ flexDirection: 'row', }}>
                                                                            <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'column' }} onPress={() => handleComments(item.post_id, item.id, item.is_comment_liked ? 'comment_dislike' : 'comment_like')}>
                                                                                <MaterialCommunityicons name={item.is_comment_liked ? "heart" : "heart-outline"} size={21} color={item.is_comment_liked ? COLORS.red : COLORS.darkgray1} />
                                                                                <Text style={{ color: COLORS.darkgray1, fontSize: hp(2.2) }}>{item.comment_likes}</Text>
                                                                                {/* <MaterialCommunityicons name="heart" size={18} color={COLORS.darkgray1} /> */}
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                    {/** fetch comment reply */}
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: wp(25), marginBottom: hp(1) }}>
                                                                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.darkgray1, marginRight: 8 }} />
                                                                        <TouchableOpacity onPress={() => { toggelCommentsReply(item.id); handleComments(null, item.id, 'fetch_comments_reply') }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(1.7) }}>View {item.replies_count} replies</Text>
                                                                        </TouchableOpacity>
                                                                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.darkgray1, marginLeft: 8 }} />
                                                                    </View>



                                                                    {/** replies */}
                                                                    {commentsReplyVisible[item.id] && (
                                                                        <View style={{ marginVertical: hp(1) }}>
                                                                            <FlatList
                                                                                data={commentsReply}
                                                                                renderItem={({ item }) => (
                                                                                    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp(10) }}>
                                                                                        <View style={{ flexDirection: 'row', }}>
                                                                                            <Image source={{ uri: item.publisher.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
                                                                                            <TouchableOpacity
                                                                                                onLongPress={() => handleLongPress(item)}
                                                                                                style={{ flexDirection: 'row', alignItems: 'center' }}
                                                                                            >
                                                                                                <View style={{ marginHorizontal: wp(3), height: 'auto', maxWidth: '100%', padding: 10, borderRadius: 8, backgroundColor: '#f0f2f5' }}>
                                                                                                    <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.publisher.user_id })}>
                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2), color: COLORS.black }}>{item.publisher.username}</Text>
                                                                                                            <Materialicons name="check-circle" size={18} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(1) }} />
                                                                                                        </View>
                                                                                                    </TouchableOpacity>
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
                                                                                            <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'column' }} onPress={() => handleComments(item.post_id, item.id, item.is_comment_liked ? 'comment_dislike' : 'comment_like')}>
                                                                                                <MaterialCommunityicons name={item.is_comment_liked ? "heart" : "heart-outline"} size={21} color={item.is_comment_liked ? COLORS.red : COLORS.darkgray1} />
                                                                                                <Text style={{ color: COLORS.darkgray1, fontSize: hp(2.2) }}>{item.comment_likes}</Text>
                                                                                                {/* <MaterialCommunityicons name="heart" size={18} color={COLORS.darkgray1} /> */}
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                    </View>
                                                                                )}
                                                                                keyExtractor={(item, index) => item.user_id.toString()}
                                                                                ListEmptyComponent={() => (
                                                                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.darkgray1 }}>No replies to show</Text>
                                                                                    </View>
                                                                                )}
                                                                            />
                                                                        </View>
                                                                    )}

                                                                </>
                                                            )}
                                                            contentContainerStyle={{ flexGrow: 1 }}
                                                            ListEmptyComponent={() => (
                                                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.darkgray1 }}>No comments to show</Text>
                                                                </View>
                                                            )}
                                                        />
                                                    )}
                                                </View>
                                            )}
                                        </RBSheet>

                                    </View>
                                )
                                }
                            />
                        )
                    }

                    {/* edit model */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={editModel}
                        onRequestClose={toggelEditModel}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.reportModelContainer}>
                                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
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
                                        onChangeText={text => setEdit(text)}
                                        textAlignVertical="top"
                                        style={styles.descriptionInput}
                                    />
                                </View>

                                {editImage && (
                                    <View style={{ marginVertical: hp(1), flexDirection: 'row' }}>
                                        <View style={{ marginHorizontal: wp(1) }}>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                <View>
                                                    <TouchableOpacity onPress={openPostEditImagePicker} style={styles.imagePicker}>
                                                        <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                                                            <MaterialCommunityicons name='image' size={24} color={COLORS.white} />
                                                            <Text style={{ color: COLORS.white, padding: 6, fontFamily: fontFamily.FONTS.Medium }}>Choose Image</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <Image source={{ uri: editImage }} style={{ marginHorizontal: wp(2), height: wp(30), width: wp(30), borderRadius: wp(2) }} />
                                                {selectedEditImage.length > 0 && (
                                                    <View style={{ flexDirection: 'row', }}>
                                                        {selectedEditImage.map((image, index) => (
                                                            <View key={index} style={{ margin: 5 }}>
                                                                <Image
                                                                    source={{ uri: image }}
                                                                    style={{ width: wp(30), height: wp(30), borderRadius: wp(2) }}
                                                                />
                                                                {/* Cancel button for the selected image */}
                                                                <TouchableOpacity
                                                                    onPress={() => removeSelectedImage(image)}
                                                                    style={{ position: 'absolute', top: 5, right: 5 }}
                                                                >
                                                                    <MaterialCommunityicons name='close-circle' size={wp(6)} color={COLORS.red} />
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
                                    <TouchableOpacity style={{ backgroundColor: '#f7e5e5', borderRadius: 10, padding: 5, }} onPress={() => handlePostActions(selectedPostId, 'edit')} >
                                        <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.red }}>Update</Text>
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
                            <View style={styles.reportModelContainer}>
                                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.black }}>Delete Post</Text>
                                    </View>
                                    <TouchableOpacity onPress={toggleDeleteModel}>
                                        <Entypo name="cross" size={18} color={COLORS.darkgray} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingHorizontal: 4, marginVertical: hp(2) }}>
                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.3), textAlign: 'justify' }}> Are you sure that you want to delete this post ?</Text>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f7e5e5',
                                            borderRadius: 10,
                                            // padding: 3,
                                            height: hp(4.5),
                                            width: wp(25),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} onPress={() => handlePostActions(selectedPostId, 'delete')} >
                                            {loading ? (
                                                <Loader isLoading={loading} color='white' />
                                            ) : (
                                                <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.red }}>Delete</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PopularPost;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: 20,
        },
        ContentContainer: {
            margin: 10,
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
        SavedPostsContainer: {
            padding: 10,
            paddingHorizontal: 15,
            marginTop: 25,
            flexDirection: 'row',
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            alignItems: 'center',
            borderRadius: 10,
        },
        SavedPostsText: {
            marginHorizontal: 10,
            fontSize: 18,
            color: global.text2.color
        },
        CommentInput: {
            width: '90%',
            height: 40,
            marginHorizontal: 4,
            backgroundColor: '#ededed',
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 10,
            justifyContent: 'center',
        },
        ProfileComplitionContainer: {
            marginTop: 25,
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            borderRadius: 10
        },
        albumsText: {
            marginHorizontal: 10,
            fontSize: 18,
            color: global.text2.color
        },
        postTitle: {
            marginHorizontal: 10,
            marginBottom: hp(1.3),
            fontSize: 14,
            fontFamily: fontFamily.FONTS.regular,
            color: global.text2.color
        },
        postDetails: {
            marginVertical: hp(2),
            paddingHorizontal: wp(5),
            fontSize: 14,
            fontFamily: fontFamily.FONTS.regular,
            color: global.text2.color
        },
        CustomInput: {
            width: '90%',
            height: 40,
            marginHorizontal: 4,
            backgroundColor: '#ededed',
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 10,
            justifyContent: 'center',
        },
        FollowinghorizontalLine: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 0.3,
            // padding: 5,
            // marginHorizontal: 15,
        },
    });
};