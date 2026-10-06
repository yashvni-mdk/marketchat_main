/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, TextInput, ToastAndroid, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontFamily from '../../../constants/fontFamily';
import { onFollowUser } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';

const Followings = ({ route }) => {
    const { followings } = route.params
    const [currentFollowings, setCurrentFollowings] = useState(followings);
    const user_data = useSelector(state => state.user_data);

    // const user_data = useSelector(state => state.user_data);
    // const followers = useSelector(state => state.followers);
    // const following = useSelector(state => state.following);

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme, WD, WH),
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFollowings, setFilteredFollowings] = useState(followings);

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = followings.filter((following) =>
            following.username.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredFollowings(filtered);
    };

    const handleFollowUser = async (userId) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('user_id', userId);

                const response = await onFollowUser(formData, token);
                if (response.data.api_status === 200) {
                    console.log('follow status', response.data.follow_status);
                    ToastAndroid.show(response.data.follow_status, ToastAndroid.SHORT);
                    // Update the state or data if necessary
                } else if (response.data.api_status === 400 || response.data.api_status === 404) {
                    console.log('error to follow user', response.data.errors.error_text);
                }
            } else {
                console.log('user token not found', error.message);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <View style={{ flex: 1 }}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Friends'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    {/* Follwers */}
                    <View style={{ padding: 10, alignItems: 'center', marginTop: hp(2) }}>
                        <TextInput
                            placeholder='Search'
                            placeholderTextColor={COLORS.secondaryGray}
                            style={styles.CustomInput}
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                    <View style={styles.FollowinghorizontalLine} />

                    {/* <Text style={styles.FollowingHading}>All Users</Text> */}

                    {filteredFollowings.length === 0 && searchQuery.length > 0 && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                            <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No users found</Text>
                        </View>
                    )}

                    {followings.length === 0 && (
                        <View >
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingTop: hp(5), margin: hp(6) }}>
                                <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>currently you dont follow any one</Text>
                            </View>
                        </View>
                    )}

                    {followings.length > 0 && (
                        <View style={{ padding: 15, }}>
                            <FlatList
                                data={searchQuery ? filteredFollowings : followings}
                                keyExtractor={(item, index) => item.user_id.toString()}
                                renderItem={({ item }) => (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                        <View style={{ paddingVertical: hp(0.5), width: wp(45), flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={{ uri: item.avatar }} style={{ height: hp(7), width: wp(14), borderRadius: 100 }} />
                                            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.user_id })}>
                                                <Text style={styles.FollowersName}>{item.username}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 6, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleFollowUser(item.user_id)} >
                                                <SimpleLineIcons name="user-following" size={20} color={COLORS.lightBlue} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 6, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                                                onPress={() => navigation.navigate('ChatScreen', { receiver: {id: item.user_id, name: item.name, profilePic: item.avatar}, sender: {
                                                        id: user_data.user_id,
                                                        name: user_data.name,
                                                        profilePic: user_data.avatar
                                                    } })}  >
                                                <FontAwesome name="send" size={20} color={COLORS.darkgray1} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Followings;

const localStyles = (theme, WD, WH) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        headerView: {
            flex: 0.08,
            width: '100%',
            justifyContent: 'center',
        },
        FollowingContainer: {
            marginTop: 25,
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            borderRadius: 10
        },
        SearchContainer: {
            marginTop: 25,
            padding: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            borderRadius: 10
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
        CustomInput: {
            width: '90%',
            height: 40,
            paddingHorizontal: 4,
            backgroundColor: '#ededed',
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        FollowinghorizontalLine: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 0.5,
            // padding: 5,
            // marginHorizontal: 15,
        },
    });
};
