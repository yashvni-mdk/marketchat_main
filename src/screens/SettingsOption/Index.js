import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, ScrollView, ToastAndroid, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { useDispatch } from 'react-redux';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import fontFamily from '../../../constants/fontFamily';
import { useNavigation } from '@react-navigation/native';
import BasicHeader from '../../components/BasicHeader';
import SelectDropdown from 'react-native-select-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign'
import flag1 from '../../../assets/image/flag1.png'
import flag2 from '../../../assets/image/flag2.png'
import translations from '../../utils/localization/traslations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const SettingOption = ({navigation}) => {
    const {t, i18n} = useTranslation();
    // const navigation = useNavigation();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const global = globalStyles(theme);
    const [firstValue, setFirstValue] = useState('');
    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme, WD, WH),
    });

    const handleNavigation = (screenName) => {
        navigation.navigate('SettingScreen', { selectedOption: screenName });
    };
    const languageList = [t('english'), t('vietnamese')];
    const navigationOptions = [
        { text: t('general'), navigateTo: 'GeneralSetting', icon: { name: 'settings', category: 'MaterialIcons', color: '#535353', backgroundColor: '#eeeeee' } },
        { text: t('profile'), navigateTo: 'ProfileSetting', icon: { name: 'face-man-profile', category: 'MaterialCommunityIcons', color: '#00bcd4', backgroundColor: '#e5f8fa' } },
        // { text: 'Social Links', navigateTo: 'SocialLinks', icon: { name: 'link-box-variant', category: 'MaterialCommunityIcons', color: '#1da1f2', backgroundColor: '#e8f5fd' } },
        { text: t('notification_setting'), navigateTo: 'NotificationSettings', icon: { name: 'notifications-on', category: 'MaterialIcons', color: '#673ab7', backgroundColor: '#efebf7' } },
        { text: t('avatar_and_cover'), navigateTo: 'Avatar', icon: { name: 'camera', category: 'MaterialIcons', color: '#b1def9', backgroundColor: '#e8f5fd' } },
        { text: t('privacy'), navigateTo: 'Privacy', icon: { name: 'shield-account', category: 'MaterialCommunityIcons', color: '#673ab7', backgroundColor: '#efebf7' } },
        { text: t('language'), navigateTo: 'Language', icon: { name: 'language', category: 'MaterialIcons', color: '#673ab7', backgroundColor: '#efebf7' } },
        { text: t('password'), navigateTo: 'Password', icon: { name: 'lock', category: 'MaterialIcons', color: '#00bcd4', backgroundColor: '#e5f8fa' } },
        // { text: 'Manage Sessions', navigateTo: 'Manage Sessions', icon: { name: 'fingerprint', category: 'MaterialIcons', color: '#b375eb', backgroundColor: '#f0e6f9' } },
        // { text: 'Two-factor authentication', navigateTo: 'Authentication', icon: { name: 'two-factor-authentication', category: 'MaterialCommunityIcons', color: '#0606ff', backgroundColor: '#e5e5ff' } },
        { text: t('blocked_users'), navigateTo: 'BlockList', icon: { name: 'account-remove', category: 'MaterialCommunityIcons', color: '#e0624b', backgroundColor: '#f8ecea' } },
        // { text: 'My Information', navigateTo: 'MyInformation', icon: { name: 'file-document', category: 'MaterialCommunityIcons', color: '#688491', backgroundColor: '#eff2f3' } },
        // { text: 'My Addresses', navigateTo: 'MyAddresses', icon: { name: 'location', category: 'Entypo', color: '#688491', backgroundColor: '#eff2f3' } },
        { text: t('my_earnings'), navigateTo: 'MyEarnings', icon: { name: 'money', category: 'FontAwesome', color: '#607d8b', backgroundColor: '#eceff0' } },
        { text: t('my_affiliates'), navigateTo: 'MyAffiliates', icon: { name: 'group', category: 'MaterialIcons', color: '#d2691e', backgroundColor: '#faf0e8' } },
        { text: t('my_points'), navigateTo: 'Points', icon: { name: 'coins', category: 'FontAwesome5', color: '#ff7f50', backgroundColor: '#f6e9e4' } },
        { text: t('wallet_and_credits'), navigateTo: 'Wallet', icon: { name: 'wallet', category: 'MaterialIcons', color: '#00bcd4', backgroundColor: '#e5f8fa' } },
        { text: t('delete_account'), navigateTo: 'DeleteAccount', icon: { name: 'delete', category: 'MaterialIcons', color: '#f44336', backgroundColor: '#fdecea' } },
    ]

    useEffect(() => {
        const subscribe = navigation.addListener('focus', () => {
            handleLanguageSelection();
          });
          return subscribe;
    }, [navigation]);

    const handleLanguageSelection = async () => {
        const language = await AsyncStorage.getItem('language');
        console.log('get Location>>', language);
        if (language == 'en') {
          setFirstValue('English');
        } else if (language == 'vs') {
          setFirstValue('Tiếng Việt');
        }
    };

    const renderModelItems = () => {
        return navigationOptions.map((option, index) => (
            option.text == t('language') ? 
            <View
                key={index}
                style={styles.modelContent}
                // onPress={() => handleNavigation(option.navigateTo)}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(5), padding: 3, paddingTop: 8 }}>
                    {option.icon.category === 'MaterialIcons' && (
                        <MaterialIcons name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}
                    {option.icon.category === 'FontAwesome' && (
                        <FontAwesome name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}
                    {option.icon.category === 'FontAwesome5' && (
                        <FontAwesome5 name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}
                    {option.icon.category === 'MaterialCommunityIcons' && (
                        <MaterialCommunityIcons name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}
                    {option.icon.category === 'Entypo' && (
                        <Entypo name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}

                    <Text style={[styles.options]}>{option.text}</Text>
                </View>
                <View style={styles.logoutButton}>
                <SelectDropdown
                  data={languageList}
                  onSelect={(selectedItem, index) => {
                    console.log('selectItem 1', selectedItem);
                    if (selectedItem == t('english')) {
                      setFirstValue('English');
                      i18n.changeLanguage('en');
                      AsyncStorage.setItem('language', 'en');
                    } else if (selectedItem == 'Vietnamese') {
                      setFirstValue('Tiếng Việt');
                      i18n.changeLanguage('vs');
                      AsyncStorage.setItem('language', 'vs');
                    }
                  }}
                  defaultButtonText={firstValue}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    console.log('selectItem', selectedItem);
                    if (selectedItem == 'Tiếng Anh' || selectedItem == 'English') {
                      return 'English';
                    } else if (selectedItem == 'Vietnamese' || selectedItem == 'Tiếng Việt') {
                      return 'Tiếng Việt';
                    }
                  }}
                rowTextForSelection={(item, index) => {
                    return item;
                  }}
                renderButton={(selectedItem, isOpened) => {
                    console.log('selectedItem 2', selectedItem);
                    return (
                        <View
                          style={{
                             flexDirection: 'row',
                             alignItems: 'center',
                             paddingHorizontal: 6,
                             borderRadius: 7,
                             borderWidth: 0.5,
                             borderColor: COLORS.gray,
                             width: wp(32) }}>
                        <Text style={{ color: COLORS.darkgray1, fontSize: hp(1.8), fontFamily: fontFamily.FONTS.regular, padding: 6, width: wp(25) }}>
                            {firstValue}
                        </Text>
                        <AntDesign name="down" size={12} color={COLORS.darkgray} />
                        </View>
                    );
                }}
                  renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                        <Image
                          style={{width: wp(5), height: hp(3), resizeMode: 'contain'}}
                          source={item == t('english') ? flag1 : flag2}
                        />
                        <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                        </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </View>
            </View>
            :
            <TouchableOpacity
                key={index}
                style={styles.modelContent}
                onPress={() => handleNavigation(option.navigateTo)}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(5), padding: 3, paddingTop: 8 }}>
                    {option.icon.category === 'MaterialIcons' && (
                        <MaterialIcons name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}
                    {option.icon.category === 'FontAwesome' && (
                        <FontAwesome name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}
                    {option.icon.category === 'FontAwesome5' && (
                        <FontAwesome5 name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}
                    {option.icon.category === 'MaterialCommunityIcons' && (
                        <MaterialCommunityIcons name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}
                    {option.icon.category === 'Entypo' && (
                        <Entypo name={option.icon.name} size={20} color={option.icon.color} style={{ backgroundColor: option.icon.backgroundColor, borderRadius: 50, padding: 7 }} /> // Adjust size and color as needed
                    )}

                    <Text style={[styles.options]}>{option.text}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={17} color={COLORS.darkgray1} />
            </TouchableOpacity>
        ))
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={t('setting')} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View style={styles.headerContainer}>
                        <View style={styles.header}>
                            {renderModelItems()}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default SettingOption;

const localStyles = (theme, WD, WH) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        modelView: {
            backgroundColor: global.ContentContainer.backgroundColor,
            borderColor: COLORS.gray,
            borderRadius: 10,
            borderWidth: 0.5,
            padding: 13,
            width: '100%',
            height: '95%',
            justifyContent: 'center',
        },
        modelContent: {
            padding: 3,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 6
        },
        
        modelText: {
            fontSize: 16,
            padding: 4,
            paddingHorizontal: 15,
            fontFamily: fontFamily.FONTS.regular,
            color: '#555555',
        },
        headerContainer: {
            marginTop: hp(1),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: 10,
        },
        header: {
            justifyContent: 'flex-start'
        },
        options: {
            paddingHorizontal: wp(5),
            fontSize: 15,
            fontFamily: fontFamily.FONTS.regular,
            color: COLORS.secondaryGray
        },
        logoutButton: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          },
          dropdown2BtnStyle: {
            width: wp(50),
            height: hp(5.5),
            backgroundColor: COLORS.secondaryWhite,
            borderRadius: 8,
            alignSelf: 'flex-end',
          },
          dropdown2BtnTxtStyle: {
            color: COLORS.black,
            fontFamily: fontFamily.FONTS.regular,
            fontSize: hp(2),
            textAlign: 'left',
          },
          dropdownMenuStyle: {
            backgroundColor: '#E9ECEF',
            borderRadius: 8,
            width: wp(32),
          },
          dropdownItemStyle: {
            width: '100%',
            flexDirection: 'row',
            paddingHorizontal: 12,
            alignItems: 'center',
            paddingVertical: 8,
          },
          dropdown2DropdownStyle: {
            backgroundColor: COLORS.white,
            borderRadius: 12,
            // borderRadius: 12,
          },
          dropdown2RowTxtStyle: {
            color: '#000',
            fontFamily: fontFamily.FONTS.regular,
            fontSize: hp(2),
            textAlign: 'left',
            paddingLeft: wp(2),
          },
          imageIcon: {
            width: wp(4),
            height: hp(3),
            resizeMode: 'contain',
          },
          selecterIcon: {
            width: wp(7),
            height: hp(4),
            resizeMode: 'contain',
          },
          dropdownItemTxtStyle: {
            color: COLORS.black,
            fontFamily: fontFamily.FONTS.regular,
            fontSize: hp(1.8),
            marginLeft: wp(2),
          },
          dropdownView: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: wp(2),
          },
    })
}