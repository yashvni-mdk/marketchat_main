/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import CheckBox from '../../components/CheckBox';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { ToastAndroid } from 'react-native'
import translations from '../../utils/localization/traslations';
import LinearGradient from 'react-native-linear-gradient';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import {useTranslation} from 'react-i18next';

const ContactUs = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const isLoginButtonDisabled = !(firstName && lastName && email && message && isChecked);

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
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
                                {t('Contact_us')}
                            </Text>
                        </View>
                    </LinearGradient>
                    <View style={styles.container}>
                        <View style={styles.ContentContainer}>
                            <View style={styles.content}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>{t('first_name')}</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={firstName}
                                        onChangeText={text => setFirstName(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>{t('last_name')}</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={lastName}
                                        onChangeText={text => setLastName(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>{t('email')}</Text>
                                    <CustomInput
                                        keyboardType="email-address"
                                        value={email}
                                        onChangeText={text => setEmail(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>{t('message')}</Text>
                                    <CustomInput
                                        multiline={true}
                                        numberOfLines={4}
                                        keyboardType="default"
                                        value={message}
                                        onChangeText={text => setMessage(text)}
                                    />
                                </View>
                                <View style={styles.CheckBoxContainer}>
                                    <CheckBox isChecked={isChecked} handleCheck={()=>setIsChecked(!isChecked)} />
                                    <Text style={styles.checkBoxtext} >{t('agree_with_Privacy_Policy_to_receive_communication')}
                                    </Text>
                                </View>

                                <Button
                                    title={t('send')}
                                    disabled={isLoginButtonDisabled}
                                    onPress={handelContactUs}
                                />

                            </View>
                        </View>
                     
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ContactUs;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor
        },
        HandingtextContainer: {
            // minHeight: hp(20),
            // backgroundColor: COLORS.green,
            justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: COLORS.white,
            justifyContent: 'center',
            alignItems: 'center',
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
            backgroundColor: global.ContentContainer.backgroundColor
        },
        inputContainer: {
            marginTop: 10,
        },
        lable: {
            fontSize: 16,
            color: global.text.color,
            fontWeight: '600',
            marginVertical: 4,
        },
        CheckBoxContainer: {
            flexDirection: 'row',
            paddingTop: 10,
        },
        checkBoxtext: {
            color: global.text.color,
            fontSize: 15
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};