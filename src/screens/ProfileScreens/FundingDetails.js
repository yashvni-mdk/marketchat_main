/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, Share, ScrollView, TextInput, StyleSheet, Text, FlatList, TouchableOpacity, View, Modal, Image, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import translations from '../../utils/localization/traslations';
import LinearGradient from 'react-native-linear-gradient';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCreateFunding } from '../../Service/Api';
import { useDispatch, useSelector } from 'react-redux';
import { createFundings } from '../../redux/reducer';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';

const FundingDetails = ({ route }) => {
    const user_data = useSelector(state => state.user_data.user_id);
    // console.log(user_data)
    const { FundingData } = route.params
    console.log('fndings', FundingData)
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [modelVisible, setModelVisible] = useState(true)

    const toggelModel = () => {
        setModelVisible((prevVisible) => !prevVisible)
    }

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    const handleShare = (FundingData) => {
        Share.share({
            message: `Check out this post: ${FundingData.url}`, // Customize the shared message here
        })
            .then(result => console.log(result))
            .catch(errorMsg => console.error(errorMsg));
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Funding'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View >
                        <View style={{ backgroundColor: COLORS.white, marginHorizontal: wp(2), borderBottomLeftRadius: 8, borderBottomRightRadius: 8, overflow: 'hidden' }}>
                            <TouchableOpacity >
                                <Image source={{ uri: FundingData.image }} style={{ height: hp(26), width: '100%' }} />
                            </TouchableOpacity>
                            <View style={styles.Blogoverlay} />

                            <View style={styles.BlogTextOverlay}>
                                <View>
                                    <TouchableOpacity >
                                        <Text style={styles.BlogTitle}>{FundingData.title}</Text>
                                    </TouchableOpacity>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(1) }}>
                                        <Image source={{ uri: FundingData.user_data.avatar }} style={{ height: hp(3.5), width: wp(7), borderRadius: 70 }} />
                                        <Text style={styles.overlayBlogText}>{FundingData.user_data.username}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.AmountDetails,]}>
                                <Text style={styles.AmountDetailsText}>$ {FundingData.raised} Raised of $ {FundingData.amount}</Text>
                                <View style={styles.horizontalLine} />
                            </View>

                            <View style={[styles.AmountDetails,]}>
                                <Text style={styles.AmountDetailsText}>$ {FundingData.raised} Donation</Text>
                                <View style={styles.horizontalLine} />
                            </View>

                            {FundingData.user_data.user_id !== user_data && (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', width: '90%', marginBottom: hp(2), backgroundColor: COLORS.red, justifyContent: 'center', marginTop: hp(2), alignItems: 'center', borderRadius: 10, padding: 5, }} onPress={handelContactUs} >
                                        <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white }}>Donate</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ width: '90%', marginBottom: hp(2), backgroundColor: '#ebeef0', justifyContent: 'center', marginTop: hp(2), alignItems: 'center', borderRadius: 10, padding: 5, }} >
                                    <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.darkgray1 }}>Share</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/**    <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modelVisible}
                            onRequestClose={() => {
                                setModelVisible(false);
                            }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <View style={styles.ProfileComplitionContainer}>
                                    <View style={{ paddingTop: hp(2), alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: COLORS.black, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2), }}>Replenish my balance</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', padding: wp(3) }}>
                                        <Text style={{ color: COLORS.black, paddingTop: hp(1), fontSize: hp(4), }}>$</Text>
                                        <TextInput
                                            style={{ color: COLORS.red, paddingTop: hp(1), fontSize: hp(4), }}
                                            placeholder='0.00' />
                                    </View>
                                    <TouchableOpacity style={{ backgroundColor: COLORS.red, flexDirection: 'row', borderRadius: 10, padding: 5, marginHorizontal: 14 }}>
                                        <MaterialCommunityIcons name="check-all" size={22} color={COLORS.white} style={{ paddingHorizontal: 5, }} />
                                        <Text style={{ paddingHorizontal: 7, fontSize: hp(2.3), color: COLORS.white }}>Continue</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal> 
                        */}

                        {/* Info */}
                        <View>
                            <View style={styles.InfoContainer}>
                                <View style={styles.infoContent}>
                                    <Entypo name="info-with-circle" size={20} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 4 }} />
                                    <Text style={styles.FollowingHading}>Info</Text>
                                </View>
                                <View style={styles.FollowinghorizontalLine} />
                                <View style={{ padding: wp(2), paddingHorizontal: wp(5), marginBottom: hp(1) }}>
                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2) }}>{FundingData.description}</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default FundingDetails

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: 20,
        },
        optionButtonView: {
            borderBottomWidth: 2,
            alignItems: "center",
            justifyContent: 'center',
            height: hp(7)
        },
        ContentContainer: {
            margin: 10,
            borderRadius: 10,
            padding: 20,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        emptyMessage: {
            margin: 10,
            borderRadius: 10,
            padding: 20,
        },
        inputContainer: {
            marginTop: 10,
        },
        imagePicker: {
            width: '100%',
            height: hp(35),
            // marginHorizontal: 15,
            backgroundColor: '#eaeaea',
            color: global.inputText.color,
            // borderColor: COLORS.secondaryBlack,
            borderRadius: 8,
            justifyContent: 'space-between'
        },
        descriptionInput: {
            width: '100%',
            height: 'auto',
            paddingHorizontal: 4,
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        lable: {
            fontSize: wp(4),
            fontFamily: fontFamily.FONTS.Medium,
            color: global.text2.color,
            // fontWeight: '600',
            marginVertical: 4,
        },
        CheckBoxContainer: {
            flexDirection: 'row',
            paddingTop: 10,
        },
        checkBoxtext: {
            color: global.text2.color,
            fontSize: 15,
        },
        albumsContainer: {
            padding: 10,
            paddingHorizontal: 15,
            marginTop: 25,
            flexDirection: 'row',
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            alignItems: 'center',
            borderRadius: 10,
        },
        headingContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp(3)
        },
        BlogTextOverlay: {
            padding: 10
        },
        BlogTitle: {
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: 18,
            color: COLORS.black,
            paddingVertical: 4
        },
        overlayBlogText: {
            fontFamily: fontFamily.FONTS.regular,
            fontSize: 15,
            paddingHorizontal: wp(2),
            color: COLORS.secondaryGray
        },
        AmountDetails: {
            backgroundColor: '#f8fafb',
            padding: 10
        },
        AmountDetailsText: {
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: 15,
            color: COLORS.black
        },
        albumsText: {
            marginHorizontal: 10,
            fontSize: 18,
            color: global.text2.color
        },
        headingText: {
            marginHorizontal: 10,
            fontSize: hp(4),
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.white
        },
        horizontalLine: {
            borderRadius: 2,
            borderBottomColor: '#eaebec',
            borderBottomWidth: 6,
            padding: 5,
            marginHorizontal: 15,
        },
        horizontalLine2: {
            borderBottomColor: '#eaebec',
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15,
        },
        InfoContainer: {
            marginTop: hp(2),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: 10
        },
        infoContent: {
            padding: wp(2),
            paddingHorizontal: wp(2.5),
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'sp',
        },
        infoContentContainer: {
            flexDirection: 'row',
            alignItems: "center",
            paddingHorizontal: wp(2.5)
        },
        infoContentText: {
            padding: 10,
            paddingHorizontal: 'auto',
            fontSize: hp(2.2),
            color: global.text2.color
        },
        infoContentPost: {
            // padding: 10,
            paddingHorizontal: 'auto',
            fontSize: hp(2.2),
            color: global.text2.color
        },
        FollowingHading: {
            padding: 5,
            marginHorizontal: 5,
            fontSize: hp(2.4),
            color: global.text2.color
        },
        FollowinghorizontalLine: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 0.5,
            // padding: 5,
            // marginHorizontal: 15,
        },
        ProfileComplitionContainer: {
            marginTop: hp(2),
            width: '96%',
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: 10
        },
    });
};