/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React from 'react';
import { COLORS } from '../../../constants';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import translations from '../../utils/localization/traslations';
import {useTranslation} from 'react-i18next';

const About = () => {
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
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container}}>
            <ScrollView>
                <View>
                    <Header navigation={navigation} />
                    <View style={styles.imageContainer}>
                        <Image source={require('../../../assets/image/img/about-us.jpg')} style={styles.image} />
                        <View style={styles.overlay} />
                        <View style={styles.textOverlay}>
                            <Text style={styles.overlayText}>{t('About_MarketChat')}</Text>
                            <Text style={styles.overlayText2}>{t('AI_based_chat_system_for_new_aera_of_intelligence')}</Text>
                        </View>
                    </View>
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

export default About;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor
        },
        imageContainer: {},
        image: {
            width: '100%',
            height: 180,
            // marginVertical: 10,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(198,77,83,0.5)',
        },
        textOverlay: {
            position: 'absolute',
            bottom: 20, // Adjust the position from the bottom as needed
            left: 0,
            right: 0,
            top: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        overlayText: {
            color: COLORS.white,
            fontSize: 32,
            fontWeight: 'bold',
            flexWrap: 'wrap',
        },
        overlayText2: {
            paddingTop: 7,
            paddingHorizontal: 8,
            color: COLORS.gray, // Set your desired text color
            fontSize: 16, // Adjust the font size as needed
            fontWeight: 'bold', // Set the font weight if necessary
            flexWrap: 'wrap',
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
            margin: 20,
            borderRadius: 10,
            padding: 20,
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
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};