/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, Linking, Share, ToastAndroid, ScrollView, TextInput, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import Entypo from 'react-native-vector-icons/Entypo';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityicons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { WD, WH } from '../../components/Dimensions';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fontFamily from '../../../constants/fontFamily';
import { addMembetsInPage, onFetchJobs, onGetPageApi, onSearchApi, onGetPostApi, MidjeournyImage, onCreateNewPostApi, commentonPost, onPageLikeApi, onGetPageMember } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import { Picker } from '@react-native-picker/picker';
import { Loader } from '../../components/Loader';
import CheckBox from '../../components/CheckBox';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Collapsible from 'react-native-collapsible';
import RBSheet from 'react-native-raw-bottom-sheet'; // Import RBSheet
import DateTimePickerModal from "react-native-modal-datetime-picker";

const JobDetails = ({ route }) => {
    const user_data = useSelector(state => state.user_data);
    const { jobData } = route.params;
    console.log('this is job deatils', jobData)
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme, WD, WH),
    });

    // const [date, setDate] = useState(new Date().getFullYear().toString());


    const SalaryType = [
        { id: 1, label: 'Per Hour', value: 'Per Hour' },
        { id: 2, label: 'Per Day', value: 'Per Day' },
        { id: 3, label: 'Per Week', value: 'Per Week' },
        { id: 4, label: 'Per Month', value: 'Per Month' },
        { id: 5, label: 'Per Year', value: 'Per Year' },
    ]

    const Currency = [
        { id: 0, label: 'USD ($)', value: ' $ ' },
        { id: 1, label: 'EUR (€)', value: ' € ' },
        { id: 2, label: 'JPY (¥)', value: ' ¥ ' },
        { id: 3, label: 'TRY (₺)', value: ' ₺ ' },
        { id: 4, label: 'GBP (£)', value: ' £ ' },
        { id: 5, label: 'RUB (₽)', value: ' ₽ ' },
        { id: 6, label: 'PLN (zł)', value: ' zł ' },
        { id: 7, label: 'ILS (₪)', value: ' ₪ ' },
        { id: 8, label: 'BRL (R$)', value: ' R$ ' },
        { id: 9, label: 'INR (₹)', value: ' ₹ ' },
    ];


    const jobTypes = [
        { id: 1, label: 'Full time', value: 'Full time' },
        { id: 2, label: 'Part time', value: 'Part time' },
        { id: 3, label: 'Part time', value: 'Part time' },
        { id: 4, label: 'Internship', value: 'Internship' },
        { id: 5, label: 'Volunteer', value: 'Volunteer' },
        { id: 6, label: 'Contract', value: 'Contract' }
    ];

    const Categories = [
        { id: 1, label: 'Other', value: 'Other' },
        { id: 2, label: 'Admin & Office', value: 'Admin & Office' },
        { id: 3, label: 'Art & Design', value: 'Art & Design' },
        { id: 4, label: 'Business Operations', value: 'Business Operations' },
        { id: 5, label: 'Cleaning & Facilities', value: 'Cleaning & Facilities' },
        { id: 6, label: 'Community & Social Services', value: 'Community & Social Services' },
        { id: 7, label: 'Computer & Data', value: 'Computer & Data' },
        { id: 8, label: 'Construction & Mining', value: 'Construction & Mining' },
        { id: 9, label: 'Eduction', value: 'Eduction' },
        { id: 10, label: 'Farming & Forestry', value: 'Farming & Forestry' },
        { id: 11, label: 'Healthcare', value: 'Healthcare' },
        { id: 12, label: 'Installation,Maintenance & Repair', value: 'Installation,Maintenance & Repair' },
        { id: 13, label: 'Legal', value: 'Legal' },
        { id: 14, label: 'Management', value: 'Management' },
        { id: 15, label: 'Manufacturing', value: 'Manufacturing' },
        { id: 16, label: 'Media & Communication', value: 'Media & Communication' },
        { id: 17, label: 'Personal Care', value: 'Personal Care' },
        { id: 18, label: 'Protective Services', value: 'Protective Services' },
        { id: 19, label: 'Restaurant & Hospitality', value: 'Restaurant & Hospitality' },
        { id: 20, label: 'Retail & Sales', value: 'Retail & Sales' },
        { id: 21, label: 'Science & Engineering', value: 'Science & Engineering' },
        { id: 22, label: 'Sports & Entertainment', value: 'Sports & Entertainment' },
        { id: 23, label: 'Transportation', value: 'Transportation' },

    ];

    const [deleteModel, setDeleteModel] = useState(false)
    const [editModel, setEditModel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState(null)
    const [JobmodelVisible, setJobModelVisible] = useState(false)
    const [applyData, setApplyData] = useState([])
    const [name, setName] = useState(user_data.username || '')
    const [phone, setPhone] = useState(user_data.phone || '')
    const [location, setLocation] = useState(user_data.location || '')
    const [email, setEmail] = useState(user_data.email || '')
    const [position, setPosition] = useState('')
    const [whereDidYouWork, setWhereDidYouWork] = useState('')
    const [description, setDescription] = useState('')
    const [experienceDescription, setExperienceDescription] = useState('')
    const [experienceStartDate, setExperienceStartDate] = useState(new Date().getFullYear())
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const [isExperienceDatePickerVisible, setIsExperienceDatePickerVisible] = useState(false)
    const [isExperienceEndDatePickerVisible, setIsExperienceEndDatePickerVisible] = useState(false)
    const [experienceEndDate, setExperienceEndDate] = useState(new Date().getFullYear())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isChecked1, setIsChecked1] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [question1Answer, setQuestion1Answer] = useState('')
    const [question2Answer, setQuestion2Answer] = useState('')
    const [question3Answer, setQuestion3Answer] = useState('')

    console.log('selected year', experienceStartDate)
    console.log('selected end year', experienceEndDate)

    // Generate a list of years from 1900 to current year
    const yearItems = Array.from({ length: (new Date().getFullYear() - 1900 + 1) }, (_, i) => i + 1900);


    const toggleDeleteModel = () => {
        setDeleteModel((prevVisible) => !prevVisible)
    }
    const toggelEditModel = () => {
        setEditModel((prevVisible) => !prevVisible)
    }

    const toggelJobModel = () => {
        setJobModelVisible((prevVisible) => !prevVisible)
    }

    const toggleMenu = (value, jobId) => {
        setSelectedJobId(jobId)
        if (value === 'edit') {
            toggelEditModel()
        }
        if (value === 'delete') {
            toggleDeleteModel()
        }
        if (value === 'boostPost') {
            navigation.navigate('UpgradeToPro')
        }
        console.log('this is the selcted value', value)
        console.log('this is the selcted post id', jobId)
    };

    const getTimeDifference = (timestamp) => {
        const currentTime = Date.now() / 1000; // Current time in seconds
        const difference = currentTime - timestamp; // Calculate the difference

        const secondsInYear = 31536000;
        const secondsInMonth = 2592000;
        const secondsInDay = 86400;
        const secondsInHour = 3600;

        const years = Math.floor(difference / secondsInYear);
        const months = Math.floor(difference / secondsInMonth);
        const days = Math.floor(difference / secondsInDay);
        const hours = Math.floor(difference / secondsInHour);

        if (years > 0) {
            return `${years}Y`;
        } else if (months > 0) {
            return `${months}M`;
        } else if (days > 0) {
            return `${days} day`;
        } else {
            return `${hours}Hr`;
        }
    };

    // Function to get the category label by ID
    const getCategoryLabelById = (categoryId) => {
        const foundCategory = Categories.find((category) => category.id === parseInt(categoryId));
        return foundCategory ? foundCategory.label : '';
    };

    // Function to get the currency label by ID
    const getCurrencyById = (currencyId) => {
        const foundCurrency = Currency.find((currency) => currency.id === parseInt(currencyId));
        return foundCurrency ? foundCurrency.value : '';
    };

    const jobAction = async (selectedJobId, type) => {
        try {
            console.log('job id', selectedJobId, type)
            const token = await AsyncStorage.getItem('access_token');
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData()
                formData.append('server_key', serverkey)
                formData.append('type', type)
                formData.append('job_id', selectedJobId)

                if (type === 'apply') {
                    formData.append('user_name', name)
                    formData.append('phone_number', phone)
                    formData.append('location', location)
                    formData.append('email', email)
                    formData.append('position', position)
                    formData.append('where_did_you_work', whereDidYouWork)
                    formData.append('experience_description', description)
                    formData.append('experience_start_date', experienceStartDate)
                    formData.append('question_one_answer', question1Answer)
                    formData.append('question_two_answer', question2Answer)
                    formData.append('question_three_answer', question3Answer)
                    if (!isChecked1) {
                        formData.append('experience_end_date', experienceEndDate)
                        formData.append('i_currently_work', 'off')
                    } else {
                        formData.append('i_currently_work', 'on')
                    }
                    console.log('this is the form data', formData)
                }

                const response = await onFetchJobs(formData, token)
                if (response.data.api_status === 200) {
                    if (type === 'get_apply') {
                        setApplyData(response.data.data)
                    }
                    console.log('apply job', response.data)
                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong', response.data.errors.error_text)
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Erro::', error)
        }
    }

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Job Detail'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>

                    {applyData.length > 0 ? (
                        <FlatList
                            data={applyData}
                            keyExtractor={(item, index) => item.user_id.toString()}
                            renderItem={({ item }) => (
                                <View style={[styles.container, { marginBottom: hp(2) }]} >
                                    <View style={styles.imageContainer}>
                                        {/* Background Image */}
                                        <Image source={{ uri: item.user_data?.cover }} style={styles.jobBackgroundImage} />
                                        {/* User Image (Avatar) Positioned Over Background */}

                                        <View style={{
                                            borderRadius: wp(1),
                                            padding: 1,
                                            backgroundColor: COLORS.secondaryWhite,
                                            position: 'absolute',
                                            top: hp(17),
                                            left: wp(4),
                                            // alignSelf: 'center'
                                        }}>
                                            <Image source={{ uri: item.user_data?.avatar }} style={{
                                                height: hp(15),
                                                width: wp(30),
                                                borderRadius: wp(1)
                                            }} />
                                        </View>
                                    </View>

                                    {/* Other Content Below Images */}
                                    <View>
                                        <View style={{ paddingLeft: wp(25), marginVertical: hp(2), justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.black, fontSize: hp(2.5) }}>{item.user_data?.username}</Text>

                                            <TouchableOpacity style={{
                                                marginTop: hp(1),
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#ebeef0',
                                                borderRadius: 8,
                                                padding: 8,
                                                paddingHorizontal: wp(4),
                                                marginHorizontal: wp(2)
                                            }} onPress={() => navigation.navigate('ChatScreen', { UserData: item.user_data })}>
                                                <MaterialCommunityicons name="message-outline" size={20} color={COLORS.darkgray1} />
                                                <Text style={{
                                                    paddingHorizontal: wp(1),
                                                    color: COLORS.black,
                                                    fontFamily: fontFamily.FONTS.regular,
                                                    fontSize: hp(2.2)
                                                }}>Message</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', padding: 10, }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                                                <Materialicons name='location-on' size={hp(2.5)} color={COLORS.red} style={{ paddingHorizontal: wp(1) }} />
                                                <TouchableOpacity onPress={() => Linking.openURL(`http://maps.google.com/?q=${item.location}`)} activeOpacity={1}>
                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>{item.location}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                                                <MaterialCommunityicons name='clock-time-four' size={hp(2.5)} color={'#5ab55d'} style={{ paddingHorizontal: wp(1) }} />
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>{getTimeDifference(item.time)}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                                                <Materialicons name='local-phone' size={hp(2.5)} color={'#2196f3'} style={{ paddingHorizontal: wp(1) }} />
                                                <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone_number}`)} activeOpacity={1}>
                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>{item.phone_number}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1) }}>
                                                <MaterialCommunityicons name='email' size={hp(2.5)} color={'#795548'} style={{ paddingHorizontal: wp(1), }} />
                                                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${item.email}`)} activeOpacity={1}>
                                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>{item.email}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>


                                    <View style={{ padding: wp(2) }}>
                                        <View style={{ backgroundColor: '#f0f2f5', borderRadius: hp(0.5), padding: hp(2), }}>
                                            <View style={{ justifyContent: 'center', paddingVertical: hp(1.3) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Where did you work?</Text>
                                                <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.where_did_you_work}</Text>
                                            </View>
                                            <View style={{ justifyContent: 'center', paddingVertical: hp(1.3) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Position</Text>
                                                <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.position}</Text>
                                            </View>
                                            <View style={{ justifyContent: 'center', paddingVertical: hp(1.3) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Start date</Text>
                                                <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.experience_start_date}</Text>
                                            </View>
                                            <View style={{ justifyContent: 'center', paddingVertical: hp(1.3) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Description</Text>
                                                <Text style={{ paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>{item.experience_description}</Text>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                            )}
                        />


                    ) : (
                        <View style={[styles.container, { marginBottom: hp(2) }]} >
                            <View style={styles.imageContainer}>
                                {/* Background Image */}
                                <Image source={{ uri: jobData.image }} style={styles.jobBackgroundImage} />
                                {/* User Image (Avatar) Positioned Over Background */}
                                {jobData.is_page_onwer && (
                                    <View style={styles.overlay}>
                                        <Menu onSelect={(value) => toggleMenu(value, jobData.id)}>
                                            <MenuTrigger>
                                                <Entypo name="dots-three-vertical" size={24} color={COLORS.white} style={{ padding: 5 }} />
                                            </MenuTrigger>
                                            <MenuOptions customStyles={{ optionsContainer: styles.modelView }}>
                                                <MenuOption value="edit">
                                                    <View style={{ flexDirection: 'row', alignjobDatas: 'center' }}>
                                                        <Materialicons name='mode-edit' size={24} color={COLORS.black} />
                                                        <View style={{ padding: 5 }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Edit Job</Text>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Edit Job information</Text>
                                                        </View>
                                                    </View>
                                                </MenuOption>
                                                <MenuOption value="delete">
                                                    <View style={{ flexDirection: 'row', alignjobDatas: 'center', }}>
                                                        <Materialicons name='delete' size={24} color={COLORS.black} />
                                                        <View style={{ padding: 5 }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.1), color: COLORS.black }}>Delete Job</Text>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(1.9), color: COLORS.darkgray1 }}>Delete this Job completely</Text>
                                                        </View>
                                                    </View>
                                                </MenuOption>
                                            </MenuOptions>
                                        </Menu>
                                    </View>
                                )}
                                <View style={styles.jobImageContainer}>
                                    <Image source={{ uri: jobData.page.avatar }} style={styles.jobImage} />
                                </View>
                            </View>

                            {/* Other Content Below Images */}
                            <View>
                                <View style={styles.jobNameContainer}>
                                    <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.black, fontSize: hp(3) }}>{jobData.title}</Text>
                                    <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.4) }}>{jobData.page.username}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignjobDatas: 'center', justifyContent: 'space-evenly', padding: 10 }}>
                                    <View style={{ flexDirection: 'row', alignjobDatas: 'center', paddingVertical: hp(1) }}>
                                        <Materialicons name='location-on' size={hp(2.5)} color={COLORS.red} style={{ paddingHorizontal: wp(1) }} />
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.3) }}>{jobData.location}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignjobDatas: 'center', paddingVertical: hp(1) }}>
                                        <MaterialCommunityicons name='clock-time-four' size={hp(2.5)} color={'#5ab55d'} style={{ paddingHorizontal: wp(1) }} />
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.3) }}>{getTimeDifference(jobData.time)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignjobDatas: 'center', paddingVertical: hp(1) }}>
                                        <Ionicons name='bag-sharp' size={hp(2.5)} color={'#2196f3'} style={{ paddingHorizontal: wp(1) }} />
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.3) }}>{jobData.job_type}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignjobDatas: 'center', paddingVertical: hp(1) }}>
                                        <MaterialCommunityicons name='tag' size={hp(2.5)} color={'#795548'} style={{ paddingHorizontal: wp(1) }} />
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.3) }}> {getCategoryLabelById(jobData.category)}</Text>
                                    </View>
                                </View>
                            </View>

                            {jobData.page.is_page_onwer ? (
                                <View style={{ justifyContent: 'center', alignjobDatas: 'center', marginHorizontal: wp(5) }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffa39b', borderRadius: wp(2) }} disabled={jobData.apply_count === '0'} onPress={() => jobAction(jobData.id, 'get_apply')}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.white, fontSize: hp(2.2), padding: hp(1) }}>View Interested Candidates ({jobData.apply_count}) </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={{ justifyContent: 'center', alignjobDatas: 'center', marginHorizontal: wp(5) }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffa39b', borderRadius: wp(2) }} disabled={jobData.apply}
                                        onPress={toggelJobModel} >
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.white, fontSize: hp(2.2), padding: hp(1) }}> {jobData.apply ? 'Already applied' : 'Apply Now'}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View style={{ marginVertical: hp(2), padding: wp(2) }}>
                                <View style={{ backgroundColor: '#f0f2f5', borderRadius: hp(0.5), padding: hp(2), }}>
                                    <View style={{ justifyContent: 'center', paddingVertical: hp(1) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Minimum</Text>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2) }}>{getCurrencyById(jobData.currency)} {jobData.minimum} {jobData.salary_date}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', paddingBottom: hp(1) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2.2) }}>Maximum</Text>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2) }}>{getCurrencyById(jobData.currency)} {jobData.maximum} {jobData.salary_date}</Text>
                                    </View>
                                    <View style={{ paddingTop: hp(2) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2) }}> {jobData.description}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}


                    {/* delete model */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={deleteModel}
                        onRequestClose={toggleDeleteModel}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.reportModelContainer}>
                                <View style={{ padding: hp(1.8), borderTopRightRadius: wp(2), borderTopLeftRadius: wp(2), flexDirection: 'row', backgroundColor: COLORS.red, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.4), color: COLORS.white }}>Delete Job</Text>
                                    </View>
                                    <TouchableOpacity onPress={toggleDeleteModel}>
                                        <Entypo name="cross" size={18} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingHorizontal: 4, marginVertical: hp(2) }}>
                                    <View style={{ paddingHorizontal: wp(4), marginVertical: hp(1.5) }}>
                                        <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.3), textAlign: 'justify' }}> Are you sure that you want to delete this job ?</Text>
                                    </View>
                                    <View style={styles.FollowinghorizontalLine} />
                                    <View style={{ marginHorizontal: wp(2), flexDirection: 'row', marginTop: hp(1), borderRadius: 10, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#f7e5e5',
                                            borderRadius: 10,
                                            // padding: 3,
                                            height: hp(4.5),
                                            width: wp(25),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} onPress={() => jobAction(selectedJobId)}>
                                            {loading ? (
                                                <Loader isLoading={loading} color='white' />
                                            ) : (
                                                <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.red }}>Delete</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>


                    {/* Job Model */}
                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={JobmodelVisible}
                        onRequestClose={toggelJobModel}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                <View style={{
                                    // marginTop: hp(2),
                                    padding: 15,
                                    backgroundColor: global.ContentContainer.backgroundColor,
                                    // marginHorizontal: wp(2),
                                    // borderRadius: wp(1),
                                    height: '100%'
                                }}>

                                    <View style={{ marginVertical: hp(2), flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <MaterialCommunityicons name="bag-checked" size={24} color={'#5ab55d'} />
                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.black }}>{jobData.title}</Text>
                                        </View>
                                        {/**
                                        <TouchableOpacity onPress={toggelJobModel}>
                                            <Entypo name="cross" size={18} color={COLORS.darkgray} />
                                        </TouchableOpacity> */}
                                    </View>

                                    <View style={{ marginVertical: hp(3) }}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Name</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                placeholder="Username"
                                                value={name}
                                                onChangeText={(text) => setName(text)}

                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>phone</Text>
                                            <CustomInput
                                                keyboardType="numeric"
                                                placeholder="Username"
                                                value={phone}
                                                onChangeText={(text) => setPhone(text)}

                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Location</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                placeholder="Username"
                                                value={location}
                                                onChangeText={(text) => setLocation(text)}

                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>E-mail</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                placeholder="Username"
                                                value={email}
                                                onChangeText={(text) => setEmail(text)}

                                            />
                                        </View>

                                        <View style={{ marginVertical: hp(3) }}>
                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray, fontSize: hp(2.2) }}>Experience</Text>
                                            <View style={{
                                                borderBottomColor: COLORS.darkgray1,
                                                borderBottomWidth: 0.5,
                                                padding: 5,
                                                // marginHorizontal: 15,
                                            }} />
                                        </View>


                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Position</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                placeholder="Username"
                                                value={position}
                                                onChangeText={(text) => setPosition(text)}

                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Where did you work?</Text>
                                            <CustomInput
                                                keyboardType="default"
                                                placeholder="Username"
                                                value={whereDidYouWork}
                                                onChangeText={(text) => setWhereDidYouWork(text)}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.lable}>Description</Text>
                                            <TextInput
                                                keyboardType="default"
                                                multiline={true}
                                                numberOfLines={6}
                                                value={description}
                                                onChangeText={text => setDescription(text)}
                                                style={styles.descriptionInput}
                                                textAlignVertical="top"
                                            />
                                        </View>

                                        <View style={{
                                            marginTop: 10,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}>
                                            <View style={styles.dropDownContainer}>
                                                <Picker
                                                    selectedValue={experienceStartDate}
                                                    onValueChange={(itemValue) => setExperienceStartDate(itemValue)}
                                                    style={styles.dropDown}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    {yearItems.map((year, index) =>
                                                        <Picker.Item key={index} label={year.toString()} value={year} />
                                                    )}
                                                </Picker>
                                            </View>

                                            {!isChecked && (
                                                <>
                                                    <Text style={{ paddingTop: hp(1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2) }}>To</Text>
                                                    <View style={styles.dropDownContainer}>
                                                        <Picker
                                                            selectedValue={experienceEndDate}
                                                            onValueChange={(itemValue) => setExperienceEndDate(itemValue)}
                                                            style={styles.dropDown}
                                                            itemStyle={styles.pickerItem}
                                                        >
                                                            {yearItems.map((year, index) =>
                                                                <Picker.Item key={index} label={year.toString()} value={year} />
                                                            )}
                                                        </Picker>
                                                    </View>
                                                </>
                                            )}
                                        </View>

                                        <View style={{ marginTop: hp(2.3), flexDirection: 'row', }}>
                                            <CheckBox
                                                isChecked={isChecked}
                                                handleCheck={() => setIsChecked(!isChecked)}
                                            />
                                            <Text style={{ paddingTop: hp(-4), paddingHorizontal: wp(2), fontSize: hp(2.2), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>I Currently work here</Text>
                                        </View>

                                        {jobData.question_one && (
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Share me your CV.</Text>
                                                <TextInput
                                                    keyboardType="default"
                                                    multiline={true}
                                                    numberOfLines={6}
                                                    value={question1Answer}
                                                    onChangeText={text => setQuestion1Answer(text)}
                                                    style={styles.descriptionInput}
                                                    textAlignVertical="top"
                                                />
                                            </View>
                                        )}



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
                                            }} onPress={() => jobAction(jobData.id, 'apply')}>
                                                {loading ? (
                                                    <Loader isLoading={loading} color='white' />
                                                ) : (
                                                    <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.6), color: COLORS.white }}>Publish</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                </View>
                            </View>
                        </ScrollView>
                    </Modal>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default JobDetails

