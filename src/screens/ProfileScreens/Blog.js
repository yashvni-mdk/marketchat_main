/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, FlatList, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../constants';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import CustomInput from '../../components/CustomInput';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import fontFamily from '../../../constants/fontFamily';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import { getUserData } from '../../utils/localization/Storage';
import { getUserArticles } from '../../Service/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { fetchArticles } from '../../redux/reducer';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const Blog = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const [selectedCategory, setSelectedCategory] = useState('Categories')
    const [categoryID, setCategoryID] = useState(null)

    const Categories = [
        { id:0, label: 'Categories', value: 'Categories' },
        { id:2, label: 'Cars and Vehicles', value: 'Cars and Vehicles' },
        { id:3, label: 'Comedy', value: 'Comedy' },
        { id:4, label: 'Econoimics and Trade', value: 'Econoimics and Trade' },
        { id:5, label: 'Education', value: 'Education' },
        { id:6, label: 'Entertainment', value: 'Entertainment' },
        { id:7, label: 'Movies & Animation', value: 'Movies & Animation' },
        { id:8, label: 'Gaming', value: 'Gaming' },
        { id:9, label: 'History and Facts', value: 'History and Facts' },
        { id:10, label: 'Live Style', value: 'Live Style' },
        { id:11, label: 'Natural', value: 'Natural' },
        { id:12, label: 'News and Politics', value: 'News and Politics' },
        { id:13, label: 'People and Nations', value: 'People and Nations' },
        { id:14, label: 'Pets and Animals', value: 'Pets and Animals' },
        { id:15, label: 'Places and Regions', value: 'Places and Regions' },
        { id:16, label: 'Science and Technology', value: 'Science and Technology' },
        { id:17, label: 'Sport', value: 'Sport' },
        { id:18, label: 'Travel and Events', value: 'Travel and Events' },
        { id:1, label: 'Other', value: 'Other' },
    ]

    // Create a state to hold all blogs
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserData()
        fetchUsersArticles(0)
    }, []);

    const fetchUserData = async () => {
        try {
            const user = await getUserData();
            if (user) {
                fetchUsersArticles(user)
                // console.log('this is the user accessToken', user.accessToken)
            } else {
                navigation.navigate('Login');
                console.log('user accessToken not found')
            }
        } catch (error) {
            console.log('Error fetching user accessToken', error.message)
        }
    };

    const fetchUsersArticles = async (categoryID) => {
        try {
            if(categoryID != 0) {
                setLoading(true)
                const token = await AsyncStorage.getItem('access_token');
                if (token != null) {
                    const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                    const formData = new FormData();
                    // formData.append('user_id', user.userData.user_id);
                    formData.append('server_key', serverkey);
                    if (categoryID) {
                        formData.append('category', categoryID)
                    }
                    console.log('get category>>>>>>>>>>>', categoryID);
                    const response = await getUserArticles(formData, token)
                    console.log("Get Response DAtaLLL", response.data)
                    if (response.data.api_status === 200) {
                        setAllBlogs(response.data.articles)
                        console.log('this is the articles', allBlogs)
                        setLoading(false)
                        dispatch(fetchArticles(response.data))
                    } else if (response.data.api_status === 400 || 404) {
                        setLoading(false)
                        console.log('Error fetching articles', response.data.errors.error_text);
                        ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
                    }
                } else {
                    setLoading(false)
                    console.log('Token not found', error.message)
                }
            } else {
                setAllBlogs([])
            }
        } catch (err) {
            setLoading(false)
            console.log("Get Error::", err)
        }
    }

    // Function to format the current date as "14 Dec 2023"
    const getCurrentDate = () => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const currentDate = new Date();
        return currentDate.toLocaleDateString(undefined, options);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={t('Blog')} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <LinearGradient
                            colors={['#677ae5', '#6c68cb', '#6f60bf', '#7451aa']} // Replace these colors with your gradient colors
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ height: hp(26), padding: hp(3) }}>
                            <View>
                                <View>
                                    <Text style={styles.overlayText}>{t('most_recent_articles')}</Text>
                                    {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        <TouchableOpacity style={{ backgroundColor: '#f5deb3', borderRadius: 10, }} onPress={() => navigation.navigate('MyArticles')}>
                                            <Text style={{ fontSize: hp(2.1), color: '#776cc4', padding: 8, paddingHorizontal: hp(6) }}>My articles</Text>
                                        </TouchableOpacity>
                                    </View> */}
                                </View>
                            </View>
                        </LinearGradient>

                        <View>
                            <View style={styles.container}>
                                <View style={styles.ContentContainer}>
                                    <View style={styles.content}>
                                        <TextInput
                                            placeholder={t('search_for_articles')}
                                            placeholderTextColor={COLORS.secondaryGray}
                                            style={styles.CustomInput}
                                        />
                                    </View>

                                    <View style={{ marginTop: 6, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {Categories.map((category, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.ProfileComplitionButton,
                                                    selectedCategory === category.value && { backgroundColor: '#3f51b5' },
                                                ]}
                                                onPress={() => {
                                                    setSelectedCategory(category.value);
                                                    setCategoryID(category.id);
                                                    fetchUsersArticles(category.id)
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.horizontalTabText,
                                                        selectedCategory === category.value && { color: '#ffffff' },
                                                    ]}
                                                >
                                                    {category.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: -60 }}>
                            {loading ? (
                                <View style={{ flex: 1, marginVertical: hp(10), justifyContent: 'center', alignItems: 'center' }}>
                                    <Loader isLoading={loading} />
                                </View>
                            ) : (
                                <FlatList
                                    data={allBlogs}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <View>
                                            <View style={{ marginTop: 15, marginHorizontal: 15, borderRadius: 8, overflow: 'hidden' }}>
                                                <Image source={{ uri: item.thumbnail }} style={{ height: hp(36), width: '100%' }} />
                                                <View style={styles.Blogoverlay} />
                                                <TouchableOpacity style={[styles.overlayBlog, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]} onPress={() => navigation.navigate('MyArticles', { blogId: item.id })} >
                                                    <Text style={styles.overlayBlogText}>{item.category}</Text>
                                                </TouchableOpacity>
                                                <View style={styles.Blogoverlay} />
                                                <View style={styles.BlogTextOverlay}>
                                                    <View>
                                                        <TouchableOpacity onPress={() => navigation.navigate('BlogDetail', { blogUrl: item.url })}>
                                                            <Text style={styles.BlogTitle}>{item.title}</Text>
                                                        </TouchableOpacity>

                                                        <View style={{ flexDirection: 'row', paddingHorizontal: hp(1), marginBottom: hp(7) }}>
                                                            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { UserId: item.author.user_id })}>
                                                                <Text style={styles.username}>{item.author.username}</Text>
                                                            </TouchableOpacity>
                                                            <Text style={styles.date}>{getCurrentDate()}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[styles.BlogEditButton, { flexDirection: 'row', marginVertical: hp(1) }]}>
                                                    <TouchableOpacity style={{ backgroundColor: COLORS.tertiaryWhite, borderRadius: 5 }} onPress={() => navigation.navigate('BlogDetail', { blogUrl: item.url })}>
                                                        <Text style={{ padding: 5, paddingHorizontal: wp(5), fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.black }}>{t('read_more')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    ListEmptyComponent={() =>
                                        selectedCategory !== null ? (
                                            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 22 }}>
                                                <MaterialCommunityIcons name="newspaper" size={24} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                                <Text style={{ paddingTop: 25, fontSize: hp(2.2) }}>
                                                    {t('no_articles_found')}
                                                </Text>
                                            </View>
                                        ) : null
                                    }
                                />
                            )}

                        </View>

                        {/* <TouchableOpacity style={styles.showMoreView}>
                            <Text style={styles.loadText}>Load more articles</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Blog;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor

        },
        headerView: {
            flex: 0.08,
            width: '100%',
            justifyContent: 'center',
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(198,77,83,0.5)',
        },
        Blogoverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.1)',
        },
        BlogTextOverlay: {
            position: 'absolute',
            bottom: 10, // Adjust the position from the bottom as needed
            left: 10,
            // right: 1,
            top: hp(16),
            justifyContent: 'center',
            alignItems: 'center',
        },
        overlayBlog: {
            position: 'absolute',
            top: 15,
            left: 15,
            alignItems: 'center',
            backgroundColor: COLORS.darkgray,
            borderRadius: 10
        },
        overlayBlog2: {
            position: 'absolute',
            top: -15,
            right: 50,
            justifyContent: 'flex-start',
            backgroundColor: COLORS.white,
            borderRadius: 10
        },
        overlayBlogText: {
            padding: 5,
            paddingHorizontal: 10,
            color: COLORS.gray, // Set your desired text color
            fontSize: hp(2), // Adjust the font size as needed
            fontFamily: fontFamily.FONTS.regular, // Set the font weight if necessary
            flexWrap: 'wrap',
        },
        overlayBlogText2: {
            padding: 5,
            paddingHorizontal: 10,
            color: COLORS.black,
            fontSize: hp(2.2),
            flexWrap: 'wrap',
        },
        overlayText: {
            color: COLORS.white,
            fontSize: wp(9),
            marginTop: hp(1.5),
            fontFamily: fontFamily.FONTS.Medium,
            // fontWeight: '',
            flexWrap: 'wrap',
        },
        BlogTitle: {
            color: COLORS.white,
            fontSize: hp(2.6),
            paddingHorizontal: wp(2),
            fontFamily: fontFamily.FONTS.Medium,
            flexWrap: 'wrap',
        },
        BlogEditButton: {
            position: 'absolute',
            bottom: 10, // Adjust the position from the bottom as needed
            left: 20,
            marginBottom: 5,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        date: {
            paddingTop: 7,
            paddingHorizontal: wp(4),
            color: COLORS.secondaryWhite,
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.regular,
            flexWrap: 'wrap',

        },
        username: {
            paddingTop: 7,
            // paddingHorizontal: 8,
            color: COLORS.secondaryWhite,
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.regular,
            flexWrap: 'wrap',
        },

        content: {
            paddingTop: 25,
        },
        ContentContainer: {
            position: 'relative',
            top: -60,
            left: 0,
            right: 0,
            margin: 10,
            borderRadius: 10,
            padding: 15,
            backgroundColor: global.ContentContainer.backgroundColor
        },
        title: {
            color: global.text.color,
            fontSize: hp(2.4),
            fontWeight: 'bold',
            flexWrap: 'wrap',
            paddingBottom: 10
        },
        mainContent: {
            color: global.text.color,
            fontSize: hp(2.1),
            flexWrap: 'wrap',
            paddingBottom: 10,
        },
        horizontalTabText: {
            padding: 5,
            paddingHorizontal: 10,
            fontSize: hp(2.1),
            color: '#5558b5'
        },
        CustomInput: {
            width: '100%',
            height: 40,
            paddingHorizontal: 4,
            backgroundColor: '#ededed',
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        ProfileComplitionButton: {
            borderRadius: 20,
            backgroundColor: '#ebedf7',
            marginTop: 10,
            marginHorizontal: 1,
            paddingHorizontal: 3
        },
        showMoreView: {
            width: '40%',
            height: hp(5),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.white,
            borderRadius: hp(5),
            marginBottom: hp(2),
            marginTop: hp(2),
            alignSelf: 'center',
        },
        loadText: {
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.black,
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};