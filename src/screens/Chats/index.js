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
    SafeAreaView
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from '../ChatScreen/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import BasicHeader from '../../components/BasicHeader';
import { GiftedChat, IMessage, Send, Bubble, SystemMessage } from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeleteUserMessages, UserMessages, getChatMedia, getGroupeMessages, getPageMessages, onGetManyUser } from '../../Service/Api';
import { COLORS } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
import { Loader } from '../../components/Loader';
import search from '../../../assets/image/img/bottombar/search.png'
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const Chats = () => {
    const navigation = useNavigation();
    const followers = useSelector(state => state.followers);
    const user_data = useSelector(state => state.user_data);
    // console.log('followers', followers)
    const [userList, setUserList] = useState([])
    const [pageList, setPageList] = useState([])
    const [loading, setLoading] = useState(false)
    const [groupList, setGroupList] = useState([])
    const [selectedOption, setSelectedOption] = useState('users')
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPageList, setFilteredPageList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredGroupList, setFilteredGroupList] = useState([]);
    const [modelVisible, setModelVisible] = useState(false)
    const [searchUserVisible, setSearchUserVisible] = useState(false);
    const [searchList, setSearchList] = useState([])

    const toggelModel = () => {
        setModelVisible((prevVisible) => !prevVisible)
        // console.log('this is the selcted post id', postId)
    }

    // Function to handle the selection of the tab and update the selectedOption state
    const handleTabSelection = (option) => {
        setSelectedOption(option);
        setSearchQuery('')
    };

    useEffect(() => {
        const subscribe = navigation.addListener('focus', () => {
            fetchUserList();
        })
        
        // fetchGroupMessages();
        return subscribe;
    }, []);


    const fetchUserList = async () => {
        try {
            let arrayValue = [];
            setLoading(true)
                await firestore()
                .collection('marketChat')
                .orderBy('lastTime', 'desc')
                .onSnapshot(snapshot => {
                    snapshot.docs
                  .map(doc => {
                    
                    if (doc.id.split('-').includes(user_data.user_id)) {
                        console.log('Get DatAAAA:::', doc._data)
                        arrayValue.push(doc._data)
                        // filteredUsers.push(doc._data)
                        // userList.push(doc._data)
                    }
                    
                    })
                    setFilteredUsers(arrayValue)
                    setUserList(arrayValue);
                    console.log('This is the user list', arrayValue);
                    setLoading(false)
                })
            // const token = await AsyncStorage.getItem('access_token');
            // if (token && followers && Array.isArray(followers) && followers.length > 0) {
            //     const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
            //     const user_ids = followers.map(user => user.id).join(','); // Use map to extract ids
            //     const formData = new FormData();
            //     formData.append('user_ids', user_ids);
            //     console.log('user ids', user_ids)
            //     formData.append('server_key', serverkey);

            //     const response = await onGetManyUser(formData, token);
            //     // console.log('API Response:', response.data.users);

            //     if (response.data.status === 200) {
            //         setFilteredUsers(response.data.users)
            //         setUserList(response.data.users);
            //         console.log('This is the user list', response.data.users);
            //     } else {
            //         // setUserList(response.data.users);
            //         console.log('Error fetching profile data', response.data);
            //         // Handle error scenario or navigation accordingly
            //     }

            // } else {
            //     console.log('user token  not found', error.message)
            // }
        } catch (error) {
            setLoading(false)
            console.log('Get Error:', error)
        }
    }

    // const fetchPageMessages = async () => {
    //     try {
    //         await firestore()
    //         .collection('marketChat')
    //         .orderBy('lastTime', 'desc')
    //         .onSnapshot(snapshot => {
    //             snapshot.docs
    //           .map(doc => {
    //             console.log('Get DatAAAA:::', doc.id.split('-').includes(user_data.user_id))
    //             if (doc.id.split('|').includes(user_data.user_id)) {
    //             }
    //             })
    //         })
    //     } catch (error) {
    //         console.log('Get Error:', error)
    //     }
    // }

    // const fetchGroupMessages = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem('access_token');
    //         if (token) {
    //             const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
    //             const formData = new FormData();
    //             formData.append('type', 'get_list');

    //             formData.append('server_key', serverkey)
    //             const response = await getGroupeMessages(formData, token)
    //             if (response.data.api_status === 200) {
    //                 setFilteredGroupList(response.data.data)
    //                 setGroupList(response.data.data)
    //                 console.log('this is the group list', response.data)
    //             } else if (response.data.api_status === 400 || response.data.api_status === 404) {
    //                 console.log('Error fetching profile data', response.data);
    //             }
    //         } else {
    //             console.log('user token  not found', error.message)
    //         }
    //     } catch (error) {
    //         console.log('Get Error:', error)
    //     }
    // }

    // const handleSearch = useCallback(() => {
    //     const filteredPage = pageList.filter(
    //         (item) =>
    //             item.page_title.toLowerCase().includes(searchQuery.toLowerCase())
    //     );
    //     setFilteredPageList(filteredPage);

    //     const filteredGroup = groupList.filter(
    //         (item) =>
    //             item.group_title.toLowerCase().includes(searchQuery.toLowerCase())
    //     );
    //     setFilteredGroupList(filteredGroup);
    // }, [searchQuery, pageList, groupList,]);

