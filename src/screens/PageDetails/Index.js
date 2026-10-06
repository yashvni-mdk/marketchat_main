/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, Linking, Share, RefreshControl, ToastAndroid, ScrollView, TextInput, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Entypo from 'react-native-vector-icons/Entypo';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontFamily from '../../../constants/fontFamily';
import { addMembetsInPage, onFetchJobs, onGetPageApi, onSearchApi, onGetPostApi, MidjeournyImage, onCreateNewPostApi, commentonPost, onPageLikeApi, onGetPageMember, onLikePage, reportComments, fetchRecommendedData, onReportPage, onHidePost, onSearchForPost } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import { Picker } from '@react-native-picker/picker';
import { Loader } from '../../components/Loader';
import CheckBox from '../../components/CheckBox';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Collapsible from 'react-native-collapsible';
import RBSheet from 'react-native-raw-bottom-sheet'; 
import ImagePicker from 'react-native-image-crop-picker';
import { fetchUserPost } from '../../redux/reducer';
import FBCollage from 'react-native-fb-collage';
import Gallery from 'react-native-image-gallery';
import SelectDropdown from 'react-native-select-dropdown';

const PageDetails = ({ route }) => {
    const user_data = useSelector(state => state.user_data);
    const followers = useSelector(state => state.followers);
    const { PageId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme, WD, WH),
    });


    const [page, setPage] = useState([])
    const [pageMembers, setPageMembers] = useState([]);
    const [loading, setLoading] = useState(false)
    const [modelVisible, setModelVisible] = useState(false)
    const [JobmodelVisible, setJobModelVisible] = useState(false)
    const [showAddMember, setShowAddMember] = useState(false)
    const [jobTitle, setJobTitle] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [location, setLocation] = useState('')
    const [minimunSalary, setMinimumSalary] = useState('')
    const [maximumSalary, setMaximumSalary] = useState('')
    const [showPostJobs, setShowPostJobs] = useState(false)
    const [JobTypeId, setJobTypeId] = useState(1);
    const [selectedJobType, setSelectedJobType] = useState('full_time');
    const [selectedCategories, setSelectedCategories] = useState('');
    const [categoryID, setCategoryID] = useState(1)
    const [selectedCurrency, setSelectedCurrency] = useState('')
    const [selectedCurrencyId, setSelectedCurrencyId] = useState(1)
    const [selectedSalaryDate, setSelectedSalaryDate] = useState('')
    const [selectedSalaryDateId, setSelectedSalaryDateId] = useState(1)

    const [userPost, setUserPost] = useState([])
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [postModelVisible, setPostModelVisible] = useState(false)
    const [trendingModelVisible, setTrendingModelVisible] = useState(false)
    const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
    const [postText, setPostText] = useState('')
    const [postData, setPostData] = useState([])
    const [postPhotos, setPostPhotos] = useState([])
    const [postPhotosType, setPostPhotosType] = useState([])
    const [selectedImage, setSelectedImage] = useState([]);
    const [isChecked1, setIsChecked1] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [createJobOption, setCreateJobOption] = useState(false)
    const [questionOption, setQuestionOption] = useState(false)
    const [question, setQuestion] = useState('Free Text Question')
    const [questionVisble, setQuestionVisible] = useState(false)
    const [loadingUserPosts, setLoadingUserPosts] = useState(false);
    const [loadingLikePages, setLoadingLikePages] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentImage, setCommentImage] = useState(null)
    const [commentReplyImage, setCommentReplyImage] = useState(null)
    const [commentImageType, setCommentImageType] = useState('')
    const [commentReplyText, setCommentReplyText] = useState('')
    const [commentsReply, setCommentsReply] = useState([])
    const [commentsReplyVisible, setCommentsReplyVisible] = useState({})
    const rbSheetRef = useRef(null); // Reference for RBSheet
    const [longPressedCommentReply, setLongPressedCommentReply] = useState(null);
    const [longPressedComment, setLongPressedComment] = useState(null);
    const [filterOption, setFilterOption] = useState(0)
    const [deleteModel, setDeleteModel] = useState(false)
    const [editModel, setEditModel] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState(null)
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
    const [loadingImage, setLoadingImage] = useState(false)
    const [reportLoading, setReportLoading] = useState(false)
    const [coordinates, setCoordinates] = useState(null);
    const [editText, setEditText] = useState(null)
    const [edit, setEdit] = useState(userPost.Orginaltext || '')
    const [editImage, setEditImage] = useState(null)
    const [postEditPhotos, setPostEditPhotos] = useState([]);
    const [postEditPhotosType, setPostEditPhotosType] = useState([]);
    const [selectedEditImage, setSelectedEditImage] = useState([]);
    const [recommendedPages, setRecommendedPages] = useState([])
    const postActionMenuRef = useRef(null);
    const ActionMenuRef = useRef(null);
    const [showReportModal, setShowReportModal] = useState(false)
    const [report, setReport] = useState('')
    const [commentStatus, setCommentStatus] = useState(null)
    const [search, setSearch] = useState('')
    const [postSavedStatus, setPostSavedStatus] = useState(null)
    const [selectedAlbum, setSelectedAlbum] = useState([]);
    const [isGalleryVisible, setGalleryVisible] = useState(false);
    const [applyData, setApplyData] = useState([])
    const [name, setName] = useState(user_data.username || '')
    const [phone, setPhone] = useState(user_data.phone || '')
    const [applylocation, setApplyLocation] = useState(user_data.location || '')
    const [email, setEmail] = useState(user_data.email || '')
    const [position, setPosition] = useState('')
    const [whereDidYouWork, setWhereDidYouWork] = useState('')
    const [description, setDescription] = useState('')
    const [experienceDescription, setExperienceDescription] = useState('')
    const [experienceStartDate, setExperienceStartDate] = useState(new Date().getFullYear())
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const [isExperienceDatePickerVisible, setIsExperienceDatePickerVisible] = useState(false)
    const [isExperienceEndDatePickerVisible, setIsExperienceEndDatePickerVisible] = useState(false)
    const [experienceEndDate, setExperienceEndDate] = useState(new Date().getFullYear())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [question1Answer, setQuestion1Answer] = useState('')
    const [question2Answer, setQuestion2Answer] = useState('')
    const [question3Answer, setQuestion3Answer] = useState('')
    const [JobApplymodelVisible, setJobApplyModelVisible] = useState(false)
    const [eventImage, setEventImage] = useState(null)
    const [deleteJobData, setDeleteJobData] = useState(null)
    const [jobData, setJobData] = useState([]); // Add this line at the beginning of your component
    const [deleteJobModel, setDeleteJobModel] = useState(false)
    const [editJobmodelVisible, setEditJobmodelVisible] = useState(false)
    const [jobId, setJobId] = useState(0)
    console.log('selected year', experienceStartDate)
    console.log('selected end year', experienceEndDate)
    const [refreshing, setRefreshing] = useState(false);

    // Generate a list of years from 1900 to current year
    const yearItems = Array.from({ length: (new Date().getFullYear() - 1900 + 1) }, (_, i) => i + 1900);

    const handlePostActionMenu = (value) => {
        // Handle the selected action here
        handlePostActions(item.post_id, value);
        // Close the RBSheet after handling the action
        postActionMenuRef.current.close();
    };

    const toggelCommentsReply = (commentId) => {
        setCommentsReplyVisible((prevVisible) => {
            // Use the spread operator to create a copy of the previous state
            const newVisible = { ...prevVisible };

            // Toggle the visibility for the specific commentId
            newVisible[commentId] = !newVisible[commentId];

            return newVisible;
        });
    }

    const handleCommentReplyLongPress = (item) => {
        setLongPressedCommentReply(item);
        rbSheetRef.current.open(); // Open the RBSheet to display actions
    };

    const handleCreatePoll = () => {
        setShowAdditionalInputs((prevVisible) => !prevVisible);
    };
    
    const toggleDeleteModel = (selectedPostId) => {
        setDeleteModel((prevVisible) => !prevVisible)
    }
    const toggleJobDeleteModel = (selectedPostId) => {
        setDeleteJobModel((prevVisible) => !prevVisible)
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

    const toggelReportModel = () => {
        setShowReportModal((prevVisible) => !prevVisible)
    }

    const toggelModel = () => {
        setModelVisible((prevVisible) => !prevVisible)
    }
    const toggelJobApplyModel = () => {
        setJobApplyModelVisible((prevVisible) => !prevVisible)
    }

    const toggelJobModel = () => {
        setJobModelVisible((prevVisible) => !prevVisible)
    }

    const toggelQuestionOption = () => {
        setQuestionOption((prevVisible) => !prevVisible)
    }

    const toggelCreateJobOption = () => {
        setCreateJobOption(prevState => !prevState);
        setShowAddMember(false);
        setShowPostJobs(false);
    };

    const handleShowAddMember = () => {
        setShowAddMember(true);
        setShowPostJobs(false);
        setCreateJobOption(false);
    };

    const handleShowPostJobs = () => {
        setShowPostJobs(true);
        setShowAddMember(false);
        setCreateJobOption(false);
    };

    const handleLongPress = (item) => {
        setLongPressedComment(item);
        rbSheetRef.current.open(); // Open the RBSheet to display actions
    };

    const toggleCommentInput = () => {
        setShowCommentInput(!showCommentInput);
        rbSheetRef.current?.open(); // Open RBSheet first
    };

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

                if (commentText) {
                    // If commentText exists, create a comment
                    formData.append('type', 'create');
                    formData.append('text', commentText);
                } else if (commentImage) {
                    formData.append('type', 'create');
                    formData.append('image', commentImage);
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
                    formData.append('type', 'fetch_comments_reply');
                    formData.append('comment_id', id)
                } else if (type === 'create_reply') {
                    formData.append('type', 'create_reply');
                    if (commentReplyText) {
                        formData.append('text', commentReplyText);
                        formData.append('comment_id', id)
                    } else if (commentReplyImage) {
                        formData.append('image', commentReplyImage)
                        formData.append('comment_id', id)
                    }
                }
                else {
                    // If commentText doesn't exist, fetch comments
                    formData.append('type', type);
                    console.log('this is the post id and type', post_id, type)

                }

                const response = await commentonPost(formData, token);
                if (response.data.api_status === 200) {
                    if (type === 'create') {
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
                    }
                    else if (type === 'fetch_comments_reply') {
                        setCommentsReply(response.data.data)
                        console.log('comments reply', response.data.data)
                    } else if (type === 'create_reply') {
                        // If a comment or image was sent, update comments state accordingly
                        const updatedComments = [...comments, response.data.data];
                        setComments(updatedComments);
                        setCommentReplyText(''); // Clear the TextInput if a comment was sent
                        setCommentReplyImage(null); // Clear the selected image if an image was sent
                        ToastAndroid.show('replyed successfully', ToastAndroid.SHORT);
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

    const createPost = async (PageId) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('page_id', PageId)

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
                    fetchUserPosts(PageId)
                    setLoading(false)
                    ToastAndroid.show('post created', ToastAndroid.SHORT)
                    console.log('created post', response.data.post_data)
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

    // Function to open image picker for selecting from gallery
    const openPostImagePicker = async () => {
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



    const fetchUserPosts = async (PageId) => {
        try {
            setRefreshing(loadingUserPosts ? true : false)
            setLoadingUserPosts(refreshing ? false : true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('type', 'get_page_posts')
                formData.append('id', PageId)
                console.log('pageId', PageId)

                const response = await onGetPostApi(formData, token)
                if (response.data.api_status === 200) {
                    setUserPost(response.data.data)
                    setPostData(response.data.data)
                    setRefreshing(false)
            setLoadingUserPosts(false)
                    const jobPosts = response.data.data.filter(post => post.postType === 'job');
                    setJobData(jobPosts); // Store job posts in jobData
                    console.log('This is USerPost', jobPosts)
                } else if (response.data.api_status === 400 || 404) {
                    setRefreshing(false)
            setLoadingUserPosts(false)
                    console.log('Error fetching UserPost', response.data.errors.error_text)
                }
            }
            else {
                setRefreshing(false)
            setLoadingUserPosts(false)
                console.log('Token not found', error.message)
            }
        } catch (err) {
            setRefreshing(false)
            setLoadingUserPosts(false)
            console.log("Get Error::", err)
        }
    }

    useEffect(() => {
        fetchUserPosts(PageId)
    }, [])

    const SalaryType = [
        { id: 1, label: 'Per Hour', value: 'per_hour' },
        { id: 2, label: 'Per Day', value: 'per_day' },
        { id: 3, label: 'Per Week', value: 'per_week' },
        { id: 4, label: 'Per Month', value: 'per_month' },
        { id: 5, label: 'Per Year', value: 'per_year' },
    ]

    const Currency = [
        { id: 0, label: 'USD ($)', value: ' $ ' },
        { id: 1, label: 'EUR (€)', value: ' € ' },
        { id: 2, label: 'JPY (¥)', value: ' ¥ ' },
        { id: 3, label: 'TRY (₺)', value: ' ₺ ' },
        { id: 4, label: 'GBP (£)', value: ' £ ' },
        { id: 5, label: 'RUB (₽)', value: ' ₽ ' },
        { id: 6, label: 'PLN (zł)', value: ' zł ' },
        { id: 7, label: 'ILS (₪)', value: ' ₪ ' },
        { id: 8, label: 'BRL (R$)', value: ' R$ ' },
        { id: 9, label: 'INR (₹)', value: ' ₹ ' },
    ];


    const jobTypes = [
        { id: 1, label: 'Full time', value: 'full_time' },
        { id: 2, label: 'Part time', value: 'part_time' },
        { id: 4, label: 'Internship', value: 'internship' },
        { id: 5, label: 'Volunteer', value: 'volunteer' },
        { id: 6, label: 'Contract', value: 'contract' }
    ];

    const usersOptions = [
        { title: 'Only me', icon: 'lock' },
        { title: 'Everyone', icon: 'public' },
        { title: 'My Friends', icon: 'group' },
        { title: 'Anonymous', icon: 'person' },
      ];

    const Categories = [
        { id: 1, label: 'Other', value: 'Other' },
        { id: 2, label: 'Admin & Office', value: 'Admin & Office' },
        { id: 3, label: 'Art & Design', value: 'Art & Design' },
        { id: 4, label: 'Business Operations', value: 'Business Operations' },
        { id: 5, label: 'Cleaning & Facilities', value: 'Cleaning & Facilities' },
        { id: 6, label: 'Community & Social Services', value: 'Community & Social Services' },
        { id: 7, label: 'Computer & Data', value: 'Computer & Data' },
        { id: 8, label: 'Construction & Mining', value: 'Construction & Mining' },
        { id: 9, label: 'Eduction', value: 'Eduction' },
        { id: 10, label: 'Farming & Forestry', value: 'Farming & Forestry' },
        { id: 11, label: 'Healthcare', value: 'Healthcare' },
        { id: 12, label: 'Installation,Maintenance & Repair', value: 'Installation,Maintenance & Repair' },
        { id: 13, label: 'Legal', value: 'Legal' },
        { id: 14, label: 'Management', value: 'Management' },
        { id: 15, label: 'Manufacturing', value: 'Manufacturing' },
        { id: 16, label: 'Media & Communication', value: 'Media & Communication' },
        { id: 17, label: 'Personal Care', value: 'Personal Care' },
        { id: 18, label: 'Protective Services', value: 'Protective Services' },
        { id: 19, label: 'Restaurant & Hospitality', value: 'Restaurant & Hospitality' },
        { id: 20, label: 'Retail & Sales', value: 'Retail & Sales' },
        { id: 21, label: 'Science & Engineering', value: 'Science & Engineering' },
        { id: 22, label: 'Sports & Entertainment', value: 'Sports & Entertainment' },
        { id: 23, label: 'Transportation', value: 'Transportation' },

    ];


    const fetchPage = async (PageId) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('page_id', PageId)

                const response = await onGetPageApi(formData, token);
                if (response.data.api_status === 200) {
                    setPage(response.data.page_data)
                    console.log('this is the pages', response.data.page_data)
                    // console.log('this is the page user_id', page.user_id)
                    // dispatch(fetchUserGroups(response.data.groups))
                } else if (response.data.api_status === 400 || 404) {
                    console.log('Error fetching events', response.data.errors.error_text)
                }
            }
            else {
                console.log('Token not found', error.message)
            }
        } catch (err) {
            console.log("Get Error::", err)
        }
    }

    useEffect(() => {
        fetchPage(PageId)
        fetchRecommended()
    }, [])


    const getPageMember = async (PageId) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('page_id', PageId);

                const response = await onGetPageMember(formData, token)
                if (response.data.api_status === 200) {
                    setPageMembers(response.data.users)
                    // console.log('this is the all members', response.data)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('Somthing went wrong', response.data.errors.error_text)
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    const addMember = async (user_id, page_id) => {
        console.log('this is the getdata', user_id, page_id)
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('page_id', page_id);
                formData.append('user_id', user_id)

                const response = await addMembetsInPage(formData, token)
                if (response.data.api_status === 200) {
                    await fetchPage(PageId)
                    console.log('Added Successfully in page', response.data)
                    ToastAndroid.show(response.data.message, ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('error to invite friends', response.data);
                    ToastAndroid.show('Something went wrong please try again', ToastAndroid.SHORT);
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    };

    const getLocationLatLng = async (location) => {
        const response = await client.geocoding.forwardGeocode({
            query: location,
            limit: 1,
        }).send();

        if (response && response.body && response.body.features && response.body.features.length > 0) {
            const { coordinates } = response.body.features[0].geometry;
            setCoordinates({ lat: coordinates[1], lng: coordinates[0] });
        } else {
            throw new Error('Unable to get location');
        }
    };


    const createJob = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {

                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                console.log('all job data>>>>>>>', selectedJobType)
                formData.append('server_key', serverkey);
                formData.append('type', 'create');
                formData.append('page_id', PageId);
                formData.append('job_title', jobTitle);
                formData.append('description', jobDescription);
                formData.append('location', location);
                // formData.append('lat', euclidLocation.lat);
                // formData.append('lng', euclidLocation.lng);

                formData.append('job_type', selectedJobType);
                formData.append('category', categoryID);
                formData.append('minimum', minimunSalary);
                formData.append('maximum', maximumSalary);
                formData.append('salary_date', selectedSalaryDate);
                formData.append('currency', selectedCurrencyId);
                formData.append('image_type', 'upload')
                formData.append('thumbnail', eventImage)
                
                // Sending job creation request
                const response = await onFetchJobs(formData, token);
                console.log(response);
                if (response.data.api_status === 200) {
                    console.log('job created', response.data);
                    ToastAndroid.show('Job Created', ToastAndroid.SHORT);
                    setCreateJobOption(false);
                    setJobModelVisible(false);
                    //  fetchPage(PageId);
                    fetchUserPosts(PageId)
                } else if (response.data.api_status === 400 || response.data.api_status === 404) {
                    console.log('Something went wrong for creating the job', response.data.errors.error_text);
                    ToastAndroid.show('Something went wrong please try again', ToastAndroid.SHORT);
                }
            } else {
                console.log('User Token not found', error.message);
                // ToastAndroid.show('User Token not found', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('Error:', error);
            ToastAndroid.show('Network Problem', ToastAndroid.SHORT);
        }
    };

    const onEditJob = async (jobId) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {

                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                console.log('all job data>>>>>>>', selectedJobType)
                formData.append('server_key', serverkey);
                formData.append('type', 'edit');
                formData.append('job_id', jobId);
                formData.append('job_title', jobTitle);
                formData.append('description', jobDescription);
                formData.append('location', location);
                // formData.append('lat', euclidLocation.lat);
                // formData.append('lng', euclidLocation.lng);

                formData.append('job_type', selectedJobType);
                formData.append('category', categoryID);
                formData.append('minimum', minimunSalary);
                formData.append('maximum', maximumSalary);
                formData.append('salary_date', selectedSalaryDate);
                
                // Sending job creation request
                const response = await onFetchJobs(formData, token);
                console.log(response);
                if (response.data.api_status === 200) {
                    console.log('job created', response.data);
                    ToastAndroid.show('Job Created', ToastAndroid.SHORT);
                    setEditJobmodelVisible(false);
                    //  fetchPage(PageId);
                    fetchUserPosts(PageId)
                } else if (response.data.api_status === 400 || response.data.api_status === 404) {
                    console.log('Something went wrong for creating the job', response.data.errors.error_text);
                    ToastAndroid.show('Something went wrong please try again', ToastAndroid.SHORT);
                }
            } else {
                console.log('User Token not found', error.message);
                // ToastAndroid.show('User Token not found', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('Error:', error);
            ToastAndroid.show('Network Problem', ToastAndroid.SHORT);
        }
    };

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

        if (years > 0) {
            return `${years}Y`;
        } else if (months > 0) {
            return `${months}M`;
        } else if (days > 0) {
            return `${days} day`;
        } else {
            return `${hours}Hr`;
        }
    };

    // Function to get the category label by ID
    const getCategoryLabelById = (categoryId) => {
        const foundCategory = Categories.find((category) => category.id === parseInt(categoryId));
        return foundCategory ? foundCategory.label : '';
    };

    // Function to get the currency label by ID
    const getCurrencyById = (currencyId) => {
        const foundCurrency = Currency.find((currency) => currency.id === parseInt(currencyId));
        return foundCurrency ? foundCurrency.value : '';
    };

    const onHandleDelete = async (item) => {
        try {
            
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                setLoading(true)
            console.log('get onHandleDelete', item)
            const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                    const formData = new FormData();
                    formData.append('server_key', serverkey);
                    formData.append('post_id', item.post_id)
                    formData.append('action', 'delete')
                    const response = await onPageLikeApi(formData, token)
                    if (response.data.api_status === 200) {
                        console.log('Post delete:', response.data)
                        setLoading(false)
                        setDeleteJobModel(false);
                        fetchUserPosts(PageId)
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

    const renderItem = ({ item }) => {
        const toggleMenu = (value, postId) => {
            setSelectedPostId(postId)
            // console.log('this is the selcted value', value)
            // console.log('this is the selcted post id', postId)
        };
        return (
            <View style={[styles.container, { marginBottom: hp(1) }]} >
                <View style={styles.imageContainer}>
                    {/* Background Image */}
                    <Image source={{ uri: `https://marketchat.in/${item.job.image}` }} style={styles.jobBackgroundImage} />
                    {/* User Image (Avatar) Positioned Over Background */}
                    {page.user_id == item.job.user_id && (
                        <View style={styles.overlay}>
                            <Menu onSelect={(value) => toggleMenu(value)}>
                                <MenuTrigger>
                                    <Entypo name="dots-three-vertical" size={24} color={COLORS.white} style={{ padding: 5 }} />
                                </MenuTrigger>
                                <MenuOptions customStyles={{ optionsContainer: styles.modelView }}>
                                    <MenuOption value="edit"
                                      onSelect={() =>{
                                        setJobId(item.job_id),
                                        setJobTitle(item.job.title),
                                        setLocation(item.job.location),
                                        setMinimumSalary(item.job.minimum),
                                        setMaximumSalary(item.job.maximum),
                                        setSelectedSalaryDate(item.job.salary_date),
                                        setSelectedJobType(item.job.job_type),
                                        setJobDescription(item.job.description),
                                        Categories.map((item1,index1) => {
                                            if(item1.id == item.job.category) {
                                                setCategoryID(item1.id)
                                                setSelectedCategories(item1.value)
                                            }
                                        }),
                                        setEditJobmodelVisible(true)
                                        }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Materialicons name='mode-edit' size={24} color={COLORS.black} />
                                            <View style={{ padding: 5 }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Edit Job</Text>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Edit Job information</Text>
                                            </View>
                                        </View>
                                    </MenuOption>
                                    <MenuOption value="delete" onSelect={() =>{setDeleteJobData(item), toggleJobDeleteModel()}}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Materialicons name='delete' size={24} color={COLORS.black} />
                                            <View style={{ padding: 5 }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Delete Job</Text>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Delete this Job completely</Text>
                                            </View>
                                        </View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                    )}
                    <View style={styles.jobImageContainer}>
                        <Image source={{ uri: item.publisher.avatar }} style={styles.jobImage} />
                    </View>
                </View>

                {/* Other Content Below Images */}
                <View>
                    <View style={styles.jobNameContainer}>
                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.black, fontSize: hp(3) }}>{item.job.title}</Text>
                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.4) }}>{item.publisher.username}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', padding: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                            <Materialicons name='location-on' size={hp(2.5)} color={COLORS.red} style={{ paddingHorizontal: wp(1) }} />
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.3) }}>{item.job.location}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                            <MaterialCommunityIcons name='clock-time-four' size={hp(2.5)} color={'#5ab55d'} style={{ paddingHorizontal: wp(1) }} />
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.3) }}>{getTimeDifference(item.job.time)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                            <Ionicons name='bag-sharp' size={hp(2.5)} color={'#2196f3'} style={{ paddingHorizontal: wp(1) }} />
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.3) }}>{item.job.job_type}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                            <MaterialCommunityIcons name='tag' size={hp(2.5)} color={'#795548'} style={{ paddingHorizontal: wp(1) }} />
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.3) }}> {getCategoryLabelById(item.job.category)}</Text>
                        </View>
                    </View>
                </View>

                {/** <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffa39b', borderRadius: wp(2) }} disabled={item.job.apply_count === '0'} >
                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.white, fontSize: hp(2.2), padding: hp(1) }}>View Interested Candidates ({item.job.apply_count}) </Text>
                    </TouchableOpacity>
                </View> */}

                {page.is_page_onwer ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffa39b', borderRadius: wp(2) }} disabled={item.job.apply_count === '0'} onPress={() => jobAction(item.id, 'get_apply')}>
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.white, fontSize: hp(2.2), padding: hp(1) }}>View Interested Candidates ({item.job.apply_count}) </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffa39b', borderRadius: wp(2) }} disabled={item.job.apply}
                            onPress={toggelJobApplyModel} >
                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.white, fontSize: hp(2.2), padding: hp(1) }}> {item.job.apply ? 'Already applied' : 'Apply Now'}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ marginVertical: hp(2), padding: wp(2) }}>
                    <View style={{ backgroundColor: '#f0f2f5', borderRadius: hp(2), padding: hp(2), }}>
                        <View style={{ justifyContent: 'center', paddingVertical: hp(1) }}>
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.3) }}>Minimum</Text>
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.3) }}>{getCurrencyById(item.job.currency)} {item.job.minimum} {item.job.salary_date}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', paddingBottom: hp(1) }}>
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.3) }}>Maximum</Text>
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.3) }}>{getCurrencyById(item.job.currency)} {item.job.maximum} {item.job.salary_date}</Text>
                        </View>
                        <View style={{ padding: hp(1) }}>
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.3) }}> {item.job.description}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const handleShare = (item) => {
        Share.share({
            message: `Check out this post: ${item.url}`, // Customize the shared message here
        })
            .then(result => console.log(result))
            .catch(errorMsg => console.error(errorMsg));
    };

    const handleSocialMediaPress = (socialMedia, page) => {
        const socialMediaLinks = {
            facebook: page?.facebook,
            youtube: page?.youtube,
            linkedin: page?.linkedin,
            twitter: page?.twitter,
            vkontakte: page?.vkontakte,
            instagram: page?.instagram,
            // Add other social media links here...
        };

        if (socialMediaLinks[socialMedia]) {
            const url = socialMediaLinks[socialMedia];
            Linking.openURL(url);
        }
    };

    const onAllPostShow = async (from) => {
        if (from == 'AllData') {
            setFilterOption(0)
            setLoadingUserPosts(true)
            setPostData(userPost)
            setLoadingUserPosts(false)
        }
        else if (from == 'postText') {
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
        else if (from == 'postFile') {
            let arrayText = []
            userPost.map((item, index) => {
                if (item.postType == 'profile_picture' || item.photo_album.length > 0 || item.postFile) {
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

    // Function to remove a selected image from the state
    const removeSelectedPostImage = (imageUriToRemove) => {
        // Filter out the image with the specified URI
        const updatedImages = selectedImage.filter(image => image !== imageUriToRemove);

        // Update the state with the new array of images
        setSelectedImage(updatedImages);
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
                    console.log('action', action)
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
                        await fetchUserPosts(PageId)
                        console.log('Post edited successfully', response.data);
                        ToastAndroid.show('Post edited successfully', ToastAndroid.SHORT);
                    } else if (action === 'delete') {
                        setDeleteModel(false)
                        setModelVisible(false)
                        await fetchUserPosts(PageId)
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
                        await fetchUserPosts(PageId)
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

    const hidePost = async (selectedPostId) => {
        try {
            // setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('post_id', selectedPostId)

                const response = await onHidePost(formData, token)
                if (response.data.api_status === 200) {
                    console.log('Post hide', response.data)
                    const updatedUserPosts = postData.filter(post => post.post_id !== selectedPostId);
                    setPostData(updatedUserPosts); // Update the userPost array
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

    const reportPage = async (page_id,) => {
        try {
            setReportLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('page_id', page_id);
                formData.append('text', report)

                const response = await onReportPage(formData, token)
                if (response.data.api_status === 200) {
                    // setMembers(response.data.users)
                    setShowReportModal(false)
                    setReportLoading(false)
                    console.log('page reported', response.data)
                    ToastAndroid.show('Page reported', ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    setReportLoading(false)
                    console.log('error to fetch members group', response.data);
                    ToastAndroid.show('Something went wrong please try again', ToastAndroid.SHORT);
                }
            } else {
                setReportLoading(false)
                console.log('User token not found', error.message)
            }
        } catch (error) {
            setReportLoading(false)
            console.log('Get Error::', error)
        }
    }


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

    const fetchRecommended = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('type', 'pages')

                const response = await fetchRecommendedData(formData, token);
                if (response.data.api_status === 200) {
                    setRecommendedPages(response.data.data)
                    console.log('this is the recommended pages', response.data)
                    // dispatch(fetchUserGroups(response.data.groups))
                } else if (response.data.api_status === 400 || 404) {
                    console.log('Error fetching events', response.data.errors.error_text)
                }
            }
            else {
                console.log('Token not found', error.message)
            }
        } catch (err) {
            console.log("Get Error::", err)
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

    const searchPost = async () => {
        try {

            const token = await AsyncStorage.getItem('Access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('type', 'page')
                formData.append('id', PageId)
                formData.append('search_query', text)
                formData.append('limit', '1')

                const response = await onSearchForPost(formData, token);
                if (response.data.api_status === 200) {
                    console.log('this is the search post', response.data)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong', response.data.errors.error_text)
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    const jobAction = async (selectedJobId, type) => {
        try {
            console.log('job id', selectedJobId, type)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData()
                formData.append('server_key', serverkey)
                formData.append('type', type)
                formData.append('job_id', selectedJobId)

                if (type === 'apply') {
                    formData.append('user_name', name)
                    formData.append('phone_number', phone)
                    formData.append('location', setApplyLocation)
                    formData.append('email', email)
                    formData.append('position', position)
                    formData.append('where_did_you_work', whereDidYouWork)
                    formData.append('experience_description', description)
                    formData.append('experience_start_date', experienceStartDate)
                    formData.append('question_one_answer', question1Answer)
                    formData.append('question_two_answer', question2Answer)
                    formData.append('question_three_answer', question3Answer)
                    if (!isChecked1) {
                        formData.append('experience_end_date', experienceEndDate)
                        formData.append('i_currently_work', 'off')
                    } else {
                        formData.append('i_currently_work', 'on')
                    }
                    console.log('this is the form data', formData)
                }

                const response = await onFetchJobs(formData, token)
                if (response.data.api_status === 200) {
                    if (type === 'get_apply') {
                        setApplyData(response.data.data)
                    }
                    console.log('apply job', response.data)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong', response.data.errors.error_text)
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Erro::', error)
        }
    }

    // ActionBottomSheet Height
    const baseHeight = 50; // Set your base height
    const optionHeight = hp(8); // Set the height of each option
    const numOptions = page.is_page_onwer ? 2 : 3;

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
          setEventImage(imageData);
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            {isGalleryVisible ? (
                <>
                    <Gallery
                        style={{ flex: 1, height: '100%', backgroundColor: 'black' }}
                        images={selectedAlbum.map(albumImage => ({ source: { uri: albumImage.image } }))}
                        onSingleTapConfirmed={() => setGalleryVisible(false)}
                    />

                    <TouchableOpacity onPress={() => setGalleryVisible(false)} style={{ position: 'absolute', top: hp(1), left: wp(1) }}>
                        <MaterialCommunityIcons name='close-circle' size={wp(8)} color={COLORS.white} />
                    </TouchableOpacity>
                </>
            ) : (
                <ImageBackground source={{ uri: `https://marketchat.in/${page.background_image}` }} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ paddingBottom: hp(2) }} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchUserPosts} />
                    } showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <View style={styles.headerView}>
                            <BasicHeader onPress={() => navigation.goBack()} title={'Page Details'} />
                        </View>
                        <View style={{
                            flex: 0.92,
                            width: '100%',
                        }}>

                            {/* Profile Part */}
                            <View style={styles.container}>
                                <View style={styles.imageContainer}>
                                    {/* Background Image */}
                                    <Image source={{ uri: page?.cover }} style={styles.backgroundImage} />
                                    {/* User Image (Avatar) Positioned Over Background */}
                                </View>
                                {/* Other Content Below Images */}
                                <View>
                                    <View style={styles.userImageContainer}>
                                        <Image source={{ uri: page?.avatar }} style={styles.userImage} />
                                    </View>
                                    <View style={styles.userNameContainer}>
                                        <Text style={styles.username}>{page?.page_name}</Text>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(1.8) }}>@{page?.page_title}</Text>
                                    </View>
                                    <View>
                                        {page.is_page_onwer ? (
                                            <View style={styles.profilePartButton}>
                                                <TouchableOpacity style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: '#ebeef0',
                                                    borderRadius: 8,
                                                    padding: 5,
                                                    paddingHorizontal: wp(4),
                                                    marginHorizontal: 5
                                                }} onPress={() => navigation.navigate('EditPages', { pageData: page })}>
                                                    <Feather name="edit-2" size={22} color={COLORS.black} />
                                                    <Text style={{
                                                        color: COLORS.black,
                                                        fontFamily: fontFamily.FONTS.regular,
                                                        fontSize: hp(2.2)
                                                    }}>Edit</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: '#dbefdc',
                                                    borderRadius: 8,
                                                    padding: 5,
                                                    paddingHorizontal: wp(4),
                                                    marginHorizontal: 5
                                                }} onPress={toggelCreateJobOption} >
                                                    <MaterialCommunityIcons name="bag-checked" size={24} color={'#5ab55d'} />
                                                    <Text style={{
                                                        color: '#5ab55d',
                                                        fontFamily: fontFamily.FONTS.regular,
                                                        fontSize: hp(2.2)
                                                    }}>Create Job</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: '#ebeef0',
                                                    borderRadius: 8,
                                                    padding: 5,
                                                    paddingHorizontal: wp(4),
                                                    marginHorizontal: 5
                                                }} onPress={() => ActionMenuRef.current.open()}>
                                                    <Entypo name="dots-three-vertical" size={20} color={COLORS.darkgray1} />
                                                </TouchableOpacity>
                                            </View>
                                        ) : (

                                            <View style={styles.profilePartButton}>
                                                <TouchableOpacity style={page.is_liked ? styles.checkButton : styles.EditButton} onPress={() => handleLikepages(page?.page_id)} >
                                                    <AntDesign name="like2" size={20} color={page.is_liked ? COLORS.white : COLORS.darkgray1} />
                                                    <Text style={{ paddingHorizontal: wp(1), fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2), color: page.is_liked ? COLORS.white : COLORS.darkgray1 }} numberOfLines={1}>Like</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.EditButton} onPress={() => navigation.navigate('ChatScreen', { pageData: page })}>
                                                    <MaterialCommunityIcons name="message-outline" size={20} color={COLORS.darkgray1} />
                                                    <Text style={{ paddingHorizontal: wp(1), paddingBottom: hp(0.3), fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2), color: COLORS.darkgray1 }} numberOfLines={1}>Message</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.EditButton} onPress={() => ActionMenuRef.current.open()}>
                                                    <Entypo name="dots-three-vertical" size={20} color={COLORS.darkgray1} />
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                        <RBSheet
                                            ref={ActionMenuRef}
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
                                            <View style={{ marginHorizontal: wp(5), }}>
                                                <View style={{ paddingVertical: hp(1.4), paddingHorizontal: wp(2) }}>
                                                    <Text style={{ fontSize: hp(2.3), fontFamily: fontFamily.FONTS.Medium, color: COLORS.black }}>Page Options</Text>
                                                </View>
                                                <View>
                                                    {page.is_page_onwer ? (
                                                        <TouchableOpacity onPress={() => { navigation.navigate('UpgradeToPro'); ActionMenuRef.current.close(); }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                <FontAwesome6 name='bolt-lightning' size={hp(3)} color={COLORS.darkgray1} />
                                                                <View style={{ padding: 5, paddingHorizontal: wp(5.5) }}>
                                                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Boost Page</Text>
                                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Boost this Page</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity onPress={() => ActionMenuRef.current.close()}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                <MaterialCommunityIcons name='star' size={hp(3.5)} color={COLORS.darkgray1} />
                                                                <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Ratings</Text>
                                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>give a Ratings the page</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )}

                                                    <TouchableOpacity onPress={() => { getPageMember(PageId); handleShowAddMember(); ActionMenuRef.current.close(); }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <Materialicons name='group-add' size={hp(3.5)} color={COLORS.darkgray1} />
                                                            <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Invite friends</Text>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Invite your friends for this page</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    {!page.is_page_onwer && (
                                                        <TouchableOpacity onPress={() => { toggelReportModel(); ActionMenuRef.current.close() }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                <Materialicons name='report' size={hp(3.5)} color={COLORS.darkgray1} />
                                                                <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Report</Text>
                                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Report this page!</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>

                                        </RBSheet>
                                    </View>

                                </View>
                            </View>

                            {/* Create Job option */}
                            {createJobOption && (
                                <View style={styles.EmptyContainer}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), padding: wp(3) }}>
                                        <Materialicons name="work" size={hp(4)} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), color: COLORS.darkgray1, fontFamily: fontFamily.FONTS.regular }}>Post a job for {page.page_name} to reach the right applicants on MarketChat.</Text>

                                        <View style={{ marginTop: hp(4), marginBottom: hp(2) }}>
                                            <TouchableOpacity style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: COLORS.red,
                                                borderRadius: 8,
                                                padding: 5,
                                                paddingHorizontal: wp(4),
                                                marginHorizontal: 5
                                            }} onPress={toggelJobModel} >
                                                <Text style={{
                                                    color: COLORS.white,
                                                    fontFamily: fontFamily.FONTS.regular,
                                                    fontSize: hp(2.2)
                                                }}>Create Job</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}


                            {/* Job Model */}
                            <Modal
                                animationType='slide'
                                transparent={true}
                                visible={JobmodelVisible}
                                onRequestClose={toggelJobModel}
                            >
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                        <View style={{
                                            // marginTop: hp(2),
                                            padding: 15,
                                            backgroundColor: global.ContentContainer.backgroundColor,
                                            marginHorizontal: wp(2),
                                            borderRadius: wp(1),
                                            height: '100%'
                                        }}>

                                            <View style={{ marginVertical: hp(2), flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <MaterialCommunityIcons name="bag-checked" size={24} color={'#5ab55d'} />
                                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.black }}>Create Job</Text>
                                                </View>
                                                <TouchableOpacity onPress={toggelJobModel}>
                                                    <Entypo name="cross" size={18} color={COLORS.darkgray} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ marginVertical: hp(3) }}>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Job Title</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        placeholder="Title"
                                                        value={jobTitle}
                                                        onChangeText={text => setJobTitle(text)}
                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Location</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        placeholder="Location"
                                                        value={location}
                                                        onChangeText={(text) => {
                                                            setLocation(text);
                                                            getLocationLatLng(text);
                                                        }}
                                                    />
                                                    {coordinates && (
                                                        <Text>Latitude: {coordinates.lat}, Longitude: {coordinates.lng}</Text>
                                                    )}
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Salary Range</Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                                        <TextInput
                                                            keyboardType="numeric"
                                                            placeholder="$ Minimum"
                                                            style={{
                                                                width: '47%',
                                                                height: hp(5),
                                                                marginHorizontal: 10,
                                                                color: global.inputText.color,
                                                                borderColor: '#eeeff0',
                                                                borderWidth: 0.5,
                                                                borderRadius: 8,
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}
                                                            value={minimunSalary}
                                                            onChangeText={text => setMinimumSalary(text)}
                                                        />

                                                        <TextInput
                                                            keyboardType="numeric"
                                                            placeholder="$ Maximum"
                                                            style={{
                                                                width: '47%',
                                                                height: hp(5),
                                                                marginHorizontal: 10,
                                                                color: global.inputText.color,
                                                                borderColor: '#eeeff0',
                                                                borderWidth: 0.5,
                                                                borderRadius: 8,
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}
                                                            value={maximumSalary}
                                                            onChangeText={text => setMaximumSalary(text)}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Pay Type</Text>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={selectedSalaryDate}
                                                            onValueChange={(itemValue, itemIndex) => {
                                                                const selectedSalaryDate = SalaryType[itemIndex]; // Get the selected category object
                                                                setSelectedSalaryDate(itemValue);
                                                                setSelectedSalaryDateId(selectedSalaryDate.id); // Set categoryID based on the selected category's id
                                                            }}
                                                            style={styles.dropDown}
                                                            itemStyle={styles.pickerItem}
                                                        >
                                                            {SalaryType.map((salaryType, index) => (
                                                                <Picker.Item key={salaryType.id} label={salaryType.label} value={salaryType.value} />
                                                            ))}
                                                        </Picker>
                                                    </View>
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Currency</Text>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={selectedCurrency}
                                                            onValueChange={(itemValue, itemIndex) => {
                                                                const selectedCurrency = Currency[itemIndex]; // Get the selected category object
                                                                setSelectedCurrency(itemValue);
                                                                setSelectedCurrencyId(selectedCurrency.id); // Set categoryID based on the selected category's id
                                                            }}
                                                            style={styles.dropDown}
                                                            itemStyle={styles.pickerItem}
                                                        >
                                                            {Currency.map((currency, index) => (
                                                                <Picker.Item key={currency.id} label={currency.label} value={currency.value} />
                                                            ))}
                                                        </Picker>
                                                    </View>
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Job Type</Text>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={selectedJobType}
                                                            onValueChange={(itemValue, itemIndex) => {
                                                                const selectedJobType = jobTypes[itemIndex]; // Get the selected category object
                                                                setSelectedJobType(itemValue);
                                                                setJobTypeId(selectedJobType.id); // Set categoryID based on the selected category's id
                                                            }}
                                                            style={styles.dropDown}
                                                            itemStyle={styles.pickerItem}
                                                        >
                                                            {jobTypes.map((jobType, index) => (
                                                                <Picker.Item key={jobType.id} label={jobType.label} value={jobType.value} />
                                                            ))}
                                                        </Picker>
                                                    </View>
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Category</Text>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={selectedCategories}
                                                            onValueChange={(itemValue, itemIndex) => {
                                                                const selectedCategory = Categories[itemIndex]; // Get the selected category object
                                                                setSelectedCategories(itemValue);
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
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Description</Text>
                                                    <TextInput
                                                        keyboardType="default"
                                                        placeholder='Address'
                                                        multiline={true}
                                                        numberOfLines={5}
                                                        value={jobDescription}
                                                        onChangeText={text => setJobDescription(text)}
                                                        style={styles.descriptionInput}
                                                        textAlignVertical="top"
                                                    />
                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.8), color: COLORS.secondaryGray }}>Describe the responsibilities and preferred skills for this job</Text>
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Questions</Text>
                                                    <View style={{ marginVertical: hp(1) }}>
                                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: '#f5f6f7', padding: hp(1), borderRadius: wp(2) }} onPress={toggelQuestionOption} >
                                                            <Materialicons name='add-circle-outline' size={hp(2.6)} color={COLORS.darkgray1} style={{ paddingLeft: wp(2) }} />
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2), }}> Add Question</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                {questionOption && (
                                                    <View style={{ marginVertical: hp(2), }}>
                                                        <View style={{ backgroundColor: '#f0f2f5', borderRadius: hp(1), padding: hp(2), }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.black }}>Question One</Text>
                                                                <TouchableOpacity onPress={toggelQuestionOption}>
                                                                    <Entypo name="cross" size={18} color={COLORS.darkgray} />
                                                                </TouchableOpacity>
                                                            </View>
                                                            <TouchableOpacity style={{
                                                                marginTop: 10,
                                                                // borderColor: COLORS.primarygray,
                                                                // borderWidth: 0.5,
                                                                borderRadius: 8,
                                                                width: '100%',
                                                                backgroundColor: COLORS.white,
                                                                justifyContent: 'space-between',
                                                                height: hp(6),
                                                                overflow: 'hidden',
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                paddingLeft: wp(3)
                                                            }} onPress={() => { setQuestionVisible(!questionVisble) }}>
                                                                <Text style={styles.titleText}>{question}</Text>
                                                                {questionVisble ?
                                                                    <Materialicons name="arrow-drop-up" size={29} color={COLORS.black} />
                                                                    :
                                                                    <Materialicons name="arrow-drop-down" size={29} color={COLORS.black} />
                                                                }

                                                            </TouchableOpacity>
                                                            <Collapsible collapsed={!questionVisble}>
                                                                <View style={styles.collapsView}>
                                                                    <TouchableOpacity style={styles.optionView} onPress={() => { setQuestion('Free Text Question'), setQuestionVisible(!questionVisble) }}>
                                                                        <Text style={styles.optionText}>{'Free Text Question'}</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity style={styles.optionView} onPress={() => { setQuestion('Yes/No Question'), setQuestionVisible(!questionVisble) }} >
                                                                        <Text style={styles.optionText}>{'Yes/No Question'}</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity style={styles.optionView} onPress={() => { setQuestion('Multiple Choice Question'), setQuestionVisible(!questionVisble) }} >
                                                                        <Text style={styles.optionText}>{'Multiple Choice Question'}</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </Collapsible>
                                                            <View style={{ justifyContent: 'center', paddingVertical: hp(1) }}>
                                                                <TextInput
                                                                    keyboardType="default"
                                                                    multiline={true}
                                                                    numberOfLines={5}
                                                                    value={question}
                                                                    onChangeText={text => setQuestion(text)}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: 'auto',
                                                                        paddingHorizontal: 4,
                                                                        backgroundColor: COLORS.white,
                                                                        color: global.inputText.color,
                                                                        // borderColor: COLORS.gray,
                                                                        // borderWidth: 0.5,
                                                                        borderRadius: 8,
                                                                        justifyContent: 'center',
                                                                    }}
                                                                    textAlignVertical="top"
                                                                />
                                                            </View>

                                                            {question === 'Multiple Choice Question' && (
                                                                <View style={styles.inputContainer}>
                                                                    <TextInput
                                                                        keyboardType="default"
                                                                        placeholder="Add Answer"
                                                                        value={question}
                                                                        onChangeText={text => setQuestion(text)}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: hp(5.5),
                                                                            backgroundColor: COLORS.white,
                                                                            color: global.inputText.color,
                                                                            borderRadius: 10,
                                                                            alignItems: 'center'
                                                                        }}
                                                                    />

                                                                </View>
                                                            )}
                                                        </View>
                                                    </View>
                                                )}

                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Add an image to help applicants see what it's like to work at this location.</Text>
                                                    <TouchableOpacity onPress={openImagePicker} style={styles.imagePicker}>
                                                    {eventImage != null ? (
                                                        <Image
                                                            source={{ uri: eventImage?.uri }}
                                                            style={{ width: wp(90), height: hp(35), borderRadius: 10 }}
                                                        />
                                                    ) : (
                                                        <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                                                        <MaterialCommunityIcons name='image' size={24} color={COLORS.white} />
                                                        <Text style={{ color: COLORS.white, padding: 6, fontFamily: fontFamily.FONTS.Medium }}>Choose Image</Text>
                                                        </View>
                                                    )}
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(3), borderRadius: 10, justifyContent: 'flex-end' }}>
                                                    <TouchableOpacity style={{
                                                        height: hp(4.8),
                                                        backgroundColor: COLORS.red,
                                                        // borderColor: COLORS.black,
                                                        // borderWidth: 2,
                                                        borderRadius: 12,
                                                        width: wp(35),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }} onPress={() => createJob(PageId)}>
                                                        {loading ? (
                                                            <Loader isLoading={loading} color='white' />
                                                        ) : (
                                                            <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.6), color: COLORS.white }}>Publish</Text>
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </Modal>

                             {/* Edit Job Model */}
                             <Modal
                                animationType='slide'
                                transparent={true}
                                visible={editJobmodelVisible}
                                onRequestClose={() => {setEditJobmodelVisible(false)}}
                            >
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                        <View style={{
                                            // marginTop: hp(2),
                                            padding: 15,
                                            backgroundColor: global.ContentContainer.backgroundColor,
                                            marginHorizontal: wp(2),
                                            borderRadius: wp(1),
                                            height: '100%'
                                        }}>

                                            <View style={{ marginVertical: hp(2), flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <MaterialCommunityIcons name="bag-checked" size={24} color={'#5ab55d'} />
                                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.black }}>Edit Job</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => {setEditJobmodelVisible(false)}}>
                                                    <Entypo name="cross" size={18} color={COLORS.darkgray} />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ marginVertical: hp(3) }}>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Job Title</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        placeholder="Title"
                                                        value={jobTitle}
                                                        onChangeText={text => setJobTitle(text)}
                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Location</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        placeholder="Location"
                                                        value={location}
                                                        onChangeText={(text) => {
                                                            setLocation(text);
                                                            getLocationLatLng(text);
                                                        }}
                                                    />
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Salary Range</Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                                        <TextInput
                                                            keyboardType="numeric"
                                                            placeholder="$ Minimum"
                                                            style={{
                                                                width: '47%',
                                                                height: hp(5),
                                                                marginHorizontal: 10,
                                                                color: global.inputText.color,
                                                                borderColor: '#eeeff0',
                                                                borderWidth: 0.5,
                                                                borderRadius: 8,
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}
                                                            value={minimunSalary}
                                                            onChangeText={text => setMinimumSalary(text)}
                                                        />

                                                        <TextInput
                                                            keyboardType="numeric"
                                                            placeholder="$ Maximum"
                                                            style={{
                                                                width: '47%',
                                                                height: hp(5),
                                                                marginHorizontal: 10,
                                                                color: global.inputText.color,
                                                                borderColor: '#eeeff0',
                                                                borderWidth: 0.5,
                                                                borderRadius: 8,
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}
                                                            value={maximumSalary}
                                                            onChangeText={text => setMaximumSalary(text)}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Pay Type</Text>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={selectedSalaryDate}
                                                            onValueChange={(itemValue, itemIndex) => {
                                                                const selectedSalaryDate = SalaryType[itemIndex]; // Get the selected category object
                                                                setSelectedSalaryDate(itemValue);
                                                                setSelectedSalaryDateId(selectedSalaryDate.id); // Set categoryID based on the selected category's id
                                                            }}
                                                            style={styles.dropDown}
                                                            itemStyle={styles.pickerItem}
                                                        >
                                                            {SalaryType.map((salaryType, index) => (
                                                                <Picker.Item key={salaryType.id} label={salaryType.label} value={salaryType.value} />
                                                            ))}
                                                        </Picker>
                                                    </View>
                                                </View>

                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Job Type</Text>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={selectedJobType}
                                                            onValueChange={(itemValue, itemIndex) => {
                                                                const selectedJobType = jobTypes[itemIndex]; // Get the selected category object
                                                                setSelectedJobType(itemValue);
                                                                setJobTypeId(selectedJobType.id); // Set categoryID based on the selected category's id
                                                            }}
                                                            style={styles.dropDown}
                                                            itemStyle={styles.pickerItem}
                                                        >
                                                            {jobTypes.map((jobType, index) => (
                                                                <Picker.Item key={jobType.id} label={jobType.label} value={jobType.value} />
                                                            ))}
                                                        </Picker>
                                                    </View>
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Category</Text>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={selectedCategories}
                                                            onValueChange={(itemValue, itemIndex) => {
                                                                const selectedCategory = Categories[itemIndex]; // Get the selected category object
                                                                setSelectedCategories(itemValue);
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
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Description</Text>
                                                    <TextInput
                                                        keyboardType="default"
                                                        placeholder='Address'
                                                        multiline={true}
                                                        numberOfLines={5}
                                                        value={jobDescription}
                                                        onChangeText={text => setJobDescription(text)}
                                                        style={styles.descriptionInput}
                                                        textAlignVertical="top"
                                                    />
                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.8), color: COLORS.secondaryGray }}>Describe the responsibilities and preferred skills for this job</Text>
                                                </View>

                                                {/* <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Add an image to help applicants see what it's like to work at this location.</Text>
                                                    <TouchableOpacity onPress={openImagePicker} style={styles.imagePicker}>
                                                    {eventImage != null ? (
                                                        <Image
                                                            source={{ uri: eventImage?.uri }}
                                                            style={{ width: wp(90), height: hp(35), borderRadius: 10 }}
                                                        />
                                                    ) : (
                                                        <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                                                        <MaterialCommunityIcons name='image' size={24} color={COLORS.white} />
                                                        <Text style={{ color: COLORS.white, padding: 6, fontFamily: fontFamily.FONTS.Medium }}>Choose Image</Text>
                                                        </View>
                                                    )}
                                                    </TouchableOpacity>
                                                </View> */}
                                                <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(3), borderRadius: 10, justifyContent: 'flex-end' }}>
                                                    <TouchableOpacity style={{
                                                        height: hp(4.8),
                                                        backgroundColor: COLORS.red,
                                                        // borderColor: COLORS.black,
                                                        // borderWidth: 2,
                                                        borderRadius: 12,
                                                        width: wp(35),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }} onPress={() => onEditJob(jobId)}>
                                                        {loading ? (
                                                            <Loader isLoading={loading} color='white' />
                                                        ) : (
                                                            <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.6), color: COLORS.white }}>Publish</Text>
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </Modal>

                            {/* Job apply Model */}
                            <Modal
                                animationType='slide'
                                transparent={true}
                                visible={JobApplymodelVisible}
                                onRequestClose={toggelJobApplyModel}
                            >
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                        <View style={{
                                            // marginTop: hp(2),
                                            padding: 15,
                                            backgroundColor: global.ContentContainer.backgroundColor,
                                            // marginHorizontal: wp(2),
                                            // borderRadius: wp(1),
                                            height: '100%'
                                        }}>

                                            <View style={{ marginVertical: hp(2), flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <MaterialCommunityIcons name="bag-checked" size={24} color={'#5ab55d'} />
                                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.black }}>{jobData.title}</Text>
                                                </View>
                                                {/**
                 <TouchableOpacity onPress={toggelJobModel}>
                     <Entypo name="cross" size={18} color={COLORS.darkgray} />
                 </TouchableOpacity> */}
                                            </View>

                                            <View style={{ marginVertical: hp(3) }}>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Name</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        placeholder="Username"
                                                        value={name}
                                                        onChangeText={(text) => setName(text)}

                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>phone</Text>
                                                    <CustomInput
                                                        keyboardType="numeric"
                                                        placeholder="Username"
                                                        value={phone}
                                                        onChangeText={(text) => setPhone(text)}

                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Location</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        placeholder="Username"
                                                        value={applylocation}
                                                        onChangeText={(text) => setApplyLocation(text)}

                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>E-mail</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        placeholder="Username"
                                                        value={email}
                                                        onChangeText={(text) => setEmail(text)}

                                                    />
                                                </View>

                                                <View style={{ marginVertical: hp(3) }}>
                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>Experience</Text>
                                                    <View style={{
                                                        borderBottomColor: COLORS.darkgray1,
                                                        borderBottomWidth: 0.5,
                                                        padding: 5,
                                                        // marginHorizontal: 15,
                                                    }} />
                                                </View>


                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Position</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        placeholder="Username"
                                                        value={position}
                                                        onChangeText={(text) => setPosition(text)}

                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Where did you work?</Text>
                                                    <CustomInput
                                                        keyboardType="default"
                                                        placeholder="Username"
                                                        value={whereDidYouWork}
                                                        onChangeText={(text) => setWhereDidYouWork(text)}
                                                    />
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.lable}>Description</Text>
                                                    <TextInput
                                                        keyboardType="default"
                                                        multiline={true}
                                                        numberOfLines={6}
                                                        value={description}
                                                        onChangeText={text => setDescription(text)}
                                                        style={styles.descriptionInput}
                                                        textAlignVertical="top"
                                                    />
                                                </View>

                                                <View style={{
                                                    marginTop: 10,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={experienceStartDate}
                                                            onValueChange={(itemValue) => setExperienceStartDate(itemValue)}
                                                            style={styles.dropDown}
                                                            itemStyle={styles.pickerItem}
                                                        >
                                                            {yearItems.map((year, index) =>
                                                                <Picker.Item key={index} label={year.toString()} value={year} />
                                                            )}
                                                        </Picker>
                                                    </View>

                                                    {!isChecked && (
                                                        <>
                                                            <Text style={{ paddingTop: hp(1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>To</Text>
                                                            <View style={styles.dropDownContainer}>
                                                                <Picker
                                                                    selectedValue={experienceEndDate}
                                                                    onValueChange={(itemValue) => setExperienceEndDate(itemValue)}
                                                                    style={styles.dropDown}
                                                                    itemStyle={styles.pickerItem}
                                                                >
                                                                    {yearItems.map((year, index) =>
                                                                        <Picker.Item key={index} label={year.toString()} value={year} />
                                                                    )}
                                                                </Picker>
                                                            </View>
                                                        </>
                                                    )}
                                                </View>

                                                <View style={{ marginTop: hp(2.3), flexDirection: 'row', }}>
                                                    <CheckBox
                                                        isChecked={isChecked}
                                                        handleCheck={() => setIsChecked(!isChecked)}
                                                    />
                                                    <Text style={{ paddingTop: hp(-4), paddingHorizontal: wp(2), fontSize: hp(2.2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>I Currently work here</Text>
                                                </View>

                                                {jobData.question_one && (
                                                    <View style={styles.inputContainer}>
                                                        <Text style={styles.lable}>Share me your CV.</Text>
                                                        <TextInput
                                                            keyboardType="default"
                                                            multiline={true}
                                                            numberOfLines={6}
                                                            value={question1Answer}
                                                            onChangeText={text => setQuestion1Answer(text)}
                                                            style={styles.descriptionInput}
                                                            textAlignVertical="top"
                                                        />
                                                    </View>
                                                )}



                                                <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(3), borderRadius: 10, justifyContent: 'flex-end' }}>
                                                    <TouchableOpacity style={{
                                                        height: hp(4.8),
                                                        backgroundColor: COLORS.red,
                                                        // borderColor: COLORS.black,
                                                        // borderWidth: 2,
                                                        borderRadius: 12,
                                                        width: wp(35),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }} onPress={() => jobAction(jobData.id, 'apply')}>
                                                        {loading ? (
                                                            <Loader isLoading={loading} color='white' />
                                                        ) : (
                                                            <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.6), color: COLORS.white }}>Publish</Text>
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>


                                        </View>
                                    </View>
                                </ScrollView>
                            </Modal>

                            {/* create Post */}
                            {!createJobOption && !showAddMember && !showPostJobs && page.is_page_onwer && (
                                <View style={styles.ProfileComplitionContainer}>
                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={{ uri: user_data?.avatar }} style={{ height: wp(9), width: wp(9), borderRadius: wp(9) }} />
                                            <Text style={styles.albumsText}>{user_data?.username}</Text>
                                        </View>
                                        {/* <View style={{ padding: 10, borderRadius: 50, justifyContent: 'center', alignItems: 'center', }}>
                                            <FontAwesome5 name="smile" size={wp(6)} color={COLORS.gray} />
                                        </View> */}
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <TextInput
                                            placeholder="What`s going on? #Hastag.. @Mention.. Link.."
                                            placeholderTextColor={COLORS.secondaryGray}
                                            multiline={true}
                                            style={{ color: COLORS.darkgray }}
                                        />
                                    </View>
                                    <View style={styles.horizontalLine} />
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 15, alignItems: 'center' }}>
                                        <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={trendingToggleMOdal}>
                                            <Octicons name="graph" size={17} color={COLORS.darkgray1} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={trendingToggleMOdal}>
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
                                }}
                            >
                                <View style={styles.maneModalView}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    setPostText('');
                                    setPostModelVisible(false);
                                    setShowAdditionalInputs(false);
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
                                            {selectedImage.length > 0 ? (
                                                <ScrollView horizontal>
                                                    <View style={{ flexDirection: 'row', }}>
                                                        {selectedImage.map((image, index) => (
                                                            <View key={index} style={{ margin: 5 }}>
                                                                <Image
                                                                    source={{ uri: image }}
                                                                    style={{ width: wp(30), height: hp(15), borderRadius: 10 }}
                                                                />
                                                                <TouchableOpacity
                                                                    onPress={() => removeSelectedPostImage(image)}
                                                                    style={{ position: 'absolute', top: 5, right: 5 }}
                                                                >
                                                                    <MaterialCommunityIcons name='close-circle' size={wp(6)} color={COLORS.red} />
                                                                </TouchableOpacity>
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
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <View style={{ marginBottom: hp(1), flexDirection: 'row', marginLeft: wp(3), justifyContent: 'space-evenly' }}>
                                                    <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={trendingToggleMOdal}>
                                                        <Octicons name="graph" size={17} color={COLORS.darkgray1} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={trendingToggleMOdal}>
                                                        <Text style={{ fontSize: hp(1.85), color: COLORS.darkgray1 }}>1X</Text>
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
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }}>
                                                            <FontAwesome5 name="smile" size={20} color={COLORS.yellow} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }}>
                                                            <Materialicons name="location-pin" size={20} color={COLORS.pink} />
                                                        </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginVertical: hp(1), padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                                                {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, borderRadius: 50, borderWidth: 0.5, borderColor: COLORS.gray }}>
                                                    <Materialicons name='person' size={15} color={COLORS.darkgray1} />
                                                    <Text style={{ color: COLORS.darkgray1, fontSize: hp(1.8), fontFamily: fontFamily.FONTS.regular, padding: 6 }}>People i follow</Text>
                                                    <AntDesign name="down" size={12} color={COLORS.darkgray} />
                                                </TouchableOpacity> */}
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
                                                    }} onPress={() => createPost(PageId)}>
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
                                                    <TouchableOpacity style={styles.DropDownContainer} onPress={() => { setImageSizeVisible(!imageSizeVisible) }}>
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
                                                            <TouchableOpacity style={styles.optionView} onPress={() => { setImageSize('512x512'), setImageSizeVisible(!imageSizeVisible) }} >
                                                                <Text style={styles.optionText}>{'512x512'}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={styles.optionView} onPress={() => { setImageSize('1024x1024'), setImageSizeVisible(!imageSizeVisible) }} >
                                                                <Text style={styles.optionText}>{'1024x1024'}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </Collapsible>
                                                </View>

                                                <View style={{ marginTop: hp(2) }}>
                                                    <Text style={styles.lable}>Image Count</Text>
                                                    <TouchableOpacity style={styles.DropDownContainer} onPress={() => { setImageCountVisible(!imageCountVisible) }}>
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
                                                            <TouchableOpacity style={styles.optionView} onPress={() => { setImageCount('2'), setImageCountVisible(!imageCountVisible) }} >
                                                                <Text style={styles.optionText}>{'2'}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={styles.optionView} onPress={() => { setImageCount('3'), setImageCountVisible(!imageCountVisible) }} >
                                                                <Text style={styles.optionText}>{'3'}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={styles.optionView} onPress={() => { setImageCount('4'), setImageCountVisible(!imageCountVisible) }} >
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
                                                        {loadingImage ? (
                                                            <Loader isLoading={loadingImage} color='white' />
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

                                        <View style={{ marginVertical: hp(2), flexDirection: 'row', justifyContent: 'space-between' }}>
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
                                                <View style={{ maxHeight: '50%', }}>
                                                    <View style={styles.descriptionInput}>
                                                        <ScrollView>
                                                            <Text style={{ padding: hp(1), fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.4) }}>{generatedPost}</Text>
                                                        </ScrollView>
                                                    </View>
                                                </View>
                                            ) : null}

                                            <View style={{ marginVertical: hp(1), flexDirection: 'row', borderRadius: wp(2), justifyContent: 'center', alignItems: 'flex-end' }}>
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

                            {/* post action Model */}
                            <Modal visible={modelVisible} transparent animationType='fade'>
                                <TouchableWithoutFeedback onPress={() => toggelModel(false)}>
                                    <View style={styles.conteredView}>
                                        <View style={styles.modelView}>
                                            {page.is_page_onwer ? (
                                                <TouchableOpacity onPress={() => navigation.navigate('UpgradeToPro')}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                        <FontAwesome6 name='bolt-lightning' size={hp(2.7)} color={COLORS.black} />
                                                        <View style={{ padding: 5, paddingHorizontal: wp(2.9) }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Boost Page</Text>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Boost this Page</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                        <MaterialCommunityIcons name='star' size={hp(2.7)} color={COLORS.black} />
                                                        <View style={{ padding: 5, paddingHorizontal: wp(2) }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Ratings</Text>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>give a Ratings the page</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )}

                                            <TouchableOpacity onPress={() => { getPageMember(PageId); handleShowAddMember() }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                    <Materialicons name='group-add' size={hp(2.7)} color={COLORS.black} />
                                                    <View style={{ padding: 5, paddingHorizontal: wp(2) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Invite friends</Text>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Invite your friends for this page</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            {!page.is_page_onwer && (
                                                <TouchableOpacity >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                        <Materialicons name='report' size={hp(2.7)} color={COLORS.black} />
                                                        <View style={{ padding: 5 }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Report</Text>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Report this page!</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )}

                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>

                            {/* Add Member */}
                            {showAddMember && !showPostJobs && (
                                <View style={styles.FollowingContainer}>
                                    <View style={styles.FollowingContent}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                            <Materialicons name="person-add" size={wp(6)} color={COLORS.white} style={styles.iconStyle} />
                                            <Text style={styles.FollowingHading}>Invite your friends/followers</Text>
                                        </View>
                                    </View>
                                    <View style={styles.FollowinghorizontalLine} />

                                    <FlatList
                                        data={pageMembers}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.user_id.toString()}
                                        renderItem={({ item }) => (
                                            <View style={{ padding: 5, paddingVertical: hp(2), justifyContent: 'space-between', paddingHorizontal: wp(1.3), width: wp(32) }}>
                                                <Image source={{ uri: item.avatar }} style={{ height: hp(14), width: wp(28), borderRadius: 10 }} />
                                                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.user_id })}>
                                                    <Text style={styles.FollowersName} numberOfLines={1}>{item.username}</Text>
                                                </TouchableOpacity>
                                                <View style={{ alignItems: 'center' }}>
                                                    <TouchableOpacity onPress={() => addMember(item.user_id, page?.page_id)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebeef0', borderRadius: 5, marginVertical: hp(1), paddingHorizontal: wp(2), padding: 2 }}>
                                                        <Materialicons name="person-add" size={16} color={COLORS.black} />
                                                        <Text style={styles.AddButton}>Invite</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    />
                                </View>
                            )}

                            {/* Apply for the jobs */}
                            {showPostJobs && !showAddMember && (
                                <View style={styles.FollowingContainer}>
                                    <View style={styles.FollowingContent}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                            <Materialicons name="person-add" size={wp(6)} color={COLORS.white} style={styles.iconStyle} />
                                            <Text style={styles.FollowingHading}>Jobs</Text>
                                        </View>
                                    </View>

                                    <View style={styles.FollowinghorizontalLine} />
                                    <View style={styles.EmptyContainer}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                                            <Materialicons name="event" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                            <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular }}>No Job to Show</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Horizontal Menu */}
                            {/* {!createJobOption && !showAddMember && !showPostJobs && (
                                <View
                                    style={{
                                        width: '100%',
                                        height: hp(7),
                                        paddingHorizontal: wp(4),
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        backgroundColor: COLORS.white,
                                        alignSelf: 'center',
                                        borderRadius: wp(2),
                                        marginTop: hp(1),
                                        justifyContent: 'space-between',
                                    }}>
                                    <TouchableOpacity onPress={() => onAllPostShow('AllData')}>
                                        <MaterialCommunityIcons name="newspaper-variant-outline" size={22} color={filterOption == 0 ? '#f3f3f3' : COLORS.darkgray} style={{ backgroundColor: filterOption == 0 ? COLORS.gray : '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onAllPostShow('postText')}>
                                        <MaterialCommunityIcons name="file-document-outline" size={22} color={filterOption == 1 ? '#f3f3f3' : COLORS.darkgray} style={{ backgroundColor: filterOption == 1 ? COLORS.gray : '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onAllPostShow('postFile')}>
                                        <Materialicons name="photo" size={22} color={COLORS.lightGreen} style={{ backgroundColor: filterOption == 2 ? COLORS.gray : '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onAllPostShow('video')}>
                                        <MaterialCommunityIcons name="video" size={22} color={COLORS.lightBlue} style={{ backgroundColor: filterOption == 3 ? COLORS.gray : '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onAllPostShow('music')}>
                                        <MaterialCommunityIcons name="music" size={22} color={COLORS.yellow} style={{ backgroundColor: filterOption == 4 ? COLORS.gray : '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onAllPostShow('group')}>
                                        <Materialicons name="map" size={22} color={COLORS.red} style={{ backgroundColor: filterOption == 5 ? COLORS.gray : '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                    </TouchableOpacity>
                                </View>
                            )} */}

                            {/* Post */}

                            {applyData.length > 0 ? (
                                <FlatList
                                    data={applyData}
                                    keyExtractor={(item, index) => item.user_id.toString()}
                                    renderItem={({ item }) => (
                                        <View style={[styles.container, { marginBottom: hp(2) }]} >
                                            <View style={styles.imageContainer}>
                                                {/* Background Image */}
                                                <Image source={{ uri: item.user_data?.cover }} style={styles.jobBackgroundImage} />
                                                {/* User Image (Avatar) Positioned Over Background */}

                                                <View style={{
                                                    borderRadius: wp(1),
                                                    padding: 1,
                                                    backgroundColor: COLORS.secondaryWhite,
                                                    position: 'absolute',
                                                    top: hp(17),
                                                    left: wp(4),
                                                    // alignSelf: 'center'
                                                }}>
                                                    <Image source={{ uri: item.user_data?.avatar }} style={{
                                                        height: hp(15),
                                                        width: wp(30),
                                                        borderRadius: wp(1)
                                                    }} />
                                                </View>
                                            </View>

                                            {/* Other Content Below Images */}
                                            <View>
                                                <View style={{ paddingLeft: wp(25), marginVertical: hp(2), justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.black, fontSize: hp(2.5) }}>{item.user_data?.username}</Text>

                                                    <TouchableOpacity style={{
                                                        marginTop: hp(1),
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: '#ebeef0',
                                                        borderRadius: 8,
                                                        padding: 8,
                                                        paddingHorizontal: wp(4),
                                                        marginHorizontal: wp(2)
                                                    }} onPress={() => navigation.navigate('ChatScreen', { UserData: item.user_data })}>
                                                        <MaterialCommunityicons name="message-outline" size={20} color={COLORS.darkgray1} />
                                                        <Text style={{
                                                            paddingHorizontal: wp(1),
                                                            color: COLORS.black,
                                                            fontFamily: fontFamily.FONTS.regular,
                                                            fontSize: hp(2.2)
                                                        }}>Message</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', padding: 10, }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                                                        <Materialicons name='location-on' size={hp(2.5)} color={COLORS.red} style={{ paddingHorizontal: wp(1) }} />
                                                        <TouchableOpacity onPress={() => Linking.openURL(`http://maps.google.com/?q=${item.location}`)} activeOpacity={1}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>{item.location}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                                                        <MaterialCommunityicons name='clock-time-four' size={hp(2.5)} color={'#5ab55d'} style={{ paddingHorizontal: wp(1) }} />
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>{getTimeDifference(item.time)}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                                                        <Materialicons name='local-phone' size={hp(2.5)} color={'#2196f3'} style={{ paddingHorizontal: wp(1) }} />
                                                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone_number}`)} activeOpacity={1}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>{item.phone_number}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                                                        <MaterialCommunityicons name='email' size={hp(2.5)} color={'#795548'} style={{ paddingHorizontal: wp(1), }} />
                                                        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${item.email}`)} activeOpacity={1}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>{item.email}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>


                                            <View style={{ padding: wp(2) }}>
                                                <View style={{ backgroundColor: '#f0f2f5', borderRadius: hp(0.5), padding: hp(2), }}>
                                                    <View style={{ justifyContent: 'center', paddingVertical: hp(1.3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Where did you work?</Text>
                                                        <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.where_did_you_work}</Text>
                                                    </View>
                                                    <View style={{ justifyContent: 'center', paddingVertical: hp(1.3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Position</Text>
                                                        <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.position}</Text>
                                                    </View>
                                                    <View style={{ justifyContent: 'center', paddingVertical: hp(1.3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Start date</Text>
                                                        <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.experience_start_date}</Text>
                                                    </View>
                                                    <View style={{ justifyContent: 'center', paddingVertical: hp(1.3) }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Description</Text>
                                                        <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.experience_description}</Text>
                                                    </View>

                                                </View>
                                            </View>
                                        </View>
                                    )}
                                />
                            ) : (
                                loadingUserPosts ? (
                                    <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                        <Loader isLoading={loadingUserPosts} />
                                    </View>
                                ) : postData.length === 0 ? (
                                    <View style={{ marginTop: hp(2), width: '100%', alignItems: 'center', justifyContent: 'center', height: hp(30), backgroundColor: COLORS.white, alignSelf: 'center', borderRadius: hp(1) }}>
                                        <MaterialCommunityIcons name="file-document-outline" size={35} color={COLORS.darkgray} style={{ backgroundColor: '#f3f3f3', borderRadius: 50, padding: 8 }} />
                                        <Text style={[styles.albumsText, { textAlign: 'center', marginTop: hp(2) }]}>No Posts to show</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={postData.filter(item => item.postType === 'post')}
                                        keyExtractor={item => item.post_id.toString()}
                                        renderItem={({ item }) => {
                                            const baseHeight = 50; // Set your base height
                                            const optionHeight = hp(8); // Set the height of each option
                                            const numOptions = item.admin ? 5 : 3;
                                            return (
                                                <View style={styles.firstView1}>
                                                    <View style={{
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
                                                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2), }}>{item.postType == 'profile_picture' ? "changed his profile picture" : item.postType == 'profile_cover_picture' ? "changed his cover profile picture" : item.fund_data.length != 0 ? "created a donation request" : item.photo_album.length > 0 ? `added new photos to ${item?.album_name}` : "Created a new article"}</Text>
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
                                                                {item.admin ?
                                                                    (
                                                                        <>
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
                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>{commentStatus === '1' ? 'Enable Comments' : 'Disable Comments'}</Text>
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
                                                        {item.postText && (
                                                            <View>
                                                                <Text style={styles.postDetails}>{item.Orginaltext}</Text>
                                                            </View>
                                                        )}

                                                        {/*  {item.postFile && (
                                                    <Image source={{ uri: item.postFile }} style={{ height: hp(30), width: '100%' }} />
                                                )}*/}

                                                        {item.photo_multi && Array.isArray(item.photo_multi) && item.photo_multi.length > 0 ? (
                                                            <FBCollage images={item.photo_multi.map(photo => ({ uri: photo.image }))}
                                                                borderRadius={2}
                                                                spacing={2}
                                                                imageOnPress={() => {
                                                                    setSelectedAlbum(item.photo_multi);
                                                                    setGalleryVisible(true);
                                                                }}
                                                            />
                                                        ) : (
                                                            item.postFile && (
                                                                <Image source={{ uri: item.postFile }} style={{ height: hp(30), width: '100%' }} />
                                                            )
                                                        )}


                                                        <View style={styles.likesAndCommentView}>
                                                            <View style={styles.likesCountView}>
                                                                <AntDesign name="like2" size={20} color={COLORS.darkgray} />
                                                                <Text style={[styles.postDetails3, { marginLeft: wp(1) }]}>{item?.post_likes}</Text>
                                                            </View>

                                                            {item.comments_status === "1" ? (
                                                                <TouchableOpacity onPress={() => { toggleCommentInput(); handleComments(item.post_id, null, 'fetch_comments'); }}>
                                                                    <Text style={styles.postDetails3} >{item?.post_comments} comments</Text>
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
                                                            <TouchableOpacity style={{ paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleLikepages(item.post_id)}>
                                                                <AntDesign name={item.is_liked ? 'heart' : 'hearto'} size={24} color={item.is_liked ? COLORS.red1 : COLORS.darkgray} />
                                                                {/** <Text style={[styles.postDetails3, { color: item.is_liked ? COLORS.red : COLORS.black }]}>Likes</Text> */}
                                                            </TouchableOpacity>

                                                            <TouchableOpacity style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                                                                toggleCommentInput();
                                                                handleComments(item.post_id, null, 'fetch_comments');

                                                            }}
                                                                disabled={item.comments_status === '0'}>
                                                                <Feather name="message-circle" size={24} color={COLORS.darkgray} />
                                                                {/**  <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.darkgray1 }}>Comment</Text> */}
                                                            </TouchableOpacity>


                                                            <TouchableOpacity style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleShare(item)}>
                                                                <Feather name="send" size={22} color={COLORS.darkgray} />
                                                                {/**    <Text style={styles.postDetails3}>Share</Text> */}
                                                            </TouchableOpacity>
                                                        </View>
                                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handlePostActions(item.post_id, item.is_post_saved ? 'unsavePost' : 'savePost')}>
                                                            <Ionicons name={item.is_post_saved ? 'bookmark' : 'bookmark-outline'} size={24} color={COLORS.darkgray} />
                                                            {/**    <Text style={styles.postDetails3}>Share</Text> */}
                                                        </TouchableOpacity>
                                                    </View>

                                                    {/* RBSheet for comments */}
                                                    <RBSheet
                                                        ref={rbSheetRef}
                                                        closeOnDragDown={true}
                                                        height={500}
                                                        dragFromTopOnly={true}
                                                        onClose={() => {setShowCommentInput(false)}}
                                                        openDuration={250}
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
                                                                <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f2f5', width: '100%' }}>
                                                                    <Image source={{ uri: user_data?.avatar }} style={{ height: hp(5), width: wp(10), borderRadius: 100 }} />
                                                                    <View style={{ flex: 1, marginHorizontal: wp(2), height: 40, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ededed', borderRadius: wp(2) }}>
                                                                        <TextInput
                                                                            placeholder=' Write a comment and press enter'
                                                                            placeholderTextColor={COLORS.secondaryGray}
                                                                            style={styles.CommentInput}
                                                                            value={commentText}
                                                                            onChangeText={text => setCommentText(text)}
                                                                            onSubmitEditing={() => handleComments(item.post_id, commentText)}
                                                                        />
                                                                        {/* <TouchableOpacity onPress={openCommentImagePicker} style={{ paddingHorizontal: wp(2) }}>
                                                                            <Ionicons name='camera-outline' size={24} color={COLORS.darkgray1} />
                                                                        </TouchableOpacity> */}
                                                                    </View>
                                                                    <TouchableOpacity onPress={() => handleComments(item.post_id, null, 'create')}>
                                                                        <Materialicons name='send' size={24} color={COLORS.darkgray1} />
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
                                                                                                        <MaterialCommunityIcons name="delete-outline" size={hp(3.5)} color={COLORS.white} />
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
                                                                                        <View style={{ flexDirection: 'row', marginHorizontal: wp(12), }}>
                                                                                            <TouchableOpacity style={{ marginHorizontal: wp(2), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => { toggelCommentsReply(item.id); handleComments(item.post_id, item.id, 'fetch_comments_reply') }}>
                                                                                                <MaterialCommunityIcons name="message-text-outline" size={hp(2)} color={COLORS.darkgray1} />
                                                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(1.9) }}>{item.replies_count}</Text>
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

                                                                                {/** fetch comment reply */}
                                                                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: wp(25), marginBottom: hp(1) }}>
                                                                            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.darkgray1, marginRight: 8 }} />
                                                                            <TouchableOpacity onPress={() => { toggelCommentsReply(item.id); handleComments(null, item.id, 'fetch_comments_reply') }}>
                                                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(1.7) }}>View {item.replies_count} replies</Text>
                                                                            </TouchableOpacity>
                                                                            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.darkgray1, marginLeft: 8 }} />
                                                                        </View>*/}



                                                                                {/** replies */}
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
                                                                                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.1), color: COLORS.primarygray }}>{item.text}</Text>

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
                                        }
                                    />
                                )
                            )}
                            <View style={{ marginTop: hp(1) }}>
                                <FlatList
                                    data={postData.filter(item => item.postType === 'job')}
                                    keyExtractor={(item) => item.id.toString()} // Assuming 'id' is a unique identifier for each job
                                    renderItem={renderItem}
                                />
                            </View>



                            {/* Report model */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={showReportModal}
                                onRequestClose={toggelReportModel}
                            >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                    <View style={styles.reportModelContainer}>
                                        <View style={{ padding: hp(1.8), borderTopRightRadius: wp(2), borderTopLeftRadius: wp(2), flexDirection: 'row', backgroundColor: COLORS.red, justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Ionicons name="warning" size={24} color={COLORS.white} />
                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.white }}>Report this group</Text>
                                            </View>
                                            <TouchableOpacity onPress={toggelReportModel}>
                                                <Entypo name="cross" size={18} color={COLORS.white} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ paddingHorizontal: 4, marginVertical: hp(2) }}>
                                            <TextInput
                                                placeholder="type text"
                                                placeholderTextColor={COLORS.secondaryGray}
                                                multiline={true}
                                                numberOfLines={3}
                                                value={report}
                                                onChangeText={text => setReport(text)}
                                                textAlignVertical="top"
                                                style={styles.descriptionInput}
                                            />
                                            <View style={{ flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                                                <TouchableOpacity style={{
                                                    backgroundColor: COLORS.red,
                                                    borderRadius: 10,
                                                    // padding: 3,
                                                    height: hp(4.5),
                                                    width: wp(25),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={() => reportPage(page?.page_id)}>
                                                    {reportLoading ? (
                                                        <Loader isLoading={reportLoading} color='white' />
                                                    ) : (
                                                        <View>
                                                            <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>Send</Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                                {/**
                                            <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5, }} onPress={() => reportPage(page?.page_id)} >
                                                <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.white }}>send</Text>
                                            </TouchableOpacity>  */}
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
                                                }} onPress={() => handlePostActions(selectedPostId, 'edit')} >
                                                    {loading ? (
                                                        <Loader isLoading={loading} color='white' />
                                                    ) : (
                                                        <Text style={{fontSize: hp(2.3), color: COLORS.red }}>Update</Text>
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
                                                    height: hp(7),
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
                                                    height: hp(7),
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

                            {/* delete Job model */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={deleteJobModel}
                                onRequestClose={toggleJobDeleteModel}
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
                                                    height: hp(7),
                                                    borderTopWidth: 0.4,
                                                    paddingVertical: hp(1.3),
                                                    borderColor: COLORS.secondaryGray,
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={() => onHandleDelete(deleteJobData)} >
                                                    {loading ? (
                                                        <Loader isLoading={loading} />
                                                    ) : (
                                                        <Text style={{ paddingHorizontal: wp(4), fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.red }}>Delete</Text>
                                                    )}
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{
                                                    // borderRadius: 10,
                                                    // padding: 3,
                                                    height: hp(7),
                                                    paddingVertical: hp(1.3),
                                                    borderTopWidth: 0.4,
                                                    borderColor: COLORS.secondaryGray,
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={toggleJobDeleteModel}>
                                                    <Text style={{ paddingHorizontal: wp(4), fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.darkgray1 }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                            {/* Search for Post */}
                            <View style={styles.SearchContainer}>
                                <Text style={styles.FollowingHading}>Search for Post</Text>
                                <TextInput
                                    keyboardType="default"
                                    style={styles.customInput}
                                // value={search}
                                // onChangeText={text => setSearch(text)}
                                />
                            </View>

                            {/* Info */}
                            <View style={styles.InfoContainer}>
                                <View style={styles.infoContent}>
                                    <Entypo name="info-with-circle" size={20} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 4 }} />
                                    <Text style={styles.FollowingHading}>Info</Text>
                                </View>
                                <View style={styles.FollowinghorizontalLine} />
                                <TouchableOpacity >
                                    <View style={styles.infoContentContainer}>
                                        <AntDesign name="like2" size={24} color={COLORS.darkgray1} />
                                        <Text style={styles.infoContentText}>{page?.likes_count} People Like this </Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.infoContentContainer}>
                                    <MaterialCommunityIcons name="post" size={24} color={COLORS.darkgray1} />
                                    <Text style={styles.infoContentText}>{page?.post_count}</Text>
                                    <Text style={styles.infoContentPost}>posts</Text>
                                </View>
                                <TouchableOpacity onPress={() => page.is_page_onwer && toggelCreateJobOption()}>
                                    <View style={styles.infoContentContainer}>
                                        <Ionicons name="bag" size={24} color={COLORS.darkgray1} />
                                        <Text style={styles.infoContentText}>Jobs</Text>
                                    </View>
                                </TouchableOpacity>
                                {page?.website && (
                                    <TouchableOpacity onPress={() => openWebsite(page?.website)} >
                                        <View style={styles.infoContentContainer}>
                                            <AntDesign name="link" size={24} color={COLORS.darkgray1} />
                                            <Text style={styles.infoContentText}>{page?.website}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                {page?.category && (
                                    <View style={styles.infoContentContainer}>
                                        <MaterialCommunityIcons name="tag" size={24} color={COLORS.darkgray1} />
                                        <Text style={styles.infoContentText}>{page?.category}</Text>
                                    </View>
                                )}
                                {page?.company && (
                                    <View style={styles.infoContentContainer}>
                                        <MaterialCommunityIcons name="office-building" size={24} color={COLORS.darkgray1} />
                                        <Text style={styles.infoContentText}>{page?.company}</Text>
                                    </View>
                                )}

                                {page?.facebook || page?.youtube || page?.linkedin || page?.twitter || page?.vkontakte || page?.instagram ? (
                                    <View>
                                        <View style={styles.infoContentContainer}>
                                            <AntDesign name="sharealt" size={20} color={COLORS.darkgray1} />
                                            <Text style={styles.infoContentText}>Social Lnks</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingBottom: 10, marginLeft: wp(10), alignItems: 'center', }}>
                                            {page?.facebook && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('facebook', page)}>
                                                    <FontAwesome name="facebook-official" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                            {page?.instagram && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('instagram', page)}>
                                                    <FontAwesome name="instagram" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                            {page?.twitter && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('twitter', page)}>
                                                    <Feather name="twitter" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                            {page?.youtube && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('youtube', page)}>
                                                    <Feather name="youtube" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                            {page?.linkedin && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('linkedin', page)}>
                                                    <AntDesign name="linkedin-square" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                            {page?.vk && (
                                                <TouchableOpacity onPress={() => handleSocialMediaPress('vkontakte', page)}>
                                                    <SimpleLineIcons name="social-vkontakte" size={24} color={COLORS.lightBlue} style={{ paddingHorizontal: wp(3) }} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ) : null}

                            </View>



                            {/* About */}
                            <View style={styles.InfoContainer}>
                                <View style={styles.FollowingContent}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Materialicons name="person-add" size={wp(6)} color={COLORS.white} style={styles.iconStyle} />
                                        <Text style={styles.FollowingHading}>About</Text>
                                    </View>
                                </View>
                                <View style={styles.FollowinghorizontalLine} />
                                <View style={{ padding: hp(2) }}>
                                    <Text style={{ paddingHorizontal: wp(1.5), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2) }}>{page?.about}</Text>
                                </View>
                            </View>

                            {/* Groups */}

                            <View style={styles.FollowingContainer}>
                                <View style={styles.FollowingContent}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <MaterialCommunityIcons name="select-group" size={22} color={COLORS.white} style={styles.iconStyle} />
                                        <Text style={styles.FollowingHading}>Suggested Pages </Text>
                                    </View>
                                </View>

                                <View style={styles.FollowinghorizontalLine} />
                                <FlatList
                                    data={recommendedPages.slice(0, 3)}
                                    horizontal={true}
                                    scrollEnabled={false}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => item.user_id.toString()}
                                    renderItem={({ item }) => (
                                        <View>
                                            <View key={item.user_id.toString()} style={{ padding: 5, paddingVertical: hp(2), paddingHorizontal: wp(1.3), marginHorizontal: wp(1), width: wp(32) }}>
                                                <TouchableOpacity onPress={() => navigation.navigate('PageDetails', { PageId: item.page_id })}>
                                                    <Image source={{ uri: item.avatar }} style={{ height: hp(14), width: wp(28), borderRadius: 10 }} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => navigation.navigate('PageDetails', { PageId: item.page_id })}>
                                                    <Text style={styles.FollowersName}>{item.page_title}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    )}
                                />

                            </View>


                        </View>
                    </ScrollView>
                </ImageBackground>
            )}
        </SafeAreaView>
    );
};

export default PageDetails;

const localStyles = (theme, WD, WH) => {
    const global = globalStyles(theme);

    return StyleSheet.create({

        container: {
            // marginHorizontal: 10,
            width: '100%',
            backgroundColor: global.ContentContainer.backgroundColor,
            borderRadius: wp(1),
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
        EmptyContainer: {
            marginTop: hp(1),
            justifyContent: 'center',
            alignItems: 'center',
            // marginHorizontal: wp(2.5),
            widtj: '100%',
            backgroundColor: global.ContentContainer.backgroundColor,
            borderRadius: wp(2),
        },
        reportModelContainer: {
            marginTop: hp(2.2),
            // padding: 15,
            width: wp(90),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: wp(2.2)
        },
        imageContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
        },
        backgroundImage: {
            height: hp(23),
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
            marginHorizontal: 10,
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
        inputContainer: {
            marginTop: 10,
        },
        lable: {
            fontSize: hp(2.2),
            color: global.text2.color,
            fontWeight: '600',
            marginVertical: 4,
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
            minHeight: 40,
            color: global.inputText.color,
        },
        pickerItem: {
            height: hp(5), // Adjust Picker.Item's height
        },
        postDetails3: {
            fontSize: hp(1.9),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black,
            textAlign: 'center'
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
            alignSelf: 'flex-start',
            marginTop: hp(-5),
            marginHorizontal: wp(3)
        },
        userImage: {
            height: hp(12),
            width: wp(24),
            borderWidth: 5,
            borderColor: COLORS.tertiaryWhite,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            elevation: 5,
            // borderRadius: 100,
            // marginVertical: hp(1.5)

        },
        userNameContainer: {
            marginVertical: hp(1),
            marginHorizontal: wp(7),
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',

        },
        username: {
            fontSize: hp(2.6),
            color: global.text2.color,
        },
        profilePartButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: hp(2)
        },
        EditButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ebeef0',
            borderRadius: wp(2),
            padding: hp(1),
            paddingHorizontal: wp(4),
            marginHorizontal: wp(2)
        },
        checkButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f68a3d',
            borderRadius: wp(2),
            padding: hp(1),
            paddingHorizontal: wp(4),
            marginHorizontal: wp(2)
        },
        EditButtonText: {
            // padding: 5,
            // marginHorizontal: 5,
            color: COLORS.gray,
            fontSize: hp(2.4)
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
            fontSize: hp(2.1),
            color: global.text2.color,
        },
        ProfileComplitionContainer: {
            marginTop: hp(1),
            width: '100%',
            backgroundColor: global.ContentContainer.backgroundColor,
            // marginHorizontal: wp(1),
            borderRadius: wp(2)
        },
        firstView1: {
            marginTop: hp(1),
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: wp(2),
            alignSelf: 'center',
            marginBottom: hp(1),
            paddingBottom: hp(2),
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
            fontSize: hp(2.6),
            color: global.text2.color
        },
        ProfileComplitionButtonText: {
            padding: 5,
            // marginHorizontal: 18,
            fontSize: hp(2.2),
            color: global.text2.color
        },
        albumsText: {
            marginHorizontal: 10,
            fontSize: hp(2.2),
            fontFamily: fontFamily.FONTS.Medium,
            color: global.text2.color
        },
        postTitle: {
            marginHorizontal: 10,
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
        CustomInput: {
            width: '90%',
            height: hp(5),
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
            marginTop: hp(1),
            backgroundColor: global.ContentContainer.backgroundColor,
            // marginHorizontal: wp(2),
            borderRadius: wp(2)
        },
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
        groupContent: {
            padding: 10,
            fontSize: hp(2.2),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.darkgray1
        },
        infoContentPost: {
            // padding: 10,
            paddingHorizontal: 'auto',
            fontSize: hp(2.2),
            color: global.text2.color
        },
        albumsContainer: {
            padding: 10,
            paddingHorizontal: 15,
            marginTop: 25,
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            borderRadius: 10
        },
        SearchContainer: {
            // marginTop: hp(2),
            width: '100%',
            padding: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
            // marginHorizontal: wp(1),
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
            fontSize: hp(2.4),
            color: global.text2.color
        },
        FollowersName: {
            padding: 5,
            fontSize: hp(2),
            color: global.text2.color
        },
        AddButton: {
            padding: 5,
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black
        },
        iconStyle: {
            backgroundColor: COLORS.red,
            borderRadius: wp(6),
            padding: 4
        },
        horizontalLine: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 0.5,
            padding: 5,
            // marginHorizontal: 15,
        },
        jobBackgroundImage: {
            height: hp(23),
            // borderRadius: wp(2),
            width: '100%'
        },
        jobImageContainer: {
            borderRadius: wp(30),
            padding: 4,
            backgroundColor: COLORS.secondaryWhite,
            position: 'absolute',
            top: hp(15),
            alignSelf: 'center'
        },
        jobImage: {
            height: wp(28),
            width: wp(28),
            borderRadius: wp(28)
        },
        jobNameContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp(8)
        },
        jobname: {
            fontSize: hp(2.8),
            color: global.text2.color,
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
            borderColor: COLORS.gray
        },
        titleText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
        optionText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
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
            width: '88%',
            // height: 40,
            // marginHorizontal: 4,
            backgroundColor: '#ededed',
            color: COLORS.black,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 10,
            justifyContent: 'center',
        },
        DropDownContainer: {
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
    });

};
