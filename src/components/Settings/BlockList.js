import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, ScrollView, ToastAndroid, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUserData } from '../../utils/localization/Storage';
import { WD, WH } from '../Dimensions';
import { COLORS } from '../../../constants';
import { globalStyles } from '../GlobalTheme';
import { useTheme } from '../ThemeContext';
import { onBlockActionApi, onBlockUserApi } from '../../Service/Api';
import { useDispatch } from 'react-redux';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../Pixel/index';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchblockUsers } from '../../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import fontFamily from '../../../constants/fontFamily';
import Footer from '../Footer';
import { useNavigation } from '@react-navigation/native';
import { Loader } from '../Loader';

const BlockList = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user_data = useSelector(state => state.user_data);
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme, WD, WH),
    });

    const [blockList, setBlockList] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchUserData()
    }, []);

    const fetchUserData = async () => {
        try {
            const user = await getUserData();
            if (user) {
                fetchblockUsersList(user)
                // console.log('this is the user accessToken', user.accessToken)
            } else {
                navigation.navigate('Login');
                console.log('user accessToken not found')
            }
        } catch (error) {
            console.log('Error fetching user accessToken', error.message)
        }
    };

    const fetchblockUsersList = async (user) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);

                const response = await onBlockUserApi(formData, token)
                console.log('Get response data', response.data)
                if (response.data.api_status === 200) {
                    setBlockList(response.data.blocked_users)
                    setLoading(false)
                    console.log('this is the blocked users', blockList)
                    dispatch(fetchblockUsers(response.data.blocked_users))
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('Error fetching blocked users', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
                }
            } else {
                setLoading(false)
                console.log('token not found', error.message)
            }
        } catch (err) {
            setLoading(false)
            console.log("Get Error::", err)
        }
    }

    const UnBlock = async (user_id) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('user_id', user_id)
                formData.append('block_action', 'un-block')

                const response = await onBlockActionApi(formData, token);
                if (response.data.api_status === 200) {
                    console.log('user Unblocked', response.data.blocked_users)
                    await fetchblockUsersList()
                    ToastAndroid.show('User Unblock', ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('fetching some error for un-block the user', response.data.errors.error_text)
                    ToastAndroid.show('Somthing went Wrong Please try again', ToastAndroid.SHORT)
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }


    return (
        <SafeAreaView style={{ backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.FollowingContainer}>
                    <View style={{ height: hp(20), margin: 12, padding: 15, backgroundColor: '#fef9f8', borderRadius: 10, borderWidth: 1, borderColor: '#fceeeb' }}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: user_data?.avatar }} style={styles.userImage} />
                            <View style={{ position: 'absolute', top: 50, left: 55 }}>
                                <MaterialCommunityIcons name='account-remove' size={22} color={COLORS.white} style={{ backgroundColor: '#e0624b', borderRadius: 50, padding: 7 }} />
                            </View>
                            <View style={{ padding: 10, paddingHorizontal: 20 }}>
                                <Text style={styles.username}>{user_data?.username}</Text>
                                <Text style={styles.Heading}>Blocked Users</Text>
                            </View>
                        </View>
                    </View>

                    {loading ? (
                        <View style={{ marginTop: hp(4), marginBottom: hp(5), justifyContent: 'center', alignItems: 'center' }}>
                            <Loader isLoading={true} />
                        </View>
                    ) : (
                        <FlatList
                            data={blockList}
                            keyExtractor={(item, index) => item.user_id.toString()}
                            renderItem={({ item }) => (
                                <View style={{ paddingTop: 10, paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', }}>
                                    <View>
                                        <Image
                                            source={{ uri: item.avatar }}
                                            style={{ height: 80, width: 80, borderRadius: 50 }}
                                        />
                                        {loading ? (
                                            <Loader isLoading={loading} />
                                        ) : (
                                            <TouchableOpacity style={{
                                                padding: 3,
                                                marginTop: hp(2),
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 5,
                                                backgroundColor: '#ebeef0',
                                                paddingHorizontal: wp(3),
                                                }} onPress={() => UnBlock(item.user_id)}>
                                                <Entypo name='cross' size={18} color={'#555555'} />
                                                <Text style={{ fontSize: hp(2), fontFamily: fontFamily.FONTS.regular, marginLeft: wp(2)}}>Unblock</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={{ marginTop: 7, flexWrap: 'wrap' }}>
                                        <Text style={styles.FollowersName}>{item.username}</Text>
                                        <Text style={styles.FollowersName}>{item.lastseen_time_text}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    )}

                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default BlockList

const localStyles = (theme, WD, WH) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        FollowingContainer: {
            marginTop: 25,
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            borderRadius: 10,

        },
        headerContainer: {
            marginTop: 25,
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            borderRadius: 10
        },
        modelText: {
            paddingTop: 5,
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.black
        },
        options: {
            paddingHorizontal: wp(5),
            fontSize: hp(2.6),
            color: COLORS.secondaryGray
        },
        header: {
            justifyContent: 'flex-start'
        },
        FollowingContent: {
            borderRadius: 10,
            padding: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
            paddingHorizontal: 15,
            alignItems: 'center'
        },
        imageContainer: {
            marginVertical: 12,
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        userDetails: {
            justifyContent: 'center',
            paddingHorizontal: 15,
        },
        userImage: {
            height: 80,
            width: 80,
            borderRadius: 100
        },
        username: {
            fontSize: hp(2.2),
            fontFamily: fontFamily.FONTS.regular,
            color: '#e0624b'
        },
        Heading: {
            fontSize: wp(6),
            fontFamily: fontFamily.FONTS.bold,
            color: '#e0624b'
        },
        FollowingHading: {
            padding: 15,
            marginHorizontal: 5,
            borderRedius: 10,
            borderWidth: 0.5,
            borderColor: '#fef9f8',
            flexDirection: 'row',
            backgroundColor: '#fef9f8',
            fontSize: hp(2.3),
            color: global.text2.color
        },
        FollowersName: {
            padding: 5,
            fontSize: hp(2),
            color: '#6c788a',
            fontFamily: fontFamily.FONTS.regular
        },

    })
}