const handleSearch =async(text)=>{

    setSearchQuery(text)
    setSearchUserVisible(true)
        if(text!=''){
            const filteredGroup = followers.filter(
                (item) =>
                    item.username.toLowerCase().includes(text.toLowerCase())
            );
            
            setSearchList(filteredGroup);
        }
        else{
            setSearchUserVisible(false);
            setSearchList([])
        }
   
}

const onSubmitChat = async (item) => {
    console.log('get gata:::', item);
    navigation.navigate('ChatScreen', {
        receiver: item.receiver,
        sender: item.sender
    });
    // try {
    //     await firestore()
    //     .collection('marketChat')
    //     .doc(`${item.receiver.id}-${user_data.user_id}`)
    //     .set({
    //         sender: {
    //             id: user_data.user_id,
    //             name: user_data.name,
    //             profilePic: user_data.avatar
    //         },
    //         receiver: {
    //             id: item.receiver.id,
    //             name: item.receiver.name,
    //             profilePic: item.receiver.profilePic
    //         },
    //         lastMessage: 'Hello',
    //         lastTime: new Date(),
    //     })
    //     .then(() => {
    //         navigation.navigate('ChatScreen', {
    //             UserData: item
    //         });
    //     })
    // } catch (err) {
    //     console.log("Error ::", err);
    // }
}

