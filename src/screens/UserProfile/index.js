/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, Share, View, Image, ToastAndroid, ScrollView, TextInput, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback, Linking } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Entypo from 'react-native-vector-icons/Entypo';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Foundation from 'react-native-vector-icons/Foundation'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Octicons from 'react-native-vector-icons/Octicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontFamily from '../../../constants/fontFamily';
import { onAddToFamilyApi, onBlockActionApi, onFollowUser, onPokeUserApi, MidjeournyImage, onGetActivities, onReportUserApi, onGetPostApi, onPageLikeApi, commentonPost, onHidePost, reportComments, onCreateAlbumApi, sendPushNotification, onNotificationDataApi } from '../../Service/Api';
import { getUserDataApi } from '../../Service/Api';
import { fetchUserDataSuccess } from '../../redux/reducer';
import RBSheet from 'react-native-raw-bottom-sheet'; // Import RBSheet
import { Loader } from '../../components/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import CheckBox from '../../components/CheckBox';
import users from '../../../assets/image/img/createPage/users.png';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import FBCollage from 'react-native-fb-collage';
import Collapsible from 'react-native-collapsible';
import CustomInput from '../../components/CustomInput';
import Gallery from 'react-native-image-gallery';
import { UnfriendPopup } from '../../components/UnfriendPopup';
import firestore from '@react-native-firebase/firestore';
import SelectDropdown from 'react-native-select-dropdown';
import bgImage from '../../../assets/image/img/market.png'
import { FutureTradPopup } from '../../components/FutureTradPopup';
import blessed from '../../../assets/emoji/blessed.png'
import Angry from '../../../assets/emoji/Angry.png'
import verySad from '../../../assets/emoji/verySad.png'
import broken from '../../../assets/emoji/broken.png'
import Cheeky from '../../../assets/emoji/Cheeky.png'
import Cool from '../../../assets/emoji/Cool.png'
import tired from '../../../assets/emoji/tired.png'
import expressionless from '../../../assets/emoji/expressionless.png'
import hot from '../../../assets/emoji/hot.png'
import pretty from '../../../assets/emoji/pretty.png'
import funny from '../../../assets/emoji/funny.png'
import lovely from '../../../assets/emoji/lovely.png'
import loved from '../../../assets/emoji/loved.png'
import happy from '../../../assets/emoji/happy.png'
import confused from '../../../assets/emoji/confused.png'
import sad from '../../../assets/emoji/sad.png'
import sleep from '../../../assets/emoji/sleep.png'
import shocked from '../../../assets/emoji/shocked.png'
import Smile from '../../../assets/emoji/Smile.png'
import TwitterTextView from 'react-native-twitter-textview';

const feelingOptions = [
    { title: 'Feeling', icon: 'sentiment-satisfied' },
    { title: 'Traveling to', icon: 'work' },
    { title: 'Watching', icon: 'desktop-mac' },
    { title: 'Playing', icon: 'support' },
    { title: 'Listening to', icon: 'music-note' },
  ];

  const SubFeelingOptions = [
    { title: 'Happy', icon: happy },
    { title: 'Loved', icon: loved },
    { title: 'Sad', icon: sad },
    { title: 'Very sad', icon: verySad },
    { title: 'Angry', icon: Angry },
    { title: 'Confused', icon: confused },
    { title: 'Hot', icon: hot },
    { title: 'Broken', icon: broken },
    { title: 'Expressionless', icon: expressionless },
    { title: 'Cool', icon: Cool },
    { title: 'Funny', icon: funny },
    { title: 'Tried', icon: tired },
    { title: 'Lovely', icon: lovely },
    { title: 'Blessed', icon: blessed },
    { title: 'Shocked', icon: shocked },
    { title: 'Sleepy', icon: sleep },
    { title: 'Pretty', icon: pretty },
    { title: 'Bored', icon: hot },
  ];

