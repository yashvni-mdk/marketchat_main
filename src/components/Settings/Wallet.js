/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../CustomInput';
import Button from '../Button';
import Footer from '../Footer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CheckBox from '../CheckBox';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header';
import { globalStyles } from '../GlobalTheme';
import { useTheme } from '../ThemeContext';
import { ToastAndroid } from 'react-native'
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../Pixel/index';
import fontFamily from '../../../constants/fontFamily';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import BasicHeader from '../BasicHeader';
import NoTransaction from '../Svg/NoTransaction';
import { SendMoneyPopup } from '../SendMoneyPopup';

const Wallet = () => {
    const user_data = useSelector(state => state.user_data);
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const [withdrawMethod, setWithdrawMethod] = useState('PayPal')
    const [paypalEmail, setPayPalEmail] = useState('');
    const [amount, setAmount] = useState('0');
    const [showAddFunds, setShowAddFunds] = useState(false); // State to toggle Add Funds components
    const [addMoneyVisible, setAddMoneyVisible] = useState(false);

    const toggleAddFunds = () => {
        setShowAddFunds(!showAddFunds);
    };

    const handelContactUs = () => {
        setAddMoneyVisible(true)
    }

    return (
        <>
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/**  <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Wallet'} />
                </View>  */}
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, marginTop: 25, backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="select-group" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                    <Text style={{ marginHorizontal: 10, fontSize: hp(2.3), color: global.text2.color, }}>Wallets & Credits</Text>
                                </View>

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.red, borderRadius: 10, padding: 5, }} onPress={() => navigation.navigate('SettingScreen', { selectedOption: 'MyEarnings' })}>
                                    <MaterialCommunityIcons name="bank-transfer" size={22} color={COLORS.white} />
                                    <Text style={{ fontSize: hp(2.1), color: COLORS.white }}>Withdrawal</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ minHeight: hp(30), alignItems: 'center', padding: 10, marginTop: 25, backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10 }}>
                            <View style={{ paddingTop: hp(5), alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: COLORS.black, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2), }}>current balance</Text>
                                <Text style={{ color: COLORS.red, paddingTop: hp(1), fontSize: hp(8), }}>{user_data.wallet}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: hp(2), padding: 10, borderRadius: 10, alignItems: 'center',justifyContent: 'center' }}>
                                <TouchableOpacity style={{ backgroundColor: '#ebeef0', flexDirection: 'row', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, }} onPress={handelContactUs} >
                                    <MaterialCommunityIcons name="send" size={20} color={COLORS.secondaryGray} style={{marginTop: hp(0.3)}} />
                                    <Text style={{ fontSize: hp(2.3), color: COLORS.secondaryGray, marginLeft: wp(2) }}>Send money</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: COLORS.red, flexDirection: 'row', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, marginHorizontal: 14 }} onPress={toggleAddFunds} >
                                    <MaterialCommunityIcons name="wallet-plus" size={20} color={COLORS.white} style={{marginTop: hp(0.3)}}/>
                                    <Text style={{ fontSize: hp(2.3), color: COLORS.white, marginLeft: wp(2) }}>Add Funds</Text>
                                </TouchableOpacity>
                            </View>

                            {showAddFunds && (
                                <View>                   
                                    <View style={{ paddingTop: hp(2), alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: COLORS.black, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2), }}>Replenish my balance</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: COLORS.black, paddingTop: hp(1), fontSize: hp(6), }}>$</Text>
                                        <TextInput
                                            style={{ color: COLORS.red, paddingTop: hp(1), fontSize: hp(6), }}
                                            placeholder='0.00'
                                            keyboardType='numeric'
                                            placeholderTextColor={COLORS.darkgray1}
                                        />
                                    </View>
                                    <TouchableOpacity style={{ backgroundColor: COLORS.red, flexDirection: 'row', borderRadius: 10, padding: 5, marginHorizontal: 14 }} onPress={handelContactUs} >
                                        <MaterialCommunityIcons name="check-all" size={22} color={COLORS.white} style={{ paddingHorizontal: 5, }} />
                                        <Text style={{ paddingHorizontal: 7, fontSize: hp(2.3), color: COLORS.white }}>Continue</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={{ minHeight: hp(30), padding: 10, marginTop: 25, backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10 }}>
                            <View style={{ paddingTop: hp(1), }}>
                                <Text style={{ color: COLORS.black, fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.2), }}>Transactions</Text>
                            </View>
                            <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../../../assets/image/img/no_transaction.png')} style={{ height: hp(12), width: wp(24), marginTop: hp(4) }} />
                                <Text style={{ marginVertical: hp(3), color: COLORS.secondaryGray, fontFamily: fontFamily.FONTS.regular, textAlign: 'center', fontSize: hp(2.1) }}>Looks like you don`t have any transsactions yet !</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        <SendMoneyPopup
            modelVisible={addMoneyVisible}
            setModelVisible={setAddMoneyVisible}
        />
        </>
    )
}

export default Wallet

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor
        },
        HandingtextContainer: {
            padding: wp(5),
            minHeight: hp(15),
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#e2f1e2',
            backgroundColor: '#f5faf5',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#008000',
            fontSize: wp(6),
            fontFamily: fontFamily.FONTS.Medium,
            marginBottom: 10,
            // padding: 5,
        },
        ContentContainer: {
            margin: 10,
            borderRadius: 10,
            padding: 20,
            backgroundColor: global.ContentContainer.backgroundColor
        },
        inputContainer: {
            marginTop: 10,
        },
        lable: {
            fontSize: hp(2.2),
            color: global.text.color,
            fontWeight: '600',
            marginVertical: 4,
        },
        username: {
            fontSize: hp(2.2),
            color: '#008000',
            fontFamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        CheckBoxContainer: {
            flexDirection: 'row',
            paddingTop: 10,
        },
        checkBoxtext: {
            color: global.text.color,
            fontSize: hp(2.1)
        },
        exampleText: {
            fontFamily: fontFamily.FONTS.regular,
            fontSize: hp(2),
            color: '#757575'
        },
        timepickerContainer: {
            width: '100%',
            height: 40,
            flexDirection: 'row',
            paddingHorizontal: 4,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        dropDownContainer: {
            marginTop: 10,
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            // marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            overflow: 'hidden',
        },
        dropDown: {
            width: '100%',
            minHeight: 40, // Set minHeight or remove for explicit height
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
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
        CheckBoxContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 20,
        },
        checkBoxtext: {
            color: global.text.color,
            paddingLeft: 10
        },
        dropDownContainer: {
            marginTop: 10,
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            // marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
            height: 45,
            overflow: 'hidden',
        },
        dropDown: {
            width: '100%',
            minHeight: 40, // Set minHeight or remove for explicit height
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};