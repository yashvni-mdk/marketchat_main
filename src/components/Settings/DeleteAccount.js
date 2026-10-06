/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Modal, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../CustomInput';
import Button from '../Button';
import Footer from '../Footer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CheckBox from '../CheckBox';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header';
import { globalStyles } from '../GlobalTheme';
import { useTheme } from '../ThemeContext';
import { ToastAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../Pixel/index';
import fontFamily from '../../../constants/fontFamily';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onDeleteAccountApi } from '../../Service/Api';
import { deleteUserAccount } from '../../redux/reducer';
import { Loader } from '../Loader';

const DeleteAccount = () => {
    const user_data = useSelector(state => state.user_data);
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });


    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    const toggleDeleteModel = (selectedPostId) => {
        setDeleteModel((prevVisible) => !prevVisible)
    }

    const [currentPassword, setCurrentPassword] = useState('')
    const [deleteModel, setDeleteModel] = useState(false)
    const [loading, setLoading] = useState(false)

    const isDeleteButtonDisabled = !(currentPassword);


    const DeleteUser = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('password', currentPassword)

                const response = await onDeleteAccountApi(formData, token)
                if (response.data.api_status === 200) {
                    setLoading(false)
                    dispatch(deleteUserAccount())
                    navigation.navigate('Login')
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    ToastAndroid.show(response.data.errors.error_text, ToastAndroid.SHORT)
                }
            } else {
                setLoading(false)
                console.log('User token not found', error.message)
                ToastAndroid.show('Somthing Went Wrong Please try again', ToastAndroid.SHORT)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }


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
                                            <MaterialIcons name='delete' size={19} color={COLORS.white} style={{ backgroundColor: '#f44336', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(5) }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            Delete Account
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Current Password</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={currentPassword}
                                        onChangeText={text => setCurrentPassword(text)}
                                    />
                                </View>

                                {/* delete model */}
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={deleteModel}
                                    onRequestClose={toggleDeleteModel}
                                >
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                        <View style={styles.reportModelContainer}>
                                            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: 18, color: COLORS.black }}>Delete Account</Text>
                                                </View>
                                                <TouchableOpacity onPress={toggleDeleteModel}>
                                                    <Entypo name="cross" size={18} color={COLORS.darkgray} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ paddingHorizontal: 4, marginVertical: hp(2) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: 17, textAlign: 'auto', textAlignLast: 'left' }}> Are you sure that you want to delete this account ?</Text>
                                                <View style={{ flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                                                    <TouchableOpacity style={{
                                                        backgroundColor: '#f7e5e5',
                                                        borderRadius: 10,
                                                        // padding: 3,
                                                        height: hp(4.5),
                                                        width: wp(35),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }} onPress={DeleteUser} disabled={isDeleteButtonDisabled} >
                                                        {loading ? (
                                                            <Loader isLoading={loading} color='white' />
                                                        ) : (
                                                            <Text style={{ paddingHorizontal: wp(4), fontSize: 17, color: COLORS.red, fontFamily: fontFamily.FONTS.Medium }}>Delete</Text>
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>

                                <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(3), borderRadius: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity style={{
                                        height: hp(4.8),
                                        backgroundColor: COLORS.red,
                                        // borderColor: COLORS.black,
                                        // borderWidth: 2,
                                        borderRadius: 12,
                                        width: wp(35),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }} onPress={toggleDeleteModel} disabled={isDeleteButtonDisabled} >
                                        {loading ? (
                                            <Loader isLoading={loading} color='white' />
                                        ) : (
                                            <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.6), color: COLORS.white, fontFamily: fontFamily.FONTS.Medium }}>Delete</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DeleteAccount

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
            borderColor: '#feeae8',
            backgroundColor: '#fff8f7',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#f44336',
            fontSize: wp(6),
            fontFamily: fontFamily.FONTS.Medium,
            marginBottom: 10,
            // padding: 5,
        },
        reportModelContainer: {
            marginTop: 25,
            padding: 15,
            width: wp(90),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: 10,
            borderRadius: 10
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
            fontFamily: fontFamily.FONTS.regular,
            marginTop: 4,
        },
        username: {
            fontSize: hp(2.2),
            color: '#f44336',
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