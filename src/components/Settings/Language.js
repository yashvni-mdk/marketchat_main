import { SafeAreaView, ScrollView, StyleSheet, TextInput, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Entypo from 'react-native-vector-icons/Entypo';
import translations from '../../utils/localization/traslations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { COLORS } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';

const Language = () => {
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const language = [
        { languageName: 'English' },
        { languageName: 'Vietnamese' }
    ]

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
                        setSelectedLanguage('Vietnamese');
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
            setSelectedLanguage('Vietnamese');
        }
    };

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginVertical: hp(3), marginHorizontal: wp(4) }}>
                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}> The MarketChat app currently supports the following two languages:</Text>

                    <View style={{ paddingTop: 15 }}>
                        <FlatList
                            data={language}
                            keyExtractor={(item) => item.languageName}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 10,
                                        justifyContent: 'space-between',
                                        backgroundColor: selectedLanguage === item.languageName ? COLORS.lightOrange : 'transparent'
                                    }}
                                    onPress={() => handleLanguageSelection(item.languageName)}
                                >
                                    <View style={styles.languageContent}>
                                        <Entypo name="dot-single" size={18} color={COLORS.darkgray} style={{ marginRight: 8 }} />
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.3), color: COLORS.darkgray }}>
                                            {item.languageName}
                                        </Text>
                                    </View>

                                    {selectedLanguage === item.languageName && (
                                        <Entypo name="check" size={20} color={COLORS.darkgray} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={{ marginTop: hp(1) }}>
                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Once a language is selected, it is applied throughout the entire app.</Text>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Language

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        FollowingContainer: {
            marginTop: 25,
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            borderRadius: 10
        },
        CustomInput: {
            width: '100%',
            height: 40,
            paddingHorizontal: 4,
            backgroundColor: '#ededed',
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        FollowingContent: {
            padding: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        FollowingHading: {
            padding: 5,
            marginHorizontal: 5,
            fontSize: hp(2.3),
            color: global.text2.color
        },
        FollowersName: {
            padding: 5,
            fontSize: hp(2),
            color: global.text2.color
        },
        iconStyle: {
            backgroundColor: COLORS.red,
            borderRadius: 50,
            padding: 4
        },
        languageContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        FollowinghorizontalLine: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 1,
            // padding: 5,
            // marginHorizontal: 15,
        },

    })
}