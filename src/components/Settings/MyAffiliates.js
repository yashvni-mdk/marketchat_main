import { SafeAreaView, ScrollView, ToastAndroid, Share, Linking, StyleSheet, Text, FlatList, ImageBackground, TextInput, TouchableOpacity, View, Modal, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import CustomInput from '../CustomInput';
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-crop-picker';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import Footer from '../../components/Footer';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';
import { Svg } from 'react-native-svg';
import Affiliates from '../Svg/Affiliate';

const MyAffiliates = () => {
    const user_data = useSelector(state => state.user_data);
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [modalVisible, setModalVisible] = useState(false);

    // Function to toggle modal visibility
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }


    const userReferralLink = `https://marketchat.in/register?ref=${user_data?.username}`;

    // Function to handle WhatsApp sharing
    const shareViaWhatsApp = () => {
        const message = `Check out this referral link: ${userReferralLink}`;
        Linking.openURL(`whatsapp://send?text=${message}`);
    };

    // Function to handle LinkedIn sharing
    const shareViaLinkedIn = () => {
        Linking.openURL(`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(userReferralLink)}`);
    };

    // Function to handle Pinterest sharing
    const shareViaPinterest = () => {
        Linking.openURL(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(userReferralLink)}`);
    };

    // Function to handle Twitter sharing
    const shareViaTwitter = () => {
        const message = `Check out this referral link: ${userReferralLink}`;
        Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`);
    };
    // Function to handle Twitter sharing
    const shareViaFacebook = () => {
        const message = `Check out this referral link: ${userReferralLink}`;
        Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(userReferralLink)}`);
    };

    const shareLink = async (platform) => {
        try {
            const message = `Check out this referral link: ${userReferralLink}`;

            switch (platform) {
                case 'facebook':
                    await Share.share({
                        title: 'Share via Facebook',
                        message: message,
                    });
                    break;

                case 'twitter':
                    await Share.share({
                        title: 'Share via Twitter',
                        message: message,
                    });
                    break;

                case 'whatsapp':
                    await Share.share({
                        title: 'Share via WhatsApp',
                        message: message,
                    });
                    break;

                case 'pinterest':
                    await Share.share({
                        title: 'Share via Pinterest',
                        message: message,
                    });
                    break;

                case 'linkedin':
                    await Share.share({
                        title: 'Share via LinkedIn',
                        message: message,
                    });
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.error('Error sharing:', error.message);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <View style={styles.container}>
                <View style={styles.AvatarContentContainer}>
                    <View style={styles.content}>
                        <View style={styles.HandingtextContainer}>
                            <View>
                                <Image source={{ uri: user_data?.avatar }} style={{ height: hp(10), width: wp(20), borderRadius: 70 }} />
                                <View style={{ position: 'absolute', top: hp(5.5), left: wp(14) }}>
                                    <MaterialIcons name='groups' size={19} color={COLORS.white} style={{ backgroundColor: '#d2691e', borderRadius: 50, padding: 5 }} />
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: wp(5) }}>
                                <Text style={styles.username}>{user_data?.username}</Text>
                                <Text style={styles.Handingtext}>
                                    My Affiliates
                                </Text>
                            </View>
                        </View>


                        <View style={styles.CoverImagePicker}>
                            <View >
                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.black }}>Earn up to $0.10 for each user your refer to us !</Text>
                                <Text style={{ paddingVertical: hp(1), fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2), color: COLORS.black }}>Your affiliate link is</Text>
                                <TouchableOpacity>
                                    <View style={{ padding: 7, marginTop: hp(1), backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.black }}>https://marketchat.in/register?ref={user_data?.username}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Image source={require('../../../assets/image/img/affiliate.png')} style={{ height: hp(20), width: wp(40) }} />
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.4) }}>Share To</Text>

                            <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginVertical: hp(1.5) }}>
                                <TouchableOpacity
                                    onPress={shareViaFacebook}
                                    style={{
                                        backgroundColor: '#334c8c',
                                        width: wp(10),
                                        height: wp(10),
                                        borderRadius: wp(10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: wp(1)
                                    }}
                                >
                                    <FontAwesome name='facebook' size={22} color={COLORS.white} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={shareViaTwitter}
                                    style={{
                                        backgroundColor: '#00a6de',
                                        width: wp(10),
                                        height: wp(10),
                                        borderRadius: wp(10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: wp(1)
                                    }}
                                >
                                    <Entypo name='twitter' size={22} color={COLORS.white} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={shareViaWhatsApp}
                                    style={{
                                        backgroundColor: '#2aa81a',
                                        width: wp(10),
                                        height: wp(10),
                                        borderRadius: wp(10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: wp(1)
                                    }}
                                >
                                    <Ionicons name='logo-whatsapp' size={22} color={COLORS.white} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={shareViaPinterest}
                                    style={{
                                        backgroundColor: '#cb2027',
                                        width: wp(10),
                                        height: wp(10),
                                        borderRadius: wp(10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: wp(1)
                                    }}
                                >
                                    <FontAwesome name='pinterest-p' size={22} color={COLORS.white} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={shareViaLinkedIn}
                                    style={{
                                        backgroundColor: '#0b69c7',
                                        width: wp(10),
                                        height: wp(10),
                                        borderRadius: wp(10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: wp(1)
                                    }}
                                >
                                    <FontAwesome name='linkedin' size={22} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </View>
            </View>
        </SafeAreaView >

    )
}

export default MyAffiliates

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            // marginTop: 20,
        },
        HandingtextContainer: {
            padding: wp(5),
            minHeight: hp(15),
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#fdfaf8',
            backgroundColor: '#fdf9f6',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#d2691e',
            fontSize: wp(6),
            fontFamily: fontFamily.FONTS.Medium,
            marginBottom: 10,
            // padding: 5,
        },
        lable: {
            fontSize: hp(2.2),
            color: global.text2.color,
            fontWeight: '600',
            marginVertical: 4,
        },
        username: {
            fontSize: hp(2.2),
            color: '#d2691e',
            fontFamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        AvatarContentContainer: {
            marginTop: hp(2),
            height: hp(85),
            marginHorizontal: wp(4),
            borderRadius: 10,
            padding: 20,
            paddingHorizontal: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        CoverImagePicker: {
            width: '100%',
            padding: 10,
            paddingVertical: hp(4),
            marginVertical: hp(4),
            backgroundColor: '#fdd25b',
            color: global.inputText.color,
            borderRadius: 8,
            alignItems: 'center',
        },
    })
}
