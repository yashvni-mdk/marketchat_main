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

const Terms = () => {
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
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <Header navigation={navigation} />
                    <LinearGradient
                        colors={['#43ac56', '#2da467', '#2da467', '#0c9a7e']} // Replace these colors with your gradient colors
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ height: hp(18), padding: hp(3) }}
                    >
                        <Text style={styles.Handingtext}>
                            {t('terms_of_use')}
                        </Text>
                    </LinearGradient>
                    <View style={styles.container}>
                        <View style={styles.ContentContainer}>
                            <View style={styles.content}>
                                <Text style={styles.title}>1- Write your Terms Of Use here. </Text>
                                <Text style={styles.mainContent}>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis sdnostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </Text>
                                <View>
                                    <Text style={styles.title}>1- Write your Terms Of Use here. </Text>
                                    <Text style={styles.mainContent}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis sdnostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Terms;

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
           
            fontSize: 42,
            fontFamily: fontFamily.FONTS.regular,
            // marginBottom: 6,
            padding: 10,
            paddingHorizontal: 30
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