const onMessagePress = async (item) => {
    try {
    await firestore()
    .collection('marketChat')
    .doc(`${item.user_id}-${user_data.user_id}`)
    .set({
        sender: {
            id: user_data.user_id,
            name: user_data.name,
            profilePic: user_data.avatar
        },
        receiver: {
            id: item.user_id,
            name: item.username,
            profilePic: item.avatar
        }
    })
    .then(() => {
        // navigation.navigate('ChatScreen', {
        //     UserData: item

        // });
        navigation.navigate('ChatScreen', {
            receiver: {
                id: item.user_id,
                name: item.username,
                profilePic: item.avatar
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
    
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{backgroundColor:COLORS.white}}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Chats'} />
                </View>
                <View style={{
                    container: {
                        flex: 1,
                        width: '100%',
                        alignSelf: 'center',
                        backgroundColor:COLORS.white
                    },
                }}>
                    {/* user/ group list */}
                    <View style={{ padding: hp(1), alignItems: 'center', backgroundColor: COLORS.white }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                width: '98%',
                                height: hp(5),
                                backgroundColor: COLORS.box,
                                borderRadius: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: wp(2),
                                justifyContent: 'space-between'
                            }}>
                                <Ionicons name="search-sharp" size={hp(3)} color={COLORS.darkgray1} />
                                <TextInput
                                    placeholder='Search'
                                    placeholderTextColor={COLORS.secondaryGray}
                                    style={{
                                        width: '90%',
                                        color: COLORS.black,
                                        fontSize:hp(1.8),
                                        fontFamily:fontFamily.FONTS.Medium
                                    }}
                                value={searchQuery}
                                onChangeText={handleSearch}
                                />
                            </View>
                            {/* <View style={{ marginHorizontal: wp(1), }}>
                                <TouchableOpacity style={{ padding: wp(2), backgroundColor: COLORS.red, flexDirection: 'row', alignItems: 'center', borderRadius: wp(2) }}>
                                    <MaterialCommunityIcons name="format-list-group" size={hp(3)} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginHorizontal: wp(1), }}>
                                <TouchableOpacity style={{ padding: wp(2), backgroundColor: COLORS.red, flexDirection: 'row', alignItems: 'center', borderRadius: wp(2) }} onPress={toggelModel}>
                                    <MaterialIcons name="group-add" size={hp(3)} color={COLORS.white} />
                                </TouchableOpacity>
                            </View> */}
                        </View>

                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(2), paddingHorizontal: wp(2), backgroundColor: COLORS.white, marginHorizontal: wp(2), borderRadius: wp(2), justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{
                                marginHorizontal: wp(2.4),
                                backgroundColor: selectedOption === 'users' ? '#f7e5e5' : COLORS.white,
                                alignItems: "center",
                                justifyContent: 'center',
                                height: hp(5),
                                width: '50%',
                                borderRadius: wp(2)
                            }} onPress={() => handleTabSelection('users')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons name="group" size={22} color={selectedOption === 'users' ? COLORS.red : COLORS.darkgray1} />
                                    <Text style={{ paddingHorizontal: wp(2.2), fontSize: hp(2.2), color: selectedOption === 'users' ? COLORS.red : COLORS.darkgray1 }}>Users</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                marginHorizontal: wp(2.4),
                                backgroundColor: selectedOption === 'groups' ? '#f7e5e5' : COLORS.white,
                                alignItems: "center",
                                justifyContent: 'center',
                                height: hp(5),
                                width: '50%',
                                borderRadius: wp(2)
                            }} onPress={() => handleTabSelection('groups')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="select-group" size={22} color={selectedOption === 'groups' ? COLORS.red : COLORS.darkgray1} />
                                    <Text style={{ paddingHorizontal: wp(2.2), fontSize: hp(2.2), color: selectedOption === 'groups' ? COLORS.red : COLORS.darkgray1 }}>Groups</Text>
                                </View>
                            </TouchableOpacity>

                        </View> */}
                    </View>

                    <View style={{backgroundColor:COLORS.white}}>
                        {selectedOption === 'users' && (
                            loading ? (
                                <View style={{ marginVertical: hp(20) }}>
                                    <Loader isLoading={loading} />
                                </View>
                            ) : (
                                searchUserVisible ? (
                                <FlatList   
                                    data={searchList}
                                    renderItem={({ item }) =>{
                                        return (
                                            <View >
                                                <TouchableOpacity
                                                    onPress={() => onMessagePress(item)}
                                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                                    <View style={{ 
                                                        paddingVertical: hp(1.5), 
                                                        width: '100%', 
                                                        flexDirection: 'row', 
                                                        alignItems: 'center',
                                                        borderBottomWidth:1,
                                                        borderBottomColor:COLORS.gray,
                                                        backgroundColor:COLORS.white,
                                                        paddingHorizontal: wp(4),
                                                        padding:hp(1)
                                                        }}>
                                                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.user_id })}>
                                                        <Image source={{ uri: item.avatar }} style={{ height: wp(10), width: wp(10), borderRadius: wp(10) }} />
                                                        </TouchableOpacity>
                                                        <View
                                                            style={{ paddingHorizontal: wp(2) }}>
                                                            <Text style={{
                                                                paddingHorizontal: 5,
                                                                fontSize: hp(2.2),
                                                                color: COLORS.black,
                                                                fontFamily: fontFamily.FONTS.Medium,
    
                                                            }}
                                                                numberOfLines={1}
                                                                ellipsizeMode='tail'
                                                            >{item.name}</Text>
                                                           
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                               
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => item.lastTime}
                                    ListEmptyComponent={() => (
                                        <View style={{ marginVertical: hp(10) }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <MaterialIcons name="group" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                                <Text style={{ paddingTop: 15, color: COLORS.secondaryGray, fontSize: 16 }}>No users to show</Text>
                                            </View>
                                        </View>
                                    )}
                                />
                               ) : (
                                    <FlatList   
                                    data={filteredUsers}
                                    renderItem={({ item }) =>{
                                        return (
                                            <TouchableOpacity onPress={() => onSubmitChat(item)}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                                    <View style={{ 
                                                        paddingVertical: hp(1.5), 
                                                        width: '100%', 
                                                        flexDirection: 'row', 
                                                        alignItems: 'center',
                                                        borderBottomWidth:1,
                                                        borderBottomColor:COLORS.gray,
                                                        backgroundColor:COLORS.white,
                                                        paddingHorizontal: wp(4),
                                                        padding:hp(1)
                                                        }}>
                                                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: user_data.user_id == item.sender.id ? item.receiver.id : item.sender.id})}>
                                                        <Image source={{ uri: user_data.user_id == item.sender.id ? item.receiver.profilePic : item.sender.profilePic }} style={{ height: wp(10), width: wp(10), borderRadius: wp(10) }} />
                                                        </TouchableOpacity>
                                                        <View
                                                            style={{ paddingHorizontal: wp(2) }}>
                                                            <Text style={{
                                                                paddingHorizontal: 5,
                                                                fontSize: hp(2.2),
                                                                color: COLORS.black,
                                                                fontFamily: fontFamily.FONTS.Medium,
    
                                                            }}
                                                                numberOfLines={1}
                                                                ellipsizeMode='tail'
                                                            >{user_data.user_id == item.sender.id ? item.receiver.name : item.sender.name}</Text>
                                                            {item.lastMessage != '' ?
                                                            <Text
                                                            style={{
                                                                paddingHorizontal: 5,
                                                                fontSize: hp(2),
                                                                color: COLORS.darkgray1,
                                                                fontFamily: fontFamily.FONTS.regular,
                                                            }}
                                                            numberOfLines={1}
                                                            ellipsizeMode='tail'>
                                                                {`${user_data.user_id == item.lastSender ? 'me' : item.lastSender == item.sender.id ? item.sender.name : item.receiver.name} : ${item.lastMessage}`}
                                                            </Text>
                                                            :
                                                            <Text style={{
                                                                paddingHorizontal: 5,
                                                                fontSize: hp(2),
                                                                color: COLORS.darkgray1,
                                                                fontFamily: fontFamily.FONTS.regular,
                                                            }}
                                                                numberOfLines={1}
                                                                ellipsizeMode='tail'
                                                            >{`${user_data.user_id == item.lastSender ? 'me' : item.lastSender == item.sender.id ? item.sender.name : item.receiver.name} : photo`}</Text>
                                                        }
                                                        </View>
                                                    </View>
                                                </View>
                                               
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => item.lastTime}
                                    ListEmptyComponent={() => (
                                        <View style={{ marginVertical: hp(10) }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <MaterialIcons name="group" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                                <Text style={{ paddingTop: 15, color: COLORS.secondaryGray, fontSize: 16 }}>No users to show</Text>
                                            </View>
                                        </View>
                                    )}
                                />
                                )
                            )
                        )}


                        {/* {selectedOption === 'groups' && (
                            loading ? (
                                <View style={{ marginVertical: hp(20) }}>
                                    <Loader isLoading={loading} />
                                </View>
                            ) : (
                                <FlatList
                                    data={filteredGroupList}
                                    renderItem={({ item }) => (
                                        <View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                                <View style={{ 
                                                    paddingVertical: hp(1.5), 
                                                    width: '100%', 
                                                    flexDirection: 'row', 
                                                    alignItems: 'center',
                                                    borderBottomWidth:1,
                                                    borderBottomColor:COLORS.gray,
                                                    backgroundColor:COLORS.white,
                                                    paddingHorizontal: wp(4),
                                                    padding:hp(1)
                                                    }}>
                                                    <Image source={{ uri: item.avatar }} style={{ height: wp(10), width: wp(10), borderRadius: wp(10) }} />
                                                    <View>

                                                        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', {
                                                            groupData: item
                                                        })}
                                                            style={{ paddingHorizontal: wp(2) }}>
                                                            <Text style={{
                                                                padding: 5,
                                                                fontSize: hp(2.2),
                                                                color: COLORS.darkgray1,
                                                                fontFamily: fontFamily.FONTS.regular,

                                                            }}
                                                                numberOfLines={1}
                                                                ellipsizeMode='tail'
                                                            >{item.group_name}</Text>
                                                        </TouchableOpacity>

                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => item.group_id.toString()}
                                    ListEmptyComponent={() => (
                                        <View style={{ marginVertical: hp(10) }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <MaterialCommunityIcons name="select-group" size={22} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                                <Text style={{ paddingTop: 15, color: COLORS.secondaryGray, fontSize: 16 }}>No Groups to show</Text>
                                            </View>
                                        </View>
                                    )}
                                />
                            )
                        )} */}

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Chats