const UserProfile = ({ route }) => {
    const user_data = useSelector(state => state.user_data);
    const { UserId } = route.params;
    console.log(UserId)
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme, WD, WH),
    });

    const [userdata, setUserData] = useState(null)
    const [friendsVisible, setFriendVisible] = useState(false)
    const [requestVisible, setRequestVisible] = useState(false)
    const [acceptRequest, setAcceptRequest] = useState(false)
    const [feelingVisible, setFeelingVisible] = useState(false);
    const [locationVisible, setLocationVisible] = useState(false);
    const [locationText, setLocationText] = useState('');
    const [selectFeeling, setSelectFeeling] = useState('')
    const [feelingSubOption, setFeelingSubOption] = useState('')
    const [selectFeelingVisible, setSelectFeelingVisible] = useState(false)
    const [subFeelingVisible, setSubFeelingVisible] = useState(false)
    const [selectedSubImage, setSelectedSubImage] = useState(null);
    const [friendRequest, setFriendRequests] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const usersOptions = [
        { title: 'Only me', icon: 'lock' },
        { title: 'Everyone', icon: 'public' },
        { title: 'My Friends', icon: 'group' },
        { title: 'Anonymous', icon: 'person' },
      ];

      useEffect(() => {
        onGetNotification()
      }, [])

      const onGetNotification = async () => {
        try {
          const token = await AsyncStorage.getItem('access_token')
          if (token != null) {
            const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
            const formData = new FormData();
            formData.append('fetch', 'friend_requests');
            formData.append('server_key', serverkey);
    
            const response = await onNotificationDataApi(formData, token)
            if (response.data.api_status === 200) {
              setFriendRequests(response.data.friend_requests)
              if(response.data.friend_requests.length > 0) {
                response.data.friend_requests.map((item,index) => {
                    if (item.user_id == UserId) {
                        setRefresh(!refresh);
                        setAcceptRequest(true);
                    }
                })
            }
              
              
              console.log('this is the notification', response.data, token)
            } else if (response.data.api_status === 400 || 404) {
              console.log('error for notification', response.data, errors.error_text)
            }
          }
        }
        catch (err) {
          setLoading(false)
          console.log("Get Error:", err)
        }
      }

    // Function to fetch user data based on UserId
    const getUserData = async (UserId) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('user_id', UserId);
                formData.append('fetch', 'user_data,followers,following,liked_pages,joined_groups');
                formData.append('server_key', serverkey);

                const response = await getUserDataApi(formData, token);
                if (response.data.api_status === 200) {
                    setUserData(response.data); // Set user data in state
                    await fetchUserPost(UserId)
                    console.log('this is the FolloerUser Data', response.data.user_data)
                    if (user_data.mutual_friends_data != undefined && user_data.mutual_friends_data.length>0) {
                        user_data.mutual_friends_data.map((item) => {
                            if (response.data.user_data.user_id == item) {
                                            setFriendVisible(true);
                            }
                        })                 
                    } 
                    setLoading(false)
                } else if (response.data.api_status === 400 || response.data.api_status === 404) {
                    setLoading(false)
                    console.log('Error fetching profile data', response.data);
                    // Handle error scenario or navigation accordingly
                }
            } else {
                setLoading(false)
                console.log('User Token Not found');
                // Handle token not found scenario
            }
        } catch (error) {
            setLoading(false)
            console.log('Error:', error);
            // Handle other errors
        }
    };

    useEffect(() => {
        getUserData(UserId); // Fetch user data when component mounts
    }, [UserId]);


    const [modelVisible, setModelVisible] = useState(false)
    const [postModelVisible, setPostModelVisible] = useState(false)
    const [userPost, setUserPost] = useState([])
    const [postText, setPostText] = useState('')
    const [postData, setPostData] = useState([])
    const [postPhotos, setPostPhotos] = useState([])
    const [postPhotosType, setPostPhotosType] = useState([])
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const [commentsReply, setCommentsReply] = useState([])
    const [commentsReplyVisible, setCommentsReplyVisible] = useState({})
    const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
    const [loading, setLoading] = useState(false)
    const rbSheetRef = useRef(null); // Reference for RBSheet
    const postActionMenuRef = useRef(null);
    const [loadingUserPosts, setLoadingUserPosts] = useState(false);
    const [loadingLikePages, setLoadingLikePages] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [isChecked1, setIsChecked1] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [selectedImage, setSelectedImage] = useState([]);
    const [commentImage, setCommentImage] = useState(null)
    const [commentImageType, setCommentImageType] = useState('')
    const [longPressedComment, setLongPressedComment] = useState(null);
    const [longPressedCommentReply, setLongPressedCommentReply] = useState(null);
    const [filterOption, setFilterOption] = useState(0)
    const [selectedPostId, setSelectedPostId] = useState(null)
    const ActionMenuRef = useRef(null);
    const [activities, setActivities] = useState([])
    const [activitiesVisible, setActivitiesVisible] = useState(false)
    const [trendingModelVisible, setTrendingModelVisible] = useState(false)
    const [aiImageModelVisible, setAiImageModelVisible] = useState(false)
    const [aiPostModelVisible, setAiPostModelVisible] = useState(false)
    const [imageSizeVisible, setImageSizeVisible] = useState(false)
    const [imageSize, setImageSize] = useState('1024x1024')
    const [imageCountVisible, setImageCountVisible] = useState(false)
    const [imageCount, setImageCount] = useState('1')
    const [imagePrompt, setImagePrompt] = useState('')
    const [postPrompt, setPostPrompt] = useState('')
    const [generatedImage, setGeneratedimage] = useState(null)
    const [result, setResult] = useState('')
    const [generatedPost, setGeneratedPost] = useState('')
    const [loadingPost, setLoadingPost] = useState(false)
    const [editModel, setEditModel] = useState(false)
    const [deleteModel, setDeleteModel] = useState(false)
    const [editText, setEditText] = useState(null)
    const [editImage, setEditImage] = useState(null)
    const [commentStatus, setCommentStatus] = useState(null)
    const [search, setSearch] = useState('')
    const [postSavedStatus, setPostSavedStatus] = useState(null)
    const [selectedAlbum, setSelectedAlbum] = useState([]);
    const [isGalleryVisible, setGalleryVisible] = useState(false);
    const [commentReplyImage, setCommentReplyImage] = useState(null)
    // const [commentImageType, setCommentImageType] = useState('')
    const [commentReplyText, setCommentReplyText] = useState('')
    const [albums ,setAlbums] = useState([]);
    const [searchPost, setSearchPost] = useState('')
    const [unfriendModal, setUnfriendModal] = useState(false);
    // const [commentsReply, setCommentsReply] = useState([])
    // const [commentsReplyVisible, setCommentsReplyVisible] = useState({})

    // ActionBottomSheet Height
    // const baseHeight = 50; // Set your base height
    // const optionHeight = hp(8); // Set the height of each option
    // const numOptions = page.is_page_onwer ? 2 : 3;



    const handlePostActionMenu = (value) => {
        // Handle the selected action here
        handlePostActions(item.post_id, value);
        // Close the RBSheet after handling the action
        postActionMenuRef.current.close();
    };

    const toggleCommentInput = () => {
        setShowCommentInput(!showCommentInput);
        rbSheetRef.current?.open(); // Open RBSheet on comment icon click
    };

    const toggelModel = () => {
        setModelVisible((prevVisible) => !prevVisible)
    }
    const postToggleModal = () => {
        setPostModelVisible((prevVisible) => !prevVisible)
        if (!postModelVisible) {
            setPostText('');
            setPostPhotos([]);
            setSelectedImage([])
        }
    };

    const trendingToggleMOdal = () => {
        setTrendingModelVisible((prevVisible) => !prevVisible)
    }

    const toggelAiImage = () => {
        setAiImageModelVisible((prevVisible) => !prevVisible)
        if (!aiImageModelVisible) {
            setGeneratedimage([])
            setImagePrompt('')
        }
    }

    const toggelAiPost = () => {
        setAiPostModelVisible((prevVisible) => !prevVisible)
        if (!aiPostModelVisible) {
            setGeneratedPost('')
            setPostPrompt('')
            setResult('')
        }
    }

    const toggleDeleteModel = (selectedPostId) => {
        setDeleteModel((prevVisible) => !prevVisible)
    }
    const toggelEditModel = () => {
        setEditModel((prevVisible) => !prevVisible)
    }

    const toggleMenu = (value, postId, Orginaltext, postFile, comments_status, is_post_saved) => {
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
        console.log('this is the selcted post body', editImage)
    };

    const createPost = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)

                if (postText) {
                    formData.append('postText', postText)
                }
                if (postPhotos) {
                    // If postPhotos contains multiple images, append them individually
                    if (Array.isArray(postPhotos)) {
                        postPhotos.forEach((image, index) => {
                            formData.append(`postPhotos[${index}]`, image);
                        });
                    } else {
                        formData.append('postPhotos[0]', postPhotos);
                    }
                }

                const response = await onCreateNewPostApi(formData, token)
                if (response.data.api_status === 200) {
                    setPostModelVisible(false)
                    fetchUserPost()
                    setLoading(false)
                    ToastAndroid.show('post created', ToastAndroid.SHORT)
                    console.log('created post', response.data)
                    setPostText('')
                    setFeelingVisible(false)
                            setSelectFeelingVisible(false);
                            setSubFeelingVisible(false);
                            setLocationVisible(false);
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('Error fetching UserPost', response.data.errors.error_text)
                    ToastAndroid.show('somthing went wrong please try again', ToastAndroid.SHORT)
                }
            }
            else {
                setLoading(false)
                console.log('Token not found', error.message)
            }
        } catch (err) {
            setLoading(false)
            console.log("Get Error::", err)
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

    const handleLongPress = (item) => {
        setLongPressedComment(item);
        rbSheetRef.current.open(); // Open the RBSheet to display actions
    };

    const handleLikepages = async (post_id, fullItem) => {
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
                        const res = fullItem.publisher.fcm_token.replace(/ /g, '')
                        console.log("get Item Token ::::", userdata.user_data)
                        if (!fullItem.is_liked) {
                            sendPushNotification(
                                res,
                                `Like Post`,
                                `${user_data.username} is like on your post.`,
                            );
                        }
                        
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

    const handleComments = async (post_id, id, type, fullItem) => {
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
                    const res = fullItem.publisher.fcm_token.replace(/ /g, '')
                        console.log("get Item Token ::::", res)
                    if (commentText || commentImage) {
                        if(commentText) {
                            sendPushNotification(
                                res,
                                `${fullItem.publisher.username}`,
                                `${commentText}`,
                            );
                        } else {
                            sendPushNotification(
                                res,
                                `${fullItem.publisher.username}`,
                                `${user_data.username} is comment on your post.`,
                            );
                        }
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
                        sendPushNotification(
                            res,
                            `${fullItem.publisher.username}`,
                            `${user_data.username} is like comment on your post.`,
                         );
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
                                    return { ...comment, is_comment_liked: false, comment_likes: comment.comment_likes - 1 };
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
                    } else if (type === 'create_reply') {
                        sendPushNotification(
                            res,
                            `${fullItem.publisher.username}`,
                            `${user_data.username} is reply comment on your post.`,
                        );
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
    const openPostImagePicker = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                multiple: true, // Allow selecting only one image
            });

            if (image && image.length> 0) {
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
                    setPostPhotos(imageData);
                    setPostPhotosType(image.mime)
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

    const renderHorizontalTabItem = (IconComponent, icoName, text, onPress) => {
        return (
            <TouchableOpacity key={icoName} onPress={onPress} style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <IconComponent name={icoName} size={22} color={COLORS.secondaryGray} />
                <Text style={styles.horizontalTabText}>{text}</Text>
            </TouchableOpacity>
        )
    }

    const onAllPostShow = async (from) => {
        if (from == 'AllData') {
            setFilterOption(0)
            setLoadingUserPosts(true)
            setPostData(userPost)
            setLoadingUserPosts(false)
        }
        else if (from == 'text') {
            let arrayText = []
            userPost.map((item, index) => {
                if (item.Orginaltext != null) {
                    arrayText.push(item)
                }
            })
            setFilterOption(1)
            setLoadingUserPosts(true)
            setPostData(arrayText)
            setLoadingUserPosts(false)
        }
        else if (from == 'image') {
            let arrayText = []
            userPost.map((item, index) => {
                if (item.postType == 'profile_picture' || item.photo_album.length> 0) {
                    arrayText.push(item)
                }
            })
            setFilterOption(2)
            setLoadingUserPosts(true)
            setPostData(arrayText)
            setLoadingUserPosts(false)
        }
        else if (from == 'video') {
            setFilterOption(3)
            setLoadingUserPosts(true)
            setPostData([])
            setLoadingUserPosts(false)
        }
        else if (from == 'music') {
            setFilterOption(4)
            setLoadingUserPosts(true)
            setPostData([])
            setLoadingUserPosts(false)
        }
        else {
            setFilterOption(5)
            setLoadingUserPosts(true)
            setPostData([])
            setLoadingUserPosts(false)
        }
    }

    const followUser = async (UserId) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            console.log(token)
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('user_id', UserId)

                const response = await onFollowUser(formData, token)
                setUnfriendModal(false)
                console.log("get Item Response Data::::", response.data)
                if (response.data.api_status === 200) {
                    if (response.data.follow_status != 'unfollowed') {
                        const res = userdata?.user_data?.fcm_token.replace(/ /g, '')
                        console.log("get Item Token ::::", userdata)
                        if (acceptRequest) {
                            setFriendVisible(true);
                            setRefresh(!refresh);
                            sendPushNotification(
                                res,
                                `${user_data.username}`,
                                `Accept your follow request.`,
                            );
                        } else {
                            setRequestVisible(true);
                            setRefresh(!refresh);
                            sendPushNotification(
                                res,
                                `${user_data.username}`,
                                `Sent follow request.`,
                            );
                        }
                        
                    } else if(response.data.follow_status == 'requested') {
                        setRequestVisible(true);
                        setRefresh(!refresh);
                    }
                    else {
                        setRequestVisible(false);
                        setFriendVisible(false);
                    }
                    // getUserData(UserId)
                    // onCheckAuth(user_data)
                    console.log('Follow_status', response.data.follow_status)
                    setModelVisible(false)
                    ToastAndroid.show(response.data.follow_status, ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    console.log(response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong please try again', ToastAndroid.SHORT)
                }
            }
            else {
                console.log('token not found', error.message)
            }
        } catch (err) {
            console.log("Get Error::", err)
        }
    }

    const onCheckAuth = async (user) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                console.log('Get USer Data:::', user)
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('user_id', user);
                formData.append('fetch', 'user_data,followers,following,liked_pages,joined_groups');
                formData.append('server_key', serverkey);

                const response = await getUserDataApi(formData, token)
                console.log("Get Response DAtaLLL", response.data)
                if (response.data.api_status === 200) {
                    dispatch(fetchUserDataSuccess(response.data.user_data, response.data.followers, response.data.following, response.data.liked_pages, response.data.joined_groups))
                    console.log('Liked_pages', response.data.liked_pages)
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

    const blockUser = async (UserId) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            console.log(token)
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('user_id', UserId)
                formData.append('block_action', 'block')

                const response = await onBlockActionApi(formData, token)
                if (response.data.api_status === 200) {
                    console.log('Block_status', response.data)
                    setModelVisible(false)
                    ToastAndroid.show(response.data.block_status, ToastAndroid.SHORT)
                    getUserData()
                    onCheckAuth(UserId)
                    navigation.navigate('Profile')
                } else if (response.data.api_status === 400 || 404) {
                    console.log(response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong please try again', ToastAndroid.SHORT)
                }
            }
            else {
                console.log('token not found', error.message)
            }
        } catch (err) {
            console.log("Get Error::", err)
        }
    }

    const pokeUser = async (UserId) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            console.log(token)
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('user_id', UserId)
                formData.append('type', 'create')

                const response = await onPokeUserApi(formData, token)
                if (response.data.api_status === 200) {
                    console.log('poke successfully', response.data)
                    ToastAndroid.show(response.data.message_data, ToastAndroid.SHORT)
                    setModelVisible(false)
                } else if (response.data.api_status === 400 || 404) {
                    console.log(response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong please try again', ToastAndroid.SHORT)
                }

            } else {
                console.log('token not found', error.message)
            }
        } catch (err) {
            console.log("Get Error::", err)
        }
    }

    const addToFamily = async (UserId) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            console.log(token)
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('user_id', UserId)
                formData.append('type', '1')

                const response = await onAddToFamilyApi(formData, token)
                if (response.data.api_status === 200) {
                    console.log('Add To family Successfully', response.data)
                    ToastAndroid.show('Added To Family', ToastAndroid.SHORT)
                    setModelVisible(false)
                } else if (response.data.api_status === 400 || 404) {
                    console.log(response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong please try again', ToastAndroid.SHORT)
                }

            } else {
                console.log('token not found', error.message)
            }
        } catch (err) {
            console.log("Get Error::", err)
        }
    }

    const reportUser = async (UserId) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('user', UserId)
                formData.append('text', '')

                const response = await onReportUserApi(formData, token)
                if (response.data.api_status === 200) {
                    console.log('User report SuccessFully', response.data)
                    ToastAndroid.show('Report the User', ToastAndroid.SHORT)
                    setModelVisible(false)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong', response.data.errors.error_text)
                    ToastAndroid.show('Somthing Went Wrong Please try again', ToastAndroid.SHORT)
                }

            } else {
                console.log('User Token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    // useEffect(() => {
    //     fetchUserPost(UserId)
    // }, [])

    const fetchUserPost = async (UserId) => {
        try {
            setLoadingUserPosts(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('type', 'get_user_posts')
                formData.append('id', UserId)

                const response = await onGetPostApi(formData, token)
                if (response.data.api_status === 200) {
                    setUserPost(response.data.data)
                    setPostData(response.data.data)
                    setLoadingUserPosts(false)
                    console.log('This is USerPost', response.data.data.admin)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('Error fetching UserPost', response.data.errors.error_text)
                    setLoadingUserPosts(false)
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
    }

    const handleShare = (item) => {
        Share.share({
            message: `Check out this post: ${item.url}`, // Customize the shared message here
        })
            .then(result => console.log(result))
            .catch(errorMsg => console.error(errorMsg));
    };

    const handlePostActions = async (selectedPostId, action) => {
        try {
            // setLoading(true)
            setPostData((prevData) => {
                return prevData.map((item) => {
                    if (selectedPostId === item.post_id) {
                        return {
                            ...item,
                            is_post_saved: !item.is_post_saved,
                        };
                    }
                    return item;
                });
            })
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
                } else if (action === 'delete') {
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
                        await fetchUserPost()
                        console.log('Post edited successfully', response.data);
                        ToastAndroid.show('Post edited successfully', ToastAndroid.SHORT);
                    } else if (action === 'delete') {
                        setDeleteModel(false)
                        setModelVisible(false)
                        await fetchUserPost()
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
                        await fetchUserPost()
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
                    const updatedUserPosts = userPost.filter(post => post.post_id !== post_id);
                    setUserPost(updatedUserPosts); // Update the userPost array
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

    const openWebsite = (websiteLink) => {
        Linking.canOpenURL(websiteLink).then((supported) => {
            if (supported) {
                Linking.openURL(websiteLink);
            } else {
                console.error("Don't know how to open URI: " + websiteLink);
            }
        });
    };

    function convertDateFormat(input) {
        if (!input) {
            console.log('empty or invaild date');
            return '';
        }
        // Split the input into components
        const [month, year, day] = input.split('/');

        // Create a new Date object
        const date = new Date(`${20}${year}-${month}-${day}`);

        // Define an array of month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Format the date
        const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;

        return formattedDate;
    }

    const toggelActivities = () => {
        setActivitiesVisible((prevVisible) => !prevVisible)
    }

    const getActivities = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);

                const response = await onGetActivities(formData, token);
                if (response.data.api_status === 200) {
                    console.log('this is the activities', response.data.data)
                    setActivities(response.data.data)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong', response.data.errors.error_text)
                }
            } else {
                console.log('user token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    // Define the profile completion items
    const profileCompletionItems = [
        'Add your profile picture',
        'Add your name',
        'Add your workplace',
        'Add your country',
        'Add your address',
    ];

    // Function to render individual profile completion items
    const renderProfileCompletionItems = (items) => {
        return items.map((item, index) => {
            let isCompleted = false;

            // Check if user_data.name exists
            if (index === 0) {
                isCompleted = !!user_data?.avatar;
            }
            if (index === 1) {
                isCompleted = !!user_data?.name;
            }
            if (index === 2) {
                isCompleted = !!user_data?.working;
            }
            if (index === 3) {
                isCompleted = !!user_data?.country_id;
            }
            if (index === 4) {
                isCompleted = !!user_data?.address;
            }

            return (
                <TouchableOpacity key={index} style={[styles.ProfileComplitionButton, isCompleted && { backgroundColor: '#e9f5e9' }]}>
                    <Materialicons name={isCompleted ? 'check-circle' : 'add-circle'} size={22} color={isCompleted ? '#7ac27d' : COLORS.black} />
                    <Text style={[styles.ProfileComplitionButtonText, isCompleted && styles.underlinedText]}>
                        {item}
                    </Text>
                </TouchableOpacity>
            );
        });
    };

    const generateImage = async () => {
        try {
            setLoadingPost(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('type', 'openai_post')
                formData.append('text', postPrompt)
                formData.append('count', result)
                // formData.append('num_outputs', imageCount)

                const response = await MidjeournyImage(formData, token)
                if (response.data.api_status === 200) {
                    console.log('Post generated', response.data.data)
                    setGeneratedPost(response.data.data)
                    setLoadingPost(false)
                    // setGeneratedimage(response.data)
                } else if (response.data.api_status === 400 || 404) {
                    setLoadingPost(false)
                    console.log('somthing went wrong', response.data.errors.error_text)
                }
            } else {
                setLoadingPost(false)
                console.log('user Token not found', error.message)
            }
        } catch (error) {
            setLoadingPost(false)
            console.log('Get Error::', error)
        }
    }

    const getTimeDifference = (timestamp) => {
        const currentTime = Date.now() / 1000; // Current time in seconds
        const difference = currentTime - timestamp; // Calculate the difference

        const secondsInYear = 31536000;
        const secondsInMonth = 2592000;
        const secondsInDay = 86400;
        const secondsInHour = 3600;

        const years = Math.floor(difference / secondsInYear);
        const months = Math.floor(difference / secondsInMonth);
        const days = Math.floor(difference / secondsInDay);
        const hours = Math.floor(difference / secondsInHour);

        if (years> 0) {
            return `${years}Y`;
        } else if (months> 0) {
            return `${months}M`;
        } else if (days> 0) {
            return `${days}d`;
        } else {
            return `${hours}Hr`;
        }
    };

    useEffect(() => {
        fetchAlbums()
    }, [])


    const fetchAlbums = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                var formdata = new FormData();
                formdata.append("server_key", serverkey);
                formdata.append("type", "fetch");
                formdata.append('user_id', UserId)
                const response = await onCreateAlbumApi(formdata, token)
                console.log('this is the created events', response.data.data)
                if (response.data.api_status === 200) {
                    setAlbums(response.data.data)
                    console.log('this is the albums', response.data.data)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('error for createing the event', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
                }
            }
        }
        catch (err) {
            console.log("Error::", err)
        }
    }

    const handleSearchPost = (text) => {
        setSearchPost(text)
      if (text !== '') {
            
      const filtered = userPost.filter(item =>
        item.Orginaltext !=null && item.Orginaltext.toLowerCase().includes(text.toLowerCase()),
      );
      setLoadingUserPosts(true)
      setPostData(filtered)
      setLoadingUserPosts(false)
      } else {
      setLoadingUserPosts(true)
      setPostData(userPost);
      setLoadingUserPosts(false)
      }
      }

    const onMessagePress = async () => {
        try {
        await firestore()
        .collection('marketChat')
        .doc(`${userdata?.user_data?.user_id}-${user_data.user_id}`)
        .set({
            sender: {
                id: user_data.user_id,
                name: user_data.name,
                profilePic: user_data.avatar
            },
            receiver: {
                id: userdata?.user_data?.user_id,
                name: userdata?.user_data?.username,
                profilePic: userdata?.user_data?.avatar
            }
        })
        .then(() => {
            // navigation.navigate('ChatScreen', {
            //     UserData: item

            // });
            navigation.navigate('ChatScreen', {
                receiver: {
                    id: userdata?.user_data?.user_id,
                    name: userdata?.user_data?.username,
                    profilePic: userdata?.user_data?.avatar
                },
                sender: {
                    id: user_data.user_id,
                    name: user_data.name,
                    profilePic: user_data.avatar
                }
            });
        })
        } catch (err) {
            console.log('err', err)
        }
    }

    const renderFeelingItem = ({item, index}) => {
        return (
          <TouchableOpacity
            style={[styles.userList, {height: hp(4),paddingLeft: wp(3)}]}
            onPress={() => {
              if(item.title == 'Feeling') {
                setSelectFeeling(item.title)
              setSelectFeelingVisible(!selectFeelingVisible)
              setSubFeelingVisible(true)
              } else {
                setSubFeelingVisible(false)
                setSelectFeeling(item.title)
              setSelectFeelingVisible(!selectFeelingVisible)
              }
              
            }}>
            <Materialicons name={item.icon} size={20} color={COLORS.darkgray1}/>
            <View style={{marginLeft: wp(4)}}>
              <Text style={styles.userNameText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )
      }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            {
                isGalleryVisible ? (
                    <Gallery
                        style={{ flex: 1, height: '100%', backgroundColor: 'black' }}
                        images={selectedAlbum.map(albumImage => ({ source: { uri: albumImage.image } }))}
                        onSingleTapConfirmed={() => setGalleryVisible(false)}
                    />
                ) : (
                    <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(2) }} showsVerticalScrollIndicator={false}>
                        {/* Profile Part */}
                        <View style={styles.container}>
                            <View style={styles.imageContainer}>
                                {/* Background Image */}
                                <Image source={{ uri: userdata?.user_data?.cover }} style={styles.backgroundImage} />
                                {/* User Image (Avatar) Positioned Over Background */}
                                <View style={styles.userImageContainer}>
                                    <Image source={{ uri: userdata?.user_data?.avatar }} style={styles.userImage} />
                                </View>
                            </View>

                            {/* Other Content Below Images */}
                            {user_data.user_id === UserId ? (
                                <View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: hp(10)
                                    }}>
                                        <Text style={{
                                            fontSize: hp(2.8),
                                            color: global.text2.color,
                                        }}>{user_data?.username}</Text>
                                        <Materialicons name="verified" size={24} color={COLORS.gray} style={{ paddingHorizontal: 10 }} />
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: hp(2.5)
                                    }}>
                                        <TouchableOpacity style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#e0e0e0',
                                            borderRadius: 10,
                                            paddingHorizontal: wp(2.5),
                                            marginHorizontal: wp(2.5)
                                        }} onPress={() => navigation.navigate('SettingScreen', { selectedOption: 'GeneralSetting' })}>
                                            <Feather name="edit-2" size={22} color={COLORS.black} />
                                            <Text style={{
                                                padding: 5,
                                                marginHorizontal: 5,
                                                color: COLORS.black,
                                                fontFamily: fontFamily.FONTS.regular,
                                                fontSize: hp(2.2)
                                            }}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#e0e0e0',
                                            borderRadius: 10,
                                            paddingHorizontal: wp(2.5),
                                            marginHorizontal: wp(2.5)
                                        }} onPress={() => { toggelActivities(); getActivities() }}>
                                            <Ionicons name="list-outline" size={24} color={COLORS.black} />
                                            <Text style={{
                                                padding: 5,
                                                marginHorizontal: 5,
                                                color: COLORS.black,
                                                fontFamily: fontFamily.FONTS.regular,
                                                fontSize: hp(2.2)
                                            }}>Activities</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={styles.horizontalTab}> */}
                                        <View
                                style={{
                                    width: '100%',
                                    // height: hp(7),
                                    paddingHorizontal: wp(4),
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: COLORS.white,
                                    alignSelf: 'center',
                                    marginTop: hp(3),
                                    justifyContent: 'space-between',
                                }}>
                                            {renderHorizontalTabItem(Materialicons, 'view-timeline', 'TimeLine', () => navigation.navigate('Profile'))}
                                            {renderHorizontalTabItem(MaterialCommunityIcons, 'select-group', 'Groups', () => navigation.navigate('GroupsList', { joined_groups: joined_groups }))}
                                            {renderHorizontalTabItem(AntDesign, 'like1', 'Likes', () => navigation.navigate('Likes', { liked_pages: liked_pages }))}
                                            {renderHorizontalTabItem(Materialicons, 'group', 'Friends', () => navigation.navigate('Followers', { followers: following }))}
                                            {/* {renderHorizontalTabItem(Materialicons, 'photo', 'Photos',)} */}
                                        </View>
                                </View>
                            ) : (
                                <View>
                                    <View style={styles.userNameContainer}>
                                        <Text style={styles.username}>{userdata?.user_data?.username}</Text>
                                        <Materialicons name="verified" size={24} color={COLORS.gray} style={{ paddingHorizontal: 10 }} />
                                    </View>
                                    <View style={styles.profilePartButton}>

                                        <TouchableOpacity style={[styles.EditButton, {backgroundColor: friendsVisible ? COLORS.orange : COLORS.gray}]} onPress={() => {friendsVisible? setUnfriendModal(true) : followUser(UserId)}}>
                                            <MaterialCommunityIcons name="account-check-outline" size={20} color={friendsVisible ? COLORS.white : COLORS.black} />
                                            <Text style={{fontSize: hp(1.8), fontFamily: fontFamily.FONTS.Medium,color: friendsVisible ? COLORS.white : COLORS.black,marginLeft:wp(1)}}>{friendsVisible? 'Friend' : requestVisible? 'Requested' : acceptRequest? 'Accept' : 'Add Friend'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.EditButton, {backgroundColor: COLORS.gray}]} onPress={() => onMessagePress()}>
                                            <MaterialCommunityIcons name="message-outline" size={20} color={COLORS.black} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.EditButton, {backgroundColor: COLORS.gray}]} onPress={() => ActionMenuRef.current.open()}>
                                            <Entypo name="dots-three-vertical" size={20} color={COLORS.black} />
                                        </TouchableOpacity>


                                        <RBSheet
                                            ref={ActionMenuRef}
                                            closeOnDragDown={true}
                                            height={250}
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
                                            <View style={{ marginHorizontal: wp(5), }}>
                                                <TouchableOpacity onPress={() => blockUser(UserId)}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                        <MaterialCommunityIcons name='account-cancel' size={24} color={COLORS.black} />
                                                        <View style={{ padding: 5 }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 15, color: COLORS.black }}>Block User</Text>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 13, color: COLORS.darkgray1 }}>Block this member,they won`t be able to reach you</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => reportUser(UserId)}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                        <Materialicons name='warning' size={24} color={COLORS.black} />
                                                        <View style={{ padding: 5 }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 15, color: COLORS.black }}>Report User</Text>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 13, color: COLORS.darkgray1 }}>Report this member</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => pokeUser(UserId)}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                        <MaterialCommunityIcons name='hand-pointing-right' size={24} color={COLORS.black} />
                                                        <View style={{ padding: 5 }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 15, color: COLORS.black }}>Poke</Text>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 13, color: COLORS.darkgray1 }}>send a poke to this member.Let them know you are  here!</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => addToFamily(UserId)}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                        <Materialicons name='family-restroom' size={24} color={COLORS.black} />
                                                        <View style={{ padding: 5 }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 15, color: COLORS.black }}>Add to family</Text>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 13, color: COLORS.darkgray1 }}>Add this member to your family list</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                        </RBSheet>

                                    </View>

                                    {/* Model */}
                                    <Modal visible={modelVisible} transparent animationType='fade'>
                                        <TouchableWithoutFeedback onPress={() => toggelModel(false)}>
                                            <View style={styles.conteredView}>
                                                <View style={styles.modelView}>
                                                    <TouchableOpacity onPress={() => blockUser(UserId)}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <MaterialCommunityIcons name='account-cancel' size={24} color={COLORS.black} />
                                                            <View style={{ padding: 5 }}>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 15, color: COLORS.black }}>Block User</Text>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 13, color: COLORS.darkgray1 }}>Block this member,they won`t be able to reach you</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => reportUser(UserId)}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <Materialicons name='warning' size={24} color={COLORS.black} />
                                                            <View style={{ padding: 5 }}>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 15, color: COLORS.black }}>Report User</Text>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 13, color: COLORS.darkgray1 }}>Report this member</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => pokeUser(UserId)}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <MaterialCommunityIcons name='hand-pointing-right' size={24} color={COLORS.black} />
                                                            <View style={{ padding: 5 }}>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 15, color: COLORS.black }}>Poke</Text>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 13, color: COLORS.darkgray1 }}>send a poke to this member.Let them know you are  here!</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => addToFamily(UserId)}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <Materialicons name='family-restroom' size={24} color={COLORS.black} />
                                                            <View style={{ padding: 5 }}>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 15, color: COLORS.black }}>Add to family</Text>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 13, color: COLORS.darkgray1 }}>Add this member to your family list</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </Modal>


                                    {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={styles.horizontalTab}> */}
                                        <View
                                style={{
                                    width: '100%',
                                    // height: hp(7),
                                    paddingHorizontal: wp(4),
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: COLORS.white,
                                    alignSelf: 'center',
                                    marginTop: hp(3),
                                    justifyContent: 'space-between',
                                }}>
                                            {renderHorizontalTabItem(Materialicons, 'view-timeline', 'TimeLine', () => navigation.navigate('UserProfile', { UserId: userdata.user_id }))}
                                            {renderHorizontalTabItem(MaterialCommunityIcons, 'select-group', 'Groups', () => navigation.navigate('GroupsList', { joined_groups: userdata.joined_groups }))}
                                            {renderHorizontalTabItem(AntDesign, 'like1', 'Likes', () => navigation.navigate('Likes', { liked_pages: userdata.liked_pages }))}
                                            {renderHorizontalTabItem(Materialicons, 'group', 'Friends', () => navigation.navigate('Followers', { followers: userdata.following }))}
                                            {/* {renderHorizontalTabItem(Materialicons, 'photo', 'Photos',)} */}
                                        </View>
                                    
                                </View>
                            )}
                        </View>


                        {user_data.user_id === UserId && (
                            <View style={styles.ProfileComplitionContainer}>
                                <View style={{ padding: 15 }}>
                                    <Text style={styles.ProfileComplitionHading}>Profile Complietion</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <View style={{ padding: 5 }}>
                                            <View style={{ marginTop: 15, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                {renderProfileCompletionItems(profileCompletionItems)}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* create Post */}
                        {user_data.user_id === UserId && !activitiesVisible && (
                            <View style={styles.ProfileComplitionContainer}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: user_data?.avatar }} style={{ height: 40, width: 40, borderRadius: 50 }} />
                                        <Text style={styles.albumsText}>{user_data?.username}</Text>
                                    </View>
                                    {/* <View style={{ padding: 10, borderRadius: 50, justifyContent: 'center', alignItems: 'center', }}>
                                        <FontAwesome5 name="smile" size={24} color={COLORS.gray} />
                                    </View> */}
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <TextInput
                                        placeholder="What`s going on? #Hastag.. @Mention.. Link.."
                                        placeholderTextColor={COLORS.secondaryGray}
                                        multiline={true}
                                        style={{ color: COLORS.darkgray }}
                                        onFocus={() => {
                                            // Call the function to toggle the post model here
                                            postToggleModal();
                                        }}
                                    />
                                </View>
                                <View style={styles.horizontalLine} />
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 15, alignItems: 'center' }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={trendingToggleMOdal}>
                                        <Octicons name="graph" size={17} color={COLORS.darkgray1} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 2, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={trendingToggleMOdal}>
                                        <Text style={{ fontSize: hp(1.85), color: COLORS.darkgray1}}>1X</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={postToggleModal}>
                                        <Materialicons name="photo" size={22} color={COLORS.lightBlue} />
                                    </TouchableOpacity> */}
                                    <TouchableOpacity style={{ padding: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={postToggleModal}>
                                        <FontAwesome5 name="poll" size={20} color={COLORS.lightGreen} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={postToggleModal}>
                                        <Materialicons name="add-circle" size={22} color={COLORS.darkgray1} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Post Modal */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={postModelVisible}
                            onRequestClose={() => {
                                setPostText('');
                                setPostModelVisible(false);
                                setShowAdditionalInputs(false);
                                setFeelingVisible(false)
                                setSelectFeelingVisible(false);
                                setSubFeelingVisible(false);
                                setLocationVisible(false);
                            }}
                     >
                            <View style={styles.maneModalView}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    setPostText('');
                                    setPostModelVisible(false);
                                    setShowAdditionalInputs(false);
                                    setFeelingVisible(false)
                                    setSelectFeelingVisible(false);
                                    setSubFeelingVisible(false);
                                    setLocationVisible(false);
                                }}>
                                <View style={styles.modalOverlay} />
                            </TouchableWithoutFeedback>
                            <View style={styles.container1}>
                                    <View style={styles.ProfileComplitionContainer}>
                                        {/* Your post structure content here */}
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={{ uri: user_data?.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 50 }} />
                                                <Text style={styles.albumsText}>{user_data?.username}</Text>
                                            </View>
                                            {/* <View style={{ padding: 10, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                                <FontAwesome5 name="smile" size={24} color={COLORS.gray} />
                                            </View> */}
                                        </View>
                                        <View style={{ paddingHorizontal: 10 }}>
                                            <TextInput
                                                placeholder="What`s going on? #Hastag.. @Mention.. Link.."
                                                placeholderTextColor={COLORS.secondaryGray}
                                                multiline={true}
                                                value={postText}
                                                onChangeText={text => setPostText(text)}
                                                style={{ color: COLORS.darkgray }}
                                            />

                                        </View>
                                        <View style={styles.horizontalLine} />
                                        {selectedImage.length> 0 ? (
                                            <ScrollView horizontal>
                                                <View style={{ flexDirection: 'row', }}>
                                                    {selectedImage.map((image, index) => (
                                                        <View key={index} style={{ margin: 5 }}>
                                                            <Image
                                                                source={{ uri: image }}
                                                                style={{ width: wp(30), height: hp(15), borderRadius: 10 }}
                                                            />
                                                        </View>
                                                    ))}
                                                </View>
                                            </ScrollView>
                                        ) : null}
                                        {showAdditionalInputs && (
                                            <View style={{ paddingHorizontal: 10 }}>
                                                <CustomInput
                                                    keyboardType="default"
                                                    placeholder="Answer 1"
                                                    placeholderTextColor={COLORS.secondaryGray}
                                                />
                                                <CustomInput
                                                    keyboardType="default"
                                                    placeholder="Answer 2"
                                                    placeholderTextColor={COLORS.secondaryGray}
                                                />
                                                <View style={{ flexDirection: 'row', paddingTop: 5, justifyContent: 'flex-start' }}>
                                                    <TouchableOpacity style={{ borderRadius: 4, backgroundColor: COLORS.lightBlue, padding: 5, }}>
                                                        <Text style={{ fontSize: hp(2), color: COLORS.white, fontFamily: fontFamily.FONTS.Medium }}>Add Answer</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}

                                        {feelingVisible && (
              <>
              {selectFeeling == '' ?
              <TouchableOpacity style={styles.locationTextInput} onPress={() => setSelectFeelingVisible(!selectFeelingVisible)}>
              <Text style={[styles.locationText, {color: COLORS.gray}]}>What are you doing?</Text>
              </TouchableOpacity>
              :
              <View style={styles.locationTextInput}>
              <TouchableOpacity style={{
                paddingHorizontal: wp(2),
                backgroundColor: COLORS.light_blue,
                paddingVertical: 5,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }} onPress={() => {setSelectFeelingVisible(!selectFeelingVisible), setSubFeelingVisible(false)}}>
              <Text style={[styles.locationText1]}>{selectFeeling}</Text>
              </TouchableOpacity>
              {selectFeeling != 'Feeling'?
              <TextInput 
                value={locationText}
                onChangeText={(text) => {setLocationText(text)}}
                placeholder={selectFeeling == 'Traveling to' ? 'Where are you traveling ?' : selectFeeling == 'Watching' ? 'What are you watching ?' : selectFeeling == 'Playing' ? 'What are you Playing ?' : selectFeeling == 'Listening to' ? 'What are you Listening to ?' : 'What are you doing ?'}
                style={styles.locationText}
              />
              :
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
             {selectedSubImage&& <Image
                source={selectedSubImage}
                style={{ width: wp(5), height: hp(2.5), resizeMode: 'contain', marginLeft: wp(2) }}
              />
             }
              <Text style={[styles.locationText1, {color:feelingSubOption != '' ? COLORS.black : COLORS.gray, marginLeft: wp(1.5)}]}>{feelingSubOption != '' ? feelingSubOption : 'What are you feeling ?'}</Text>
              </View>
              }
              </View>
              }
              {subFeelingVisible ? (
                <View style={styles.feelingListView1}>
              <ScrollView>
                <View>
                  {SubFeelingOptions.map((item, index) => (
                    <TouchableOpacity
                      style={[styles.userList, {height: hp(4),paddingLeft: wp(3)}]}
                      onPress={() => {
                        setSelectedSubImage(item.icon);
                        setFeelingSubOption(item.title);
                        setSubFeelingVisible(!subFeelingVisible);
                      }}>
                      <Image
                        source={item.icon}
                        style={{ width: wp(5), height: hp(5), resizeMode: 'contain' }}
                      />
                      <View style={{marginLeft: wp(2)}}>
                        <Text style={styles.userNameText}>{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              </View>
            ) : null}
              {selectFeelingVisible &&
                <View style={styles.feelingListView1}>
                  <FlatList
                    data={feelingOptions}
                    keyExtractor={item => item.user_id}
                    renderItem={renderFeelingItem}
                  />
                </View>
                } 
              
              </>
            )}

            {locationVisible && (
              <View style={styles.locationTextInput}>
              <Materialicons name="location-on" size={20} color={COLORS.lightBlue} />
              <TextInput 
                value={locationText}
                onChangeText={(text) => {setLocationText(text)}}
                placeholder='Where are you ?'
                style={styles.locationText}
              />
              </View>
            )}

                                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <View style={{ marginBottom: hp(1), flexDirection: 'row', marginLeft: wp(3), justifyContent: 'space-evenly' }}>
                                                <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={trendingToggleMOdal}>
                                                    <Octicons name="graph" size={17} color={COLORS.darkgray1} />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={trendingToggleMOdal}>
                                                    <Text style={{ fontSize: hp(1.85), color: COLORS.darkgray1}}>1X</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                                {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={openPostImagePicker}>
                                                    <Materialicons name="photo" size={22} color={COLORS.lightBlue} />
                                                 </TouchableOpacity> */}
                                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={() => {
                                                    handleCreatePoll();
                                                }}>
                                                    <FontAwesome5 name="poll" size={20} color={COLORS.lightGreen} />
                                                    {/*<Text style={{ paddingHorizontal: 5, fontSize: hp(2), fontfamily: fontFamily.FONTS.Medium, color: '#555555' }}>Create Poll</Text>  */}
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={() => {setFeelingVisible(!feelingVisible),setSelectFeelingVisible(true)}}>
                                                    <FontAwesome5 name="smile" size={20} color={COLORS.yellow} />
                                                    {/*  <Text style={{ paddingHorizontal: 5, fontSize: hp(2), fontfamily: fontFamily.FONTS.Medium, color: '#555555' }}>Felling</Text> */}
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={() => setLocationVisible(!locationVisible)}>
                                                    <Materialicons name="location-pin" size={20} color={COLORS.pink} />
                                                    {/*   <Text style={{ paddingHorizontal: 5, fontSize: hp(2), fontfamily: fontFamily.FONTS.Medium, color: '#555555' }}>location</Text> */}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginVertical: hp(1), padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                                        <SelectDropdown
                                                data={usersOptions}
                                                onSelect={(selectedItem, index) => {
                                                console.log(selectedItem, index);
                                                }}
                                                defaultValueByIndex={0}
                                                renderButton={(selectedItem, isOpened) => {
                                                return (
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, borderRadius: 50, borderWidth: 0.5, borderColor: COLORS.gray, width: wp(35) }}>
                                                    {selectedItem && (
                                                        <Materialicons name={selectedItem.icon} size={15} color={COLORS.darkgray1}/>
                                                    )}
                                                    <Text style={{ color: COLORS.darkgray1, fontSize: hp(1.8), fontFamily: fontFamily.FONTS.regular, padding: 6, width: wp(23) }}>
                                                        {(selectedItem && selectedItem.title)}
                                                    </Text>
                                                    <AntDesign name="down" size={12} color={COLORS.darkgray} />
                                                    </View>
                                                );
                                                }}
                                                renderItem={(item, index, isSelected) => {
                                                return (
                                                    <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                                    <Materialicons name={item.icon} size={18} color={COLORS.darkgray1} />
                                                    <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                                    </View>
                                                );
                                                }}
                                                showsVerticalScrollIndicator={false}
                                                dropdownStyle={styles.dropdownMenuStyle}
                                            />
                                            <View>
                                                <TouchableOpacity style={{
                                                    backgroundColor: COLORS.red,
                                                    borderRadius: 10,
                                                    // padding: 3,
                                                    height: hp(4.5),
                                                    width: wp(25),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={createPost}>
                                                    {loading ? (
                                                        <Loader isLoading={loading} color='white' />
                                                    ) : (
                                                        <View>
                                                            <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>Share</Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    </View>
                            </View>
                        </Modal>

                        {activitiesVisible && (
                            <View>
                                <View style={styles.albumsContainer}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Entypo name="list" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 5 }} />
                                        <Text style={styles.FollowingHading}>Activities</Text>
                                    </View>
                                </View>

                                <View style={[styles.FollowingContainer, { paddingVertical: hp(1) }]}>
                                    <FlatList
                                        data={activities}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.user_id.toString()}
                                        renderItem={({ item }) => (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: wp(2) }}>
                                                <View style={{ padding: wp(3) }}>
                                                    <Image source={{ uri: item.activator.avatar }} style={{ height: wp(9), width: wp(9), borderRadius: wp(9) }} />
                                                    {/* Add an icon (e.g., a star) next to the user's avatar */}
                                                    {/**  <MaterialCommunityIcons name="star" size={20} color={COLORS.gold} style={{ position: 'absolute', bottom: 0, right: 0 }} />  */}
                                                </View>
                                                <View style={{ padding: wp(1.6), width: '80%', backgroundColor: '#f0f2f5', borderRadius: wp(2), flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text style={{ paddingHorizontal: wp(1), fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.red }}>{item.activator.username}</Text>
                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>{item.activity_type}</Text>
                                                    <Text style={{ paddingHorizontal: wp(1), fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>{item?.postData?.publisher?.username}</Text>
                                                    <Text style={{ paddingHorizontal: wp(1), fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>{getTimeDifference(item.time)}</Text>
                                                </View>
                                            </View>
                                        )}
                                    />
                                </View>
                            </View>
                        )}


                        {/* Ai Image Modal */}
                        <Modal
                            animationType='slide'
                            transparent={true}
                            visible={aiImageModelVisible}
                            onRequestClose={toggelAiImage}
                     >
                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                <View style={{
                                    marginTop: hp(2),
                                    padding: 15,
                                    backgroundColor: global.ContentContainer.backgroundColor,
                                    marginHorizontal: wp(2),
                                    borderRadius: 10,
                                    maxHeight: '97%'
                                }}>
                                    <ScrollView showsVerticalScrollIndicator={false}>

                                        <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.5), color: COLORS.black }}>Generate Image</Text>
                                            <TouchableOpacity onPress={toggelAiImage}>
                                                <Entypo name="cross" size={hp(2.5)} color={COLORS.darkgray} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ marginVertical: hp(3) }}>
                                            <View>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2) }}>You can generate and draw your own images using AI, describe your image below so our AI image generate will generate 4 images for you.</Text>
                                            </View>

                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Write somthing here.</Text>
                                                <TextInput
                                                    keyboardType="default"
                                                    placeholder='Enter a prompt to display an image'
                                                    value={imagePrompt}
                                                    onChangeText={text => setImagePrompt(text)}
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    style={styles.descriptionInput}
                                                    textAlignVertical="top"
                                                />
                                            </View>

                                            <View style={{ marginTop: hp(2) }}>
                                                <Text style={styles.lable}>Image Size</Text>
                                                <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setImageSizeVisible(!imageSizeVisible) }}>
                                                    <Text style={styles.titleText}>{imageSize}</Text>
                                                    {imageSizeVisible ?
                                                        <Materialicons name="arrow-drop-up" size={29} color={COLORS.black} />
                                                        :
                                                        <Materialicons name="arrow-drop-down" size={29} color={COLORS.black} />
                                                    }

                                                </TouchableOpacity>
                                                <Collapsible collapsed={!imageSizeVisible}>
                                                    <View style={styles.collapsView}>
                                                        <TouchableOpacity style={styles.optionView} onPress={() => { setImageSize('256x256'), setImageSizeVisible(!imageSizeVisible) }}>
                                                            <Text style={styles.optionText}>{'256x256'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.optionView} onPress={() => { setImageSize('512x512'), setImageSizeVisible(!imageSizeVisible) }}>
                                                            <Text style={styles.optionText}>{'512x512'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.optionView} onPress={() => { setImageSize('1024x1024'), setImageSizeVisible(!imageSizeVisible) }}>
                                                            <Text style={styles.optionText}>{'1024x1024'}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </Collapsible>
                                            </View>

                                            <View style={{ marginTop: hp(2) }}>
                                                <Text style={styles.lable}>Image Count</Text>
                                                <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setImageCountVisible(!imageCountVisible) }}>
                                                    <Text style={styles.titleText}>{imageCount}</Text>
                                                    {imageCountVisible ?
                                                        <Materialicons name="arrow-drop-up" size={29} color={COLORS.black} />
                                                        :
                                                        <Materialicons name="arrow-drop-down" size={29} color={COLORS.black} />
                                                    }

                                                </TouchableOpacity>
                                                <Collapsible collapsed={!imageCountVisible}>
                                                    <View style={styles.collapsView}>
                                                        <TouchableOpacity style={styles.optionView} onPress={() => { setImageCount('1'), setImageCountVisible(!imageCountVisible) }}>
                                                            <Text style={styles.optionText}>{'1'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.optionView} onPress={() => { setImageCount('2'), setImageCountVisible(!imageCountVisible) }}>
                                                            <Text style={styles.optionText}>{'2'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.optionView} onPress={() => { setImageCount('3'), setImageCountVisible(!imageCountVisible) }}>
                                                            <Text style={styles.optionText}>{'3'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.optionView} onPress={() => { setImageCount('4'), setImageCountVisible(!imageCountVisible) }}>
                                                            <Text style={styles.optionText}>{'4'}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </Collapsible>
                                            </View>

                                            <View style={{ marginTop: hp(3), borderRadius: wp(2), alignItems: 'flex-end' }}>
                                                <TouchableOpacity style={{
                                                    backgroundColor: '#f7e5e5',
                                                    borderRadius: 10,
                                                    // padding: 3,
                                                    height: hp(4.5),
                                                    width: wp(30),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={generateImage}>
                                                    {loading ? (
                                                        <Loader isLoading={loading} color='white' />
                                                    ) : (
                                                        <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.red }}>Generate</Text>
                                                    )}
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>

                        {/* Ai Post Modal */}
                        <Modal
                            animationType='slide'
                            transparent={true}
                            visible={aiPostModelVisible}
                            onRequestClose={toggelAiPost}
                    >
                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', }}>
                                <View style={{
                                    marginTop: hp(2),
                                    padding: 15,
                                    backgroundColor: global.ContentContainer.backgroundColor,
                                    marginHorizontal: wp(2),
                                    borderRadius: 10,
                                    maxHeight: '97%'
                                }}>

                                    <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.5), color: COLORS.black }}>Generate Post</Text>
                                        <TouchableOpacity onPress={toggelAiPost}>
                                            <Entypo name="cross" size={hp(2.5)} color={COLORS.darkgray} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ marginVertical: hp(3) }}>
                                        <View>
                                            <Text style={styles.lable}>Write somthing here.</Text>
                                            <TextInput
                                                keyboardType="default"
                                                placeholder='Discribe your post '
                                                value={postPrompt}
                                                onChangeText={text => setPostPrompt(text)}
                                                multiline={true}
                                                numberOfLines={5}
                                                style={styles.descriptionInput}
                                                textAlignVertical="top"
                                            />
                                        </View>

                                        <View style={{ marginVertical: hp(2) }}>
                                            <Text style={styles.lable}>Max Result Length</Text>
                                            <CustomInput
                                                keyboardType="numeric"
                                                placeholder="Max Rwsult length"
                                                value={result}
                                                onChangeText={text => setResult(text)}
                                            />
                                        </View>

                                        {generatedPost ? (
                                            <View style={{ height: '50%', }}>
                                                <View style={styles.descriptionInput}>
                                                    <ScrollView>
                                                        <Text style={{ padding: hp(1), fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.4) }}>{generatedPost}</Text>
                                                    </ScrollView>
                                                </View>
                                            </View>
                                        ) : null}

                                        <View style={{ flexDirection: 'row', marginTop: hp(3), borderRadius: wp(2), justifyContent: 'center', alignItems: 'flex-end' }}>
                                            {generatedPost && (
                                                <TouchableOpacity style={{
                                                    backgroundColor: COLORS.lightBlue,
                                                    borderRadius: 10,
                                                    // padding: 3,
                                                    height: hp(4.5),
                                                    width: wp(30),
                                                    marginHorizontal: wp(2),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={() => {
                                                    setPostText(generatedPost);
                                                    toggelAiPost();
                                                    setGeneratedPost(''); // Reset generatedPost state to empty string
                                                }}>
                                                    {loading ? (
                                                        <Loader isLoading={loading} color='white' />
                                                    ) : (
                                                        <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.white }}>Use Text</Text>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                            <TouchableOpacity style={{
                                                backgroundColor: '#f7e5e5',
                                                borderRadius: 10,
                                                // padding: 3,
                                                height: hp(4.5),
                                                width: generatedPost ? wp(45) : wp(35),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }} onPress={generateImage}>
                                                {loadingPost ? (
                                                    <Loader isLoading={loadingPost} color='white' />
                                                ) : (
                                                    <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.red }}>  {generatedPost ? 'Generate again' : 'Generate'}s</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                </View>
                            </View>
                        </Modal>

                        {/* trending Modal */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={trendingModelVisible}
                            onRequestClose={() => {
                                setTrendingModelVisible(false);
                            }}
                    >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                {/* Post structure inside the modal */}
                                <View style={styles.ProfileComplitionContainer}>
                                    <View style={{ padding: 10 }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.yellow, fontSize: hp(2.6), padding: 5 }}> Educational Tips</Text>
                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.black, fontSize: hp(2.3), }}> Spot Trading</Text>
                                        </View>
                                        <View style={{ paddingVertical: hp(1), maxWidth: '90%' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.1), marginRight: wp(9) }}>Name</Text>
                                                <TextInput
                                                    placeholder='Enter Name'
                                                    placeholderTextColor={COLORS.secondaryGray}
                                                    style={styles.CommentInput}
                                                />
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.1), marginRight: wp(9) }}>Type</Text>
                                                    <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                                                        <CheckBox
                                                            isChecked={isChecked}
                                                            handleCheck={() => { setIsChecked(true), setIsChecked1(false) }}
                                                        />
                                                        <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkGreeen, fontSize: hp(2.3), }}>Buy</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                                        <CheckBox
                                                            isChecked={isChecked1}
                                                            handleCheck={() => { setIsChecked1(true), setIsChecked(false) }}
                                                        />
                                                        <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.red, fontSize: hp(2.3), }}>Sell</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.1), }}>Entry Price</Text>
                                                <TextInput
                                                    placeholder='Enter Buy Price'
                                                    placeholderTextColor={COLORS.secondaryGray}
                                                    style={styles.CommentInput}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.1), }}>Profit Price</Text>
                                                <TextInput
                                                    placeholder='Enter Sell Price'
                                                    placeholderTextColor={COLORS.secondaryGray}
                                                    style={styles.CommentInput}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.1), marginRight: wp(2) }}>Stop Loss</Text>
                                                <TextInput
                                                    placeholder='Stop Loss'
                                                    placeholderTextColor={COLORS.secondaryGray}
                                                    style={styles.CommentInput}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <TouchableOpacity style={{
                                                backgroundColor: COLORS.red,
                                                borderRadius: 10,
                                                // padding: 3,
                                                height: hp(4.5),
                                                width: wp(25),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                                <View>
                                                    <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>Post</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>



                        {/* edit model */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={editModel}
                            onRequestClose={toggelEditModel}
                    >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <View style={styles.reportModelContainer}>
                                    <View style={{ padding: hp(1.8), borderTopRightRadius: wp(2), borderTopLeftRadius: wp(2), flexDirection: 'row', backgroundColor: COLORS.red, justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.white }}>Edit Post</Text>
                                        </View>
                                        <TouchableOpacity onPress={toggelEditModel}>
                                            <Entypo name="cross" size={18} color={COLORS.white} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ paddingHorizontal: 4, marginVertical: hp(2) }}>
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


                                        <View style={{ flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                                            <TouchableOpacity style={{
                                                backgroundColor: '#f7e5e5',
                                                borderRadius: 10,
                                                // padding: 3,
                                                height: hp(4.5),
                                                width: wp(25),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: wp(2)
                                            }} onPress={() => handlePostActions(selectedPostId, 'edit')}>
                                                {loading ? (
                                                    <Loader isLoading={loading} />
                                                ) : (
                                                    <Text style={{ fontSize: hp(2.3), color: COLORS.red }}>Update</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
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
                                            }} onPress={() => handlePostActions(selectedPostId, 'delete')}>
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


                        {/* Post */}
                        <View style={{ marginVertical: hp(2), }}>
                            {!activitiesVisible && (
                                loadingUserPosts ? (
                                    <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                        <Loader isLoading={loadingUserPosts} />
                                    </View>
                                ) : postData.length === 0 ? (
                                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: hp(30), backgroundColor: COLORS.white, alignSelf: 'center', borderRadius: hp(1) }}>
                                        <MaterialCommunityIcons name="file-document-outline" size={35} color={COLORS.darkgray} style={{ backgroundColor: '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                        <Text style={[styles.albumsText, { textAlign: 'center', marginTop: hp(2) }]}>No Posts to show</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={postData}
                                        keyExtractor={item => item.post_id.toString()}
                                        renderItem={({ item }) => {
                                            const baseHeight = 50; // Set your base height
                                            const optionHeight = hp(8); // Set the height of each option
                                            const numOptions = item.admin ? 5 : 3;

                                            return (
                                                <View style={styles.firstView1}>
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
                                                                <TouchableOpacity>
                                                                    <Image
                                                                        style={{ height: hp(5), width: hp(5), borderRadius: hp(5) }}
                                                                        source={{ uri: item.publisher.avatar }}
                                                                    />
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
                                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2), }}>{item.postType == 'profile_picture' ? "changed his profile picture" : item.postType == 'profile_cover_picture' ? "changed his cover profile picture" : item.fund_data.length != 0 ? "created a donation request" : item.photo_album.length> 0 ? `added new photos to ${item?.album_name}` : item.blog != undefined ? "Created a new article" : "Created a new post"}</Text>
                                                                        <Text
                                                                            style={{
                                                                                fontSize: hp(1.8),
                                                                                paddingHorizontal: wp(3),
                                                                                fontFamily: fontFamily.FONTS.regular,
                                                                                color: COLORS.darkgray1,
                                                                            }}>
                                                                            ({item?.post_time.replace(/\s+/g, '')})
                                                                        </Text>
                                                                    </View>

                                                                </View>
                                                            </View>
                                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: wp(1) }}>
                                                                <TouchableOpacity onPress={() => { toggleMenu(null, item.post_id, item.Orginaltext, item.postFile, item.photo_multi, item.comments_status, item.is_post_saved); postActionMenuRef.current.open() }}>
                                                                    <Entypo name="dots-three-vertical" size={20} color={COLORS.darkgray1} />
                                                                </TouchableOpacity>

                                                               
                                                                {/*<TouchableOpacity onPress={() => toggelModel(item.post_id)}>
                                                             <AntDesign name="down" size={20} color={COLORS.darkgray1} />
                                                        </TouchableOpacity> */}
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
                                                                            <TouchableOpacity onPress={() => { toggleMenu('edit', null, null, null); postActionMenuRef.current.close(); }}>
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

                                                                            <TouchableOpacity onPress={() => { toggleMenu('boostPost', null, null, null); postActionMenuRef.current.close(); }}>
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
                                                                            <TouchableOpacity onPress={() => { handlePostActions(selectedPostId, item.is_post_saved ? 'unsavePost' : 'savePost'); postActionMenuRef.current.close(); }}>
                                                                                <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                                                    <Ionicons name='bookmark-outline' size={hp(4)} color={COLORS.black} />
                                                                                    <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>{item.is_post_saved === 'true' ? 'Unsaved Post' : 'Save Post'}</Text>
                                                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Add this post to your favorite list</Text>
                                                                                    </View>
                                                                                </View>
                                                                            </TouchableOpacity>

                                                                            <TouchableOpacity onPress={() => { handlePostActions(selectedPostId, 'reportPost'); postActionMenuRef.current.close(); }}>
                                                                                <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                                                                    <Materialicons name='report-gmailerrorred' size={hp(4)} color={COLORS.black} />
                                                                                    <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>{item.is_reported === 'true' ? 'Unreport Post' : 'Report Post'}</Text>
                                                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Report this post to us</Text>
                                                                                    </View>
                                                                                </View>
                                                                            </TouchableOpacity>

                                                                            <TouchableOpacity onPress={() => { handlePostActions(selectedPostId, 'hidePost'); postActionMenuRef.current.close(); }}>
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
                                                            item.photo_album.length !== 0 ? (
                                                                <FBCollage images={item.photo_album.map(albumImage => albumImage.image)} borderRadius={2} spacing={2}
                                                                    imageOnPress={() => {
                                                                        setSelectedAlbum(item.photo_album);
                                                                        setGalleryVisible(true);
                                                                    }} />
                                                            )
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
                                                                            {/* <Text style={styles.postDetails1}>{item.Orginaltext}</Text> */}
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
                                                                                {/* <Text style={styles.postDetails1}>{item.blog.title}</Text> */}
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
                                                                        item.event != undefined ?
                                                                            <TouchableOpacity onPress={() => navigation.navigate('BlogDetail', { blogUrl: item.blog.url })}>
                                                                                <Image source={{ uri: item.event.cover }} style={{ height: hp(30), width: '100%' }} />
                                                                                <View style={{
                                                                                    width: '100%',
                                                                                    paddingBottom: hp(1),
                                                                                    backgroundColor: COLORS.white,
                                                                                }}>
                                                                                    <Text style={{
                                                                                        marginVertical: hp(2),
                                                                                        paddingLeft: wp(5),
                                                                                        fontSize: hp(2.4),
                                                                                        fontFamily: fontFamily.FONTS.Medium,
                                                                                        color: COLORS.black,
                                                                                        textAlign: 'justify',
                                                                                        width: '96%'
                                                                                    }}>{item.event.name}</Text>
                                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: wp(5), width: '96%' }}>
                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                            <Materialicons name="event" size={24} color={COLORS.lightGreen} />
                                                                                            <Text style={{
                                                                                                fontSize: hp(2),
                                                                                                fontFamily: fontFamily.FONTS.regular,
                                                                                                color: COLORS.black,
                                                                                                textAlign: 'justify',
                                                                                                // width: '96%'
                                                                                            }}>{convertDateFormat(item.event.start_date)}</Text>
                                                                                        </View>
                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: wp(5), }}>
                                                                                            <Materialicons name="event" size={24} color={COLORS.red} />
                                                                                            <Text style={{
                                                                                                fontSize: hp(2),
                                                                                                fontFamily: fontFamily.FONTS.regular,
                                                                                                color: COLORS.black,
                                                                                                textAlign: 'justify',
                                                                                                // width: '96%'
                                                                                            }}>{convertDateFormat(item.event.end_date)}</Text>
                                                                                        </View>
                                                                                    </View>
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
                                                                <AntDesign name="like2" size={20} color={COLORS.darkgray} />
                                                                <Text style={[styles.postDetails3, { marginLeft: wp(1) }]}>{item?.post_likes}</Text>
                                                            </View>

                                                            {item.comments_status === "1" ? (
                                                                <TouchableOpacity onPress={() => { toggleCommentInput(); handleComments(item.post_id, null, 'fetch_comments'); }}>
                                                                    <Text style={styles.postDetails3}>{item?.post_comments} comments</Text>
                                                                </TouchableOpacity>
                                                            ) : (
                                                                <View>
                                                                    <Text style={styles.postDetails3}>Comments disabled</Text>
                                                                </View>
                                                            )}

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
                                                            <TouchableOpacity style={{ paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleLikepages(item.post_id, item)}>
                                                                <AntDesign name={item.is_liked ? 'heart' : 'hearto'} size={24} color={item.is_liked ? COLORS.red1 : COLORS.darkgray} />
                                                                {/** <Text style={[styles.postDetails3, { color: item.is_liked ? COLORS.red : COLORS.black }]}>Likes</Text> */}
                                                            </TouchableOpacity>

                                                            <TouchableOpacity style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => { toggleCommentInput(); handleComments(item.post_id, null, 'fetch_comments'); }} disabled={item.comments_status === '0'}>
                                                                <Feather name="message-circle" size={24} color={COLORS.darkgray} />
                                                                {/**  <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.darkgray1 }}>Comment</Text> */}
                                                            </TouchableOpacity>


                                                            <TouchableOpacity style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleShare(item)}>
                                                                <Feather name="send" size={22} color={COLORS.darkgray} />
                                                                {/**    <Text style={styles.postDetails3}>Share</Text> */}
                                                            </TouchableOpacity>
                                                        </View>
                                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handlePostActions(item.post_id, 'savePost')}>
                                                            <Ionicons name={item.is_post_saved ? 'bookmark' : 'bookmark-outline'} size={24} color={COLORS.darkgray} />
                                                            {/**    <Text style={styles.postDetails3}>Share</Text> */}
                                                        </TouchableOpacity>
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
                                                                        {/* <TouchableOpacity onPress={openCommentImagePicker}>
                                                                            <Ionicons name='camera-outline' size={23} color={COLORS.darkgray1} />
                                                                        </TouchableOpacity> */}
                                                                    </View>

                                                                    <TouchableOpacity onPress={() => handleComments(item.post_id, null, 'create')}>
                                                                        <Materialicons name='send' size={23} color={COLORS.darkgray1} />
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
                                                                                {longPressedCommentReply === item && (
                                                                                    <View style={{ backgroundColor: COLORS.lightBlue }}>
                                                                                        <View style={{ flexDirection: 'row', height: hp(7), justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.7), color: COLORS.white, paddingHorizontal: wp(4) }}>1 Selected</Text>
                                                                                            {item.onwer ? (
                                                                                                <View style={{ flexDirection: 'row', paddingHorizontal: wp(2), alignItems: 'center' }}>
                                                                                                    <TouchableOpacity onPress={() => handleComments(null, item.id, 'edit')} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                                        <Feather name="edit-2" size={hp(3)} color={COLORS.white} />
                                                                                                    </TouchableOpacity>
                                                                                                    <TouchableOpacity onPress={() => handleComments(null, item.id, 'delete')} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
                                                                                                        <MaterialCommunityicons name="delete-outline" size={hp(3.5)} color={COLORS.white} />
                                                                                                    </TouchableOpacity>
                                                                                                    <TouchableOpacity onPress={() => setLongPressedCommentReply(null)} style={{ justifyContent: 'flex-end', paddingHorizontal: wp(1) }}>
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
                                                                                    <View>
                                                                                        <View style={{ flexDirection: 'row', }}>
                                                                                            <Image source={{ uri: item.publisher.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
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
                                                                                        <View style={{ flexDirection: 'row', marginHorizontal: wp(12), marginBottom: hp(1) }}>
                                                                                            <TouchableOpacity style={{ marginHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => { toggelCommentsReply(item.id); handleComments(null, item.id, 'fetch_comments_reply') }}>
                                                                                                <MaterialCommunityIcons name="message-text-outline" size={hp(2.4)} color={COLORS.darkgray1} />
                                                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.replies_count}</Text>
                                                                                            </TouchableOpacity>

                                                                                        </View>
                                                                                    </View>
                                                                                    <View style={{ flexDirection: 'row', }}>
                                                                                        <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'column' }} onPress={() => handleComments(item.post_id, item.id, item.is_comment_liked ? 'comment_dislike' : 'comment_like')}>
                                                                                            <MaterialCommunityIcons name={item.is_comment_liked ? "heart" : "heart-outline"} size={21} color={item.is_comment_liked ? COLORS.red : COLORS.darkgray1} />
                                                                                            <Text style={{ color: COLORS.darkgray1, fontSize: hp(2.2) }}>{item.comment_likes}</Text>
                                                                                            {/* <MaterialCommunityIcons name="heart" size={18} color={COLORS.darkgray1} /> */}
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                </View>

                                                                                {commentsReplyVisible[item.id] && (
                                                                                    <View>
                                                                                        <FlatList
                                                                                            data={commentsReply}
                                                                                            renderItem={({ item }) => (
                                                                                                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', }}>
                                                                                                    <View style={{ flexDirection: 'row', maxWidth: '80%', marginLeft: wp(7) }}>
                                                                                                        <Image source={{ uri: item.publisher.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
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
                                                                                                        <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'column' }} onPress={() => handleComments(null, item.id, item.is_comment_liked ? 'comment_dislike' : 'comment_like')}>
                                                                                                            <MaterialCommunityIcons name={item.is_comment_liked ? "heart" : "heart-outline"} size={21} color={item.is_comment_liked ? COLORS.red : COLORS.darkgray1} />
                                                                                                            <Text style={{ color: COLORS.darkgray1, fontSize: hp(2.2) }}>{item.comment_likes}</Text>
                                                                                                            {/* <MaterialCommunityIcons name="heart" size={18} color={COLORS.darkgray1} /> */}
                                                                                                        </TouchableOpacity>
                                                                                                    </View>
                                                                                                </View>
                                                                                            )}
                                                                                            keyExtractor={(item, index) => item.comment_id.toString()}
                                                                                            ListEmptyComponent={() => (
                                                                                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                                                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.darkgray1 }}>No replies to show</Text>
                                                                                                </View>
                                                                                            )}
                                                                                        />

                                                                                        <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                                                                            <Image source={{ uri: user_data?.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
                                                                                            <View style={{ flex: 1, marginHorizontal: wp(2), height: 40, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ededed', borderRadius: wp(2) }}>
                                                                                                <TextInput
                                                                                                    placeholder=' Write a comment and press enter'
                                                                                                    placeholderTextColor={COLORS.secondaryGray}
                                                                                                    style={styles.CommentInput}
                                                                                                    value={commentReplyText}
                                                                                                    onChangeText={text => setCommentReplyText(text)}
                                                                                                    onSubmitEditing={() => handleComments(item.id, commentText, 'create_reply')}
                                                                                                />
                                                                                                {/* <TouchableOpacity onPress={openCommentImagePicker} style={{ paddingHorizontal: wp(2) }}>
                                                                                                    <Ionicons name='camera-outline' size={24} color={COLORS.darkgray1} />
                                                                                                </TouchableOpacity> */}
                                                                                            </View>
                                                                                            <TouchableOpacity onPress={() => handleComments(null, item.id, 'create_reply')}>
                                                                                                <Materialicons name='send' size={24} color={COLORS.darkgray1} />
                                                                                            </TouchableOpacity>
                                                                                        </View>
                                                                                    </View>


                                                                                )}
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
                                        }
                                        }
                                    />
                                )
                            )}
                        </View>

                        {/**    <TouchableOpacity style={styles.showMoreView}>
                    <AntDesign name="down" size={10} color={COLORS.white} style={{ backgroundColor: '#555555', padding: 2, borderRadius: 50 }} />
                    <Text style={styles.loadText}>Load more Posts</Text>
                </TouchableOpacity> */}

                        {/* Info */}
                        <View>
                            <View style={styles.InfoContainer}>
                                <View style={styles.infoContent}>
                                    <Entypo name="info-with-circle" size={20} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 4 }} />
                                    <Text style={styles.FollowingHading}>Info</Text>
                                </View>
                                <View style={styles.FollowinghorizontalLine} />
                                <View style={styles.infoContentContainer}>
                                    <MaterialCommunityIcons name="eye" size={24} color={COLORS.darkgray1} />
                                    <Text style={{
                                        padding: 10,
                                        paddingHorizontal: 'auto',
                                        fontSize: hp(2.2),
                                        color: user_data.lastseen_time_text.trim().toLowerCase() === 'now' ? '#7ac27d' : COLORS.black
                                    }}>
                                        {user_data.lastseen_time_text.trim().toLowerCase() === 'now' ? 'Online' : user_data.lastseen_time_text}
                                    </Text>
                                </View>
                                <View style={styles.infoContentContainer}>
                                    <Materialicons name="post-add" size={24} color={COLORS.darkgray1} />
                                    <Text style={styles.infoContentText}>{userdata?.user_data?.details?.post_count}</Text>
                                    <Text style={styles.infoContentPost}>posts</Text>
                                </View>

                                {userdata?.user_data?.website && (
                                    <View style={styles.infoContentContainer}>
                                        <Materialicons name="language" size={22} color={COLORS.darkgray1} />
                                        <TouchableOpacity
                                            onPress={() => openWebsite(userdata?.user_data?.website)}
                                    >
                                            <Text style={styles.infoContentText}>{userdata?.user_data?.website}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <View style={styles.FollowinghorizontalLine} />

                                <View style={styles.infoContentContainer}>
                                    {userdata?.user_data?.gender === 'male' ? (
                                        <MaterialCommunityIcons name="face-man-profile" size={22} color={COLORS.darkgray1} />
                                    ) :
                                        <MaterialCommunityIcons name="face-woman-profile" size={22} color={COLORS.darkgray1} />
                                    }
                                    <Text style={styles.infoContentText}>{userdata?.user_data?.gender}</Text>
                                </View>
                                {userdata?.user_data?.birthday !== "0000-00-00" && userdata?.user_data?.birthday && (
                                    <View style={styles.infoContentContainer}>
                                        <Materialicons name="cake" size={22} color={COLORS.darkgray1} />
                                        <Text style={styles.infoContentText}>{userdata?.user_data?.birthday}</Text>
                                    </View>
                                )}

                                {userdata?.user_data?.country && (
                                    <View style={styles.infoContentContainer}>
                                        <Materialicons name="language" size={22} color={COLORS.darkgray1} />
                                        <Text style={styles.infoContentText}>{userdata?.user_data?.address}</Text>
                                    </View>
                                )}



                                {userdata?.user_data?.facebook || userdata?.user_data?.youtube || userdata?.user_data?.linkedin || userdata?.user_data?.twitter || userdata?.user_data?.vkontakte || userdata?.user_data?.instagram ? (

                                    <View>
                                        <View style={styles.infoContentContainer}>
                                            <AntDesign name="sharealt" size={20} color={COLORS.darkgray1} />
                                            <Text style={styles.infoContentText}>Social Lnks</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingBottom: 10, marginLeft: wp(10), alignItems: 'center', }}>
                                            {userdata?.user_data?.facebook && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('facebook', user_data)}>
                                                    <FontAwesome name="facebook-official" size={24} color={COLORS.lightBlue} />
                                                </TouchableOpacity>
                                            )}
                                            {userdata?.user_data?.instagram && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('instagram', user_data)}>
                                                    <FontAwesome name="instagram" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                            {userdata?.user_data?.twitter && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('twitter', user_data)}>
                                                    <Feather name="twitter" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                            {userdata?.user_data?.youtube && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('youtube', user_data)}>
                                                    <Feather name="youtube" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                            {userdata?.user_data?.linkedin && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('linkedin', user_data)}>
                                                    <AntDesign name="linkedin-square" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                            {userdata?.user_data?.vk && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('vkontakte', user_data)}>
                                                    <SimpleLineIcons name="social-vkontakte" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                        </View>

                        {/* Search for Post */}
                        <View style={styles.SearchContainer}>
                            <Text style={styles.FollowingHading}>Search for Post</Text>
                            <TextInput
                                keyboardType="default"
                                style={styles.customInput}
                                value={searchPost}
                                onChangeText={(text) => handleSearchPost(text)}
                            />
                        </View>

                        {/* Albums */}
                        {/* <View style={styles.FollowingContainer}>
                        <View style={styles.FollowingContent}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Materialicons name="photo-library" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 5 }} />
                                <Text style={styles.FollowingHading}>Albums ({albums.length})</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('Albums')}>
                                <Foundation name="list-thumbnails" size={24} color={COLORS.gray} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.FollowinghorizontalLine} />
                        
                        <FlatList
                            data={albums}
                            horizontal={true}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item, index }) => {
                                if(index < 3) {
                                    return (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: hp(2) }}>
                                            <TouchableOpacity onPress={() => navigation.navigate('AlbumsDetails', { postId: item.id })} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: wp(1) }}>
                                                <Image
                                                    source={{ uri: item.first_image }}
                                                    style={{ height: hp(15), width: wp(30), borderRadius: wp(2) }}
                                                />
                                                <Text style={{
                                                    // position: 'absolute',
                                                    // bottom: -10,
                                                    // left: 0,
                                                    color: COLORS.black,
                                                    fontSize: hp(2.2),
                                                    fontFamily: fontFamily.FONTS.Medium,
                                                    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    paddingHorizontal: 4,
                                                    borderRadius: 6,
                                                    marginBottom: hp(2)
                                                }}>{item.album_name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            }}
                        />
                        </View> */}

                        {/* Followings */}
                        <View style={styles.FollowingContainer}>
                            <View style={styles.FollowingContent}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Materialicons name="person-add" size={22} color={COLORS.white} style={styles.iconStyle} />
                                    <Text style={styles.FollowingHading}>Friends ({userdata?.user_data?.details?.following_count})</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('Followings', { followings: userdata?.following })}>
                                    <Foundation name="list-thumbnails" size={24} color={COLORS.gray} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.FollowinghorizontalLine} />
                            <FlatList
                                data={userdata?.following.slice(0, 3)}
                                horizontal={true}
                                keyExtractor={(item, index) => item.user_id.toString()}
                                renderItem={({ item }) => (
                                    <View style={{ padding: 15, width: wp(32) }}>
                                        <Image source={{ uri: item.avatar }} style={{ height: hp(14), width: wp(28), borderRadius: 10 }} />
                                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.user_id })}>
                                            <Text style={styles.FollowersName} numberOfLines={1}>{item.username}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        {/* Likes */}
                        <View style={styles.FollowingContainer}>
                            <View style={styles.FollowingContent}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <AntDesign name="like1" size={20} color={COLORS.white} style={styles.iconStyle} />
                                    <Text style={styles.FollowingHading}>Likes ({userdata?.user_data?.details?.likes_count})</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('Likes', { liked_pages: userdata?.liked_pages })}>
                                    <Foundation name="list-thumbnails" size={24} color={COLORS.gray} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={userdata?.liked_pages}
                                horizontal={true}
                                keyExtractor={(item, index) => item.user_id.toString()}
                                renderItem={({ item }) => (
                                    <View style={{ padding: 5, paddingVertical: hp(2), paddingHorizontal: wp(2) }}>
                                        <Image source={{ uri: item.avatar }} style={{ height: 100, width: 100, borderRadius: 10 }} />
                                        <Text style={styles.FollowersName} numberOfLines={1}>{item.page_title}</Text>
                                    </View>
                                )}
                            />
                        </View>

                        {/* Groups */}
                        <View style={styles.FollowingContainer}>
                            <View style={styles.FollowingContent}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <MaterialCommunityIcons name="select-group" size={22} color={COLORS.white} style={styles.iconStyle} />
                                    <Text style={styles.FollowingHading}>Groups ({userdata?.user_data?.details?.groups_count})</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('GroupsList', { joined_groups: userdata?.joined_groups })}>
                                    <Foundation name="list-thumbnails" size={24} color={COLORS.gray} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.FollowinghorizontalLine} />
                            <FlatList
                                data={userdata?.joined_groups}
                                horizontal={true}
                                keyExtractor={(item, index) => item.user_id.toString()}
                                renderItem={({ item }) => (
                                    <View style={{ padding: 5, paddingVertical: hp(2), paddingHorizontal: wp(1.3), width: wp(32) }}>
                                        <Image source={{ uri: item.avatar }} style={{ height: 100, width: 100, borderRadius: 10 }} />
                                        <Text style={styles.FollowersName} numberOfLines={1}>{item.group_title}</Text>
                                    </View>

                                )}
                            />

                        </View>
                    </ScrollView>
                )
            }
    <UnfriendPopup 
    modelVisible={unfriendModal}
    setModelVisible={setUnfriendModal}
    onPress={() => followUser(UserId)}
    />
        </SafeAreaView>
    );
};

