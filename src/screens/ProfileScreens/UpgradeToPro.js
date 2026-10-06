/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Entypo from 'react-native-vector-icons/Entypo'
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';

const UpgradeToPro = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const [modelVisible, setModelVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const toggelModel = () => {
        setModelVisible((prevVisible) => !prevVisible)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: hp(1) }}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Upgrade Pro'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>

                    <LinearGradient
                        colors={['#e6a02d', '#e19b29', '#d48c1f']} // Replace these colors with your gradient colors
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ height: hp(30), padding: hp(3) }}
                    >
                        <View style={{ marginTop: hp(1), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.Handingtext}>
                                    MarcketChat
                                </Text>
                            </View>
                            <Text style={{ paddingHorizontal: wp(1), fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2), color: COLORS.white }}>
                                Pro features give you complete control over your profile.
                            </Text>
                        </View>
                    </LinearGradient>

                    <View style={styles.container}>
                        <View style={styles.ContentContainer}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: hp(2) }}>
                                <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.9), color: COLORS.darkgray1 }}>Pick your plan</Text>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={{ borderRadius: 5, borderColor: COLORS.gray, borderWidth: 0.4, marginBottom: hp(4) }}>
                                    <View style={styles.headerRow}>
                                        <View>
                                            <Text style={styles.headerCell1}>Price</Text>
                                        </View>
                                        <View style={styles.headerCell}>
                                            <Entypo name='star' size={hp(4)} color='#79c149' style={{ backgroundColor: '#ebf6e4', borderRadius: 50, padding: 6, marginBottom: hp(1) }} />
                                            <Text style={{ paddingBottom: hp(2), fontFamily: fontFamily.FONTS.Medium, color: '#333', fontSize: hp(2.7) }}>Star</Text>
                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.secondaryGray, fontSize: hp(2.2) }}>$3/ 1 month</Text>
                                        </View>
                                        <View style={styles.headerCell}>
                                            <MaterialIcons name='whatshot' size={hp(4)} color={COLORS.red} style={{ backgroundColor: '#fae2e2', borderRadius: 50, padding: 6, marginBottom: hp(1) }} />
                                            <Text style={{ paddingBottom: hp(2), fontFamily: fontFamily.FONTS.Medium, color: '#333', fontSize: hp(2.7) }}>Hot</Text>
                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.secondaryGray, fontSize: hp(2.2) }}>$10/ 1 month</Text>
                                        </View>
                                        <View style={styles.headerCell}>
                                            <FontAwesome6 name='bolt-lightning' size={hp(3)} color='#fc924b' style={{ backgroundColor: '#ffefe4', borderRadius: 50, padding: 10, marginBottom: hp(1) }} />
                                            <Text style={{ paddingBottom: hp(2), fontFamily: fontFamily.FONTS.Medium, color: '#333', fontSize: hp(2.7) }}>ultima</Text>
                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.secondaryGray, fontSize: hp(2.2) }}>$20/ 1 month</Text>
                                        </View>
                                        <View style={styles.headerCell}>
                                            <MaterialCommunityIcons name='rocket-launch' size={hp(4)} color='#5bbaf5' style={{ backgroundColor: '#e7f5fe', borderRadius: 50, padding: 6, marginBottom: hp(1) }} />
                                            <Text style={{ paddingBottom: hp(2), fontFamily: fontFamily.FONTS.Medium, color: '#333', fontSize: hp(2.7) }}>VIP</Text>
                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.secondaryGray, fontSize: hp(2.2) }}>$30/ 1 month</Text>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}>Featured member</Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}>See profile visitors</Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}>Show / Hide last seen</Text>
                                        <Text style={styles.nameCell}><Entypo name='cross' size={20} color={COLORS.secondaryGray} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}>Verified badge</Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                        <Text style={styles.nameCell}><Entypo name='check' size={20} color={COLORS.darkGreeen} /></Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}>Post promotion</Text>
                                        <Text style={styles.nameCell}>1 Post</Text>
                                        <Text style={styles.nameCell}>1 Posts</Text>
                                        <Text style={styles.nameCell}>1 Posts</Text>
                                        <Text style={styles.nameCell}>1 Posts</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}>Pages promotion</Text>
                                        <Text style={styles.nameCell}>1 Page</Text>
                                        <Text style={styles.nameCell}>2 Pages</Text>
                                        <Text style={styles.nameCell}>5 Pages</Text>
                                        <Text style={styles.nameCell}>30 Pages</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}>Discount</Text>
                                        <Text style={styles.nameCell}><Entypo name='cross' size={20} color={COLORS.secondaryGray} /></Text>
                                        <Text style={styles.nameCell}>10% Discount</Text>
                                        <Text style={styles.nameCell}>20% Discount</Text>
                                        <Text style={styles.nameCell}>30% Discount</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}>Max upload size</Text>
                                        <Text style={styles.nameCell}>24 MB</Text>
                                        <Text style={styles.nameCell}>48 MB</Text>
                                        <Text style={styles.nameCell}>96 MB</Text>
                                        <Text style={styles.nameCell}>256 MB</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}>More info</Text>
                                        <Text style={styles.nameCell}>Get started!</Text>
                                        <Text style={styles.nameCell}>Get Hot! More features.</Text>
                                        <Text style={styles.nameCell}>Oh yeah, join the ultima!</Text>
                                        <Text style={styles.nameCell}>GO Limitless!</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.nameCell1}></Text>
                                        <View style={styles.nameCellButton}>
                                            <TouchableOpacity style={{ backgroundColor: '#79c149', borderRadius: 20, }} onPress={toggelModel}>
                                                <Text style={{ color: COLORS.white, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), padding: 8 }}>Upgrade Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.nameCellButton}>
                                            <TouchableOpacity style={{ backgroundColor: '#dd3c3c', borderRadius: 20, }} onPress={toggelModel}>
                                                <Text style={{ color: COLORS.white, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), padding: 8 }}>Upgrade Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.nameCellButton}>
                                            <TouchableOpacity style={{ backgroundColor: '#fb924b', borderRadius: 20, }} onPress={toggelModel}>
                                                <Text style={{ color: COLORS.white, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), padding: 8 }}>Upgrade Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.nameCellButton}>
                                            <TouchableOpacity style={{ backgroundColor: '#5bbaf5', borderRadius: 20, }} onPress={toggelModel}>
                                                <Text style={{ color: COLORS.white, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), padding: 8 }}>Upgrade Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* delete model */}
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={modelVisible}
                                        onRequestClose={toggelModel}
                                    >
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                            <View style={styles.reportModelContainer}>
                                                <View style={{ padding: 10, marginBottom: hp(1) }}>
                                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.black }}>Pay By Wallet</Text>
                                                    </View>

                                                </View>
                                                <View style={{ paddingHorizontal: 4, }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 5, backgroundColor: '#feeceb' }}>

                                                        <Text style={{ color: COLORS.darkgray1, padding: 13, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2) }}>
                                                            Available funds to withdrawal: $0, minimum withdrawal request is $50</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginTop: hp(3), borderRadius: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                                        <TouchableOpacity style={{
                                                            backgroundColor: '#dd6a70',
                                                            borderRadius: 10,
                                                            // padding: 3,
                                                            height: hp(4.5),
                                                            width: wp(35),
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }} >
                                                            {loading ? (
                                                                <Loader isLoading={loading} color='white' />
                                                            ) : (
                                                                <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.white }}>Pay Now $3</Text>
                                                            )}
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>

                                </View>
                            </ScrollView>
                        </View>
                    </View>

                    <View style={styles.container}>
                        <View style={styles.Information}>
                            <Text style={{ padding: 10, fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.5), color: COLORS.darkgray1, }}>Why Choose Pro?</Text>
                            <View style={{ padding: 10 }}>
                                <View style={{ marginBottom: hp(2), padding: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLORS.gray }}>
                                    <Image source={require('../../../assets/image/img/superhero.png')} style={{ height: hp(10), width: wp(20), marginHorizontal: wp(3) }} />
                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.2), color: COLORS.darkgray1, marginHorizontal: wp(3) }}>Featured member</Text>
                                </View>
                                <View style={{ padding: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLORS.gray }}>
                                    <Image source={require('../../../assets/image/img/go-pro/lastseen.png')} style={{ height: hp(10), width: wp(20), marginHorizontal: wp(3) }} />
                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.2), color: COLORS.darkgray1, marginHorizontal: wp(3) }}>Show / Hide last seen</Text>
                                </View>
                                <View style={{ marginVertical: hp(2), padding: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLORS.gray }}>
                                    <Image source={require('../../../assets/image/img/go-pro/post.png')} style={{ height: hp(10), width: wp(20), marginHorizontal: wp(3) }} />
                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.2), color: COLORS.darkgray1, marginHorizontal: wp(3) }}>Posts promotion</Text>
                                </View>
                                <View style={{ marginBottom: hp(2), padding: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLORS.gray }}>
                                    <Image source={require('../../../assets/image/img/go-pro/verify.png')} style={{ height: hp(10), width: wp(20), marginHorizontal: wp(3) }} />
                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.2), color: COLORS.darkgray1, marginHorizontal: wp(3) }}>Verified badge</Text>
                                </View>

                                <Text style={{ padding: 10, fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.5), color: COLORS.darkgray1, }}>Become a Pro member and access these features</Text>

                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UpgradeToPro;

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
            marginHorizontal: 20,
            marginTop: hp(-4),
            borderRadius: 10,
            height: 'auto',
            padding: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        Information: {
            marginHorizontal: 20,
            marginTop: hp(4),
            borderRadius: 10,
            height: 'auto',
            padding: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        title: {
            color: global.text.color,
            fontSize: hp(2.7),
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
        reportModelContainer: {
            marginTop: 25,
            padding: 15,
            width: wp(90),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            borderRadius: 10
        },
        // Header styles
        headerRow: {
            marginTop: hp(3),
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: COLORS.gray
            // backgroundColor: '#f2f2f2',
        },
        headerCell1: {
            fontSize: hp(2.3),
            color: '#333',
            paddingHorizontal: wp(20),
            width: wp(65),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.regular
        },
        headerCell: {
            fontSize: hp(2.7),
            color: '#333',
            paddingHorizontal: wp(10),
            width: wp(40),
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: fontFamily.FONTS.Medium
        },
        // User data row styles
        row: {
            flexDirection: 'row',
            backgroundColor: COLORS.white,
            marginHorizontal: wp(3),
            borderRadius: 5,
            // justifyContent: 'center',
            padding: 15,
            borderBottomWidth: 0.5,
            borderBottomColor: COLORS.gray,
        },
        cell: {
            flex: 1,
            fontSize: hp(2.2),
            color: '#555',
            justifyContent: 'space-around'
            // textAlign: 'center',
            // alignItems: 'center'
        },
        // Width for each column
        nameCellButton: {
            fontSize: hp(2.2),
            color: '#555',
            width: wp(40),
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: fontFamily.FONTS.Medium,
            paddingVertical: hp(1)
        },
        nameCell: {
            fontSize: hp(2.2),
            color: '#555',
            width: wp(40),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.Medium,
            paddingVertical: hp(1)
        },
        nameCell1: {
            fontSize: hp(2.2),
            color: '#555',
            width: wp(65),
            textAlign: 'left',
            fontFamily: fontFamily.FONTS.Medium,
            paddingVertical: hp(1)
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            // marginHorizontal: 15
        },
    });
};