/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onGetCommonTHings } from '../../Service/Api';

const CommonThings = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    useEffect(() => {
        getCommonThingsUser()
    }, [])

    const getCommonThingsUser = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);

                const response = await onGetCommonTHings(formData, token)
                if (response.data.api_status == 200) {
                    console.log('the all commonThings', response.data.data)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong', response.data.errors.error_text)
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Common Things'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>

                    <LinearGradient
                        colors={['#ea5f96', '#d353a6', '#cc50ab', '#b846b9',]} // Replace these colors with your gradient colors
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ height: hp(22), padding: hp(3) }}
                    >
                        <View style={{ marginTop: hp(3), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.Handingtext}>
                                    Common Things
                                </Text>
                            </View>
                            <Text style={{ marginVertical: hp(2), fontFamily: fontFamily.FONTS.regular, fontSize: 16, color: COLORS.white }}>
                                Meet People with things is common
                            </Text>
                        </View>
                    </LinearGradient>

                    <View>
                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                                <MaterialIcons name="group" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No users to Show</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CommonThings;

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
            margin: 20,
            borderRadius: 10,
            padding: 20,
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