export default UserProfile;

const localStyles = (theme, WD, WH) => {
    const global = globalStyles(theme);

    return StyleSheet.create({

        container: {
            // marginHorizontal: wp(2),
            backgroundColor: global.ContentContainer.backgroundColor,
            borderRadius: 10,
        },
        reportModelContainer: {
            marginTop: hp(2.2),
            // padding: 15,
            width: wp(90),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: wp(2.2)
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
        imageContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        backgroundImage: {
            height: hp(22),
            // borderBottomLeftRadius: 10,
            // borderBottomRightRadius: 10,
            width: '100%'
        },
        overlay: {
            position: 'absolute',
            top: 5,
            right: 0,
        },

        customInput: {
            width: '96%',
            height: 48,
            // marginHorizontal: 10,
            backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: COLORS.secondaryBlack,
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        inputText: {
            color: global.inputText.color
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
        conteredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-st.5art',
            marginTop: hp(20),
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
            fontSize: 16,
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
            fontSize: 16,
            fontFamily: fontFamily.FONTS.Medium,
            color: global.text2.color
        },
        userImageContainer: {
            position: 'absolute',
            top: 100,
            alignSelf: 'center'
        },
        userImage: {
            height: 110,
            width: 110,
            borderRadius: 100
        },
        userNameContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 70
        },
        username: {
            fontSize: 20,
            color: global.text2.color,
        },
        profilePartButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15
        },
        EditButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e0e0e0',
            borderRadius: 8,
            padding: 8,
            paddingHorizontal: wp(4),
            marginHorizontal: 5
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
            marginTop: 25,
            flexWrap: 'wrap'
        },
        horizontalTabText: {
            padding: 5,
            marginHorizontal: 10,
            fontSize: 15,
            color: COLORS.black,
        },
        ProfileComplitionContainer: {
            marginTop: hp(1),
            backgroundColor: global.ContentContainer.backgroundColor,
            // marginHorizontal: 10,
            borderRadius: wp(2)
        },
        ProfileComplitionButton: {
            flexDirection: 'row',
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderColor: COLORS.secondaryWhite,
            borderWidth: 1,
            marginTop: 10,
            marginHorizontal: 5
        },
        ProfileComplitionHading: {
            padding: 5,
            marginHorizontal: 18,
            fontSize: 22,
            color: global.text2.color
        },
        ProfileComplitionButtonText: {
            padding: 5,
            // marginHorizontal: 18,
            fontSize: 16,
            color: global.text2.color
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
            textAlign: 'left',
            width: '96%'
        },
        postDetails2: {
            paddingLeft: wp(5),
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            textAlign: 'left',
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
            marginTop: hp(1),
            backgroundColor: global.ContentContainer.backgroundColor,
            // marginHorizontal: wp(2),
            borderRadius: wp(2)
        },
        InfoContainer: {
            // marginTop: hp(1),
            backgroundColor: global.ContentContainer.backgroundColor,
            // marginHorizontal: 10,
            borderRadius: wp(2)
        },
        // InfoContainer: {
        //     // marginTop: hp(1),
        //     backgroundColor: global.ContentContainer.backgroundColor,
        //     marginHorizontal: 10,
        //     borderRadius: 10
        // },
        infoContent: {
            padding: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'sp',
        },
        infoContentContainer: {
            flexDirection: 'row',
            alignItems: "center",
            paddingHorizontal: 15
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
            paddingHorizontal: wp(4),
            marginTop: hp(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: global.ContentContainer.backgroundColor,
            // marginHorizontal: 10,
            alignItems: 'center',
            borderRadius: wp(2)
        },
        SearchContainer: {
            marginTop: hp(1),
            padding: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
            // marginHorizontal: 10,
            borderRadius: wp(2)
        },
        FollowingContent: {
            padding: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        FollowingHading: {
            padding: 5,
            marginHorizontal: 5,
            fontSize: 18,
            color: global.text2.color
        },
        FollowersName: {
            padding: 5,
            fontSize: 14,
            color: global.text2.color
        },
        iconStyle: {
            backgroundColor: COLORS.red,
            borderRadius: 50,
            padding: 4
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            // marginHorizontal: 15,
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
        firstView1: {
            // marginTop: hp(2),
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: wp(2),
            alignSelf: 'center',
            marginBottom: hp(1),
            paddingBottom: hp(2),
        },
        dropdownMenuStyle: {
            backgroundColor: '#E9ECEF',
            borderRadius: 8,
            width: wp(40),
          },
          dropdownItemStyle: {
            width: '100%',
            flexDirection: 'row',
            paddingHorizontal: 12,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 8,
          },
          dropdownItemTxtStyle: {
            flex: 1,
            fontSize: hp(2),
            fontWeight: '500',
            color: '#151E26',
            marginLeft: wp(2)
          },
          modalOverlay: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
          container1: {
            width: '94%',
            // height: hp(22),
            backgroundColor: COLORS.white,
            borderRadius: 10,
            // marginLeft: -wp(2.5),
            // paddingTop: hp(3),
          },
          maneModalView: {
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          },
          locationTextInput: {
            width: '96%',
            flexDirection: 'row',
            alignItems: 'center',
            // height: hp(5.5),
            borderWidth: 1,
            borderColor: COLORS.gray,
            borderRadius: 5,
            alignSelf: 'center',
            marginTop: hp(1)
          },
          locationText: {
            fontSize: hp(1.8),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            paddingVertical: 5
          },
          locationText1: {
            fontSize: hp(1.8),
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.black,
            paddingVertical: 5
          },
          feelingListView1: {
            position: 'absolute',
            top: hp(22),
            paddingVertical: hp(2),
            width: wp(94.5),
            backgroundColor: COLORS.white,
            zIndex: 999,
            maxHeight: hp(30),
            // marginLeft: -wp(2)
          },
          userList: {
            width: '100%',
            height: hp(8),
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            // borderBottomWidth: 1,
            // borderBottomColor: COLORS.gray,
            borderRadius: 5,
            marginTop: hp(1),
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
