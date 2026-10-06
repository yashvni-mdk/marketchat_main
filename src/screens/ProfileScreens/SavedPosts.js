/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, Share, ScrollView, StyleSheet, RefreshControl, ToastAndroid, Text, TextInput, TouchableOpacity, View, Modal, Image, FlatList, TouchableHighlight } from 'react-native';
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
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Octicons from 'react-native-vector-icons/Octicons'
import Foundation from 'react-native-vector-icons/Foundation'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onGetPostApi, onPageLikeApi, commentonPost, onHidePost, onSearchApi, sendPushNotification } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import RBSheet from 'react-native-raw-bottom-sheet'; // Import RBSheet
import ImagePicker from 'react-native-image-crop-picker';
import CheckBox from '../../components/CheckBox';
import users from '../../../assets/image/img/createPage/users.png';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Collapsible from 'react-native-collapsible';
import { fetchUserPost } from '../../redux/reducer';
import TwitterTextView from 'react-native-twitter-textview';
import shuttle from '../../../assets/image/shuttle.png'

const SavedPosts = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const user_data = useSelector(state => state.user_data)
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [postData, setPostData] = useState([])
    const [modelVisible, setModelVisible] = useState(false)
    const [postModelVisible, setPostModelVisible] = useState(false)
    const [savedPosts, setSavedPosts] = useState([]);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [loading, setLoading] = useState(false)
    const [loadingComments, setLoadingComments] = useState(false)
    const [loadingLikePages, setLoadingLikePages] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const rbSheetRef = useRef(null); // Reference for RBSheet
    const [commentImage, setCommentImage] = useState(null)
    const [commentImageType, setCommentImageType] = useState('')
    const [longPressedComment, setLongPressedComment] = useState(null);
    const [commentsReply, setCommentsReply] = useState([])
    const [commentsReplyVisible, setCommentsReplyVisible] = useState({})
    const postActionMenuRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isPressArray, setIsPressArray] = useState([]);
    const [admin, setAdmin] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [commentStatus, setCommentStatus] = useState(false);
    const [commentReplyText, setCommentReplyText] = useState('')

    const toggleCommentInput = () => {
        setShowCommentInput(!showCommentInput);
        rbSheetRef.current?.open(); // Open RBSheet on comment icon click
    };

    const handlePostActionMenu = (value) => {
        // Handle the selected action here
        handlePostActions(item.post_id, value);
        // Close the RBSheet after handling the action
        postActionMenuRef.current.close();
    };

    const toggelModel = () => {
        setModelVisible((prevVisible) => !prevVisible)
    }
    const toggelPostModel = () => {
        setPostModelVisible((prevVisible) => !prevVisible)
    }

    const handleLongPress = (item) => {
        setLongPressedComment(item);
        rbSheetRef.current.open(); // Open the RBSheet to display actions
    };


    const fetchSavedPosts = async () => {
        try {
            setRefreshing(loading ? true : false)
            setLoading(refreshing ? false : true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('type', 'saved')
                // formData.append('limit', '1')
                // formData.append('after_post_id', '3')

                const response = await onGetPostApi(formData, token)
                if (response.data.api_status === 200) {
                    setSavedPosts(response.data.data)
                    setPostData(response.data.data)
                    setIsPressArray(Array(response.data.data.length).fill(false));
                    setRefreshing(false)
                    setLoading(false)
                    console.log('this is the saved Post ', response.data.data)
                } else if (response.data.api_status === 400 || 404) {
                    setRefreshing(false)
                    setLoading(false)
                    console.log('this is the saved Post ', response.data.errors.error_text)
                }
            }
            else {
                setRefreshing(false)
                setLoading(false)
                console.log('User token not found', error.message)
            }
        } catch (error) {
            setRefreshing(false)
            setLoading(false)
            console.log('Get Error::', error)
        }
    }


    useEffect(() => {
        fetchSavedPosts()
    }, [])

    const handleLikepages = async (post_id) => {
        try {
            setPostData((prevData) => {
                return prevData.map((item) => {
                    if (post_id === item.post_id) {
                        return {
                            ...item,
                            is_liked: !item.is_liked,
                            post_likes: item.is_liked ? parseInt(item.post_likes) - 1 : parseInt(item.post_likes) + 1,
                        };
                    }
                    return item;
                });
            });
                const token = await AsyncStorage.getItem('access_token');
                if (token != null) {
                    const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                    const formData = new FormData();
                    formData.append('server_key', serverkey);
                    formData.append('post_id', post_id);
                    formData.append('action', 'like');

                    const response = await onPageLikeApi(formData, token);
                    if (response.data.api_status === 200) {
                        // ToastAndroid.show(response.data.action, ToastAndroid.SHORT)
                        // await fetchUserPost()

                        console.log('page Liked', response.data);
                    } else if (response.data.api_status === 400 || response.data.api_status === 404) {
                        console.log('something went wrong', response.data.errors.error_text);
                    }
                } else {
                    console.log('User Token not found');
                    // Handle the absence of user token (e.g., redirect to login)
                }
        } catch (error) {
            console.log('Get Error::', error);
        }
    };

    const handleComments = async (post_id, id, type, fullItem, index, comment_index) => {
        try {
          let arrayList = postData
          console.log('this is the post id and type', post_id, id, type, index, comment_index)
          if (type === 'fetch_comments') {
            setLoadingComments(true); // Show loading only when fetching comments
          }
          if (type === 'delete') {
            const updatedCommentList = arrayList.map((item, index1) => {
              if (index==index1) {
                return {
                  ...item,
                  commentList: item.commentList.filter(comment => comment.id !== id)
                };
              }
              return item;
            })
            setPostData(updatedCommentList)
            setRefresh(!refresh);
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
            } else if (type === 'create_reply') {
              formData.append('type', 'create_reply')
              formData.append('comment_id', id)
              formData.append('text', commentReplyText)
            }
            else {
              // If commentText doesn't exist, fetch comments
              formData.append('type', type);
              console.log('this is the post id and type', post_id, type)
            }
      
            const response = await commentonPost(formData, token);
            if (response.data.api_status === 200) {
              let res = '';
              if (user_data.user_id != fullItem.user_id){
                res = fullItem.publisher.fcm_token.replace(/ /g, '')
                console.log("get Item Token ::::", res)
              }
                
              if (type === 'create') {
                if (commentText) {
                    sendPushNotification(
                      res,
                      `${user_data.name}`,
                      `${commentText}`,
                  );
                } else {
                  sendPushNotification(
                    res,
                    `${user_data.name}`,
                    `${user_data.username} is comment on your post.`,
                  );
                }
                // If a comment or image was sent, update comments state accordingly
                const updatedComments = [...fullItem.commentList, response.data.data];
                // setComments(updatedComments);
                arrayList[index].commentList = updatedComments;
                setPostData(arrayList)
                setCommentText(''); // Clear the TextInput if a comment was sent
                setCommentImage(null); // Clear the selected image if an image was sent
                ToastAndroid.show('Comment/Image posted successfully', ToastAndroid.SHORT);
              } else if (type === 'comment_like') {
                console.log('comment like');
                sendPushNotification(
                  res,
                  `${user_data.name}`,
                  `${user_data.username} is like comment on your post.`,
                );
                // Update comments state to reflect the like
                // setComments(prevComments => {
                    arrayList[index].commentList[comment_index].is_comment_liked = true
                    arrayList.map((item, index1) => {
                    if (index1 == index) {
                        item.commentList.map(comment => {
                            if (comment.id === id) {
                                arrayList[index].commentList[comment_index].comment_likes = comment.comment_likes + 1;
                            }
                        });
                    }
                  })
                  setPostData(arrayList)
                setRefresh(!refresh);
                // return updatedCommentList;
                // });
                ToastAndroid.show('Comment liked', ToastAndroid.SHORT);
              }
              else if (type === 'comment_dislike') {
                console.log('comment dislike');
                // Update comments state to reflect the dislike
                // setComments(prevComments => {
                    arrayList[index].commentList[comment_index].is_comment_liked = false
                    arrayList.map((item, index1) => {
                    if (index1 == index) {
                        item.commentList.map(comment => {
                            if (comment.id === id) {
                                arrayList[index].commentList[comment_index].comment_likes = comment.comment_likes - 1;
                            }
                        });
                    }
                  })
                  setPostData(arrayList)
                  setRefresh(!refresh);
                // });
                ToastAndroid.show('Comment disliked', ToastAndroid.SHORT);
              } else if (type === 'fetch_comments_reply') {
                console.log('comments reply ', response.data)
                console.log('this is the post id and type', post_id, id, type)
                // setCommentsReply(response.data.data)
                if (arrayList[index].commentList[comment_index].commentReply != undefined){
                    arrayList[index].commentList[comment_index].commentReply = response.data.data
                }
                setPostData(arrayList);
              } else if (type === 'create_reply') {
                if (res != '') {
                  sendPushNotification(
                    res,
                    `${user_data.name}`,
                    `${user_data.username} is reply comment on your post.`,
                  );
                }
                console.log('get reply value>>>>>>>>>>', arrayList[index].commentList[comment_index].commentReply);
                if (arrayList[index].commentList[comment_index].commentReply != undefined){
                    // If a comment or image was sent, update comments state accordingly
                    const updatedComments = [...arrayList[index].commentList[comment_index].commentReply, response.data.data];
                    arrayList[index].commentList[comment_index].commentReply = updatedComments;
                    setPostData(arrayList)
                    setCommentReplyText(''); // Clear the TextInput if a comment was sent
                } else {
                    arrayList[index].commentList[comment_index].commentReply = response.data.data
                    setPostData(arrayList);
                    setCommentReplyText(''); // Clear the TextInput if a comment was sent
                }
                
                // setCommentImage(null); // Clear the selected image if an image was sent
                ToastAndroid.show('Reply successfully', ToastAndroid.SHORT);
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

    const handleShare = (item) => {
        Share.share({
            message: `Check out this post: ${item.url}`, // Customize the shared message here
        })
            .then(result => console.log(result))
            .catch(errorMsg => console.error(errorMsg));
    };

    const handleCommentVisible = async (item, index) => {
        try {
            console.log('get comment>>>>', commentsReplyVisible);
          let arrayList = postData;
          const token = await AsyncStorage.getItem('access_token');
              const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
              const formData = new FormData();
              formData.append('server_key', serverkey);
              formData.append('post_id', item.post_id);
              formData.append('type', 'fetch_comments');
      
              const response = await commentonPost(formData, token);
              if (response.data.api_status === 200) {
                if (item.isCollapse != undefined) {
                  arrayList[index].isCollapse = !item.isCollapse
                } else {
                  arrayList[index].isCollapse = true
                }
                  arrayList[index].commentList = response.data.data
                  console.log('Get Comment Value:::', response.data.data);
                  // setComments(response.data.data);
                  console.log('Fetched comments:', arrayList[index].commentList);
                  setRefresh(!refresh);
                  setPostData(arrayList);
              }
             
        } catch (err) {
          console.log('error:', err);
        }
      }

    const onChangedCommentData = async (item) => {
        setPostData((prevData) => {
            return prevData.map((item1) => {
                if (item.post_id === item1.post_id) {
                    return {
                        ...item1,
                        comments_status: item.comments_status == '1'? '0' : '1',
                    };
                }
                return item1;
            });
        })
        const token = await AsyncStorage.getItem('access_token')
        if (token != null) {
            const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
            const formData = new FormData();
            formData.append('server_key', serverkey);
            formData.append('post_id', item.post_id)
            formData.append('action', commentStatus === '0' ? 'enable_comments' : 'disable_comments');
            const response = await onPageLikeApi(formData, token)
      
            if (response.data.api_status === 200) {
                console.log('get response:::', response.data);
            } else {
                console.log('get Error:::', response.data);
            }
        }
      }

    const handlePostActions = async (post_id, value) => {
        try {
            setPostData((prevData) => {
                return prevData.map((item) => {
                    if (post_id === item.post_id) {
                        return {
                            ...item,
                            is_post_saved: !item.is_post_saved,
                        };
                    }
                    return item;
                });
            })
            // setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('post_id', post_id)

                if (value === 'savePost') {
                    formData.append('action', 'save')
                } else if (value === 'reportPost') {
                    formData.append('action', 'report')
                } else if (value === 'hidePost') {
                    await hidePost(post_id)
                } else if (value === 'unsavePost') {
                    formData.append('action', 'unsave')
                }

                const response = await onPageLikeApi(formData, token)
                if (response.data.api_status === 200) {
                    // Display messages for successful actions
                    if (value === 'savePost') {
                        console.log('Post saved', response.data);
                        ToastAndroid.show(response.data.action, ToastAndroid.SHORT);
                    } else if (value === 'reportPost') {
                        // await fetchUserPost(UserId)
                        console.log('report successfully', response.data);
                        ToastAndroid.show(response.data.action, ToastAndroid.SHORT);
                    } else if (value === 'unsavePost') {
                        console.log('Post Unsaved', response.data);
                        fetchSavedPosts();
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

    const hidePost = async (post_id) => {
        try {
            // setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('post_id', post_id)

                const response = await onHidePost(formData, token)
                if (response.data.api_status === 200) {
                    console.log('Post hide', response.data)
                    const updatedUserPosts = savedPosts.filter(post => post.post_id !== post_id);
                    setSavedPosts(updatedUserPosts); // Update the userPost array
                    ToastAndroid.show('Post hided', ToastAndroid.SHORT)

                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT)
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
            ToastAndroid.show('Network issue', ToastAndroid.SHORT)
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
        setRefresh(!refresh);
        console.log('get Comment Reply>>>>', commentsReplyVisible);
    }

    const handleShowUnderlay1 = index => {
        setIsPressArray(prevState => {
          const newState = [...prevState];
          newState.map((item, index1) => {
            if (index1 == index) {
              newState[index1] = true;
            } else {
              newState[index1] = false;
            }
          });
          return newState;
        });
      };

      const toggleMenu = (value, admin, postId, Orginaltext, fundTitle, postFile, comments_status, is_post_saved) => {
        setAdmin(admin)
        setSelectedPostId(postId)
        setEditText(Orginaltext)
        setEditImage(postFile)
        setEditFundTitle(fundTitle)
        setCommentStatus(comments_status)
        setPostSavedStatus(is_post_saved)
     if (value === 'edit') {
        toggelEditModel()
      }
      if (value === 'delete') {
        toggleDeleteModel()
      }
      if (value === 'boostPost') {
        navigation.navigate('UpgradeToPro')
      } if (value === 'disable_comments') {
        handlePostActions(selectedPostId, 'disable_comments')
      }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchSavedPosts} />
            } showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Saved Post'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        {/* SavedPosts */}
                        {/*   <View>
                            <View style={styles.SavedPostsContainer}>
                                <Materialicons name="photo-library" size={22} color={COLORS.gray} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 5 }} />
                                <Text style={styles.SavedPostsText}>SavedPosts</Text>
                            </View>
                        </View> */}

                        {/* Post */}
                        <View style={{ marginVertical: hp(2) }}>
                            {
                                loading ? (
                                    <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                        <Loader isLoading={loading} />
                                    </View>
                                ) : postData.length === 0 ? (
                                    <View style={{ marginVertical: hp(2), width: '94%', alignItems: 'center', justifyContent: 'center', height: hp(30), alignSelf: 'center', borderRadius: hp(1) }}>
                                        <MaterialCommunityIcons name="file-document-outline" size={35} color={COLORS.darkgray} style={{ backgroundColor: '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                        <Text style={[styles.albumsText, { textAlign: 'center', marginTop: hp(2) }]}>No Posts to show</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={postData}
                                        keyExtractor={(item, index) => item.post_id.toString()}
                                        renderItem={({ item, index }) => {
                                            const baseHeight = 50; // Set your base height
                                            const optionHeight = hp(8); // Set the height of each option
                                            const numOptions = item.admin ? 5 : 3;
                                            return (
                                                <TouchableHighlight
                                                    key={item.created_at}
                                                    onShowUnderlay={() => handleShowUnderlay1(index)}
                                                    activeOpacity={1}
                                                    style={{width: '94%', alignSelf: 'center', borderRadius: wp(2), marginBottom: hp(2),}}
                                                    onPress={() => console.log('hello')}
                                                    underlayColor={COLORS.lightWhite}>
                                                    <View style={[styles.ProfileComplitionContainer, {borderColor: isPressArray[index] ? COLORS.greenColor : COLORS.white, borderWidth: 2}]}>
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                height: hp(8),
                                                                width: '92%',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                alignSelf: 'center',
                                                            }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '94%' }}>
                                                                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', }}>
                                                                    <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.publisher.user_id })}>
                                                                    {item?.publisher?.avatar != '' &&
                                                                        <Image
                                                                            style={{ height: hp(5), width: hp(5), borderRadius: hp(5) }}
                                                                            source={{ uri: item.publisher.avatar }}
                                                                        />
                                                                    }
                                                                    </TouchableOpacity>
                                                                    <View
                                                                        style={{ marginVertical: hp(1), justifyContent: 'space-between', marginLeft: wp(2), flexWrap: 'wrap', width: '88%' }}>

                                                                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.publisher.user_id })}>
                                                                            <Text style={{
                                                                                fontSize: hp(2),
                                                                                fontFamily: fontFamily.FONTS.bold,
                                                                                color: COLORS.black,
                                                                            }} numberOfLines={1}>{item.publisher.username}</Text>
                                                                        </TouchableOpacity>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2), }}>{item.postType == 'profile_picture' ? "changed his profile picture" : item.postType == 'profile_cover_picture' ? "changed his cover profile picture" : item.fund_data != undefined ? "created a donation request" : item.photo_album != undefined ? `added new photos to ${item?.album_name}` : item.event != undefined ? "Created a new event" : item.blog != undefined ? "Created a new article" : "Created a new post"}</Text>
                                                                            <Text
                                                                                style={{
                                                                                    fontSize: hp(1.8),
                                                                                    paddingHorizontal: wp(3),
                                                                                    fontFamily: fontFamily.FONTS.regular,
                                                                                    color: COLORS.darkgray1,
                                                                                }}>
                                                                                ({item?.post_time?.replace(/\s+/g, '')})
                                                                            </Text>
                                                                        </View>

                                                                    </View>
                                                                </View>
                                                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: wp(1) }}>
                                                                    {/* <TouchableOpacity onPress={() => postActionMenuRef.current.open()}>
                                                                        <Entypo name="dots-three-vertical" size={20} color={COLORS.darkgray1} />
                                                                    </TouchableOpacity> */}
                                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {handlePostActions(item.post_id, item.is_post_saved ? 'unsavePost' : 'savePost')}}>
                                                                        <Ionicons name={item.is_post_saved ? 'bookmark' : 'bookmark-outline'} size={24} color={COLORS.darkgray} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <RBSheet
                                                                    ref={postActionMenuRef}
                                                                    closeOnDragDown={true}
                                                                    height={baseHeight + numOptions * optionHeight}
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

                                                                    {item.admin ? (
                                                                        <>
                                                                            <View style={{ marginHorizontal: wp(3), marginVertical: hp(2), width: '90%' }}>
                                                                                <TouchableOpacity onPress={() => handlePostActions(item.post_id, 'edit')}>
                                                                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center' }}>
                                                                                        <MaterialCommunityIcons name='pencil-outline' size={24} color={COLORS.black} />
                                                                                        <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Edit Post</Text>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Edit post information</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableOpacity>

                                                                                <TouchableOpacity onPress={() => handlePostActions(item.post_id, 'delete')}>
                                                                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                                                        <Materialicons name='delete-outline' size={24} color={COLORS.black} />
                                                                                        <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Delete Post</Text>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Delete this post completely</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableOpacity>

                                                                                <TouchableOpacity onPress={() => handlePostActions(item.post_id, 'disableComments')}>
                                                                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                                                        <MaterialCommunityIcons name='comment-text-outline' size={24} color={COLORS.black} />
                                                                                        <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Disable Comments</Text>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Allow or Disallow members to comment on this post</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableOpacity>

                                                                                <TouchableOpacity onPress={() => handlePostActions(item.post_id, 'pinPost')}>
                                                                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                                                        <AntDesign name='pushpino' size={24} color={COLORS.black} />
                                                                                        <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Pin Post</Text>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Pin this post to the top of your profile</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableOpacity>

                                                                                <TouchableOpacity onPress={() => handlePostActions(item.post_id, 'boostPost')}>
                                                                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                                                        <MaterialCommunityIcons name='lightning-bolt-outline' size={24} color={COLORS.black} />
                                                                                        <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Boost Post</Text>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Add this post from the boosted list</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        </>

                                                                    ) : (
                                                                        <>

                                                                            <View style={{ marginHorizontal: wp(3), marginVertical: hp(2) }}>
                                                                                <TouchableOpacity onPress={() => handlePostActions(item.post_id, 'unsavePost')}>
                                                                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                                                        <Ionicons name='bookmark-outline' size={hp(4)} color={COLORS.black} />
                                                                                        <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Unsave Post</Text>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Remove this post to your favorite list</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableOpacity>

                                                                                <TouchableOpacity onPress={() => handlePostActions(item.post_id, 'reportPost')}>
                                                                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                                                        <Materialicons name='report-gmailerrorred' size={hp(4)} color={COLORS.black} />
                                                                                        <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>{item.is_reported ? 'Unreport Post' : 'Report Post'}</Text>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>{item.is_reported ? 'Unreport' : 'Report'} this post to us</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableOpacity>

                                                                                <TouchableOpacity onPress={() => handlePostActions(item.post_id, 'hidePost')}>
                                                                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                                                        <Ionicons name='eye-off-outline' size={hp(4)} color={COLORS.black} />
                                                                                        <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Hide Post</Text>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>i don`t want to see this post anymore</Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </TouchableOpacity>


                                                                            </View>
                                                                        </>
                                                                    )}

                                                                </RBSheet>
                                                            </View>
                                                        </View>

                                                        <View
                                                            style={{
                                                                width: '100%',
                                                                alignSelf: 'center',
                                                            }}>
                                                            {item.postType == 'profile_picture' || item.postType == 'profile_cover_picture' ? (
                                                                <Image source={{ uri: item.postFile }} style={{ height: hp(30), width: '100%' }} />
                                                            ) : (
                                                                item.photo_album.length > 0 ?
                                                                    <View>
                                                                        <Image source={{ uri: item.photo_album[0].image }} style={{ height: hp(30), width: '100%' }} />

                                                                    </View>
                                                                    :
                                                                    item.fund_data.length != 0 ?
                                                                    <TouchableOpacity
                                                                        onPressIn={() => handleShowUnderlay1(index)}
                                                                        onPress={() => navigation.navigate('FundingData')}
                                                                        activeOpacity={1}>
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
                                                                    </TouchableOpacity>
                                                                        :
                                                                        item.blog != undefined ?
                                                                            <TouchableOpacity
                                                                              onPressIn={() => handleShowUnderlay1(index)}
                                                                              onPress={() => navigation.navigate('BlogDetail', { blogUrl: item.blog.url })}
                                                                              activeOpacity={1}>
                                                                               <TwitterTextView
                                                                                    style={styles.postDetails1}
                                                                                    hashtagStyle={styles.hashtagStyle}
                                                                                    mentionStyle={styles.mentionStyle}
                                                                                    linkStyle={styles.linkStyle}
                                                                                    emailStyle={styles.emailStyle}
                                                                                    onPressHashtag={()=>{}}
                                                                                    onPressMention={()=>{}}
                                                                                    onPressEmail={()=>{}}
                                                                                >{item.Orginaltext}</TwitterTextView>
                                                                                <Image source={{ uri: item.blog.thumbnail }} style={{ height: hp(30), width: '100%' }} />
                                                                                <View style={{
                                                                                    width: '100%',
                                                                                    paddingBottom: hp(1),
                                                                                    backgroundColor: COLORS.white,
                                                                                }}>
                                                                                    <TwitterTextView
                                                                                    style={styles.postDetails1}
                                                                                    hashtagStyle={styles.hashtagStyle}
                                                                                    mentionStyle={styles.mentionStyle}
                                                                                    linkStyle={styles.linkStyle}
                                                                                    emailStyle={styles.emailStyle}
                                                                                    onPressHashtag={()=>{}}
                                                                                    onPressMention={()=>{}}
                                                                                    onPressEmail={()=>{}}
                                                                                >{item.blog.title}</TwitterTextView>
                                                                                <TwitterTextView
                                                                                    style={styles.postDetails2}
                                                                                    hashtagStyle={styles.hashtagStyle}
                                                                                    mentionStyle={styles.mentionStyle}
                                                                                    linkStyle={styles.linkStyle}
                                                                                    emailStyle={styles.emailStyle}
                                                                                    onPressHashtag={()=>{}}
                                                                                    onPressMention={()=>{}}
                                                                                    onPressEmail={()=>{}}
                                                                                >{item.blog.description.replace(/<br\s*\/?>/gi, '\n')}</TwitterTextView>
                                                                                    {/* <Text style={styles.postDetails2}>{item.blog.description.replace(/<br\s*\/?>/gi, '\n')}</Text> */}
                                                                                </View>
                                                                            </TouchableOpacity>
                                                                            :
                                                                            <View>
                                                                            <TwitterTextView
                                                                                    style={styles.postDetails}
                                                                                    hashtagStyle={styles.hashtagStyle}
                                                                                    mentionStyle={styles.mentionStyle}
                                                                                    linkStyle={styles.linkStyle}
                                                                                    emailStyle={styles.emailStyle}
                                                                                    onPressHashtag={()=>{}}
                                                                                    onPressMention={()=>{}}
                                                                                    onPressEmail={()=>{}}
                                                                                >{item.Orginaltext}</TwitterTextView>
                                                                                {/* <Text style={styles.postDetails}>{item.Orginaltext}</Text> */}
                                                                            </View>
                                                            )}
                                                            <View style={styles.likesAndCommentView}>
                                                                <View style={styles.likesCountView}>
                                                                    {/* <AntDesign name="like2" size={20} color={COLORS.darkgray} />
                                                                    <Text style={[styles.postDetails3, { marginLeft: wp(1) }]}>{item?.post_likes}</Text> */}
                                                                </View>

                                                                {/* {item.comments_status === "1" ? (
                                                                    <TouchableOpacity onPress={() => { toggleCommentInput(); handleComments(item.post_id, null, 'fetch_comments'); }}>
                                                                        <Text style={styles.postDetails3} >{item?.post_comments} comments</Text>
                                                                    </TouchableOpacity>
                                                                ) : (
                                                                    <View>
                                                                        <Text style={styles.postDetails3}>Comments disabled</Text>
                                                                    </View>
                                                                )} */}
                                                                {item.admin &&
                                                                    <TouchableOpacity  style={{
                                                                    height: wp(10),
                                                                    width: wp(10),
                                                                    borderRadius: wp(10),
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    backgroundColor: COLORS.primary
                                                                    }} onPress={() => { toggleMenu('boostPost', null, null, null)}}>
                                                                    {/* <Text style={{fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2), color: COLORS.white}}>Boost</Text> */}
                                                                    <Image source={shuttle} style={{width: wp(5), height: hp(3), resizeMode: 'contain', tintColor: COLORS.white}} />
                                                                    </TouchableOpacity>
                                                                }
                                                            </View>
                                                        </View>
                                                        <View style={{
                                                            borderBottomColor: COLORS.secondaryGray,
                                                            borderBottomWidth: 0.5,
                                                            width: '100%',
                                                            // marginHorizontal: 15,
                                                        }} />
                                                        <View style={{ paddingTop: hp(1.5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', alignSelf: "center" }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                                <TouchableOpacity style={{ paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleLikepages(item.post_id)}>
                                                                    <AntDesign name={item.is_liked ? 'heart' : 'hearto'} size={24} color={item.is_liked ? COLORS.red1 : COLORS.darkgray} />
                                                                    {/** <Text style={[styles.postDetails3, { color: item.is_liked ? COLORS.red : COLORS.black }]}>Likes</Text> */}
                                                                </TouchableOpacity>
                                                                {item.comments_status == '1' &&
                                                                <TouchableOpacity
                                                                  style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }}
                                                                  onPress={() => handleCommentVisible(item, index)}
                                                                  disabled={item.comments_status === '0'}>
                                                                    <MaterialCommunityIcons name="message-text" size={24} color={COLORS.darkgray} />
                                                                </TouchableOpacity>
                                                                }

                                                                <TouchableOpacity style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleShare(item)}>
                                                                    <Feather name="send" size={22} color={COLORS.darkgray} />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                                {item.admin ? 
                                                                    <>
                                                                    <TouchableOpacity style={{ paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => { toggleMenu('pinPost', item.admin, item.post_id, item.Orginaltext, item.postFile, item.photo_multi, item.comments_status, item.fund_data.title, item.is_post_saved)}}>
                                                                        <MaterialCommunityIcons name='pin-outline' size={24} color={COLORS.black} />
                                                                    </TouchableOpacity>
                                                                    
                                                                    <TouchableOpacity style={{ paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => { toggleMenu('edit', item.admin, item.post_id, item.Orginaltext, item.postFile, item.photo_multi, item.comments_status, item.fund_data.title, item.is_post_saved)}}>
                                                                        <MaterialCommunityIcons name='pencil-outline' size={24} color={COLORS.black} />
                                                                    </TouchableOpacity>

                                                                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center' }} onPress={() => { toggleMenu('delete', item.admin, item.post_id, item.Orginaltext, item.postFile, item.photo_multi, item.comments_status, item.fund_data.title, item.is_post_saved)}}>
                                                                        <Materialicons name='delete-outline' size={26} color={COLORS.black} />
                                                                    </TouchableOpacity>
                                                                    </>
                                                                    :
                                                                    <>
                                                                    <TouchableOpacity style={{ paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handlePostActions(item.post_id, 'reportPost')}>
                                                                        <Materialicons name='report-gmailerrorred' size={hp(3)} color={COLORS.black} />
                                                                    </TouchableOpacity>

                                                                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center' }} onPress={() => handlePostActions(item.post_id, 'hidePost')}>
                                                                        <Ionicons name='eye-off-outline' size={hp(3)} color={COLORS.black} />
                                                                    </TouchableOpacity>
                                                                    </>
                                                                }
                                                            </View>
                                                        </View>

                                                        {item.admin &&
                                                            <View style={styles.commentCollapsView}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black, marginLeft: wp(2) }}>Comments :  </Text>
                                                            <Text style={{fontFamily: fontFamily.FONTS.Medium, color: item.comments_status == '1'? COLORS.red1 : COLORS.greenColor, fontSize: hp(2.1)}} onPress={() => onChangedCommentData(item)}>{item.comments_status == '1'? 'Disable' : 'Enable' }</Text>
                                                            </View>
                                                        }
                                                        <Collapsible collapsed={!item.isCollapse}>
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: '100%',
                                                            justifyContent: 'space-between',
                                                            alignSelf: 'center',
                                                            paddingHorizontal: wp(2),
                                                            marginTop: hp(1.5)
                                                            }}>
                                                                {user_data?.avatar != '' &&
                                                                    <Image source={{ uri: user_data?.avatar }} style={{ height: wp(8), width: wp(8), borderRadius: wp(8) }} />
                                                                }
                                                                    <TextInput
                                                                    placeholder=' Write a comment and press enter'
                                                                    placeholderTextColor={COLORS.secondaryGray}
                                                                    style={{
                                                                        width: wp(72),
                                                                        // height: 40,
                                                                        // marginHorizontal: 4,
                                                                        backgroundColor: '#ededed',
                                                                        color: COLORS.black,
                                                                        borderColor: '#eeeff0',
                                                                        borderWidth: 0.5,
                                                                        borderRadius: 5,
                                                                        justifyContent: 'center',
                                                                        paddingVertical: hp(0.5)
                                                                    }}
                                                                    value={commentText}
                                                                    onChangeText={text => setCommentText(text)}
                                                                    />
                                                                <TouchableOpacity onPress={() => handleComments(item.post_id, null, 'create', item, index)}>
                                                                    <Materialicons name='send' size={23} color={COLORS.darkgray1} />
                                                                </TouchableOpacity>

                                                        </View>
                                                                <View  style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: '100%',
                                                            justifyContent: 'space-between',
                                                            alignSelf: 'center',
                                                            paddingHorizontal: wp(2),
                                                            marginTop: hp(1.5)
                                                            }}>
                                                                {item?.commentList?.length > 0 &&
                                                                    <FlatList
                                                                    data={item.commentList}
                                                                    keyExtractor={(item, index) => item.id.toString()}
                                                                    renderItem={({item, index:index1}) => {
                                                                        console.log('Get Comment Value:::', index1);
                                                                        if (item != undefined) {    
                                                                        return(
                                                                        <>
                                                                        {longPressedComment === item && (
                                                                            <View style={{ backgroundColor: COLORS.lightBlue, marginTop: hp(1) }}>
                                                                            <View style={{ flexDirection: 'row', height: hp(7), justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.7), color: COLORS.white, paddingHorizontal: wp(4) }}>1 Selected</Text>
                                                                                {item.onwer ? (
                                                                                <View style={{ flexDirection: 'row', paddingHorizontal: wp(2), alignItems: 'center' }}>
                                                                                    <TouchableOpacity onPress={() => handleComments(item.post_id, item.id, 'edit', item, index)} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                    <Feather name="edit-2" size={hp(3)} color={COLORS.white} />
                                                                                    </TouchableOpacity>
                                                                                    <TouchableOpacity onPress={() => handleComments(item.post_id, item.id, 'delete', item, index)} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
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
                                                                        <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                            <View>
                                                                            <View style={{ flexDirection: 'row', }}>
                                                                                {item?.publisher?.avatar != '' &&
                                                                                <Image source={{ uri: item?.publisher?.avatar }} style={{ height: wp(8), width: wp(8), borderRadius: wp(8) }} />
                                                                                }
                                                                                <TouchableOpacity
                                                                                onLongPress={() => handleLongPress(item)}
                                                                                style={{ flexDirection: 'row', alignItems: 'center' }}
                                                                                >
                                                                                <View style={{ marginHorizontal: wp(3), height: 'auto', maxWidth: '80%', padding: 10, borderRadius: 8, backgroundColor: '#f0f2f5' }}>
                                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                                    <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.publisher.user_id })} style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2), color: COLORS.black }}>{item.publisher.username}</Text>
                                                                                        <Materialicons name="check-circle" size={18} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(1) }} />
                                                                                    </TouchableOpacity>
                                                                                    <TouchableOpacity onPress={() => handleComments(item.post_id, item.id, 'delete', item, index)} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1), marginRight: wp(2) }}>
                                                                                    <MaterialCommunityIcons name="delete-outline" size={hp(3)} color={COLORS.black} />
                                                                                    </TouchableOpacity>
                                                                                    </View>
                                                                                    <View>
                                                                                    {item.c_file!="" ? (
                                                                                        <Image source={{ uri: item?.c_file }} style={{ height: hp(10), width: wp(30), marginTop: hp(1) }} />
                                                                                    ) : (
                                                                                        <View>
                                                                                        <TwitterTextView
                                                                                        style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.primarygray }}
                                                                                        hashtagStyle={styles.hashtagStyle}
                                                                                        mentionStyle={styles.mentionStyle}
                                                                                        linkStyle={styles.linkStyle}
                                                                                        emailStyle={styles.emailStyle}
                                                                                        onPressHashtag={()=>{}}
                                                                                        onPressMention={()=>{}}
                                                                                        onPressEmail={()=>{}}
                                                                                        >{item.text}</TwitterTextView>
                                                                                        </View>
                                                                                    )}
                                                                                    </View>
                                                                                </View>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                            <View style={{ flexDirection: 'row', marginHorizontal: wp(12), marginBottom: hp(1) }}>
                                                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center'}} onPress={() => handleComments(item.post_id, item.id, item.is_comment_liked ? 'comment_dislike' : 'comment_like', item, index, index1)}>
                                                                                <MaterialCommunityIcons name={item.is_comment_liked ? "heart" : "heart-outline"} size={21} color={item.is_comment_liked ? COLORS.red : COLORS.darkgray1} />
                                                                                <Text style={{ color: COLORS.darkgray1, fontSize: hp(2.2) }}>{item.comment_likes}</Text>
                                                                            </TouchableOpacity>
                                                                                <TouchableOpacity style={{ marginHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => { toggelCommentsReply(item.id); handleComments(item.post_id, item.id, 'fetch_comments_reply', item, index, index1) }}>
                                                                                <MaterialCommunityIcons name="message-text-outline" size={hp(2.4)} color={COLORS.darkgray1} />
                                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.replies_count}</Text>
                                                                            </TouchableOpacity>

                                                                            </View>
                                                                            </View>
                                                                            <View style={{ flexDirection: 'row', }}>
                                                                            
                                                                            </View>
                                                                        </View>
                                                                                    
                                                                        {commentsReplyVisible[item.id] && (
                                                                            <View style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            width: '100%',
                                                            justifyContent: 'space-between',
                                                            alignSelf: 'center',
                                                            }}>
                                                                            {item.commentReply != undefined && item.commentReply?.length>0&&
                                                                            <FlatList
                                                                                data={item.commentReply}
                                                                                renderItem={({ item }) => (
                                                                                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', }}>
                                                                                    <View style={{ flexDirection: 'row', maxWidth: '80%', marginLeft: wp(7) }}>
                                                                                    {item?.publisher?.avatar != '' &&
                                                                                    <Image source={{ uri: item?.publisher?.avatar }} style={{ height: wp(8), width: wp(8), borderRadius: wp(8) }} />
                                                                                    }
                                                                                    <TouchableOpacity
                                                                                        onLongPress={() => handleCommentReplyLongPress(item)}
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
                                                                                            {item.c_file !="" ? (
                                                                                            <Image source={{ uri: item?.c_file }} style={{ height: hp(10), width: wp(30), marginTop: hp(1) }} />
                                                                                            ) : (
                                                                                            <View>
                                                                                            <TwitterTextView
                                                                                                style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.primarygray }}
                                                                                                hashtagStyle={styles.hashtagStyle}
                                                                                                mentionStyle={styles.mentionStyle}
                                                                                                linkStyle={styles.linkStyle}
                                                                                                emailStyle={styles.emailStyle}
                                                                                                onPressHashtag={()=>{}}
                                                                                                onPressMention={()=>{}}
                                                                                                onPressEmail={()=>{}}
                                                                                            >{item.text}</TwitterTextView>
                                                                                            </View>
                                                                                            )}
                                                                                        </View>
                                                                                        </View>
                                                                                    </TouchableOpacity>
                                                                                    </View>
                                                                                    {/* <View style={{ flexDirection: 'row', }}>
                                                                                    <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'column' }} onPress={() => handleComments(null, item.id, item.is_comment_liked ? 'comment_dislike' : 'comment_like', item, index)}>
                                                                                        <MaterialCommunityIcons name={item.is_comment_liked ? "heart" : "heart-outline"} size={21} color={item.is_comment_liked ? COLORS.red : COLORS.darkgray1} />
                                                                                        <Text style={{ color: COLORS.darkgray1, fontSize: hp(2.2) }}>{item.comment_likes}</Text>
                                                                                    </TouchableOpacity>
                                                                                    </View> */}
                                                                                </View>
                                                                                )}
                                                                                keyExtractor={(item, index) => item.comment_id.toString()}
                                                                                ListEmptyComponent={() => (
                                                                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.darkgray1 }}>No replies to show</Text>
                                                                                </View>
                                                                                )}
                                                                            />
                                                                            }
                                                                            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                                                            {user_data?.avatar != '' &&
                                                                                <Image source={{ uri: user_data?.avatar }} style={{ height: wp(8), width: wp(8), borderRadius: wp(8) }} />
                                                                            }
                                                                                <View style={{ flex: 1, marginHorizontal: wp(2), height: 40, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ededed', borderRadius: wp(2) }}>
                                                                                <TextInput
                                                                                    placeholder=' Write a comment and press enter'
                                                                                    placeholderTextColor={COLORS.secondaryGray}
                                                                                    style={styles.CommentInput}
                                                                                    value={commentReplyText}
                                                                                    onChangeText={text => setCommentReplyText(text)}
                                                                                    onSubmitEditing={() => handleComments(item.post_id, item.id, 'create_reply', item, index, index1)}
                                                                                />
                                                                                </View>
                                                                                <TouchableOpacity onPress={() => handleComments(item.post_id, item.id, 'create_reply', item, index, index1)}>
                                                                                <Materialicons name='send' size={24} color={COLORS.darkgray1} />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                            
                                                                            </View>

                                                                        )}
                                                                    
                                                                        </>
                                                                        )}
                                                                        }
                                                                    }
                                                                    contentContainerStyle={{ flexGrow: 1 }}
                                                                    ListEmptyComponent={() => (
                                                                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 15, color: COLORS.darkgray1 }}>No comments to show</Text>
                                                                        </View>
                                                                    )}
                                                                    />
                                                                }
                                                                </View>
                                                        </Collapsible>
                                                        
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
                                                                    <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f2f5', width: '95%' }}>
                                                                        <Image source={{ uri: user_data?.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
                                                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                                            <TextInput
                                                                                placeholder=' Write a comment and press enter'
                                                                                placeholderTextColor={COLORS.secondaryGray}
                                                                                style={styles.CommentInput}
                                                                                value={commentText}
                                                                                onChangeText={text => setCommentText(text)}
                                                                            />
                                                                            <TouchableOpacity onPress={() => handleComments(item.post_id)}>
                                                                                <Materialicons name='send' size={23} color={COLORS.darkgray1} />
                                                                            </TouchableOpacity>
                                                                            {/* <TouchableOpacity onPress={openImagePicker}>
                                                                                <Ionicons name='camera-outline' size={23} color={COLORS.darkgray1} />
                                                                            </TouchableOpacity> */}
                                                                        </View>
                                                                    </View>
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
                                                                                            <Image source={{ uri: item.publisher.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
                                                                                            <TouchableOpacity
                                                                                                onLongPress={() => handleLongPress(item)}
                                                                                                style={{ flexDirection: 'row', alignItems: 'center' }}
                                                                                            >
                                                                                                <View style={{ marginHorizontal: wp(3), height: 'auto', maxWidth: '80%', padding: 10, borderRadius: 8, backgroundColor: '#f0f2f5' }}>
                                                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                                                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.publisher.user_id })}>
                                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2), color: COLORS.black }}>{item.publisher.username}</Text>
                                                                                                            <Materialicons name="check-circle" size={18} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(1) }} />
                                                                                                        </TouchableOpacity>

                                                                                                    </View>
                                                                                                    <View>
                                                                                                        {item.c_file != "" ? (
                                                                                                            <Image source={{ uri: item.c_file }} style={{ height: hp(10), width: wp(30), marginTop: hp(1) }} />
                                                                                                        ) : (
                                                                                                            <View>
                                                                                                            <TwitterTextView
                                                                                                                style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.primarygray }}
                                                                                                                hashtagStyle={styles.hashtagStyle}
                                                                                                                mentionStyle={styles.mentionStyle}
                                                                                                                linkStyle={styles.linkStyle}
                                                                                                                emailStyle={styles.emailStyle}
                                                                                                                onPressHashtag={()=>{}}
                                                                                                                onPressMention={()=>{}}
                                                                                                                onPressEmail={()=>{}}
                                                                                                            >{item.text}</TwitterTextView>
                                                                                                                {/* <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.primarygray }}>{item.text}</Text> */}
                                                                                                            </View>
                                                                                                        )}
                                                                                                    </View>
                                                                                                </View>
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                        <View style={{ flexDirection: 'row', }}>
                                                                                            <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'column' }} onPress={() => handleComments(item.post_id, item.id, item.is_comment_liked ? 'comment_dislike' : 'comment_like')}>
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
                                                            )}
                                                        </RBSheet>


                                                    </View>
                                                </TouchableHighlight>
                                            )
                                        }
                                        }
                                    />
                                )
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SavedPosts;

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
        commentCollapsView: {
            // width: '100%',
            backgroundColor: '#fff',
            borderWidth: 0.5,
            borderColor: '#eeeff0',
            paddingVertical: hp(1),
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
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
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: wp(2),
            alignSelf: 'center',
            paddingBottom: hp(2),
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
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
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black
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
            fontSize: 16,
            padding: 4,
            paddingHorizontal: 15,
            fontFamily: fontFamily.FONTS.regular,
            color: '#555555',
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
            fontSize: hp(1.9),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            textAlign: 'left',
            width: '96%'
        },
        postDetails2: {
            paddingLeft: wp(5),
            fontSize: hp(1.9),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            textAlign: 'left',
            width: '96%'
        },
        postDetails3: {
            fontSize: hp(1.9),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            textAlign: 'center'
        },
        hashtagStyle: {
            fontSize: hp(1.9),
            fontFamily: fontFamily.FONTS.bold,
            color: COLORS.red,
        },
        mentionStyle: {
          fontSize: hp(1.9),
            fontFamily: fontFamily.FONTS.bold,
            color: COLORS.primary,
        },
        emailStyle: {
          fontSize: hp(1.9),
          fontFamily: fontFamily.FONTS.bold,
          color: COLORS.red,
        },
        linkStyle: {
          fontSize: hp(1.9),
          fontFamily: fontFamily.FONTS.bold,
          color: COLORS.red,
        }
    });
};