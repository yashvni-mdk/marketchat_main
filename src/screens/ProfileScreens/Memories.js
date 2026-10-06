/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import translations from '../../utils/localization/traslations';
import LinearGradient from 'react-native-linear-gradient';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import BasicHeader from '../../components/BasicHeader';
// import { Svg, Image } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onGetMemories } from '../../Service/Api';
import { Loader } from '../../components/Loader';

const Memories = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });


    const [loading, setLoading] = useState(false)
    const [memories, setMemories] = useState([])

    useEffect(() => {
        getMemories()
    }, [])

    const getMemories = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('type', 'all');

                const response = await onGetMemories(formData, token)
                if (response.data.api_status == 200) {
                    setMemories(response.data.data)
                    setLoading(false)
                    console.log('the all memories', response.data.data)

                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('somthing went wrong', response.data.errors.error_text)
                }
            } else {
                setLoading(false)
                console.log('User token not found', error.message)

            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)

        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Memories'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>

                    <View style={styles.container}>
                        <View style={styles.ContentContainer}>
                            <View style={styles.CoverImagePicker}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../../assets/image/img/memories.png')} style={{ height: hp(20), width: wp(45) }} />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(3) }}>
                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 15, color: COLORS.red }}>Memories</Text>
                                    <Text style={{ textAlign: 'center', paddingVertical: hp(1), fontFamily: fontFamily.FONTS.regular, fontSize: 18, color: COLORS.black }}>Discover the memories you have shared!</Text>
                                </View>

                            </View>
                        </View>
                    </View>

                    {loading ? (
                        <View style={{ marginTop: hp(4), marginBottom: hp(5), justifyContent: 'center', alignItems: 'center' }}>
                            <Loader isLoading={true} />
                        </View>
                    ) : (
                        <FlatList
                            data={memories}
                            keyExtractor={(item, index) => item.user_id.toString()}
                            renderItem={({ item }) => (
                                <View style={{ marginTop: hp(3), paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', }}>
                                    <View>
                                        <Image
                                            source={{ uri: item.avatar }}
                                            style={{ height: hp(12), width: wp(24), borderRadius: 100 }}
                                        />

                                    </View>
                                    <View style={{ paddingHorizontal: wp(4), }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.username}>{item.username}</Text>
                                            <MaterialIcons name="verified" size={24} color={'#55acee'} style={{ paddingHorizontal: 10 }} />
                                        </View>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <View style={styles.ContentContainer}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                                        <MaterialIcons name="event" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>You dont have memories on this day.</Text>
                                    </View>
                                </View>
                            )}
                        />
                    )}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Memories;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
        },
        HandingtextContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },

        Handingtext: {
            color: COLORS.white,
            fontSize: wp(10),
            fontFamily: fontFamily.FONTS.regular,
        },
        ContentContainer: {
            marginHorizontal: wp(2),
            marginTop: hp(2),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            height: 'auto',
            padding: wp(1),
            backgroundColor: global.ContentContainer.backgroundColor,
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
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};