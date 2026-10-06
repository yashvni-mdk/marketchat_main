import { SafeAreaView, ScrollView, ToastAndroid, StyleSheet, Text, FlatList, ImageBackground, TextInput, TouchableOpacity, View, Modal, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import CustomInput from '../CustomInput';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-crop-picker';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontFamily from '../../../constants/fontFamily';
import Footer from '../../components/Footer';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';
import { onAddressApi } from '../../Service/Api';
import { Loader } from '../Loader';

const MyAddresses = () => {
    const user_data = useSelector(state => state.user_data);
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    // New state to hold fetched address data
    const [fetchedAddress, setFetchedAddress] = useState(null);
    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(false)
    const [name, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address, setAddress] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    // Function to toggle modal visibility
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    useEffect(() => {
        addressRequest('get'); // Fetch addresses initially
    }, []);


    const addressRequest = async (type, updatedData = null) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('type', type)

                if (type === 'add' || type === 'edit') {
                    // Include the updated data if it's an edit or add action
                    formData.append('name', updatedData.name);
                    formData.append('phone', updatedData.phone);
                    formData.append('country', updatedData.country);
                    formData.append('city', updatedData.city);
                    formData.append('zip', updatedData.zipCode);
                    formData.append('address', updatedData.address);
                }

                const response = await onAddressApi(formData, token)
                if (response.data.api_status === 200) {
                    console.log('User Address ', response.data.data)
                    setAddresses(response.data.data); // Assuming the response contains an array of addresses
                    setFetchedAddress(response.data.data[0]);
                    setLoading(false)
                    if (type === 'add') {
                        toggleModal(); // Close the modal after adding
                    }
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('somthing went wrong ', response.data.errors.error_text)
                }
            }
            else {
                setLoading(false)
                console.log('User token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }


    useEffect(() => {
        // Update the name, phone, country, city, zipCode, and address states based on fetchedAddress
        if (fetchedAddress) {
            setUserName(fetchedAddress.name || '');
            setPhone(fetchedAddress.phone || '');
            setCountry(fetchedAddress.country || '');
            setCity(fetchedAddress.city || '');
            setZipCode(fetchedAddress.zip || '');
            setAddress(fetchedAddress.address || '');
        }
    }, [fetchedAddress]);


    const handleAction = (type) => {
        if (type === 'get') {
            addressRequest(type); // Fetch addresses
        } else {
            // For add or edit action
            addressRequest(type, {
                name,
                phone,
                country,
                city,
                zipCode,
                address,
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: modalVisible ? 'rgba(0,0,0,1)' : global.container.backgroundColor }}>
            <View style={styles.container}>
                <View style={styles.AvatarContentContainer}>
                    <View style={styles.content}>
                        <View style={styles.HandingtextContainer}>
                            <View>
                                <Image source={{ uri: user_data?.avatar }} style={{ height: hp(10), width: wp(20), borderRadius: 70 }} />
                                <View style={{ position: 'absolute', top: hp(5.5), left: wp(14) }}>
                                    <Entypo name='location' size={19} color={COLORS.white} style={{ backgroundColor: '#607d8b', borderRadius: 50, padding: 5 }} />
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: wp(5) }}>
                                <Text style={styles.username}>{user_data?.username}</Text>
                                <Text style={styles.Handingtext}>
                                    My Addresses
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={toggleModal}>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: hp(5)
                            }}>
                                <View style={styles.CoverImagePicker}>
                                    <MaterialIcons name="add-location" size={24} color={COLORS.white} style={{ backgroundColor: '#666666', borderRadius: 50, padding: 7 }} />
                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), paddingTop: hp(2), color: '#666666' }}>Add New</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Modal
                                animationType='slide'
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={toggleModal}
                            >
                                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                    <View style={{
                                        marginTop: hp(2),
                                        padding: 15,
                                        backgroundColor: global.ContentContainer.backgroundColor,
                                        marginHorizontal: wp(2),
                                        borderRadius: 10,
                                        height: '97%'
                                    }}>

                                        <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.black }}>Add New Address</Text>
                                            <TouchableOpacity onPress={toggleModal}>
                                                <Entypo name="cross" size={18} color={COLORS.darkgray} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ marginVertical: hp(3) }}>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Name</Text>
                                                <CustomInput
                                                    keyboardType="default"
                                                    placeholder="Username"
                                                    value={name}
                                                    onChangeText={text => setUserName(text)}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Phone</Text>
                                                <CustomInput
                                                    keyboardType="numeric"
                                                    placeholder="Phone"
                                                    value={phone}
                                                    onChangeText={text => setPhone(text)}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Country</Text>
                                                <CustomInput
                                                    keyboardType="default"
                                                    placeholder="Country"
                                                    value={country}
                                                    onChangeText={text => setCountry(text)}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>City</Text>
                                                <CustomInput
                                                    keyboardType="default"
                                                    placeholder="City"
                                                    value={city}
                                                    onChangeText={text => setCity(text)}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Zip Code</Text>
                                                <CustomInput
                                                    keyboardType="default"
                                                    placeholder="Zip Code"
                                                    value={zipCode}
                                                    onChangeText={text => setZipCode(text)}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Name</Text>
                                                <TextInput
                                                    keyboardType="default"
                                                    placeholder='Address'
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    value={address}
                                                    onChangeText={text => setAddress(text)}
                                                    style={styles.descriptionInput}
                                                    textAlignVertical="top"
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(3), borderRadius: 10, justifyContent: 'flex-end' }}>
                                                <TouchableOpacity style={{
                                                    height: hp(4.8),
                                                    backgroundColor: COLORS.red,
                                                    // borderColor: COLORS.black,
                                                    // borderWidth: 2,
                                                    borderRadius: 12,
                                                    width: wp(35),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={() => handleAction('add')}>
                                                    {loading ? (
                                                        <Loader isLoading={loading} color='white' />
                                                    ) : (
                                                        <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.6), color: COLORS.white }}>Add</Text>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </ScrollView>


                    </View>
                </View>
            </View>
        </SafeAreaView>

    )
}

