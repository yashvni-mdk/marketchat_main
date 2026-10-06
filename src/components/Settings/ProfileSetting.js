/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../CustomInput';
import Button from '../Button';
import Footer from '../Footer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onUpdateUserDataApi } from '../../Service/Api';
import { getUserData } from '../../utils/localization/Storage';
import { getUserDataApi } from '../../Service/Api';
import { useDispatch } from 'react-redux';
import { fetchUserDataSuccess } from '../../redux/reducer';
import { Loader } from '../Loader';



const ProfileSetting = () => {
    const user_data = useSelector(state => state.user_data);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const relationshipOptions = [
        { label: 'None', value: '', relationshipId: 0 },
        { label: 'Single', value: 'Single', relationshipId: 1 },
        { label: 'In a relationship', value: 'In a relationship', relationshipId: 2 },
        { label: 'Married', value: 'Married', relationshipId: 3 },
        { label: 'Engaged', value: 'Engaged', relationshipId: 4 },
    ];

    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [about, setAbout] = useState('');
    const [location, setLocation] = useState('');
    const [school, setSchool] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [company, setCompany] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [website, setWebsite] = useState('');
    const [relationship, setRelationship] = useState('');
    const [relationshipId, setRelationshipId] = useState('0');

    useEffect(() => {
        
        const subscribe = navigation.addListener('focus', () => {
            setFirstName(user_data?.first_name);
            setLastName(user_data?.last_name)
            setAbout(user_data?.about)
            setSchool(user_data?.school)
            setCompany(user_data?.working)
            setCompanyWebsite(user_data?.working_link)
            setWebsite(user_data?.website)
            setRelationship(user_data?.relationship_id)
            console.log("Get Value:::",user_data.relationship_id)
            relationshipOptions.map((item, index) => {
                if(user_data?.relationship_id == item.relationshipId) {
                    setRelationship(item.value);
                }
            })
        });
        return subscribe;
    }, [])

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    const handleRelationshipChange = (itemValue, itemIndex) => {
        setRelationship(itemValue);
        const selectedRelationship = relationshipOptions.find(option => option.value === itemValue);
        setRelationshipId(selectedRelationship ? selectedRelationship.relationshipId : null);
    };


    const onCheckAuth = async (user) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {

                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('user_id', user.userData.user_id);
                formData.append('fetch', 'user_data,followers,following');
                formData.append('server_key', serverkey);

                const response = await getUserDataApi(formData, token)
                console.log("Get Response DAtaLLL", response.data)
                if (response.data.api_status === 200) {
                    dispatch(fetchUserDataSuccess(response.data.user_data))

                } else if (response.data.api_status === 400 || 404) {
                    console.log('Error fetching profile data', response.data);
                    navigation.navigate('Login');
                }
            }
            else {
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 2000);
            }
        }
        catch (err) {
            console.log("Get Error::", err)
        }
    }

    const updateData = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('first_name', firstName)
                formData.append('last_name', lastName)
                formData.append('about', about)
                formData.append('school', school)
                formData.append('working', company)
                formData.append('working_link', companyWebsite)
                formData.append('relationship_id', relationshipId)
                formData.append('server_key', serverkey)

                const response = await onUpdateUserDataApi(formData, token)
                if (response.data.api_status === 200) {
                    const user = await getUserData()
                     onCheckAuth(user)
                    setLoading(false)
                    console.log('update successful', response.data)
                    navigation.navigate('ProfileScreen')
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('this is the error', response.data.errors.error_text)
                    ToastAndroid.show(response.data.errors.error_text, ToastAndroid.SHORT)
                }
            } else {
                setLoading(false)
                console.log('User Token not Found ', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <View style={styles.container}>
                        <View style={styles.ContentContainer}>
                            <View style={styles.content}>
                                <View style={styles.HandingtextContainer}>
                                    <View>
                                        <Image source={{ uri: user_data?.avatar }} style={{ height: hp(10), width: wp(20), borderRadius: 70 }} />
                                        <View style={{ position: 'absolute', top: hp(5.5), left: wp(14) }}>
                                            <MaterialCommunityIcons name='face-man-profile' size={19} color={COLORS.white} style={{ backgroundColor: '#13bdd4', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(5) }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            Profile Setting
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>First name</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={firstName}
                                        onChangeText={text => setFirstName(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Last name</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={lastName}
                                        onChangeText={text => setLastName(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>About</Text>
                                    <TextInput
                                        keyboardType="default"
                                        multiline={true}
                                        numberOfLines={5}
                                        value={about}
                                        onChangeText={text => setAbout(text)}
                                        style={styles.descriptionInput}
                                        textAlignVertical="top"
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Location</Text>
                                    <CustomInput
                                        keyboardType="email-address"
                                        value={location}
                                        onChangeText={text => setLocation(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>School</Text>
                                    <CustomInput
                                        keyboardType="email-address"
                                        value={school}
                                        onChangeText={text => setSchool(text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
                                        <Text style={styles.checkBoxtext}>Completed</Text>
                                    </View>
                                </View>



                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Working at</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={company}
                                        onChangeText={text => setCompany(text)}
                                    />
                                    <Text style={styles.exampleText}>(e.g Apple)</Text>
                                    <View style={styles.inputContainer}>
                                        <CustomInput
                                            keyboardType="default"
                                            value={companyWebsite}
                                            onChangeText={text => setCompanyWebsite(text)}
                                        />
                                        <Text style={styles.exampleText}>Company website</Text>
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>Website</Text>
                                    <CustomInput
                                        keyboardType="default"
                                        value={website}
                                        onChangeText={text => setWebsite(text)}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.lable}>RelationShip</Text>
                                    <View style={styles.dropDownContainer}>
                                        <Picker
                                            selectedValue={relationship}
                                            onValueChange={(itemValue, itemIndex) => handleRelationshipChange(itemValue, itemIndex)}
                                            style={styles.dropDown} itemStyle={styles.pickerItem}
                                        >
                                            {relationshipOptions.map(option => (
                                                <Picker.Item
                                                    key={option.value}
                                                    label={option.label}
                                                    value={option.value}
                                                    style={styles.lable}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>

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
                                    }} onPress={updateData}>
                                        {loading ? (
                                            <Loader isLoading={loading} color='white' />
                                        ) : (
                                            <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>Save</Text>
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

export default ProfileSetting

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor
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
            color: '#13bdd4',
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
            fontSize:  hp(2.2),
            color: global.text.color,
            fontFamily: fontFamily.FONTS.Medium,
            marginVertical: 4,
        },
        username: {
            fontSize:  hp(2.2),
            color: '#13bdd4',
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
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        dropDownContainer: {
            marginTop: 10,
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 1,
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
            paddingHorizontal: wp(2.5),
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: 'center',
            fontFamily: fontFamily.FONTS.Medium,
            fontSize: hp(2),
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
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};