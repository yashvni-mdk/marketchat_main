/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../CustomInput';
import Button from '../Button';
import Footer from '../Footer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
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
import { Loader } from '../Loader';

const MyEarnings = () => {
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
    const [loading, setLoading] = useState(false)

    const handleContactUs = () => {
        setLoading(true);

        // Simulating an asynchronous action with setTimeout
        setTimeout(() => {
            setLoading(false);
            ToastAndroid.show('Work in process', ToastAndroid.SHORT);
        }, 2000); // Simulating a 2-second delay, replace with actual async operation
    };

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={styles.container}>
                        <View style={styles.ContentContainer}>
                            <View style={styles.content}>
                                <View style={styles.HandingtextContainer}>
                                    <View>
                                        <Image source={{ uri: user_data?.avatar }} style={{ height: hp(10), width: wp(20), borderRadius: 70 }} />
                                        <View style={{ position: 'absolute', top: hp(5.5), left: wp(14) }}>
                                            <FontAwesome name='money' size={19} color={COLORS.white} style={{ backgroundColor: '#008000', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(5) }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            My Earings $0.00
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={{ marginVertical: hp(2), flexDirection: 'row', alignItems: 'center', borderRadius: 5, backgroundColor: '#feeceb' }}>

                                        <Text style={{ color: '#f44639', padding: 13, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2) }}>
                                            <AntDesign name='warning' size={18} color={'#f44639'} />
                                            Available funds to withdrawal: $0, minimum withdrawal request is $50</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#feeceb', borderRadius: 5, backgroundColor: '#fef4ec' }}>
                                        <Text style={{ color: '#f5ad6f', padding: 13, fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.2) }}>Please note that you are able to withdrawal only your Earnings, wallet top ups are not withdrawable</Text>
                                    </View>
                                    <View style={{ marginTop: hp(2) }}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Withdraw Method</Text>
                                            <View style={styles.dropDownContainer}>
                                                <Picker
                                                    selectedValue={withdrawMethod}
                                                    onValueChange={(itemValue, itemIndex) => setWithdrawMethod(itemValue)}
                                                    style={styles.dropDown} itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label='PayPal' value={'PayPal'} style={styles.lable} />
                                                </Picker>
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>PayPal email</Text>
                                            <CustomInput
                                                keyboardType="email-address"
                                                value={paypalEmail}
                                                onChangeText={text => setPayPalEmail(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Amount</Text>
                                            <CustomInput
                                                keyboardType="numeric"
                                                value={amount}
                                                onChangeText={text => setAmount(text)}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(3), borderRadius: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity style={{
                                        height: hp(4.8),
                                        backgroundColor: COLORS.red,
                                        // borderColor: COLORS.black,
                                        // borderWidth: 2,
                                        borderRadius: 12,
                                        width: wp(66),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }} onPress={handleContactUs}>
                                        {loading ? (
                                            <Loader isLoading={loading} color='white' />
                                        ) : (
                                            <Text style={{ paddingHorizontal: wp(10), fontSize: 17, color: COLORS.white }}>Request Withdrawal</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.ContentContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="history" size={20} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 100, padding: 3 }} />
                                <Text style={{ paddingHorizontal: 7, fontFamily: fontFamily.FONTS.Medium, color: COLORS.black, fontSize: hp(2.2) }}>Payment History</Text>
                            </View>

                            <View style={{ padding: 10, marginTop: hp(3), borderRadius: 3, borderWidth: 0.6, borderColor: COLORS.gray }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={styles.headerRow}>
                                            <Text style={styles.headerCell}>#</Text>
                                            <Text style={styles.headerCell}>Amount</Text>
                                            <Text style={styles.headerCell}>Requested</Text>
                                            <Text style={styles.headerCell}>Status</Text>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MyEarnings

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
            // flexWrap: 'wrap',
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
            height: hp(5.4),
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

        dropDown: {
            width: '100%',
            minHeight: 40, // Set minHeight or remove for explicit height
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            width: '100%',
            // backgroundColor: '#f2f2f2',
        },
        headerCell1: {
            fontSize: hp(2.2),
            color: '#333',
            paddingHorizontal: wp(20),
            // width: wp(5),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.Medium,
        },
        headerCell: {
            fontSize: hp(2.2),
            color: '#333',
            paddingHorizontal: wp(10),
            // width: wp(10),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.Medium
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};