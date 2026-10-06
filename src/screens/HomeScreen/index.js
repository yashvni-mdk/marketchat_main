import {
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Share,
  RefreshControl,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import styles from './styles';
import { useScrollToTop } from '@react-navigation/native';
import InstaStory from 'react-native-insta-story';
import plus from '../../../assets/icons/png/add-1.png';
import CommonHeader from '../../components/CommonHeader';
import Octicons from 'react-native-vector-icons/Octicons'
import { COLORS } from '../../../constants';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux';
import add from '../../../assets/image/img/createPage/add.png';
import users from '../../../assets/image/img/createPage/users.png';
import gallery from '../../../assets/image/img/createPage/gallery.png';
import flag from '../../../assets/image/img/createPage/flag.png';
import dollar from '../../../assets/image/img/createPage/dollar.png';
import calendar from '../../../assets/image/img/createPage/calendar.png';
import background from '../../../assets/image/img/backgrounds/background.jpg';
import welcome from '../../../assets/image/img/backgrounds/welcome.jpg';
import sent from '../../../assets/image/img/createPage/sent.png';
import love from '../../../assets/image/img/createPage/love.png';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import { Picker } from '@react-native-picker/picker';
import Footer from '../../components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCreateNewPostApi, onGetPostApi, onGetStoriesApi, onSearchApi, MidjeournyImage, onHidePost, reportComments, sendPushNotification, onPostFutureTradingApi, onPostSpotTradingApi } from '../../Service/Api';
import CommonDetails from '../../components/CommonDetails';
import Modal from "react-native-modal";
import { onLogOutApi, commentonPost, onPageLikeApi } from '../../Service/Api';
import { fetchUserPost, logoutuser } from '../../redux/reducer';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Loader } from '../../components/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import CheckBox from '../../components/CheckBox';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Collapsible from 'react-native-collapsible';
import CustomInput from '../../components/CustomInput';
import FBCollage from 'react-native-fb-collage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FutureTradPopup } from '../../components/FutureTradPopup';
import SelectDropdown from 'react-native-select-dropdown';
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
import vip from '../../../assets/image/img/vip.png'
import shuttle from '../../../assets/image/shuttle.png'
import Gallery from 'react-native-image-gallery';
import TwitterTextView from 'react-native-twitter-textview';
import {useTranslation} from 'react-i18next';
import { showMessage, hideMessage } from 'react-native-flash-message';

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