const localStyles = (theme, WD, WH) => {
    const global = globalStyles(theme);

    return StyleSheet.create({

        container: {
            // marginHorizontal: 10,
            backgroundColor: global.ContentContainer.backgroundColor,
            borderRadius: 10,
        },
        imageContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,

        },
        lable: {
            fontSize: hp(2.2),
            color: global.text2.color,
            fontWeight: '600',
            fontFamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        descriptionInput: {
            width: '100%',
            height: 'auto',
            paddingHorizontal: wp(2),
            // backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        dropDownContainer: {
            marginTop: hp(1),
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '45%',
            // marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            overflow: 'hidden', // Hide overflow content
        },
        dropDown: {
            width: '100%',
            minHeight: 40,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
        },
        jobBackgroundImage: {
            height: hp(20),
            // borderBottomLeftRadius: wp(2),
            // borderBottomRightRadius: wp(2),
            width: '100%'
        },
        jobImageContainer: {
            borderRadius: wp(30),
            padding: 4,
            backgroundColor: COLORS.secondaryWhite,
            position: 'absolute',
            top: hp(13),
            alignSelf: 'center'
        },
        jobImage: {
            height: wp(28),
            width: wp(28),
            borderRadius: wp(28)
        },
        jobNameContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp(8)
        },
        jobname: {
            fontSize: hp(2.8),
            color: global.text2.color,
        },
        overlay: {
            position: 'absolute',
            top: 5,
            right: 0,
        },
        modelView: {
            borderRadius: 10,
            padding: 13,
            width: '80%',
            height: 'auto',
            backgroundColor: global.ContentContainer.backgroundColor,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,

        },
        reportModelContainer: {
            marginTop: hp(2.2),
            // padding: 15,
            width: wp(90),
            backgroundColor: global.ContentContainer.backgroundColor,
            marginHorizontal: wp(2),
            borderRadius: wp(2.2)
        },
    })
}