/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, TextInput, ToastAndroid, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityicons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontFamily from '../../../constants/fontFamily';
import { onLikePage } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';

const Likes = ({ route }) => {
    const { liked_pages } = route.params

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
    const [filteredPages, setFilteredPages] = useState(liked_pages);

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = liked_pages.filter((page) =>
            page.page_title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredPages(filtered);
    };

    const handleLikepages = async (pageId) => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('page_id', pageId);

                const response = await onLikePage(formData, token)
                if (response.data.api_status === 200) {
                    ToastAndroid.show(response.data.like_status, ToastAndroid.SHORT)
                } else if (response.data.api_status === 400 || 404) {
                    ToastAndroid.show(response.data.errors.error_text)
                }
            } else {
                console.log('User Token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <View style={styles.headerView}>
                <BasicHeader onPress={() => navigation.goBack()} title={'Likes'} />
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

                {/* <Text style={styles.FollowingHading}>All Pages</Text> */}

                {filteredPages.length === 0 && searchQuery.length > 0 && (
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No page found</Text>
                    </View>
                )}

                {liked_pages.length === 0 && (
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                        <Text style={{ fontSize: 16, fontFamily: fontFamily.FONTS.regular, color: COLORS.secondaryGray }}>
                            Currently, you don't like any page
                        </Text>
                    </View>
                )}

                {liked_pages.length > 0 && (
                    <View style={{ padding: 15 }}>
                        <FlatList
                            data={searchQuery ? filteredPages : liked_pages}
                            keyExtractor={(item, index) => item.user_id.toString()}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                    <View style={{ paddingVertical: hp(0.5), flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: item.avatar }} style={{ height: hp(7), width: wp(14), borderRadius: 100 }} />
                                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.user_id })} style={{ paddingHorizontal: wp(2) }}>
                                            <Text style={styles.FollowersName}>{item.page_title}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 6, borderRadius: 5, backgroundColor: item.is_liked ? COLORS.yellow : COLORS.red, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleLikepages(item.page_id)} >
                                        <AntDesign name="like2" size={20} color={COLORS.white} />
                                        <Text style={{ color: COLORS.white, fontFamily: fontFamily.FONTS.regular, fontSize: 15, paddingHorizontal: 5 }}> {item.is_liked ? 'Liked' : 'Like'}</Text>
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

export default Likes;

const localStyles = (theme, WD, WH) => {
    const global = globalStyles(theme);

    return StyleSheet.create({

        headerView: {
            flex: 0.08,
            width: '100%',
            justifyContent: 'center',
        },
        FollowingContainer: {
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
            borderBottomWidth: 1,
            // padding: 5,
            // marginHorizontal: 15,
        },
    });
};
