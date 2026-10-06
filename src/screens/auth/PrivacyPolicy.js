/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
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
import {useTranslation} from 'react-i18next';

const PrivacyPolicy = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor, }}>
            <ScrollView>
                <View>
                    <Header navigation={navigation} />
                    <LinearGradient
                        colors={['#43ac56', '#2da467', '#2da467', '#0c9a7e']} // Replace these colors with your gradient colors
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ height: hp(18), padding: hp(3) }}
                    >
                        <View style={styles.HandingtextContainer}>
                            <Text style={styles.Handingtext}>
                                {t('Privacy_policy')}
                            </Text>
                        </View>
                    </LinearGradient>
                    <View style={styles.container}>
                        <View style={styles.ContentContainer}>
                            <View style={styles.content}>
                                <Text style={styles.title}>Who we are?</Text>
                                <Text style={styles.mainContent}>
                                    Provide name and contact details of the data controller.
                                </Text>
                            </View>
                        </View>
                     
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PrivacyPolicy;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
        },
        HandingtextContainer: {
            // minHeight: hp(20),
            // backgroundColor: COLORS.green,
            justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: COLORS.white,
            // justifyContent: 'center',
            // alignItems: 'center',
            fontSize: 42,
            fontFamily: fontFamily.FONTS.regular,
            // marginBottom: 6,
            padding: 10,
            // paddingHorizontal: 30
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