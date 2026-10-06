/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, ToastAndroid, ScrollView, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutuser } from '../../redux/reducer';
import fontFamily from '../../../constants/fontFamily';
import { onLogOutApi } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';

const Followers = ({ route }) => {
    const followers = useSelector(state => state.followers);

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
    const [filteredFollowers, setFilteredFollowers] = useState(followers);

    useEffect(() => {
        console.log('Get Followers Data::::', followers);
    }, [])

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = followers.filter((follower) =>
            follower.username.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredFollowers(filtered);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            {/* Follwers */}
            <View style={styles.headerView}>
                <BasicHeader onPress={() => navigation.goBack()} title={'Friends'} />
            </View>
            <View style={{
                flex: 0.92,
                width: '100%',
            }}>
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

                {/* <Text style={styles.FollowingHading}>All Friends</Text> */}

                {filteredFollowers.length === 0 && searchQuery.length > 0 && (
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No users found</Text>
                    </View>
                )}

                {followers.length === 0 && (
                    <View >
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingTop: hp(5), margin: hp(6) }}>
                            <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular }}>currently you dont follow anyone</Text>
                        </View>
                    </View>
                )}

                {followers.length > 0 && (
                    <View style={{ padding: 15 }}>
                        <FlatList
                            data={searchQuery ? filteredFollowers : followers}
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
                                            <FontAwesome5 name="user-check" size={20} color={COLORS.lightBlue} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 6, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('ChatScreen', { recipientId: item.user_id })}   >
                                            <FontAwesome name="send" size={20} color={COLORS.darkgray1} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Followers;

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
        FollowinghorizontalLine: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 1,
            // padding: 5,
            // marginHorizontal: 15,
        },
    });
};