const data = [
  {
    user_id: 1,
    user_image:
      'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
    user_name: 'Ahmet Çağlar Durmuş',
    stories: [
      {
        story_id: 1,
        story_image:
          'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
      },
    ],
  },
  {
    user_id: 2,
    user_image:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    user_name: 'Test User',
    stories: [
      {
        story_id: 1,
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
];

const HomeScreen = ({ navigation }) => {
  const {t} = useTranslation();
  const dispatch = useDispatch()
  const [modelVisible, setModelVisible] = useState(false);
  const [filterModelVisible, setFilterModelVisible] = useState('All');
  const [messageText, setMessageText] = useState('')
  const [screenChange, setScreenChange] = useState('')
  const [searchText, setSearchText] = useState('')
  // const user_data = useSelector(state => state.user_data);
  const post_data = useSelector(state => state.posts);
  const usersList = useSelector(state => state.usersList);
  const [postData, setPostData] = useState([])
  const [postText, setPostText] = useState('')
  const [postPhotos, setPostPhotos] = useState([])
  const user_data = useSelector(state => state.user_data);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [loading, setLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [commentImage, setCommentImage] = useState(null)
  const [commentImageType, setCommentImageType] = useState('')
  const [postModelVisible, setPostModelVisible] = useState(false)
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [filterOption, setFilterOption] = useState(0)
  const [trendingModelVisible, setTrendingModelVisible] = useState(false)
  const [logoutModelVisible, setLogoutModelVisible] = useState(false)
  const [isChecked1, setIsChecked1] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const rbSheetRef = useRef(null); // Reference for RBSheet
  const postActionMenuRef = useRef(null);
  const [loadingPost, setLoadingPost] = useState(false)
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
  const [loadingComments, setLoadingComments] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const [stories, setStories] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const [isEmptyArray, setIsEmptyArray] = useState(false);
  // const [limit, setLimit] = useState('10');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [editText, setEditText] = useState(null);
  const [editImage, setEditImage] = useState([]);
  const [commentStatus, setCommentStatus] = useState(false);
  const [postSavedStatus, setPostSavedStatus] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [editModel, setEditModel] = useState(false)
  const [deleteModel, setDeleteModel] = useState(false)
  const [editFundTitle, setEditFundTitle] = useState(null)
  const [longPressedComment, setLongPressedComment] = useState(null);
  const [longPressedCommentReply, setLongPressedCommentReply] = useState(null);
  // const [comments, setComments] = useState([])
  const [commentsReply, setCommentsReply] = useState([])
  const [commentsReplyVisible, setCommentsReplyVisible] = useState({})
  const [commentReplyText, setCommentReplyText] = useState('')
  const [userListData, setUserListData] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [inputValue, setInputValue] = useState('');
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [tradName, setTradName] = useState('');
  const [tradType, setTradType] = useState('');
  const [futureTradingModelVisible, setFutureTradingModelVisible] = useState(false);
  const [entryPrice, setEntryPrice] = useState('');
  const [profitPrice, setProfitPrice] = useState('');
  const [futureStopLoss, setFutureStopLoss] = useState('')
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [entrySpotPrice, setEntrySpotPrice] = useState('');
  const [profitSpotPrice, setProfitSpotPrice] = useState('');
  const [SpotStopLoss, setSpotStopLoss] = useState('');
  const [feelingVisible, setFeelingVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [locationText, setLocationText] = useState('');
  const [selectFeeling, setSelectFeeling] = useState('')
  const [feelingSubOption, setFeelingSubOption] = useState('')
  const [selectFeelingVisible, setSelectFeelingVisible] = useState(false)
  const [subFeelingVisible, setSubFeelingVisible] = useState(false)
  const [selectedSubImage, setSelectedSubImage] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [isGalleryVisible, setGalleryVisible] = useState(false);
  const [isPressArray, setIsPressArray] = useState([]);
  const [commentVisible, setCommentVisible] = useState(false);
  const [commentDisable, setCommentDisable] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [lastId, setLastId] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
    // Ref's
    const flatListRef = useRef(null);

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

  const toggelCommentsReply = (commentId) => {
    setCommentsReplyVisible((prevVisible) => {
      // Use the spread operator to create a copy of the previous state
      const newVisible = { ...prevVisible };

      // Toggle the visibility for the specific commentId
      newVisible[commentId] = !newVisible[commentId];

      return newVisible;
    });
  }

  const toggelModel = () => {
    setModelVisible(prevVisible => !prevVisible);
  };

  const toggleFilterModel = () => {
    setFilterModelVisible(prevVisible => !prevVisible);
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
                        console.log("get Item Token ::::", res)
            sendPushNotification(
              res,
              `${user_data.username}`,
              `like on your post.`,
            );
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

  const toggleDeleteModel = (selectedPostId) => {
    setDeleteModel((prevVisible) => !prevVisible)
  }
  const toggelEditModel = () => {
    setEditModel((prevVisible) => !prevVisible)
  }

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
  const openImagePicker = async () => {
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
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const logout = async () => {
    try {
      setLogoutModelVisible(false);
      const token = await AsyncStorage.getItem('access_token');
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('server_key', serverkey)

        const response = await onLogOutApi(formData, token);
        if (response.data.api_status === 200) {
          await AsyncStorage.removeItem('access_token');
          console.log('logout successfull:', response.data);
          dispatch(logoutuser())
          navigation.navigate('Login')
        } else if (response.data.api_status === 400 || 404) {
          console.log('error to logout', response.data.errors.error_text)
          ToastAndroid.show('Somthing went wrong Please try again', ToastAndroid.SHORT);
        }
      } else {
        console.log('failed to logout', error.message)
        ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("Get Error::", error)
    }
  }

  const navigationProfileOptions = [
    { text: t('search'), navigateTo: 'Explore', icon: { name: 'search', category: 'MaterialIcons' } },
    { text: t('pages'), navigateTo: 'Pages', icon: { name: 'flag', category: 'MaterialCommunityIcons' } },
    { text: t('Blog'), navigateTo: 'Blog', icon: { name: 'newspaper', category: 'MaterialCommunityIcons' } },
    // { text: 'My articles', navigateTo: 'MyArticles', icon: { name: 'file-document', category: 'MaterialCommunityIcons' } },
    { text: t('Events'), navigateTo: 'Events', icon: { name: 'event', category: 'MaterialIcons' } },
    { text: t('my_groups'), navigateTo: 'Groups', icon: { name: 'account-group', category: 'MaterialCommunityIcons' } },
    // { text: 'Forum', navigateTo: 'Forum', icon: { name: 'forum', category: 'MaterialCommunityIcons' } },
    // { text: 'Advertising', navigateTo: 'Advertising', icon: { name: 'newspaper', category: 'MaterialCommunityIcons' } },
    // { text: 'Albums', navigateTo: 'Albums', icon: { name: 'photo-library', category: 'MaterialIcons' } },
    { text: t('saved_posts'), navigateTo: 'SavedPosts', icon: { name: 'newspaper', category: 'MaterialCommunityIcons' } },
    // { text: 'Pokes', navigateTo: 'Poke', icon: { name: 'cursor-pointer', category: 'MaterialCommunityIcons' } },
    // { text: 'Explore', navigateTo: 'Explore', icon: { name: 'explore', category: 'MaterialIcons' } },
    // { text: 'Popular Posts', navigateTo: 'PopularPost', icon: { name: 'trending-up', category: 'MaterialCommunityIcons' } },
    // { text: 'Find friends', navigateTo: 'FindFriends', icon: { name: 'account-search', category: 'MaterialCommunityIcons' } },
    // { text: 'Jobs', navigateTo: 'Jobs', icon: { name: 'bag', category: 'Ionicons' } },
    // { text: 'Common Things', navigateTo: 'CommonThings', icon: { name: 'newspaper', category: 'MaterialCommunityIcons' } },
    // { text: 'Funding', navigateTo: 'Funding', icon: { name: 'newspaper', category: 'MaterialCommunityIcons' } },
    // { text: 'Memories', navigateTo: 'Memories', icon: { name: 'newspaper', category: 'MaterialCommunityIcons' } },
    { text: t('setting'), navigateTo: 'SettingOption', icon: { name: 'settings', category: 'MaterialIcons' } },
    // { text: 'LogOut', onPress: () => {setModelVisible(false),setLogoutModelVisible(true)}, icon: { name: 'logout-variant', category: 'MaterialCommunityIcons' } },
  ]

  const navigationOptions = [
    { text: 'Create Albums', image: gallery, navigateTo: 'CreateAlbum' },
    { text: 'Create Ad', image: dollar, navigateTo: 'CreateAd' },
    { text: 'Create Blog', image: calendar, navigateTo: 'CreateBlog' },
    { text: 'Create Event', image: add, navigateTo: 'CreateEvent' },
    { text: 'Create Group', image: users, navigateTo: 'CreateGroup' },
    { text: 'Create Page', image: flag, navigateTo: 'CreatePage' },
  ];

  const filterOptions = [
    { text: 'All', image: users },
    { text: 'People I Follow', image: users },
    { text: 'All', image: users },
    { text: 'People I Follow', image: users },
    { text: 'All', des: 'View all public posts.', image: users },
    { text: 'People I Follow', image: users },
  ];

  const usersOptions = [
    { title: 'Only me', icon: 'lock' },
    { title: 'Everyone', icon: 'public' },
    { title: 'My Friends', icon: 'group' },
    { title: 'Anonymous', icon: 'person' },
  ];

  const feelingOptions = [
    { title: 'Feeling', icon: 'sentiment-satisfied' },
    { title: 'Traveling to', icon: 'work' },
    { title: 'Watching', icon: 'desktop-mac' },
    { title: 'Playing', icon: 'support' },
    { title: 'Listening to', icon: 'music-note' },
  ];

  const renderModelItems1 = () => {
    return navigationProfileOptions.map((option, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setModelVisible(false);
          if (option.navigateTo) {
            navigation.navigate(option.navigateTo);
          } else if (option.onPress) {
            option.onPress(); // Execute the onPress function for logout
          }
        }}
        style={styles.modelContent}
      >
        {option.icon.category === 'MaterialIcons' && (
          <Materialicons name={option.icon.name} size={24} color={'#555555'} /> // Adjust size and color as needed
        )}
        {option.icon.category === 'FontAwesome' && (
          <FontAwesome5 name={option.icon.name} size={24} color={'#555555'} /> // Adjust size and color as needed
        )}
        {option.icon.category === 'MaterialCommunityIcons' && (
          <MaterialCommunityIcons name={option.icon.name} size={24} color={'#555555'} /> // Adjust size and color as needed
        )}
        {option.icon.category === 'Ionicons' && (
          <Ionicons name={option.icon.name} size={24} color={'#555555'} /> // Adjust size and color as needed
        )}
        <Text style={styles.modelText}>{option.text}</Text>
      </TouchableOpacity>
    ));
  };

  const renderFilterModelItems = () => {
    return filterOptions.map((option, index) => (
      <TouchableOpacity
        key={index}
        onPress={() =>
          option.navigateTo && navigation.navigate(option.navigateTo)
        }
        style={styles.OptionView1}>
        <Image
          style={{ width: wp(7), height: hp(5), resizeMode: 'contain' }}
          source={option.image}
        />
        <View>
          <Text style={styles.modelText}>{option.text}</Text>
          <Text style={styles.modelText1}>{option.des}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  useEffect(() => {
    onGetPostData()
    onGetStoryData()
  }, [])

  const onGetPostData = async () => {
    try {
      setRefreshing(loading ? true : false)
      setLoading(refreshing ? false : true)
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        // formData.append('limit', 50);
        formData.append('server_key', serverkey);
        formData.append('type', 'get_news_feed');
        formData.append('limit', '10');
        // formData.append('limit', limit);
        // console.log(limit)

        const response = await onGetPostApi(formData, token)
        console.log('error for createing the event', response.data.data)
        if (response.data.api_status === 200) {
            setPostData(response.data.data);
            setIsPressArray(Array(response.data.data.length).fill(false));
            setRefreshing(false)
            setLoading(false)
          dispatch(fetchUserPost(response.data.data));
          // console.log('this is the created events', response.data.data)
        } else if (response.data.api_status === 400 || 404) {
          setRefreshing(false)
          setLoading(false)
          console.log('error for createing the event', response.data.errors.error_text)
          ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
        }
      }
    }
    catch (err) {
      setRefreshing(false)
      setLoading(false)
      console.log("err:", err)
    }
  }

  const onGetPostDataList = async () => {
    try {
      setRefreshing(loading ? true : false)
      // setLoading(refreshing ? false : true)
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        // formData.append('limit', 50);
        formData.append('server_key', serverkey);
        formData.append('type', 'get_news_feed');
        formData.append('limit', '10');
        // formData.append('limit', limit);
        // console.log(limit)

        const response = await onGetPostApi(formData, token)
        console.log('error for createing the event', response.data.data)
        if (response.data.api_status === 200) {
            setPostData(response.data.data);
            setIsPressArray(Array(response.data.data.length).fill(false));
            setRefreshing(false)
            setLoading(false)
          dispatch(fetchUserPost(response.data.data));
          // console.log('this is the created events', response.data.data)
        } else if (response.data.api_status === 400 || 404) {
          setRefreshing(false)
          setLoading(false)
          console.log('error for createing the event', response.data.errors.error_text)
          ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
        }
      }
    }
    catch (err) {
      setRefreshing(false)
      setLoading(false)
      console.log("err:", err)
    }
  }

  const onGetStoryData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        // formData.append('limit', 50);
        formData.append('server_key', serverkey);

        const response = await onGetStoriesApi(formData, token)

        if (response.data.api_status === 200) {

          response.data.stories.map((item,index)=>{
            if(stories.length>0){
              stories.map((item1,index1)=>{
                if(item1.user_id==item.user_data.user_id){
                  stories[index1].stories.push({
                    story_id: item.id,
                        story_image:item.thumbnail,
                        swipeText: '',
                        onPress: () => console.log('story 1 swiped'),
                  })
                }
                else{
                  stories.push({
                    user_id: item.user_data.user_id,
                    user_image:item.user_data.avatar,
                    user_name: item.user_data.first_name,
                    stories: [
                      {
                        story_id: item.id,
                        story_image:item.thumbnail,
                        swipeText: '',
                        onPress: () => console.log('story 1 swiped'),
                      }
                    ],
                  })
                }
              })
            }
            else{
             stories.push({
                  user_id: item.user_data.user_id,
                  user_image:item.user_data.avatar,
                  user_name: item.user_data.first_name,
                  stories: [
                    {
                      story_id: item.id,
                      story_image:item.thumbnail,
                      swipeText: '',
                      onPress: () => console.log('story 1 swiped'),
                    }
                  ],
                })
            }
          })
          setStories(response.data.stories)
          console.log('this is the created Stories>>>>>', response.data.stories)
        } else if (response.data.api_status === 400 || 404) {
          console.log('error for createing the event', response.data.errors.error_text)
          ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
        }
      }
    }
    catch (err) {
      console.log("err:", err)
    }

  }

  const renderers = {
    a: (htmlAttribs, children, convertedCSSStyles, passProps) => {
      if (htmlAttribs.class === 'hash') {
        // Extract and display the hashtag text
        return <Text key={passProps.key}>#{children}</Text>;
      }
      // You can handle other cases or return null to skip rendering
      return null;
    },
  };


  const handleLongPress = (item) => {
    setLongPressedComment(item);
  };


  const handleCreatePoll = () => {
    setShowAdditionalInputs((prevVisible) => !prevVisible);
  };

  const postToggleModal = () => {
    setPostModelVisible((prevVisible) => !prevVisible)
  };

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

  const createPost = async () => {
    try {
      setPostLoading(true)
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
          setPostLoading(false)
          setPostText('');
          setFeelingVisible(false)
          setSelectFeelingVisible(false);
          setSubFeelingVisible(false);
          setLocationVisible(false);
          usersList.map(item => {
            const res = item.fcm_token.replace(/ /g, '')
            console.log("get Item Token ::::", res)
            sendPushNotification(
              res,
              `Create Post`,
              `${user_data.username} is create new post.`,
            );
          })
          await onGetPostDataList()
          ToastAndroid.show('post created', ToastAndroid.SHORT)
          console.log('created post', response.data)
        } else if (response.data.api_status === 400 || 404) {
          console.log('Error fetching UserPost', response.data.errors.error_text)
        }
      }
      else {
        setPostLoading(false)
        console.log('Token not found', error.message)
      }
    } catch (err) {
      setPostLoading(false)
      console.log("Get Error::", err)
    }
  }

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

  const onAllPostShow = async (from) => {
    if (from == 'AllData') {
      setFilterOption(0)
      setLoading(true)
      setPostData(post_data)
      setLoading(false)
    }
    else if (from == 'text') {
      let arrayText = []
      post_data.map((item, index) => {
        if (item.Orginaltext != null) {
          arrayText.push(item)
        }
      })
      setFilterOption(1)
      setLoading(true)
      setPostData(arrayText)
      setLoading(false)
    }
    else if (from == 'image') {
      let arrayText = []
      post_data.map((item, index) => {
        if (item.postType == 'profile_picture' || item.photo_album.length > 0) {
          arrayText.push(item)
        }
      })
      setFilterOption(2)
      setLoading(true)
      setPostData(arrayText)
      setLoading(false)
    }
    else if (from == 'video') {
      setFilterOption(3)
      setLoading(true)
      setPostData([])
      setLoading(false)
    }
    else if (from == 'music') {
      setFilterOption(4)
      setLoading(true)
      setPostData([])
      setLoading(false)
    }
    else {
      setFilterOption(5)
      setLoading(true)
      setPostData([])
      setLoading(false)
    }
  }

  const trendingToggleMOdal = () => {
    setTrendingModelVisible((prevVisible) => !prevVisible)
  }

  const handleShare = (item) => {
    Share.share({
      message: `Check out this post: ${item.url}`, // Customize the shared message here
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.error(errorMsg));
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

  const handlePostActions = async (post_id, value) => {
    try {
      if (value == 'unsavePost' || value == 'savePost') {
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
      }
      
      if (value == 'delete') {
        setPostData((prevData) => {
          return prevData.map((item) => {
            if (post_id !== item.post_id) {
              return item;
            }
            return item;
          });
        })
      }
      // setLoading(true)
      const token = await AsyncStorage.getItem('access_token')
      if (token != null) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('server_key', serverkey);
        formData.append('post_id', post_id)

        if (value === 'edit') {
          formData.append('action', 'edit')
          console.log('action', value)
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
        } else if (value === 'delete') {
          formData.append('action', 'delete')
        } else if (value === 'savePost') {
          formData.append('action', 'save')
        } else if (value === 'reportPost') {
          formData.append('action', 'report')
        } else if (value === 'hidePost') {
          await hidePost(selectedPostId)
        } else if (value === 'unsavePost') {
          formData.append('action', 'unsave')
        } else if (value === 'disable_comments') {
          formData.append('action', commentStatus === '0' ? 'enable_comments' : 'disable_comments');
        }

        const response = await onPageLikeApi(formData, token)
        if (response.data.api_status === 200) {
          // Display messages for successful actions
          if (value === 'edit') {
            setEditModel(false)
            await onGetPostDataList()
            console.log('Post edited successfully', response.data);
            ToastAndroid.show('Post edited successfully', ToastAndroid.SHORT);
          } else if (value === 'delete') {
            setDeleteModel(false)
            setModelVisible(false)
            // await onGetPostData()
            console.log('Post deleted successfully', response.data);
            ToastAndroid.show('Post deleted successfully', ToastAndroid.SHORT);
          } else if (value === 'savePost') {
            console.log('Post saved', response.data);
            ToastAndroid.show(response.data.action, ToastAndroid.SHORT);
          } else if (value === 'reportPost') {
            // await fetchUserPost(UserId)
            setPostData((prevData) => {
              return prevData.map((item) => {
                if (post_id === item.post_id) {
                  return {
                    ...item,
                    is_reported: !item.is_reported,
                  };
                }
                return item;
              });
            })
            console.log('report successfully', response.data);
            ToastAndroid.show(response.data.action, ToastAndroid.SHORT);
          } else if (value === 'unsavePost') {
            console.log('Post Unsaved', response.data);
            ToastAndroid.show(response.data.action, ToastAndroid.SHORT);
          } else if (value === 'disable_comments') {
            console.log('disable_comments', response.data);
            // await onGetPostData()
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
    //  finally {
    //   setLoading(false)
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
          const updatedUserPosts = postData.filter(post => post.post_id !== post_id);
          setPostData(updatedUserPosts); // Update the userPost array
          setIsPressArray(Array(updatedUserPosts.length).fill(false));
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
      return `${days}d`;
    } else {
      return `${hours}Hr`;
    }
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

  const renderFooter = () => {
    return (
      <View style={{height:hp(7),width:'100%',alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const getMoreOldItems = async (afterPostId) => {
    try {
      console.log('get More Post Data:::::', afterPostId, isFooterLoader, isEmptyArray);
      if(isFooterLoader && !isEmptyArray && lastId != afterPostId && postData.length > 0){
        setIsLoadingMore(true);
        const token = await AsyncStorage.getItem('access_token')
        if (token != null) {
          const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
          const formData = new FormData();
          // formData.append('limit', 50);
          formData.append('server_key', serverkey);
          formData.append('type', 'get_news_feed');
          formData.append('limit', '10');
          // formData.append('limit', limit);
          // console.log(limit)
          if (afterPostId) {
            formData.append('after_post_id', afterPostId);
          }
  
          const response = await onGetPostApi(formData, token)
          if(response.data.data.length>0){
            if (response.data.api_status === 200) {
              if (afterPostId) {
                // Append new posts to existing ones
                setLastId(afterPostId)
                let array = [...postData, ...response.data.data]
                setPostData(array);
                setIsPressArray(Array(array.length).fill(false));
              } else {
                setPostData(response.data.data);
                setIsPressArray(Array(response.data.data.length).fill(false));
              }
              setRefreshing(false)
              setLoading(false)
              dispatch(fetchUserPost(response.data.data));
              
              // console.log('this is the created events', response.data.data)
            } else if (response.data.api_status === 400 || 404) {
              setRefreshing(false)
              setLoading(false)
              console.log('error for createing the event', response.data.errors.error_text)
              ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
            }
            setIsEmptyArray(false)
          }
          else{
            setRefreshing(false)
            setLoading(false)
            setIsEmptyArray(true)
          }
        }
      }
    }
    catch (err) {
      setRefreshing(false)
      setLoading(false)
      console.log("err:", err)
    }  finally {
      setIsFooterLoader(false);
      setIsLoadingMore(false);
    }
    // if (
    //   homeData?.meta?.current_page < homeData?.meta?.last_page &&
    //   !isFooterLoader
    // ) {
    //   setIsFooterLoader(true);
    //   if (filterType == 'UPCOMING_NEAR_ME_PRIVATE') {
    //     if (_.isEmpty(location)) { }
    //     else {
    //       dispatch(
    //         joinDataAction.getHomeData(
    //           homeData?.meta?.current_page + 1,
    //           filterType,
    //           false,
    //           true,
    //           onLoadMoreSuccess,
    //           latitude,
    //           longitude
    //         )
    //       );
    //     }
    //   } else {
    //     dispatch(
    //       joinDataAction.getHomeData(
    //         homeData?.meta?.current_page + 1,
    //         filterType,
    //         false,
    //         true,
    //         onLoadMoreSuccess,
    //       ),
    //     );
    //   }
    // }
  };

const handleSearchApi = text => {
  setSearchText(text)
  if (text !== '') {
    const filtered = usersList.filter(item =>
      item.username.toLowerCase().includes(text.toLowerCase()),
    );
    setRefresh(!refresh);
    setUserListData(filtered);
    setRefresh(!refresh);
  } else {
    setRefresh(!refresh);
    setUserListData([]);
    setRefresh(!refresh);
  }
}

const renderItem = ({item, index}) => {
  return (
    <TouchableOpacity
      style={styles.userList}
      onPress={() => navigation.navigate('UserProfile', { UserId: item.user_id })}>
      <Image style={styles.imageView} source={{uri: `https://marketchat.in/${item.avatar}`}} />
      <View>
        <Text style={styles.userNameText}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  )
}

const fetchUsernameSuggestions = async (searchTerm) => {
  console.log('get user name >>>>', usersList);
  setUsernameSuggestions(usersList.filter(item => item.username.toLowerCase().includes(searchTerm.toLowerCase())));
};

const handleInputChange = (text) => {
  setPostText(text);
  const mentionIndex = text.lastIndexOf('@');
  if (mentionIndex !== -1) {
    const searchTerm = text.slice(mentionIndex + 1);
    if (searchTerm.trim() !== '') {
      fetchUsernameSuggestions(searchTerm);
    } else {
      setUsernameSuggestions([]);
    } 
  } else {
    setUsernameSuggestions([]);
  }
};

const handleUsernameSelection = (username) => {
  const mentionIndex = postText.lastIndexOf('@');
  const newValue =
  postText.slice(0, mentionIndex + 1) + username + ' ' + postText.slice(mentionIndex + username.length + 1);
    setPostText(newValue);
  setUsernameSuggestions([]); // Clear suggestions after selection
};

const renderUsernameSuggestion = ({ item }) => {
  console.log('get username name::;;', item.username)
  return (
    <TouchableOpacity
    style={styles.userList1}
    onPress={() => handleUsernameSelection(item.username)}>
      <Image style={styles.imageView} source={{uri: item.avatar}} />
      <View>
        <Text style={styles.userNameText}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );
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

const handleCommentVisible = async (item, index) => {
  try {
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
                      arrayList[index].commentList[comment_index].comment_likes = parseInt(comment.comment_likes) + 1;
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
                          arrayList[index].commentList[comment_index].comment_likes = parseInt(comment.comment_likes) - 1;
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
          arrayList[index].commentList[comment_index].commentReply = response.data.data
          setPostData(arrayList);
        } else if (type === 'create_reply') {
          if (res != '') {
            sendPushNotification(
              res,
              `${user_data.name}`,
              `${user_data.username} is reply comment on your post.`,
            );
          }
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

const addFutureTrading = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token')
    const raw = JSON.stringify({
      "name": tradName,
      "type": tradType,
      "entry_price": entryPrice,
      "profit_price": profitPrice,
      "stop_loss": futureStopLoss
    });
    const response1 = await onPostFutureTradingApi(raw, token);
    console.log('get Response:::', response1.data)
    if (response1.data.status) {
      setFutureTradingModelVisible(false);
      setTradName('')
      setTradType('')
      setEntryPrice('')
      setProfitPrice('')
      setFutureStopLoss('')
      showMessage({
        message: t('future_trading_create_successfully'),
        type: 'success',
        duration: 3000,
      });
    } else {
      setTrendingModelVisible(false);
      showMessage({
        message: t('something_is_wrong'),
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
    }
  } catch (err) {
    setTrendingModelVisible(false);
    showMessage({
      message: t('something_is_wrong'),
      type: 'danger',
      duration: 6000,
      icon: 'danger',
    });
    console.log('get Error:', err);
  }
}

const addSpotTrading = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token')
    const raw = JSON.stringify({
      "name": name,
      "type": isChecked ? "Buy" : "Sell",
      "entry_price": entrySpotPrice,
      "profit_price": profitSpotPrice,
      "stop_loss": SpotStopLoss
    });
    const response = await onPostSpotTradingApi(raw, token);
    console.log('get Response:::', response.data)
    if (response.data.status) {
      setTrendingModelVisible(false);
      setName('');
      setEntrySpotPrice('');
      setProfitSpotPrice('');
      setSpotStopLoss('');
      showMessage({
        message: t('spot_trading_create_successfully'),
        type: 'success',
        duration: 3000,
      });
    } else {
      setTrendingModelVisible(false);
      setName('');
      setEntrySpotPrice('');
      setProfitSpotPrice('');
      setSpotStopLoss('');
      showMessage({
        message: t('something_is_wrong'),
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
    }
  } catch (err) {
    setTrendingModelVisible(false);
    console.log('get Error:', err);
    setName('');
      setEntrySpotPrice('');
      setProfitSpotPrice('');
      setSpotStopLoss('');
      showMessage({
        message: t('something_is_wrong'),
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
  }
}

const handleScroll = ({ nativeEvent }) => {
  const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
  const threshold = 50; // Threshold to call handleLoadMoreItems
  const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - threshold;
  console.log('layout value', isNearBottom)
  if (isNearBottom) {
    setIsFooterLoader(true);
    setIsRefreshing(!isRefreshing);
  }
};

  return (
    <>
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
    <View style={styles.container}>
      <View style={styles.headerView}>
        <CommonHeader
          userData={user_data}
          onPress={toggelModel}
          searchText={searchText}
          onChangeText={text => handleSearchApi(text)}
          onBlur={() => {setUserListData([])}}
          onPressMessage={() => navigation.navigate('Chats')}
          usersData = {userListData}
        />
        {userListData.length > 0 &&
         <View style={styles.userListView}>
          <FlatList
            data={userListData}
            keyExtractor={item => item.user_id}
            renderItem={renderItem}
          />
         </View>
        }
      </View>
      <View style={styles.secondView}>
        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onGetPostData} />
          }
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false} 
          showsVerticalScrollIndicator={false}
        >
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: hp(0.5)
          }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateStatus')}
              style={{ position: 'relative', marginLeft: wp(4), marginVertical: hp(1),marginBottom:hp(2.5) }}
            >
              <Image source={{ uri: user_data?.avatar }} style={{ width: hp(10), height: hp(10), borderRadius: hp(10) }} />
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: -2,
                borderRadius: wp(4),
                borderRadius: 100,
                padding: 0.5,
                backgroundColor: COLORS.secondaryWhite,
              }}>
                <Materialicons name="add-circle" size={24} color={COLORS.lightBlue} />
              </View>
            </TouchableOpacity>

            <InstaStory
              data={stories}
              duration={10}
              avatarWrapperStyle={{
                width: hp(9.5), justifyContent: 'center', alignItems: 'center', height: hp(9.5), borderRadius: hp(9.5), borderWidth: 1, borderColor: 'red'
              }}
              avatarImageStyle={{ width: hp(9), height: hp(9), borderRadius: hp(9) }}
              avatarTextStyle={{fontFamily:fontFamily.FONTS.Medium,textAlign:'center',fontSize:hp(1.8),color:COLORS.black,width:wp(21)}}
            />
          </View>

          {/*create post*/}
          <View style={styles.ProfileComplitionContainer}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                {user_data?.avatar != '' &&
                  <Image source={{ uri: user_data?.avatar }} style={{ height: wp(10), width: wp(10), borderRadius: wp(10) }} />
                }
                <Text style={styles.albumsText} numberOfLines={1}>{user_data?.username}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={postToggleModal}>
              <TextInput
                placeholder={t('what_going_on')}
                placeholderTextColor={COLORS.secondaryGray}
                multiline={true}
                editable={false}
                value={inputValue}
                onChangeText={handleInputChange}
                style={{ color: COLORS.darkgray }}
              />
            </TouchableOpacity>
           
            <View style={styles.horizontalLine} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 15, alignItems: 'center' }}>
              <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={() => {setFutureTradingModelVisible(true)}}>
                <Octicons name="graph" size={17} color={COLORS.darkgray1} />
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 2, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={trendingToggleMOdal}>
                <Text style={{ fontSize: hp(1.85), color: COLORS.darkgray1 }}>1X</Text>
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

          {/** Horizontal menu */}
          {/* <View
            style={{
              width: '100%',
              height: hp(7),
              paddingHorizontal: wp(4),
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: COLORS.white,
              alignSelf: 'center',
              borderRadius: wp(2),
              marginVertical: hp(1),
              justifyContent: 'space-between'
            }}>
            <TouchableOpacity onPress={() => onAllPostShow('AllData')}>
              <MaterialCommunityIcons name="newspaper-variant-outline" size={22} color={filterOption == 0 ? '#f3f3f3' : COLORS.darkgray} style={{ backgroundColor: filterOption == 0 ? COLORS.gray : '#f3f3f3', borderRadius: 50, padding: 8 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onAllPostShow('text')}>
              <MaterialCommunityIcons name="file-document-outline" size={22} color={filterOption == 1 ? '#f3f3f3' : COLORS.darkgray} style={{ backgroundColor: filterOption == 1 ? COLORS.gray : '#f3f3f3', borderRadius: 50, padding: 8 }} />
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
          </View> */}
          
          {/** post data */}
          <View style={{ marginBottom: hp(10), marginVertical: hp(1), }}>
            {loading ? (
              <View style={{ marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                <Loader isLoading={loading} />
              </View>
          // {/**    <PostSkeleton /> */}
            ) : postData.length === 0 ? (
            <View style={{ marginTop: hp(2), width: '100%', alignItems: 'center', justifyContent: 'center', height: hp(30), backgroundColor: COLORS.white, alignSelf: 'center', borderRadius: hp(1) }}>
              <MaterialCommunityIcons name="file-document-outline" size={35} color={COLORS.darkgray} style={{ backgroundColor: '#f3f3f3', borderRadius: 50, padding: 8 }} />
              <Text style={[styles.albumsText, { textAlign: 'center', marginTop: hp(2) }]}>{t('no_posts_to_show')}</Text>
            </View>
            ) : (
              <FlatList
                data={postData.filter(item => item.postType === 'post')}
                extraData={postData}
                nestedScrollEnabled
                initialNumToRender={postData.length}
                contentContainerStyle={{marginBottom: hp(2)}}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index?.toString()}
                // scrollEnabled={false}
                renderItem={({ item, index }) => {
                  const baseHeight = 50; // Set your base height
                  const optionHeight = hp(8); // Set the height of each option
                  const numOptions = admin ? 5 : 3;
                  
                  return ( //isPressArray
                    <TouchableHighlight
                      key={item.created_at}
                      onShowUnderlay={() => handleShowUnderlay1(index)}
                      activeOpacity={1}
                      style={{width: '94%', alignSelf: 'center', borderRadius: wp(2), marginBottom: hp(2),}}
                      onPress={() => console.log('hello')}
                      underlayColor={COLORS.lightWhite}>
                    <View style={[styles.firstView1, {borderColor: isPressArray[index] ? COLORS.greenColor : COLORS.white, borderWidth: 2}]}>
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
                            <TouchableOpacity onPressIn={() => handleShowUnderlay1(index)} onPress={() => navigation.navigate('UserProfile', { UserId: item.publisher.user_id })}>
                            {item?.publisher?.avatar != '' &&
                              <Image
                                style={{ height: hp(5), width: hp(5), borderRadius: hp(5) }}
                                source={{ uri: item?.publisher?.avatar }}
                              />
                            }
                            </TouchableOpacity>
                            <View
                              style={{ marginVertical: hp(1), justifyContent: 'space-between', marginLeft: wp(2), flexWrap: 'wrap', width: '88%' }}>

                              <TouchableOpacity onPressIn={() => handleShowUnderlay1(index)} onPress={() => navigation.navigate('UserProfile', { UserId: item.publisher.user_id })}>
                                <Text style={{
                                  fontSize: hp(2),
                                  fontFamily: fontFamily.FONTS.bold,
                                  color: COLORS.black,
                                }} numberOfLines={1}>{item.publisher.username}</Text>
                              </TouchableOpacity>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2), }}>{item.postType == 'profile_picture' ? t('changed_his_profile_picture') : item.postType == 'profile_cover_picture' ? t('changed_his_cover_profile_picture') : item.fund_data.length != 0 ? t('created_a_donation_request') : item.photo_album.length > 0 ? `added new photos to ${item?.album_name}` : item.event != undefined ? t('created_a_new_event') : item.blog != undefined ? t('created_a_new_article') : t('created_a_new_post')}</Text>
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
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {/* <TouchableOpacity
                              onPress={() => { toggleMenu(null, item.admin, item.post_id, item.Orginaltext, item.postFile, item.photo_multi, item.comments_status, item.fund_data.title, item.is_post_saved); postActionMenuRef.current.open() }}>
                              <Entypo name="dots-three-vertical" size={20} color={COLORS.darkgray1} />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPressIn={() => handleShowUnderlay1(index)} style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {handlePostActions(item.post_id, item.is_post_saved ? 'unsavePost' : 'savePost')}}>
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

                            {admin ? (
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
                                      <Materialicons name='delete-outline' size={24} color={COLORS.black} />
                                      <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Delete Post</Text>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Delete this post completely</Text>
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
                                      <Ionicons name={item.is_post_saved ? 'bookmark' : 'bookmark-outline'} size={24} color={COLORS.darkgray} />
                                      <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>{item.is_post_saved ? 'Unsaved Post' : 'Save Post'}</Text>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Add this post to your favorite list</Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => handlePostActions(item.post_id, 'reportPost')}>
                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                      <Materialicons name='report-gmailerrorred' size={hp(4)} color={COLORS.black} />
                                      <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>{item.is_reported ? 'Unreport Post' : 'Report Post'}</Text>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Report this post to us</Text>
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
                          <Image source={{ uri: item?.postFile }} style={{ height: hp(30), width: '100%' }} />
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
                              <TouchableOpacity
                                onPressIn={() => handleShowUnderlay1(index)}
                                onPress={() => navigation.navigate('FundingData')}
                                activeOpacity={1}>
                                {item.fund_data.image !='' &&
                                  <Image source={{ uri: item?.fund_data?.image }} style={{ height: hp(30), width: '100%' }} />
                                }
                                <View style={{
                                  width: '100%',
                                  height: hp(11),
                                  // justifyContent: 'center',
                                  position: 'absolute',
                                  bottom: 0,
                                  backgroundColor: 'rgba(0,0,0,0.8)',
                                  paddingHorizontal: wp(3)
                                }}>
                                  <Text style={styles.donationText}>{item.fund_data.title}</Text>
                                  <View style={styles.donationView}>
                                    <Text style={styles.donationText1}>{`$${item.fund_data.raised} Raised of $${item.fund_data.amount}`}</Text>
                                    <TouchableOpacity style={styles.donationButton} onPress={() => navigation.navigate('Funding')} >
                                      <Text style={{
                                        marginHorizontal: wp(2),
                                        fontSize: hp(2.3),
                                        fontFamily: fontFamily.FONTS.Medium,
                                        color: COLORS.darkgray1
                                      }}>{t('donate')}</Text>
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
                                >
                                  {item.Orginaltext}
                                </TwitterTextView>
                                  {/* <Text style={styles.postDetails1}>{item.Orginaltext}</Text> */}
                                  {item.blog.thumbnail != '' &&
                                    <Image source={{ uri: item?.blog?.thumbnail }} style={{ height: hp(30), width: '100%' }} />
                                  }
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
                                  >
                                    {item.blog.title}
                                  </TwitterTextView>
                                  <TwitterTextView
                                    style={styles.postDetails2}
                                    hashtagStyle={styles.hashtagStyle}
                                    mentionStyle={styles.mentionStyle}
                                    linkStyle={styles.linkStyle}
                                    emailStyle={styles.emailStyle}
                                    onPressHashtag={()=>{}}
                                  onPressMention={()=>{}}
                                  onPressEmail={()=>{}}
                                  >
                                    {item.blog.description.replace(/<br\s*\/?>/gi, '\n')}
                                  </TwitterTextView>
                                    {/* <Text style={styles.postDetails1}></Text>
                                    <Text style={styles.postDetails2}></Text> */}
                                  </View>
                                </TouchableOpacity>
                                :
                                item.event != undefined ?
                                  <TouchableOpacity
                                    activeOpacity={1}
                                    onPressIn={() => handleShowUnderlay1(index)}
                                    onPress={() => navigation.navigate('EventDetails', { EventId: item.id })}>
                                    {item.event.cover!= '' &&
                                    <Image source={{ uri: item?.event?.cover }} style={{ height: hp(30), width: '100%' }} />
                                    }
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
                                   
                                   {item.event.start_date&&
                                         <Text style={{
                                            fontSize: hp(2),
                                            fontFamily: fontFamily.FONTS.regular,
                                            color: COLORS.black,
                                            textAlign: 'justify',
                                            // width: '96%'
                                          }}>{item.event.start_date}</Text>
                                        }
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: wp(5), }}>
                                          <Materialicons name="event" size={24} color={COLORS.red} />
                                          {item.event.start_date&&
                                          <Text style={{
                                            fontSize: hp(2),
                                            fontFamily: fontFamily.FONTS.regular,
                                            color: COLORS.black,
                                            textAlign: 'justify',
                                            // width: '96%'
                                          }}>{item.event.end_date}</Text>
                                        }
                                        </View>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                  :
                                  <>
                                    {item.Orginaltext && (
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
                                      
                                    )}
{/* <Text style={styles.postDetails}>{item.Orginaltext}</Text> */}
                                    {item?.postFile != '' && (
                                      <Image source={{ uri: item?.postFile }} style={{ height: hp(30), width: '100%' }} />
                                    )}

                                  </>
                        )}
                        <View style={styles.likesAndCommentView}>
                          <View style={styles.likesCountView}>
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
                      <View style={styles.horizontalLine} />
                      <View style={{ paddingTop: hp(1.5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '94%', alignSelf: "center" }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <TouchableOpacity style={{ paddingRight: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleLikepages(item.post_id, item)}>
                            <AntDesign name={item.is_liked ? 'heart' : 'hearto'} size={24} color={item.is_liked ? COLORS.red1 : COLORS.darkgray} />
                          </TouchableOpacity>

                          {/* <TouchableOpacity style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => { toggleCommentInput(); handleComments(item.post_id, null, 'fetch_comments'); }} disabled={item.comments_status === '0'}>
                            <MaterialCommunityIcons name="message-text" size={24} color={COLORS.darkgray} />
                          </TouchableOpacity> */}
                          {item.comments_status == '1' &&
                            <TouchableOpacity
                              style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }}
                              onPress={() => handleCommentVisible(item, index)} disabled={item.comments_status === '0'}>
                              <MaterialCommunityIcons name="message-text" size={24} color={COLORS.darkgray} />
                            </TouchableOpacity>
                          }
                          <TouchableOpacity style={ { paddingHorizontal: wp(2), flexDirection: 'row', alignItems: 'center' }} onPress={() => handleShare(item)}>
                            <Feather name="send" size={22} color={COLORS.darkgray} />
                          </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handlePostActions(item.post_id, 'savePost')}>
                          <Ionicons name={item.is_post_saved ? 'bookmark' : 'bookmark-outline'} size={24} color={COLORS.darkgray} />
                        </TouchableOpacity> */}
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

                        {/* <TouchableOpacity onPress={() => { toggleMenu('disable_comments', null, null, null); postActionMenuRef.current.close(); }}>
                                    <View style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center', }}>
                                      <MaterialCommunityIcons name='comment-text-outline' size={24} color={COLORS.black} />
                                      <View style={{ padding: 5, paddingHorizontal: wp(3) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Disable Comments</Text>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Allow or Disallow members to comment on this post</Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity> */}
                      </View>
                     
                      {item.admin &&
                        <View style={styles.commentCollapsView}>
                          <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black, marginLeft: wp(2) }}>{`${t('comments')} :  `}</Text>
                          <Text style={{fontFamily: fontFamily.FONTS.Medium, color: item.comments_status == '1'? COLORS.red1 : COLORS.greenColor, fontSize: hp(2.1)}} onPress={() => onChangedCommentData(item)}>{item.comments_status == '1'? t('disable') : t('enable') }</Text>
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
                                  placeholder={t('write_comment')}
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
                            <View>
                              {item?.commentList?.length > 0 &&
                                <FlatList
                                  data={item.commentList}
                                  keyExtractor={(item, index) => item.id.toString()}
                                  renderItem={({item, index1}) => {
                                    console.log('Get Comment Value:::', item);
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
                                      <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
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
                                        <View>
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
                                                <View style={{ flexDirection: 'row', }}>
                                                  <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'column' }} onPress={() => handleComments(null, item.id, item.is_comment_liked ? 'comment_dislike' : 'comment_like', item, index)}>
                                                    <MaterialCommunityIcons name={item.is_comment_liked ? "heart" : "heart-outline"} size={21} color={item.is_comment_liked ? COLORS.red : COLORS.darkgray1} />
                                                    <Text style={{ color: COLORS.darkgray1, fontSize: hp(2.2) }}>{item.comment_likes}</Text>
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
                                        }
                                          <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                          {user_data?.avatar != '' &&
                                            <Image source={{ uri: user_data?.avatar }} style={{ height: wp(8), width: wp(8), borderRadius: wp(8) }} />
                                          }
                                            <View style={{ flex: 1, marginHorizontal: wp(2), height: 40, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ededed', borderRadius: wp(2) }}>
                                              <TextInput
                                                placeholder={t('write_comment')}
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
                                      <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: 15, color: COLORS.darkgray1 }}>{t('no_comments_to_show')}</Text>
                                    </View>
                                  )}
                                />
                              }
                            </View>
                      </Collapsible>
                    </View>
                    </TouchableHighlight>
                  )
                }}
                ListEmptyComponent={() => (
                  <View style={{ marginVertical: hp(10) }}>
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <Materialicons name="group" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                          <Text style={{ paddingTop: 15, color: COLORS.secondaryGray, fontSize: 16 }}>{t('no_users_to_show')}</Text>
                      </View>
                  </View>
                )}
                ListFooterComponent={isFooterLoader ? renderFooter : null}
                onEndReached={() => {isFooterLoader ? getMoreOldItems(postData[postData.length - 1].post_id) : null}}
                onEndReachedThreshold={0.5}
                onScroll={handleScroll}
              />
              )}
            </View>

          {/* Right side menu Model */}
          <Modal isVisible={modelVisible} animationIn={'slideInLeft'} animationOut={"slideOutLeft"} onBackdropPress={() => {
            setModelVisible(false);
          }}>
            <View
              style={{
                width: "74%",
                backgroundColor: "#fff",
                height: "103%",
                marginLeft: wp(-5),
                alignItems: "center",
              }}
            >
              <View style={{ width: '100%' }} onPress={toggelModel}>
                <View style={styles.conteredView}>
                  <View style={styles.modelView}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={styles.userDetails}>
                        <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={styles.userName}>{user_data?.username}</Text>
                          <TouchableOpacity onPress={toggelModel}>
                            {user_data?.avatar != '' &&
                              <Image source={{ uri: user_data?.avatar }} style={{ height: 30, width: 30, borderRadius: 30 }} />
                            }
                          </TouchableOpacity>
                        </View>
                        <View style={{ paddingHorizontal: 15 }}>
                          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {setModelVisible(false), navigation.navigate('SettingScreen', { selectedOption: 'Wallet' })}}>
                            <Entypo name='wallet' size={20} color={'#555555'} style={{ paddingRight: 10 }} />
                            <Text style={styles.modelText}>Wallet: {user_data.wallet}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {setModelVisible(false), navigation.navigate('SettingScreen', { selectedOption: 'Points' })}}>
                            <FontAwesome5 name='coins' size={20} color={'#555555'} style={{ paddingRight: 12 }} />
                            <Text style={styles.modelText}>Points: {user_data.points}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <TouchableOpacity style={{ paddingTop: hp(2), paddingHorizontal: wp(4), flexDirection: 'row', alignItems: 'center' }} onPress={() => {setModelVisible(false), navigation.navigate('UpgradeToPro')}}>
                        <FontAwesome5 name='coins' size={20} color={'#555555'} style={{ paddingRight: 12 }} />
                        <Text style={styles.modelText}>{t('upgrade_to_pro')}</Text>
                      </TouchableOpacity>
                      {/* HorizontalLine */}
                      <View style={styles.horizontalLine} />
                      <View style={{ paddingTop: hp(1)}}>
                        {renderModelItems1()}
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </View>
              <View style={{
                position: 'absolute',
                bottom: 0,
                width: '100%'
              }}>
                <TouchableOpacity
                  onPress={() => {
                    setModelVisible(false);
                    setLogoutModelVisible(true);
                  }}
                  style={styles.modelContent2}
                >
                    <MaterialCommunityIcons name={'logout-variant'} size={24} color={'#fff'} />
                    <Text style={styles.modelText2}>{t('log_out')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAwareScrollView>
      </View>

      {/* edit model */}
      <Modal
        isVisible={editModel}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackdropPress={() => {
          setEditModel(false);
          setEditText('');
        }}
        backdropOpacity={0.5}
      >
        {/* <View style={{
          width: '111%',
          height: '111%',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: wp(-5),
          }}>
        <TouchableWithoutFeedback
          onPress={() => {
              setEditModel(false);
              setEditText('');
          }}>
          <View style={{position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                  }} />
        </TouchableWithoutFeedback> */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.reportModelContainer}>
            <View style={{ padding: hp(1.8), borderTopRightRadius: wp(2), borderTopLeftRadius: wp(2), flexDirection: 'row', backgroundColor: COLORS.red, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.white }}>{t('edit_post')}</Text>
              </View>
              <TouchableOpacity onPress={toggelEditModel}>
                <Entypo name="cross" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 4, marginVertical: hp(2) }}>
              <TextInput
                placeholder="Type text"
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
                    <Text style={{fontSize: hp(2.3), color: COLORS.red }}>{t('update')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* delete model */}
      <Modal
        // animationType="slide"
        // transparent={true}
        // visible={deleteModel}
        // onRequestClose={toggleDeleteModel}
        isVisible={deleteModel}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackdropPress={toggleDeleteModel}
        backdropOpacity={0.5}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* <View style={{
          width: '111%',
          height: '111%',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: wp(-5),
          }}>
          <TouchableWithoutFeedback
            onPress={toggleDeleteModel}>
            <View style={{position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                    }} />
          </TouchableWithoutFeedback> */}
          <View style={{
            // marginTop: hp(2),
            // padding: 15,
            width: '80%',
            height: 'auto',
            backgroundColor: COLORS.white,
            // marginHorizontal: wp(2),
            borderRadius: 10
          }}>
            <View style={{ padding: hp(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.8), color: COLORS.black }}>{t('delete_this_post')}</Text>
              </View>
            </View>
            <View>
              <View style={{ marginHorizontal: wp(7) }}>
                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2), textAlign: 'justify' }}>{t('delete_message')}</Text>
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
                    <Text style={{ paddingHorizontal: wp(4), fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.red }}>{t('delete')}</Text>
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
                  <Text style={{ paddingHorizontal: wp(4), fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.darkgray1 }}>{t('cancel')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Post Modal */}
      <Modal
        isVisible={postModelVisible}
        onBackdropPress={() => {
          setPostText('');
          setPostModelVisible(false);
          setShowAdditionalInputs(false);
          setFeelingVisible(false)
          setSelectFeelingVisible(false);
          setSubFeelingVisible(false);
          setLocationVisible(false);
        }}
        backdropOpacity={0.5}
      >
        <View style={{
          // position: 'absolute',
          // bottom: 0,
          // left: 0,
          // right: 0,
          // top: 0,
          // width: '100%',
          // alignItems: 'center',
          // justifyContent: 'center',
        }}>
          {/* Post structure inside the modal */}
          <View style={styles.ProfileComplitionContainer1}>
            {/* Your post structure content here */}
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
              {user_data?.avatar != '' &&
                <Image source={{ uri: user_data?.avatar }} style={{ height: 40, width: 40, borderRadius: 50 }} />
              }
                <Text style={styles.albumsText}>{user_data?.username}</Text>
              </View>
              {/* <View style={{ padding: 10, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesome5 name="smile" size={24} color={COLORS.gray} />
              </View> */}
            </View>
            <View style={{ paddingHorizontal: 10 }}>
              <TextInput
                placeholder={t('what_going_on')}
                placeholderTextColor={COLORS.secondaryGray}
                multiline={true}
                value={postText}
                onChangeText={handleInputChange}
                // value={postText}
                // onChangeText={text => setPostText(text)}
                onSubmitEditing={(event) => {
                  event.persist(); // Persist the synthetic event
                  createPost(postText); // Call createPost function with postText
                }}
                style={{ color: COLORS.darkgray }}
              />
                {usernameSuggestions.length > 0 &&
                        <View style={styles.userListView1}>
                              <FlatList
                                data={usernameSuggestions}
                                renderItem={renderUsernameSuggestion}
                                keyExtractor={(item) => item.user_id}
                              />
                      </View>
                }
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
                {/* <View style={{ flexDirection: 'row', paddingTop: 5, justifyContent: 'flex-start' }}>
                  <TouchableOpacity style={{ borderRadius: 4, backgroundColor: COLORS.lightBlue, padding: 5, }}>
                    <Text style={{ fontSize: 14, color: COLORS.white, fontFamily: fontFamily.FONTS.Medium }}>Add Answer</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            )}
            {feelingVisible && (
              <>
              {selectFeeling == '' ?
              <TouchableOpacity style={styles.locationTextInput} onPress={() => setSelectFeelingVisible(!selectFeelingVisible)}>
              <Text style={[styles.locationText, {color: COLORS.gray}]}>{t('what_are_you_doing')}</Text>
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
                placeholder={selectFeeling == 'Traveling to' ? t('where_are_you_traveling') : selectFeeling == 'Watching' ? t('what_are_you_watching') : selectFeeling == 'Playing' ? t('playing_q') : selectFeeling == 'Listening to' ? t('listening_q') : t('feel_d')}
                style={styles.locationText}
              />
              :
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
             {selectedSubImage&& <Image
                source={selectedSubImage}
                style={{ width: wp(5), height: hp(2.5), resizeMode: 'contain', marginLeft: wp(2) }}
              />
             }
              <Text style={[styles.locationText1, {color:feelingSubOption != '' ? COLORS.black : COLORS.gray, marginLeft: wp(1.5)}]}>{feelingSubOption != '' ? feelingSubOption : t('feeling_q')}</Text>
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
                placeholder={t('maps_placeholder')}
                style={styles.locationText}
              />
              </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', zIndex: -1}}>
              <View style={{ marginBottom: hp(1), flexDirection: 'row', marginLeft: wp(3), justifyContent: 'space-evenly' }}>
                <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={() => {setFutureTradingModelVisible(true), setPostModelVisible(false)}}>
                  <Octicons name="graph" size={17} color={COLORS.darkgray1} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={() => {setTrendingModelVisible(true), setPostModelVisible(false)}}>
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
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={() => {setFeelingVisible(!feelingVisible),setSelectFeelingVisible(true)}}>
                    <FontAwesome5 name="smile" size={20} color={COLORS.yellow} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, marginHorizontal: 5, height: wp(10), width: wp(10), borderRadius: wp(10), borderColor: COLORS.secondaryWhite, backgroundColor: '#f3f3f3', marginTop: 10 }} onPress={() => setLocationVisible(!locationVisible)}>
                    <Materialicons name="location-pin" size={20} color={COLORS.pink} />
                  </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: hp(1), padding: 10, alignItems: 'center', justifyContent: 'space-between', zIndex: -1 }}>
              {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, borderRadius: 50, borderWidth: 0.5, borderColor: COLORS.gray }}>
                <Materialicons name='person' size={15} color={COLORS.darkgray1} />
                <Text style={{ color: COLORS.darkgray1, fontSize: 12, fontFamily: fontFamily.FONTS.regular, padding: 6 }}>People i follow</Text>
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
                }} onPress={createPost}>
                  {postLoading ? (
                    <Loader isLoading={postLoading} color='white' />
                  ) : (
                    <View>
                      <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>{t('share')}</Text>
                    </View>
                  )}
                </TouchableOpacity>
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            marginTop: hp(2),
            padding: 15,
            backgroundColor: COLORS.white,
            // marginHorizontal: wp(2),
            borderRadius: 10,
            maxHeight: '97%',
            width: '100%'
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            marginTop: hp(2),
            padding: 15,
            backgroundColor: COLORS.white,
            // marginHorizontal: wp(2),
            borderRadius: 10,
            maxHeight: '97%',
            width: '100%'
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

 {/* Future trading Modal */}
      <FutureTradPopup
      futureTradingModelVisible={futureTradingModelVisible}
      setFutureTradingModelVisible={setFutureTradingModelVisible}
      tradName={tradName}
      setTradName={setTradName}
      tradType={tradType}
      setTradType={setTradType}
      entryPrice={entryPrice}
      setEntryPrice={setEntryPrice}
      profitPrice={profitPrice}
      setProfitPrice={setProfitPrice}
      futureStopLoss={futureStopLoss}
      setFutureStopLoss={setFutureStopLoss}
      onPress={() => addFutureTrading()}
      />

      {/* trending Modal */}
      <Modal
        isVisible={trendingModelVisible}
        onBackdropPress={() => {
          setTrendingModelVisible(false);
          setName('');
          setEntrySpotPrice('');
          setProfitSpotPrice('');
          setSpotStopLoss('');
        }}
        backdropOpacity={0.5}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* Post structure inside the modal */}
          <View style={styles.ProfileComplitionContainer1}>
            <View style={{ padding: 10 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.yellow, fontSize: hp(2.5), padding: 5 }}>{t('educational_tips')}</Text>
                <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.black, fontSize: hp(2.3), }}>{t('spot_trading')}</Text>
              </View>
              <View style={{ paddingVertical: hp(1), maxWidth: '90%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
                  <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), marginRight: wp(9) }}>{t('name')}</Text>
                  <TextInput
                    placeholder={t('enter_name')}
                    value={name}
                    onChangeText={(text) => {setName(text)}}
                    placeholderTextColor={COLORS.secondaryGray}
                    style={styles.CommentInput1}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', marginLeft: wp(2) }}>
                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), marginRight: wp(9) }}>{t('type')}</Text>
                    <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                      <CheckBox
                        isChecked={isChecked}
                        // handleCheck={()=>{!isChecked?[setIsChecked(true),setIsChecked1(false)]:[setIsChecked(false),setIsChecked1(false)]}}
                        handleCheck={() => { setIsChecked(true), setIsChecked1(false) }}
                      />
                      <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkGreeen, fontSize: hp(2.3), }}>{t('buy')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                      <CheckBox
                        isChecked={isChecked1}
                        handleCheck={() => { setIsChecked1(true), setIsChecked(false) }}
                      />
                      <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.red, fontSize: hp(2.3), }}>{t('sell')}</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
                  <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), }}>{t('entry_price')}</Text>
                  <TextInput
                    placeholder={t('enter_buy_price')}
                    value={entrySpotPrice}
                    onChangeText={(text) => {setEntrySpotPrice(text)}}
                    placeholderTextColor={COLORS.secondaryGray}
                    style={styles.CommentInput1}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
                  <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), }}>{t('profit_price')}</Text>
                  <TextInput
                    placeholder={t('enter_sell_price')}
                    value={profitSpotPrice}
                    onChangeText={(text) => {setProfitSpotPrice(text)}}
                    placeholderTextColor={COLORS.secondaryGray}
                    style={styles.CommentInput1}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
                  <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), marginRight: wp(2) }}>{t('stop_loss')}</Text>
                  <TextInput
                    placeholder={t('stop_loss')}
                    value={SpotStopLoss}
                    onChangeText={(text) => {setSpotStopLoss(text)}}
                    placeholderTextColor={COLORS.secondaryGray}
                    style={styles.CommentInput1}
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
                }} onPress={() => addSpotTrading()}>
                  <View>
                    <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>{t('post')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>


      {/* LOGOUT Modal */}
      <Modal
        isVisible={logoutModelVisible}
        onBackdropPress={() => {
          setLogoutModelVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* Post structure inside the modal */}
          <View style={styles.ProfileComplitionContainer1}>
           <Text style={{fontSize:hp(2.4),color:COLORS.black,paddingVertical:hp(2),paddingLeft:wp(3),width:'90%'}}>{'Are you sure you want to logout this app.'}</Text>

           <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-end',paddingVertical:hp(3),paddingBottom:hp(1),marginBottom:hp(1)}}>
            <TouchableOpacity style={{width:'20%',backgroundColor:COLORS.gray,height:hp(5),alignItems:'center',justifyContent:'center',borderRadius:5}} onPress={() => {
          setLogoutModelVisible(false);
        }}>
              <Text style={{fontSize:hp(2),fontFamily:fontFamily.FONTS.Medium,color:COLORS.white}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width:'20%',backgroundColor:COLORS.red,height:hp(5),alignItems:'center',justifyContent:'center',marginHorizontal:wp(3),borderRadius:5}} onPress={()=>logout()}>
              <Text style={{fontSize:hp(2),fontFamily:fontFamily.FONTS.Medium,color:COLORS.white}}>Logout</Text>
            </TouchableOpacity>
           </View>
          </View>
        </View>
      </Modal>

    </View>
  )}
</>
  );
};

export default HomeScreen;
