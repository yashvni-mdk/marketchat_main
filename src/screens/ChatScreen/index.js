import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  TouchableWithoutFeedback,
  Modal,
  Alert
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import BasicHeader from '../../components/BasicHeader';
import { Bubble, GiftedChat, Send, Actions, InputToolbar, Composer, Avatar } from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeleteUserMessages, UserMessages, getChatMedia, getGroupeMessages, getPageMessages, onSendUserMessages, sendPushNotification } from '../../Service/Api';
import { COLORS } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
import { Loader } from '../../components/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import Clipboard from '@react-native-clipboard/clipboard';

const db = firestore();
const ChatScreen = ({ navigation, route }) => {
  const user_data = useSelector(state => state.user_data);
  const usersList = useSelector(state => state.usersList);
  // const { pageData } = route.params;
  // console.log('this is the page Id ', pageData)
  // const { groupData } = route.params;
  // console.log('this is the group Id ', groupData)
  const { receiver, sender } = route.params;
  console.log('this is the recipientId ', receiver)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([]);
  const [pageMessages, setPageMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showAttachment, setShowAttachment] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false)
  const [messagesMedia, setMessagesMedia] = useState([])
  const [reply, setReply] = useState(null);
  const [isReload, setIsReload] = useState(false);
  const room = (me, him) => [me, him].sort().join('-');
  const roomname = `${receiver.id}-${user_data.user_id == receiver.id ? sender.id : user_data.user_id}`;
  const chat = db.doc(`marketChat/${roomname}`);

  const makeLongPress = (
    user,
    messages,
    setMessages,
    setReply,
    navigation,
    setIsReload,
  ) => (context, message) => {
    // Log.infoChat(' MESSAGE in CHATTER LINE 66', message);
  
    const options = ['Copy', 'Reply'];
  
    if (message.user?._id == user_data.user_id) options.push('Recall this message'); // recall option for user sender
    options.push('Delete', 'Cancel');
  
    const cancelButtonIndex = options.length - 1;
    if (message.user?._id == user_data.user_id) {
      context
        .actionSheet()
        .showActionSheetWithOptions(
          { options, cancelButtonIndex },
          async buttonIndex => {
            switch (buttonIndex) {
              case 0: // copy
                console.log('Get OnPress:::', buttonIndex, message.text);
                Clipboard.setString(message.text);
                ToastAndroid.show(message.text, ToastAndroid.SHORT);
                break;
  
              case 1: //reply
                setReply(message);
                break;
  
              case 2: // recall this message
                console.log('FIFTH', options[buttonIndex]);
  
                if (options[buttonIndex] === 'Delete') {
                  deleteMessage(
                    buttonIndex,
                    setMessages,
                    messages,
                    message,
                    user,
                  );
                  return;
                }
  
                if (!message?.sent) {
                  Alert.alert(
                    'Message can not be recalled.',
                    'This message has not been sent. you can not recall this message. try deleting it',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'DELETE',
                        onPress: () =>
                          deleteMessage(
                            buttonIndex,
                            setMessages,
                            messages,
                            message,
                            user,
                          ),
                      },
                    ],
                  );
  
                  return;
                }
  
                let recalledIndex = messages?.findIndex(m => {
                  return m.messageDocId === message.messageDocId;
                });
  
                console.log('recalledIndex', recalledIndex, message);
                let tempObject;
                if (recalledIndex >= 0) {
                  let msgArray = [...messages];
  
                  tempObject = msgArray[recalledIndex];
                  tempObject.text = 'This message has been recalled';
                  tempObject._id = `recalled-${message._id}`;
                  msgArray.splice(recalledIndex, 1, tempObject);
                  setMessages(m => msgArray);
                }
  
                // setMessages(messages =>
                //   messages.filter(m => m.messageDocId !== message.messageDocId),
                // );
  
                chat.collection('messages')
                  .doc(message.messageDocId)
                  .update(tempObject)
                  // .delete(1)
                  .catch(err => console.log(err));
  
                if (messages[0]._id === message._id) {
                  chat
                    .set(
                      {
                        [`lastmsg${message.user._id}`]:
                          messages.length > 1 ? messages[1].text : '',
                        [`lastuser${message.user._id}`]:
                          messages.length > 1
                            ? messages[1].user.name
                            : 'Recall all messages',
                        [`lastmsg${message.rcvr.id}`]:
                          messages.length > 1 ? messages[1].text : '',
                        [`lastuser${message.rcvr.id}`]:
                          messages.length > 1
                            ? messages[1].user.name
                            : 'Recall all messages',
                      },
                      { merge: true },
                    );
                }
                break;
              case 3: // delete message
                console.log('Get OnPress:::', buttonIndex);
                Alert.alert(
                  'Delete Message',
                  'Are you sure you want to delete this message?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'DELETE',
                      onPress: () =>
                        deleteMessage(
                          buttonIndex,
                          setMessages,
                          messages,
                          message,
                          user,
                        ),
                    },
                  ],
                );
                // deleteMessage(buttonIndex, setMessages, messages, message, user);
                break;
              case 4:
                console.log('Get OnPress:::', buttonIndex);
                break;
            }
          },
        );
    } else {
      context
        .actionSheet()
        .showActionSheetWithOptions(
          { options, cancelButtonIndex },
          async buttonIndex => {
            switch (buttonIndex) {
              case 0: // copy
                console.log('Get OnPress:::', buttonIndex, message.text);
                Clipboard.setString(message.text);
                ToastAndroid.show(message.text, ToastAndroid.SHORT);
                break;
  
              case 1: //reply
                setReply(message);
                break;
              case 2: // delete message
                console.log('Get OnPress:::', buttonIndex);
                Alert.alert(
                  'Delete Message',
                  'Are you sure you want to delete this message?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'DELETE',
                      onPress: () =>
                        deleteMessage(
                          buttonIndex,
                          setMessages,
                          messages,
                          message,
                          user,
                        ),
                    },
                  ],
                );
                // deleteMessage(buttonIndex, setMessages, messages, message, user);
                break;
              case 3:
                console.log('Get OnPress:::', buttonIndex);
                break;
            }
          },
        );
    }
  };

  const deleteMessage = (buttonIndex, setMessages, messages, message, user) => {
    console.log('INDEX line 178', buttonIndex);
    // if (message.user?._id !== user.id) return;
    setMessages(messages =>
      messages.filter(m => m.messageDocId !== message.messageDocId),
    );
    console.log('Firestore user Data:::::',message);
    if(user_data.user_id == message.user._id) {
      chat.collection('messages')
      .doc(message.messageDocId)
      .delete()
      .then(() => {
        console.log('User deleted!');
      });
    } else {
      chat.collection('messages')
      .doc(message.messageDocId)
      .set({ deletedFor: user.user_id}, { merge: true })
      .catch(err => {
        console.log("issue solved",err);
      });
    }
    
    if (messages[0]._id == message._id) {
      chat.set(
          {
            [`lastmsg${message.user._id}`]:
              messages.length > 1 ? messages[1].text : '',
            [`lastuser${message.user._id}`]:
              messages.length > 1 ? messages[1].user.name : '',
            // [`lastmsg${message.rcvr.id}`]: messages.length > 1 ? messages[0].text : null,
            // [`lastuser${message.rcvr.id}`]: messages.length > 1 ? messages[0].user.name : null,
          },
          { merge: true },
        );
    }
  };

  function Reply({ replyTo = 'a', replyMsg = 'a', setReply = () => { } }) {
    const dismiss = () => setReply(null);
    return (
      <View style={{ height: hp(8), flexDirection: 'row' }}>
        <View style={{ height: hp(8), width: 5, backgroundColor: 'red' }}></View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ color: 'red', paddingLeft: 10, paddingTop: 5 }}>
            {replyTo}
          </Text>
          <Text style={{ color: 'gray', paddingLeft: 10, paddingTop: 5 }}>
            {replyMsg}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            paddingRight: 10,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={dismiss}>
            <MaterialIcons
              name="close"
              size={15}
              color="#0084ff"
              style={{
                padding: 5,
                borderRadius: 100,
                backgroundColor: COLORS.gray,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const onLongPress = makeLongPress(
    user_data,
    messages,
    setMessages,
    setReply,
    navigation,
    setIsReload,
  );

  const toggleDeleteModel = (selectedPostId) => {
    setDeleteModel((prevVisible) => !prevVisible)
  }

  const convertTimestampToHumanReadable = (timestamp) => {
    const now = new Date();
    const lastSeen = new Date(timestamp * 1000); // Convert seconds to milliseconds

    const timeDifference = now - lastSeen;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44); // Average number of days in a month
    const years = Math.floor(days / 365.25); // Average number of days in a year

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 30) {
      return `${days} days ago`;
    } else if (months < 12) {
      return `${months} months ago`;
    } else {
      return `${years} years ago`;
    }
  };


  useEffect(() => {
    fetchMessages()
    // fetchPageMessages('fetch')
    // fetchGroupMessages('fetch_messages')
    // fetchMediaMessages('get_media')
  }, [])

  const fetchMediaMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('recipient_id', UserData.user_id);
        formData.append('server_key', serverkey);
        formData.append('type', 'get_media');
        formData.append('media_type', 'images,videos,audio,links,docs');

        if (UserData.user_id) {
          formData.append('user_id', UserData.user_id);
        } else if (pageData.page_id) {
          formData.append('page_id', pageData.page_id);
        } else if (groupData.group_id) {
          formData.append('group_id', groupData.group_id);
        }

        const response = await getChatMedia(formData, token)
        if (response.data.api_status === 200) {
          setMessagesMedia(response.data.messages)
          console.log('this is the User messages media', response.data)
        } else if (response.data.api_status === 400 || response.data.api_status === 404) {
          console.log('Error fetching profile data', response.data);
          // Handle error scenario or navigation accordingly
        }
      } else {
        console.log('user token  not found', error.message)
      }
    } catch (error) {
      console.log('Get Error:', error)
    }
  }
  const chatsRef = chat.collection(`messages`);
  const fetchMessages = async () => {
    try {
      const subscribe = chatsRef.onSnapshot(querySnapshot => {
        const messagesFirestore = querySnapshot
          .docChanges()
          .filter(({ type }) => type === 'added')
          .map(({ doc }) => {
            const message = doc.data();
  
            return {
              ...message,
              messageDocId: doc.id,
              createdAt: message?.createdAt?.toDate(),
              received: message?.user?.id != user_data.user_id,
            };
          })
          .sort((a, b) => b?.createdAt?.getTime() - a?.createdAt?.getTime())
          .filter(msg => {
            if (msg?.deletedFor) {
              return !msg?.deletedFor?.includes(user_data.user_id);
            }
  
            return true;
          });
        appendMessages(messagesFirestore);
      });
    } catch (error) {
      console.log('Get Error:', error)
    }
  }

  const renderReply = () =>
    reply && (
      <Reply
        setReply={setReply}
        replyMsg={reply?.text}
        replyTo={reply?.user?.name}
      />
    );

  const appendMessages = useCallback(
    messages => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        )
    },
    [messages, handleSend],
  );

  // const fetchPageMessages = async (type) => {
  //   try {
  //     const token = await AsyncStorage.getItem('access_token');
  //     if (token) {
  //       const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
  //       const formData = new FormData();
  //       formData.append('type', type);
  //       formData.append('page_id', pageData.page_id);
  //       formData.append('recipient_id', pageData.user_id);

  //       if (type === 'send') {
  //         formData.append('text', 'text');
  //         formData.append('message_hash_id', '');
  //         formData.append('file', 'file');
  //         formData.append('gif', 'gif');
  //         formData.append('image_url', 'image_url');
  //         formData.append('lng', 'lng');
  //         formData.append('lat', 'lat');
  //       }

  //       formData.append('server_key', serverkey);

  //       const response = await getPageMessages(formData, token)
  //       if (response.data.api_status === 200) {
  //         setPageMessages(response.data.data)
  //         console.log('this is the page messages Data', response.data)
  //       } else if (response.data.api_status === 400 || response.data.api_status === 404) {
  //         console.log('Error fetching profile data', response.data);
  //         // Handle error scenario or navigation accordingly
  //       }
  //     } else {
  //       console.log('user token  not found', error.message)
  //     }
  //   } catch (error) {
  //     console.log('Get Error:', error)
  //   }
  // }

  // const fetchGroupMessages = async (type) => {
  //   try {
  //     const token = await AsyncStorage.getItem('access_token');
  //     if (token) {
  //       const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
  //       const formData = new FormData();
  //       formData.append('type', type);
  //       formData.append('id', groupData.group_id);

  //       if (type === 'send') {
  //         formData.append('text', 'text');
  //         formData.append('image_url', 'image_url');
  //         formData.append('sticker_id', 'sticker_id');
  //         formData.append('gif', 'gif');
  //         formData.append('file', 'file');
  //         formData.append('message_hash_id', '');

  //         formData.append('gif', 'gif');
  //         formData.append('lng', 'lng');
  //         formData.append('lat', 'lat');
  //       }
  //       formData.append('server_key', serverkey);

  //       const response = await getGroupeMessages(formData, token)
  //       if (response.data.api_status === 200) {
  //         setGroupMessages(response.data.messages)
  //         console.log('this is the group messages Data', response.data)
  //       } else if (response.data.api_status === 400 || response.data.api_status === 404) {
  //         console.log('Error fetching profile data', response.data);
  //         // Handle error scenario or navigation accordingly
  //       }
  //     } else {
  //       console.log('user token  not found', error.message)
  //     }
  //   } catch (error) {
  //     console.log('Get Error:', error)
  //   }
  // }

  // const sendUserMessage = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('access_token');
  //     if (token) {
  //       const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
  //       const formData = new FormData();
  //       formData.append('user_id', UserData.user_id);
  //       formData.append('message_hash_id', '');
  //       formData.append('text', 'text');
  //       formData.append('file', 'file');
  //       formData.append('image_url', 'image_url');
  //       formData.append('server_key', serverkey);

  //       const response = await onSendUserMessages(formData, token)
  //       if (response.data.api_status === 200) {
  //         setMessages(response.data.message_data)
        
          
  //         console.log('this is the User messages Data', response.data)
  //       } else if (response.data.api_status === 400 || response.data.api_status === 404) {
  //         console.log('Error fetching profile data', response.data);
  //         // Handle error scenario or navigation accordingly
  //       }
  //     } else {
  //       console.log('user token  not found', error.message)
  //     }
  //   } catch (error) {
  //     console.log('Get Error:', error)
  //   }
  // }

  const deleteConversation = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('delete_type', 'all');
        formData.append('server_key', serverkey);

        const response = await DeleteUserMessages(formData, token)
        if (response.data.api_status === 200) {
          setDeleteModel(false)
          setMessages([]);
          console.log('this is the User messages Data', response.data)
        } else if (response.data.api_status === 400 || response.data.api_status === 404) {
          setDeleteModel(false)
          console.log('Error fetching profile data', response.data);
          // Handle error scenario or navigation accordingly
        }
      } else {
        setDeleteModel(false)
        console.log('User token not found', error.message)
      }
    } catch (error) {
      setDeleteModel(false)
      console.log('Get Error::', error)
    }
  }

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',

  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar:
  //           'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
  //       },
  //     },
  //   ]);
  // }, []);

  const handleSend = async (newMessages) => {
    // setMessages(previousMessages =>
    //   GiftedChat.append(previousMessages, newMessages),
    // );
    console.log('get Message>>>>>>', newMessages, reply);
    if (newMessages?.length && reply) {
     Object.assign(newMessages[0], { reply });
     setReply(null);
   }

    let userDataToken = '';
    if (receiver.id == user_data.user_id) {
     usersList.map(item => {
      if (item.user_id == sender.id) {
        userDataToken = item.fcm_token
      }
    });
   } else {
    usersList.map(item => {
      if (item.user_id == receiver.id) {
        userDataToken = item.fcm_token
      }
    });
   }
    
    if (receiver.id == user_data.user_id) {
      const writes = newMessages.map(
        async m =>
          await chat.collection(`messages`).add({ ...m, receiver: sender }).then(doc => doc.update('sent', true)),
      );
    } else {
      const writes = newMessages.map(
        async m =>
          await chat.collection(`messages`).add({ ...m, receiver }).then(doc => doc.update('sent', true)),
      );
    }
    const res = userDataToken.replace(/ /g, '')
      const lastchat = newMessages[0];
      if (lastchat) {
        chat.update({
          date: new Date(lastchat.createdAt).getTime(),
          lastMessage: lastchat.text,
          lastSender: user_data.user_id,
          lastTime: lastchat.createdAt,
        });
        console.log('Get Push Token:::', res);
        sendPushNotification(
          res,
          user_data.name,
          lastchat.text,
        );
      }
    
  };


  // const handleSend = () => {
  //   if (inputText.trim() === '') {
  //     return;
  //   }
  //   onSend([
  //     {
  //       _id: Math.round(Math.random() * 1000000).toString(),
  //       text: inputText,
  //       createdAt: new Date(),
  //       user: {
  //         id: user_data.user_id,
  //         name: user_data.name,
  //         profilePic: user_data.avatar
  //       },
  //     },
  //   ]);
  //   setInputText('');
  // };

  const renderBubble = (props) => {
    const { currentMessage } = props;
    const isCurrentUser = currentMessage.user._id === user_data.user_id;
    // Check the type of the message
    const isMyMessage = currentMessage.type === 'added';
    const message_sender_id = props.currentMessage.user._id;
    const seen =
      props.currentMessage.seenBy &&
      props.currentMessage.seenBy.includes(props?.currentMessage?.receiver?.id);
    
      // const local = date =>
      //   date.toLocaleTimeString().split(':').slice(0, 2).join(':');
      const local = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
      
        const adjustedHours = hours % 12 || 12; // Adjusts hours from 24-hour format to 12-hour format
        const strMinutes = minutes < 10 ? '0' + minutes : minutes;
      
        return `${adjustedHours}:${strMinutes} ${ampm}`;
      };

    const me = props.currentMessage.user._id == user_data.user_id;
    let isRecalled =
      props?.currentMessage.text === 'This message has been recalled';
    console.log('get Sender Id>>>',  user_data.user_id, message_sender_id)

    if (isRecalled && me) {
      return (
        <Text
          style={{
            fontSize: 16,
            color: '#000',
            borderRadius: 8,
            marginBottom: 4,
            paddingVertical: 4,
            fontStyle: 'italic',
            paddingHorizontal: 12,
            backgroundColor: 'lightgray',
          }}>
          This message has been recalled
        </Text>
      );
    } else if (isRecalled) {
      return null;
    }

    return (
      <View style={{ marginBottom: hp(1), paddingHorizontal: wp(2) }}>
      
          {props.currentMessage.reply ? (
            <>
                <View style={user_data.user_id == message_sender_id ? {
                    opacity: 0.7,
                    borderWidth: 1,
                    height: hp(11),
                    alignSelf: 'flex-end',
                    borderRadius: 7,
                    justifyContent: 'space-between',
                    borderColor: COLORS.gray,
                    backgroundColor: COLORS.gray,
                    paddingHorizontal: wp(2),
                    } : 
                    {
                    opacity: 0.7,
                    borderWidth: 1,         
                    height: hp(11),
                    alignSelf: 'flex-start',
                    borderRadius: 7,
                    justifyContent: 'space-between',
                    borderColor: COLORS.red,
                    backgroundColor: COLORS.red,
                    paddingHorizontal: wp(2),
                  }}>
                    <View style={{
                      backgroundColor: user_data.user_id == message_sender_id ? COLORS.white : COLORS.red,
                      height: hp(6),
                      paddingHorizontal: wp(2),
                      borderLeftWidth:2,
                      borderLeftColor: user_data.user_id == message_sender_id ? COLORS.greenColor : COLORS.white,
                    }}>
                    <Text style={{
                      fontSize: hp(1.9),
                      fontFamily: fontFamily.FONTS.bold,
                      color: user_data.user_id == message_sender_id ? COLORS.black : COLORS.white,
                      
                    }}>{props.currentMessage.user.name} </Text>
                    <Text style={{
                      fontSize: hp(1.75),
                      fontFamily: fontFamily.FONTS.regular,
                      color: user_data.user_id == message_sender_id ? COLORS.black : COLORS.white,
                      marginLeft: wp(2),
                      marginTop: hp(0.5)
                    }}>{props.currentMessage.reply.text} </Text>
                    </View>
                    <View style={{
                      minHeight: hp(5),
                      justifyContent: 'center'
                    }}>
                    <Text style={{
                      fontSize: hp(2),
                      fontFamily: fontFamily.FONTS.regular,
                      color: user_data.user_id == message_sender_id ? COLORS.black : COLORS.white
                      }}>{props.currentMessage.text} </Text>
                      {/* <Text
                        style={{
                          fontSize: hp(1.6),
                          fontFamily: fontFamily.FONTS.Medium,
                          color: COLORS.black,
                          marginTop: hp(0.5),
                          // textAlign:'right',
                          textAlign:
                            props.currentMessage.user._id == user_data.user_id
                              ? 'right'
                              : 'left',
                          includeFontPadding: false,
                          // textAlignVertical: 'center',
                        }}>
                        {local(props.currentMessage.createdAt)}
                      </Text> */}
                    </View>
                    
                </View>
                <Text
                        style={{
                          fontSize: hp(1.4),
                          fontFamily: fontFamily.FONTS.regular,
                          color: COLORS.black,
                          marginTop: hp(0.5),
                          // textAlign:'right',
                          textAlign:
                            props.currentMessage.user._id == user_data.user_id
                              ? 'right'
                              : 'left',
                          includeFontPadding: false,
                          // textAlignVertical: 'center',
                        }}>
                        {local(props.currentMessage.createdAt)}
                      </Text>
              {/* <Bubble
                {...props}
                currentMessage={props.currentMessage.reply}
                textStyle={{
                  right: {
                    fontSize: hp(1.75),
                    fontFamily: fontFamily.FONTS.regular,
                    color: COLORS.white,
                    // padding: hp(1),
                  },
                  left: {
                    fontSize: hp(1.75),
                    fontFamily: fontFamily.FONTS.regular,
                    color: COLORS.white,
                    // padding: hp(1),
                  },
                }}
                
                wrapperStyle={{
                  right: {
                    opacity: 0.7,
                    borderWidth: 1,
                    marginRight: -9,  
                    marginBottom: -25,
                    height: hp(9),
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    justifyContent: 'space-between',
                    borderColor: COLORS.primary,
                    backgroundColor: COLORS.primary,
                  },
                  left: {
                    opacity: 0.7,
                    borderWidth: 1,
                    marginBottom: -25,
                    height: hp(9),
                    alignItems: 'center',
                    flexDirection: 'row',
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    justifyContent: 'space-between',
                    borderColor: COLORS.secondary2,
                    backgroundColor: COLORS.secondary2,
                  },
                }}
              /> */}
            {/* </Text> */}
            {/* <View style={{ justifyContent: 'center' }}>
          <Bubble
            {...props}
            tickStyle={{}}
            position={user_data.user_id == message_sender_id ? 'right' : 'left'}
            textStyle={{
              right: {
                fontSize: hp(1.8),
                fontFamily: fontFamily.FONTS.Medium,
                color: COLORS.black,
              },
              left: {
                fontSize: hp(1.8),
                fontFamily: fontFamily.FONTS.Medium,
                color: COLORS.white,
              },
            }}
            wrapperStyle={{
              left: {
                // Style for left bubble
                backgroundColor: COLORS.red,
              },
              right: {
                // Style for right bubble
                backgroundColor: COLORS.gray,
              },
            }}
          />
          </View> */}
          </>
          ) : (
            <View style={{ justifyContent: 'center' }}>
          <Bubble
            {...props}
            position={user_data.user_id == message_sender_id ? 'right' : 'left'}
            textStyle={{
              right: {
                fontSize: hp(1.9),
                fontFamily: fontFamily.FONTS.Medium,
                color: COLORS.black,
              },
              left: {
                fontSize: hp(1.9),
                fontFamily: fontFamily.FONTS.Medium,
                color: COLORS.white,
              },
            }}
            wrapperStyle={{
              left: {
                // Style for left bubble
                backgroundColor: COLORS.red,
                height: hp(5),
                minWidth: wp(15),
                justifyContent: 'center',
                borderRadius: 7,
              },
              right: {
                // Style for right bubble
                backgroundColor: COLORS.gray,
                height: hp(5),
                minWidth: wp(15),
                borderRadius: 7,
                justifyContent: 'center'
              },
            }}
          />
          </View>
          )}
        
        {/* <View style={{ justifyContent: 'center' }}>
          <Bubble
            {...props}
            tickStyle={{}}
            position={user_data.user_id == message_sender_id ? 'right' : 'left'}
            textStyle={{
              right: {
                fontSize: hp(1.8),
                fontFamily: fontFamily.FONTS.Medium,
                color: COLORS.black,
              },
              left: {
                fontSize: hp(1.8),
                fontFamily: fontFamily.FONTS.Medium,
                color: COLORS.white,
              },
            }}
            wrapperStyle={{
              left: {
                // Style for left bubble
                backgroundColor: COLORS.red,
              },
              right: {
                // Style for right bubble
                backgroundColor: COLORS.gray,
              },
            }}
          />
          </View> */}
        </View>
    );
  };

  // const renderInputToolbar = (props) => {
  //   return (
  //     <View style={styles.inputToolbarContainer}>
  //       {showAttachment && (
  //         <View style={styles.attachmentContainer}>
  //           <View style={styles.attachmentView}>
  //             {/* <GalleryIcon /> */}
  //             <Text style={styles.attachmentText}>Gallery</Text>
  //           </View>
  //           <View style={styles.attachmentView}>
  //             {/* <VideoIcon /> */}
  //             <Text style={styles.attachmentText}>Video</Text>
  //           </View>
  //           <View style={styles.attachmentView}>
  //             {/* <FileIcon /> */}
  //             <Text style={styles.attachmentText}>File</Text>
  //           </View>
  //           <View style={styles.attachmentView}>
  //             {/* <CameraIcon /> */}
  //             <Text style={styles.attachmentText}>Camera</Text>
  //           </View>
  //         </View>
  //       )}
  //       <TouchableOpacity onPress={() => console.log('Emoji button pressed')}>
  //         <View style={styles.iconContainer}>
  //           {/* <EmojiIcon /> */}
  //         </View>
  //       </TouchableOpacity>
  //       <View style={styles.textInputContainer}>
  //         <TextInput
  //           placeholder="Write your text here"
  //           style={styles.textInput}
  //           placeholderTextColor={'white'}
  //           keyboardType="default"
  //           returnKeyType="done"
  //           onSubmitEditing={handleSend}
  //           value={inputText}
  //           onChangeText={text => setInputText(text)}
  //         />
  //       </View>
  //       <TouchableOpacity onPress={() => setShowAttachment(!showAttachment)}>
  //         <View style={styles.iconContainer}>
  //           {/* <AttachmentIcon /> */}
  //           <MaterialIcons size={30} color={'tomato'} name={'send'} />

  //         </View>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          marginBottom: hp(0.5)
        }}
        primaryStyle={{ justifyContent: 'center' }}
      >
        <Composer
          {...props}
          textInputStyle={{
            backgroundColor: COLORS.black,
            color: COLORS.secondaryBlack,
            borderRadius: 1,
            borderWidth: 1,
            borderColor: COLORS.gray,
            marginRight: 6,
          }}
        />
        <Send {...props} />
        {/* <renderActions props={props} /> */}
      </InputToolbar>
    );
  };

  const uploadMedia = (uri, sender, msgFunc) => {
    console.log('Get DFATA::::::', uri);
    if (uri) {
      console.log('Get DFATA::::::', uri);
      // toggleProgress(true);
      const uploadTask = storage()
        .ref()
        .child(`/media/${uuid.v4()}`)
        .putFile(uri);
      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress = snapshot.bytesTransferred / snapshot.totalBytes;
          // setProgress(progress);
        },
        error => {
          console.error('error uploading image', error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('Get URL:::', downloadURL);
            // toggleProgress(false);
            let userDataToken = '';
            if (receiver.id == user_data.user_id) {
              usersList.map(item => {
                if (item.user_id == sender.id) {
                  userDataToken = item.fcm_token
                }
              });
            } else {
              usersList.map(item => {
                if (item.user_id == receiver.id) {
                  userDataToken = item.fcm_token
                }
              });
            }
            const res = userDataToken.replace(/ /g, '');
            sendPushNotification(
              res,
              user_data.name,
              'sent photo in chat.',
            );
            sender(msgFunc(downloadURL));
          });
        },
      );
    }
  }

  const openImagePicker = async (sender) => {
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
        uploadMedia(
          image.path,
          sender,
          downloadURL => ({
            text: '',
            ['image']: downloadURL,
          }),
        );
        // Process the selected image data as needed
        console.log("Selected image:", image);
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const renderTicks = (currentMessage, user) => {
    if (currentMessage) {
      const seen =
        currentMessage?.seenBy &&
        currentMessage?.seenBy?.includes(currentMessage.receiver?.id);
  
      const me = user
        ? currentMessage.user._id == user_data.user_id
        : currentMessage.user._id != (currentMessage.receiver?.id || 0);
  
      let isRecalled = currentMessage.text === 'This message has been recalled';
      return (
        <View key={currentMessage?._id}>
          {seen && me && (
            <MaterialIcons
              name={'check-all'}
              color={COLORS.green}
              size={hp(2)}
              style={{ marginLeft: wp(10) }}
            />
          )}
          {!seen && me && currentMessage?.sent && (
            <MaterialIcons
              name={'check'}
              color={COLORS.green}
              size={hp(2)}
              // style={{ marginLeft: wp(10) }}
            />
          )}
        </View>
      );
    }
    return null;
  };

  const CustomActions = (props) => {
    const { onSend } = props;
    return (
      <FontAwesome name="camera" size={24} color="black" onPress={() => openImagePicker(onSend)} />
    );
  };

  const renderActions = (props) => {
    const { onSend } = props;
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', height: hp(5.5), marginLeft: wp(2)}}>
        <FontAwesome name="camera" size={22} color="black" onPress={() => openImagePicker(onSend)} />
      </View>  
      );
    // return (
    //   <Actions
    //     {...props}

    //     icon={() => (
    //       <FontAwesome name="camera" size={24} color="black" onPress={() => openImagePicker(onSend)} />
    //     )}
    //   />
    // );
    
    }


  const renderSystemMessage = useCallback(props => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: hp(2),
        }}
        textStyle={{
          fontSize: hp(2.2),
        }}
      />
    )
  }, [])

  const renderSend = useCallback((props) => {
    return (
      <Send {...props} containerStyle={{ justifyContent: 'center', marginHorizontal: wp(1) }}>
        <MaterialIcons size={26} color={'tomato'} name={'send'} />
      </Send>
    )
  }, [])

  return (
    <View style={styles.container}>
      {/**    <View style={styles.headerView}>
        <BasicHeader onPress={() => navigation.goBack()} title={'Chat Screen'} />
      </View> */}
      <View
        style={{
          flex: 0.08,
          width: '100%',
          // justifyContent: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          backgroundColor: COLORS.white,
          // marginBottom: hp(1),
          height: hp(7),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()} title={'Chat Screen'}
            style={{ marginLeft: wp(-1) }}
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={hp(4)}
              style={{ color: COLORS.darkgray1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            if (receiver.id == user_data.user_id) {
              navigation.navigate('UserProfile', { UserId: sender.id });
            } else {
              navigation.navigate('UserProfile', { UserId: receiver.id });
            }
          }}>
            <Image
              source={{
                uri: receiver.id == user_data.user_id ? sender.profilePic : receiver.profilePic,
              }}
              resizeMode="contain"
              style={{
                height: wp(10),
                width: wp(10),
                borderRadius: wp(10),
                marginLeft: wp(1),
              }}
            />
          </TouchableOpacity>
          <View style={{ marginHorizontal: wp(2) }}>
            <TouchableOpacity onPress={() => {
              if (receiver.id == user_data.user_id) {
                navigation.navigate('UserProfile', { UserId: sender.id });
              } else {
                navigation.navigate('UserProfile', { UserId: receiver.id });
              }
            }}>
              <Text style={{ color: COLORS.black, fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.2) }}>
                {receiver.id == user_data.user_id ? sender.name : receiver.name}
              </Text>
            </TouchableOpacity>
            {/* <Text style={{ color: COLORS.darkgray1, fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.7) }}>
              {convertTimestampToHumanReadable(UserData ? UserData.lastseen : groupData ? groupData.chat_time : '')}
            </Text> */}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/** <TouchableOpacity>
            <Ionicons name="search-sharp" size={hp(3)} color={COLORS.darkgray1} />
          </TouchableOpacity>  */}

          {/* <TouchableOpacity onPress={toggleDeleteModel} >
            <AntDesign name="delete" size={hp(3)} color={COLORS.darkgray1} />
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={styles.secondView}>
        <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={{
            _id: user_data.user_id,
            name: user_data.name,
            avatar: user_data.avatar
          }}
          showUserAvatar={true}
          renderAvatar={null}
          // renderActions={renderActions}
          renderSystemMessage={renderSystemMessage}
          alwaysShowSend
          renderInputToolbar={renderInputToolbar}
          renderMessage={renderBubble}
          // renderBubble={renderBubble}
          renderSend={renderSend}
          renderTicks={renderTicks}
          onLongPress={onLongPress}
          renderChatFooter={renderReply}
          keyboardShouldPersistTaps="never"
          scrollToBottom
          textInputStyle={{
            width: '80%',
            borderRadius: wp(4),
            borderWidth: 0.5,
            borderColor: COLORS.gray,
            marginRight: wp(1),
            paddingHorizontal: wp(3),
            backgroundColor: COLORS.white,
            color: COLORS.black,
          }}
          timeTextStyle={{ left: { color: COLORS.secondaryBlack }, right: { color: COLORS.secondaryBlack } }}
          style={{ backgroundColor: COLORS.secondaryBlack }}
        // renderMessage={renderMessage}
        />
      </View>

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
                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.black }}>Clear Chat?</Text>
              </View>
              <TouchableOpacity onPress={toggleDeleteModel}>
                <Entypo name="cross" size={18} color={COLORS.darkgray} />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 4, marginVertical: hp(2) }}>
              <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.3), textAlign: 'justify' }}> Are you sure that you want to delete this Chat ?</Text>
              <View style={{ flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={{
                  backgroundColor: '#f7e5e5',
                  borderRadius: 10,
                  // padding: 3,
                  height: hp(4.5),
                  width: wp(25),
                  justifyContent: 'center',
                  alignItems: 'center',
                }} onPress={() => deleteConversation(UserData.user_id)}  >
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



  );
};

export default ChatScreen;
