/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, TextInput, ToastAndroid, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontFamily from '../../../constants/fontFamily';
import { onFollowUser, onJoinGroup } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import {useTranslation} from 'react-i18next';

const GroupsList = ({ route }) => {
    const {t} = useTranslation();
    const { joined_groups } = route.params

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
    const [filteredGroups, setFilteredGroups] = useState(joined_groups);

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = joined_groups.filter((group) =>
            group.group_title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredGroups(filtered);
    };

    const handleJoinedGroup = async (group_id) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('group_id', group_id);

                const response = await onJoinGroup(formData, token)
                if (response.data.api_status === 200) {
                    console.log('Your Joined into group', response.data.join_status)
                    ToastAndroid.show(response.data.join_status, ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('error to joined into group', response.data.errors.error_text);
                    ToastAndroid.show('Something went wrong please try again', ToastAndroid.SHORT);
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <View style={styles.headerView}>
                <BasicHeader onPress={() => navigation.goBack()} title={t('groups')} />
            </View>
            <View style={{
                flex: 0.92,
                width: '100%',
            }}>
                {/* Follwers */}
                <View style={{ padding: 10, alignItems: 'center', marginTop: hp(2) }}>
                    <TextInput
                        placeholder={t('search')}
                        placeholderTextColor={COLORS.secondaryGray}
                        style={styles.CustomInput}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
                <View style={styles.FollowinghorizontalLine} />

                {/* <Text style={styles.FollowingHading}>All Groups</Text> */}


                {filteredGroups.length === 0 && searchQuery.length > 0 && (
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>{t('no_groups_found')}</Text>
                    </View>
                )}

                {joined_groups.length === 0 && (
                    <View >
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingTop: hp(5), margin: hp(6) }}>
                            <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular }}>{t('currently_you_joined_any_groups')}</Text>
                        </View>
                    </View>
                )}

                {joined_groups.length > 0 && (
                    <View style={{ padding: 15 }}>
                        <FlatList
                            data={searchQuery ? filteredGroups : joined_groups}
                            keyExtractor={(item, index) => item.user_id.toString()}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                    <View style={{ paddingVertical: hp(0.5), flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: item.avatar }} style={{ height: hp(6), width: wp(12), borderRadius: 100 }} />
                                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.user_id })} style={{ paddingHorizontal: wp(2) }}>
                                            <Text style={styles.FollowersName}>{item.group_title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 4, borderRadius: 5, backgroundColor: COLORS.red, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleJoinedGroup(item.group_id)} >
                                        <AntDesign name='pluscircleo' size={20} color={COLORS.white} />
                                        <Text style={{ color: COLORS.white, fontFamily: fontFamily.FONTS.regular, fontSize: 15, paddingHorizontal: 5 }}>{t('join')}</Text>
                                    </TouchableOpacity>

                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default GroupsList;

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
            fontSize: 16,
            fontFamily: fontFamily.FONTS.regular,
            color: global.text2.color
        },
        iconStyle: {
            backgroundColor: COLORS.red,
            borderRadius: 50,
            padding: 4
        },
        FollowinghorizontalLine: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 0.5,
            // padding: 5,
            // marginHorizontal: 15,
        },
    });
};