export default MyAddresses

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            // marginTop: 20,
        },
        HandingtextContainer: {
            padding: wp(5),
            height: hp(15),
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#e2f7fa',
            backgroundColor: '#f5fcfd',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#607d8b',
            fontSize: wp(6),
            fontFamily: fontFamily.FONTS.Medium,
            marginBottom: 10,
            // padding: 5,
        },
        lable: {
            fontSize: hp(2.2),
            color: global.text2.color,
            fontWeight: '600',
            marginVertical: 4,
        },
        username: {
            fontSize: hp(2.2),
            color: '#607d8b',
            fontFamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        AvatarContentContainer: {
            marginTop: 10,
            height: hp(70),
            marginHorizontal: wp(4),
            borderRadius: 10,
            padding: 20,
            paddingHorizontal: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        CoverImagePicker: {
            width: '95%',
            height: hp(28),
            // marginHorizontal: 15,
            backgroundColor: '#f2f2f2',
            color: global.inputText.color,
            // borderColor: COLORS.secondaryBlack,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        userImagePickerContainer: {
            width: wp(36),
            height: hp(18),
            position: 'absolute',
            bottom: -80,
            // marginBottom: 30,
            borderWidth: 4,
            borderColor: COLORS.white,
            borderRadius: 100,
            backgroundColor: '#eaeaea',
            justifyContent: 'center',
            alignItems: 'center',
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
        backgroundImage: {
            height: hp(30),
            width: '100%',
            borderRadius: 10
        },

        userImage: {
            height: hp(17),
            width: wp(34),
            // borderWidth: 4,
            // borderColor: COLORS.white,
            borderRadius: 100
        },
    })
}
