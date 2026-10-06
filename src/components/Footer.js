/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../constants';
import translations from '../utils/localization/traslations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightPercentageToDP as hp,widthPercentageToDP as wp} from './Pixel';
import fontFamily from '../../constants/fontFamily';


const Footer = ({ navigation }) => {
    const [modelVisible, setModelVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');

    useEffect(() => {
        async function loadSelectedLanguage() {
            try {
                const language = await AsyncStorage.getItem('language');
                if (language) {
                    if (language === 'EN') {
                        translations.setLanguage(1);
                        setSelectedLanguage('English')
                    } else if (language === 'VN') {
                        translations.setLanguage(2);
                        setSelectedLanguage('Vietnam');
                    }
                }
            } catch (error) {
                console.error('Error loading language:', error)
            }
        }
        loadSelectedLanguage();
    }, [])

    const handleLanguageSelection = async (language) => {
        if (language === 'English') {
            translations.setLanguage(1);
            await AsyncStorage.setItem('language', 'EN');
            setSelectedLanguage('English');
        } else {
            translations.setLanguage(2);
            await AsyncStorage.setItem('language', 'VN');
            setSelectedLanguage('Vietnam');
        }
        setModelVisible(false);
    };

    return (
        <View style={{alignItems:'center',justifyContent:'center',marginTop:hp(2)}}>
            <Text style={styles.footerText}>© 2023 MarketChat</Text>
        <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('TabStack')}>
                <Text style={styles.optionText}>{translations.home}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('About')}>
                <Text style={styles.optionText}>{translations.About}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ContactUs')}>
                <Text style={styles.optionText}>{translations.Contact_us}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Text style={styles.optionText}>{translations.Privacy_policy}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                <Text style={styles.optionText}>{translations.terms_of_use}</Text>
            </TouchableOpacity>
           
            <TouchableOpacity onPress={() => {}}>
                <Text style={styles.optionText}>{translations.request_a_refund}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Blog')}>
                <Text style={styles.optionText}>{translations.Blog}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>{}}>
                <Text style={styles.optionText}>{translations.developers}</Text>
            </TouchableOpacity>
           
        </View>
        <TouchableOpacity onPress={() => setModelVisible(true)}>
                <Text style={styles.optionText}>{translations.Language}: {selectedLanguage}</Text>
            </TouchableOpacity>

            <Modal visible={modelVisible} animationType="slide" onRequestClose={() => setModelVisible(false)}>
                <View style={styles.conteredView}>
                    <View style={styles.modelView}>
                        <Text style={styles.modelText}>
                            Selected Language:
                        </Text>
                        <TouchableOpacity onPress={() => handleLanguageSelection('English')}>
                            <Text style={styles.languageText}>
                                English
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleLanguageSelection('Vietnam')}>
                            <Text style={styles.languageText}>
                                Vietnam
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModelVisible(false)}>
                            <Text style={styles.closeText}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Footer;

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        width:'90%'
    },
    footerText: {
        color: COLORS.secondaryGray,
        paddingHorizontal: 5,
        fontFamily:fontFamily.FONTS.Medium,
        fontSize:hp(2)
    },
    optionText: {
        color: COLORS.darkgray,
        paddingHorizontal: 5,
        fontFamily:fontFamily.FONTS.regular,
        fontSize:hp(1.8)
    },
    conteredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.darkgray,
    },
    modelView: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modelText: {
        fontSize: 18,
        marginBottom: 15,
        fontFamily: fontFamily.FONTS.regular,
        color:COLORS.black 
    },
    languageText: {
        fontSize: 16,
        marginBottom: 10,
        color: COLORS.secondaryGray,
        fontFamily: fontFamily.FONTS.regular,
    },
    closeText: {
        fontSize: 16,
        color: COLORS.red,
        marginTop: 10,
        fontFamily: fontFamily.FONTS.regular,
    },

});
