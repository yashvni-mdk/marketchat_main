import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS } from '../../../constants';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import BasicHeader from '../../components/BasicHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onGetBlogById } from '../../Service/Api';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';

const BlogDetails = ({ route }) => {
    const { blogId } = route.params;
    console.log(blogId)
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const [blog, setBlog] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getBlog(blogId)
    }, [])


    const getBlog = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('blog_id', blogId)

                const response = await onGetBlogById(formData, token)
                if (response.data.api_status === 200) {
                    setBlog(response.data.data)
                    setLoading(false)
                    console.log('get the specific blog', response.data)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('error fetching blog', response.data.errors.error_text)
                } else {
                    setLoading(false)
                    console.log('error fetching blog', response.data.errors.error_text)
                }
            }
            else {
                setLoading(false)
                console.log('User Token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'BlogDetals'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View style={{ margin: 15 }}>
                        <View>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: blog.thumbnail }} style={{ height: hp(40), width: '100%', borderRadius: 10 }} />
                                <View style={styles.Blogoverlay} />
                                <TouchableOpacity style={styles.overlayBlog}>
                                    <Text style={styles.overlayBlogText}>{blog.category_name}</Text>
                                </TouchableOpacity>
                                <View style={styles.textOverlay}>
                                    <Text style={styles.overlayText}>{blog.title}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: hp(1), }}>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Image source={{ uri: blog.author?.avatar }} style={{ height: hp(4), width: wp(8), borderRadius: 100 }} />
                                            <Text style={styles.overlayText2}>{blog.author?.username}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: hp(3), borderRadius: 10, backgroundColor: COLORS.white }}>
                            <View style={{ padding: 20 }}>
                                <Text style={{ color: COLORS.darkgray1, fontFamily: fontFamily.FONTS.Medium, fontSize: 18 }}>{blog.description}</Text>
                            </View>

                            <View style={styles.horizontalLine} />
                            <View style={{ padding: 20 }}>
                                <Text style={{ color: COLORS.darkgray1, fontFamily: fontFamily.FONTS.regular, fontSize: 18 }}>{blog.content}</Text>
                                <Text style={{ paddingVertical: hp(1), color: COLORS.darkgray1, fontFamily: fontFamily.FONTS.bold, fontSize: 16 }}>{blog.tags_array}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BlogDetails

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor

        },
        imageContainer: {},
        Blogoverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.2)',
        },
        textOverlay: {
            position: 'absolute',
            bottom: 10, // Adjust the position from the bottom as needed
            left: 20,
            // justifyContent: 'flex-start',
            // alignItems: 'center',
        },
        overlayBlog: {
            position: 'absolute',
            top: 15,
            left: 15,
            alignItems: 'center',
            backgroundColor: COLORS.darkgray,
            borderRadius: 10
        },
        overlayBlogText: {
            padding: 5,
            paddingHorizontal: 10,
            color: COLORS.gray, // Set your desired text color
            fontSize: 16, // Adjust the font size as needed
            fontFamily: fontFamily.FONTS.Medium
        },
        overlayText: {
            color: COLORS.white,
            fontSize: wp(8),
            fontFamily: fontFamily.FONTS.regular,
            flexWrap: 'wrap',
        },
        overlayText2: {
            paddingHorizontal: 8,
            color: COLORS.white, // Set your desired text color
            fontSize: 16, // Adjust the font size as needed
            fontFamily: fontFamily.FONTS.regular
        },
        HandingtextContainer: {
            backgroundColor: COLORS.green,
            justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: COLORS.red,
            fontSize: 42,
            fontWeight: 'bold',
            marginBottom: 6,
            padding: 40,
        },
        ContentContainer: {
            position: 'relative',
            top: -50,
            left: 0,
            right: 0,
            margin: 20,
            borderRadius: 10,
            padding: 15,
            backgroundColor: global.ContentContainer.backgroundColor
        },
        title: {
            color: global.text.color,
            fontSize: 18,
            fontWeight: 'bold',
            flexWrap: 'wrap',
            paddingBottom: 10
        },
        mainContent: {
            color: global.text.color,
            fontSize: 15,
            flexWrap: 'wrap',
            paddingBottom: 10,
        },
        horizontalTabText: {
            padding: 5,
            marginHorizontal: 10,
            fontSize: 15,
            color: COLORS.white
        },
        ProfileComplitionButton: {
            borderRadius: 20,
            backgroundColor: COLORS.secondaryGray,
            marginTop: 10,
            marginHorizontal: 5
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            // padding: 5,
            // marginHorizontal: 15
        },
    });
};