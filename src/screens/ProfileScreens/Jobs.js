/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, FlatList, Modal, ToastAndroid } from 'react-native';
import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Header from '../../components/Header';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import CustomInput from '../../components/CustomInput';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Picker } from '@react-native-picker/picker';
import translations from '../../utils/localization/traslations';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAlljobs } from '../../redux/reducer';
import { onFetchJobs } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const Jobs = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('')
    const [selectedJobType, setSelectedJobType] = useState('');
    const [selectedCategories, setSelectedCategories] = useState('');
    const [categoryID, setCategoryID] = useState(null);
    const [selectedRange, setSelectedRange] = useState('');
    const [showSlider, setShowSlider] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [deleteJobModel, setDeleteJobModel] = useState(false)
    const [deleteJobData, setDeleteJobData] = useState(null)

    const handleLocationClick = () => {
        setShowSlider(!showSlider); // Toggle showSlider state on location click
    };

    const handleSliderChange = (value) => {
        setSliderValue(value); // Set slider value when it changes
    };

    const jobTypes = [
        { id: 1, label: 'Full time', value: 'full_time' },
        { id: 2, label: 'Part time', value: 'part_time' },
        { id: 3, label: 'Internship', value: 'internship' },
        { id: 4, label: 'Volunteer', value: 'volunteer' },
        { id: 5, label: 'Contract', value: 'contract' }
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


    const fetchingJobs = async (data, from) => {
        try {
            setLoading(true)
            
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('type', 'search')
                formData.append('server_key', serverkey)

                if (selectedJobType && from != 'jobType') {
                    formData.append('job_type', selectedJobType)
                    console.log('job_type', selectedJobType)
                    // console.log('categoryId', categoryID)
                } else if (from == 'jobType') {
                    formData.append('job_type', data)
                    console.log('job_type', data)
                }

                if (categoryID && from != 'category') {
                    formData.append('c_id', categoryID)
                    // formData.append('categoryId', categoryID)
                } else if (from == 'category') {
                    formData.append('c_id', data)
                }

                if (search && from != 'search') {
                    formData.append('keyword', search)
                    console.log('search', search)
                } else if (from == 'search') {
                    formData.append('search', data)
                }
                 
                console.log('search data>>>>', selectedJobType, categoryID, search, data);
                const response = await onFetchJobs(formData, token)
                if (response.data.api_status === 200) {
                    setJobs(response.data.data)
                    setLoading(false)
                    console.log('all jobs', response.data.data)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('cant fetching the jobs', response.data.errors.error_text)
                }
            } else {
                setLoading(false)
                console.log('User Token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    useEffect(() => {
        fetchingJobs()
    }, []);


    // const renderPicker = (selectedValue, onValueChange, item) => {
    //     return (
    //         <View style={styles.dropDownContainer}>
    //             <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={styles.dropDown} itemStyle={styles.pickerItem}>
    //                 {item.map((item, index) => (
    //                     <Picker.Item key={index} label={item.label} value={item.value} />
    //                 ))}
    //             </Picker>
    //         </View>
    //     )
    // }

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

        if (years === 0 && months === 0 && days === 0 && hours === 0) {
            return 'now';
        } else if (years > 0) {
            return `${years}Y ago`;
        } else if (months > 0) {
            return `${months}M ago`;
        } else if (days > 0) {
            return `${days} day ago`;
        } else {
            return `${hours}hr ago`;
        }
    };

    // Function to get the currency label by ID
    const getCurrencyById = (currencyId) => {
        const foundCurrency = Currency.find((currency) => currency.id === parseInt(currencyId));
        return foundCurrency ? foundCurrency.value : '';
    };

    const onHandleDelete = async (item) => {
        try {
            
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                setLoading(true)
            console.log('get onHandleDelete', item)
            const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                    const formData = new FormData();
                    formData.append('server_key', serverkey);
                    formData.append('post_id', item.post_id)
                    formData.append('action', 'delete')
                    const response = await onPageLikeApi(formData, token)
                    if (response.data.api_status === 200) {
                        console.log('Post delete:', response.data)
                        setLoading(false)
                        setDeleteJobModel(false);
                        fetchUserPosts(PageId)
                    } else if (response.data.api_status === 400) {
                        setLoading(false)
                        console.log('somthing went wrong:', response.data.errors.error_text)
                        ToastAndroid.show('somthing went wrong please try again', ToastAndroid.SHORT)
                    }
            } else {
                setLoading(false)
                console.log('User Token not found', error.message)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
        
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Jobs'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <View>
                            <Image source={require('../../../assets/image/img/job.png')} style={{ height: hp(28), width: '100%', padding: hp(3) }} />
                            <View style={styles.textOverlay}>
                                <Text style={styles.overlayText}>{t('jobs')}</Text>
                                <Text style={styles.overlayText2}>{t('Search_Jobs_Heading')}</Text>
                            </View>
                        </View>

                        <View style={styles.container}>
                            <View style={styles.ContentContainer}>
                                <View style={styles.content}>
                                    <TextInput
                                        placeholder='Search for Jobs'
                                        placeholderTextColor={COLORS.secondaryGray}
                                        style={styles.CustomInput}
                                        value={search}
                                        onChangeText={(text) => setSearch(text)}
                                        onSubmitEditing={() => fetchingJobs(search, 'search')}
                                    />
                                    <View style={{
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                    }}>

                                        <View style={styles.dropDownContainer}>
                                            <Picker
                                                selectedValue={selectedJobType}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    setSelectedJobType(itemValue);
                                                    setRefresh(!refresh);
                                                    fetchingJobs(itemValue, 'jobType'); // Call a function to fetch jobs with the selected job type and category
                                                }}
                                                style={styles.dropDown}
                                                itemStyle={styles.pickerItem}
                                            >
                                                {jobTypes.map((jobType, index) => (
                                                    <Picker.Item key={jobType.id} label={jobType.label} value={jobType.value} />
                                                ))}
                                            </Picker>
                                        </View>
                                        <View style={styles.dropDownContainer}>
                                            <Picker
                                                selectedValue={selectedCategories}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    const selectedCategory = Categories.find(category => category.value === itemValue);
                                                    setSelectedCategories(itemValue);
                                                    if (selectedCategory) {
                                                        setCategoryID(selectedCategory.id);
                                                    }
                                                    setRefresh(!refresh);
                                                    fetchingJobs(selectedCategory.id, 'category');
                                                }}
                                                style={styles.dropDown}
                                                itemStyle={styles.pickerItem}
                                            >
                                                {Categories.map((category, index) => (
                                                    <Picker.Item key={category.id} label={category.label} value={category.value} />
                                                ))}
                                            </Picker>
                                        </View>


                                        <View style={styles.location}>
                                            <TouchableOpacity onPress={handleLocationClick} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 }}>
                                                <Text style={{ color: global.inputText.color, fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular }}>Location distance</Text>
                                                <FontAwesome name='sort-down' size={15} color={COLORS.secondaryGray} style={{ paddingRight: 5 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                {showSlider && (
                                    <View style={styles.sliderContainer}>
                                        <View style={styles.sliderContentContainer}>
                                            <Slider
                                                style={styles.slider}
                                                minimumValue={0}
                                                maximumValue={300}
                                                minimumTrackTintColor="#2979ff"
                                                maximumTrackTintColor="#d0d0d0"
                                                thumbTintColor="#2979ff"
                                                step={1}
                                                value={sliderValue}
                                                onValueChange={handleSliderChange}
                                            />
                                            <Text>{sliderValue} km </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={{ marginBottom: hp(2) }}>
                            {loading ? (
                                <View style={{ flex: 1, marginVertical: hp(20), justifyContent: 'center', alignItems: 'center' }}>
                                    <Loader isLoading={true} />
                                </View>
                            ) : (
                                <FlatList
                                    data={jobs}
                                    renderItem={({ item }) => (
                                        <View style={{ marginTop: hp(2), marginHorizontal: wp(3) }}>
                                            <View style={{ borderRadius: 8 }}>
                                                <View style={{ borderRadius: 10 }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobData: item })}>
                                                        <Image
                                                            source={{ uri: item.image }}
                                                            style={{ height: hp(30), width: '100%', borderTopRightRadius: 8, borderTopLeftRadius: 8 }}
                                                        />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.overlayBlog} onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
                                                        <Text style={styles.overlayBlogText}>{getTimeDifference(item.time)}</Text>
                                                    </TouchableOpacity>
                                                    <View style={styles.BlogTextOverlay} onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
                                                        <TouchableOpacity style={{ flexDirection: 'row', }}>
                                                            <Ionicons name="location" size={18} color={COLORS.white} />
                                                            <Text style={styles.BlogTitle}>{item.location}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ backgroundColor: COLORS.white, padding: 15, justifyContent: 'flex-start', borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }}>
                                                        <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
                                                            <Text style={{ paddingBottom: hp(1), fontFamily: fontFamily.FONTS.regular, fontSize: hp(2.4), color: COLORS.black }}>{item.title}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ paddingBottom: hp(1), flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
                                                            <MaterialCommunityIcons name="cash-multiple" size={hp(2.2)} color={COLORS.red} />
                                                            <Text style={{
                                                                // paddingHorizontal: 1,
                                                                color: COLORS.darkgray1,
                                                                fontSize: hp(2),
                                                            }}>{getCurrencyById(item.currency)}{item.minimum} - {getCurrencyById(item.currency)}{item.maximum}</Text>
                                                        </TouchableOpacity>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <MaterialIcons name="category" size={hp(2, 2)} color={COLORS.darkgray1} />
                                                            <Text style={{ fontFamily: fontFamily.FONTS.regular, fontSize: hp(2), color: COLORS.darkgray1 }}> {item.job_type}</Text>
                                                        </View>
                                                        <TouchableOpacity style={{
                                                            width: wp(87),
                                                            height: hp(4.5),
                                                            alignItems:'center',
                                                            justifyContent: 'center',
                                                            borderRadius: wp(5),
                                                            backgroundColor: COLORS.orange,
                                                            marginTop: hp(2),
                                                        }}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2), color: COLORS.white }}>Apply Now</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={{
                                                            width: wp(87),
                                                            height: hp(4.5),
                                                            alignItems:'center',
                                                            justifyContent: 'center',
                                                            borderRadius: wp(5),
                                                            backgroundColor: COLORS.red,
                                                            marginTop: hp(2),
                                                        }} onPress={() => {setDeleteJobData(item),setDeleteJobModel(true)}}>
                                                            <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2), color: COLORS.white }}>Delete</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.id.toString()}
                                    ListEmptyComponent={() => (
                                        <View style={styles.DisplayJobs}>
                                            <View style={styles.JobContentContainer}>
                                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                    <Ionicons name="bag" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                                    <Text style={{ paddingTop: 15, color: COLORS.secondaryGray, fontSize: hp(2.2) }}>{t('No_available_jobs_to_show')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </View>
                                            {/* delete Job model */}
                                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={deleteJobModel}
                                onRequestClose={() => {setDeleteJobModel(false)}}
                            >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                    <View style={{
                                        marginTop: hp(2),
                                        // padding: 15,
                                        width: '70%',
                                        height: 'auto',
                                        backgroundColor: global.ContentContainer.backgroundColor,
                                        marginHorizontal: wp(2),
                                        borderRadius: 10
                                    }}>
                                        <View style={{ padding: hp(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.8), color: COLORS.black }}>Delete this Job?</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={{ marginHorizontal: wp(7) }}>
                                                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2), textAlign: 'justify' }}>Are you sure that you want to delete this job?</Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', marginTop: hp(1.5), justifyContent: 'center', alignItems: 'center' }}>
                                                <TouchableOpacity style={{
                                                    // backgroundColor: '#f7e5e5',
                                                    // borderRadius: 10,
                                                    // padding: 3,
                                                    // borderWidth: 0.5,
                                                    height: hp(7),
                                                    borderTopWidth: 0.4,
                                                    paddingVertical: hp(1.3),
                                                    borderColor: COLORS.secondaryGray,
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={() => onHandleDelete(deleteJobData)} >
                                                    {loading ? (
                                                        <Loader isLoading={loading} />
                                                    ) : (
                                                        <Text style={{ paddingHorizontal: wp(4), fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.red }}>Delete</Text>
                                                    )}
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{
                                                    // borderRadius: 10,
                                                    // padding: 3,
                                                    height: hp(7),
                                                    paddingVertical: hp(1.3),
                                                    borderTopWidth: 0.4,
                                                    borderColor: COLORS.secondaryGray,
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }} onPress={() => {setDeleteJobModel(false)}}>
                                                    <Text style={{ paddingHorizontal: wp(4), fontFamily: fontFamily.FONTS.Medium, fontSize: hp(2.3), color: COLORS.darkgray1 }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Jobs;

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor

        },
        imageContainer: {},
        image: {
            width: '100%',
            height: 180,
            // marginVertical: 10,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(198,77,83,0.5)',
        },
        BlogTitle: {
            color: COLORS.white,
            fontSize: hp(2.3),
            fontWeight: 'bold',
            flexWrap: 'wrap',
        },
        DisplayJobs: {
            marginBottom: hp(8),
            justifyContent: 'center',
            alignItems: 'center'
        },
        JobContentContainer: {
            borderRadius: 10,
            padding: 10,
            // backgroundColor: global.ContentContainer.backgroundColor,
        },
        Jobsoverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        textOverlay: {
            position: 'absolute',
            bottom: 0, // Adjust the position from the bottom as needed
            left: 10,
            right: 0,
            top: 40,
            // justifyContent: 'center',
            alignItems: 'flex-start',
        },
        BlogTextOverlay: {
            position: 'absolute',
            bottom: 60, // Adjust the position from the bottom as needed
            left: 20,
            top: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        overlayBlog: {
            position: 'absolute',
            top: 10,
            right: 10,
            alignItems: 'center',
            backgroundColor: COLORS.darkgray,
            borderRadius: wp(2)
        },
        overlayBlogText: {
            padding: 5,
            paddingHorizontal: 10,
            color: COLORS.gray, // Set your desired text color
            fontSize: hp(2.2), // Adjust the font size as needed
            fontFamily: fontFamily.FONTS.regular
        },
        overlayText: {
            color: COLORS.white,
            fontSize: hp(3),
            fontFamily: fontFamily.FONTS.Medium,
            flexWrap: 'wrap',
        },
        overlayText: {
            color: COLORS.white,
            paddingHorizontal: 8,
            fontSize: hp(4),
            fontFamily: fontFamily.FONTS.bold,
            flexWrap: 'wrap',
        },
        overlayText2: {
            // paddingTop: 5,
            paddingHorizontal: 8,
            color: COLORS.white,
            fontSize: wp(5),
            flexWrap: 'wrap',
        },
        pickerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 10,
            paddingHorizontal: 10,
            width: '100%',
        },
        HandingtextContainer: {
            backgroundColor: COLORS.green,
            justifyContent: 'center',
            alignItems: 'center',
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
        Handingtext: {
            color: COLORS.red,
            fontSize: 42,
            fontWeight: 'bold',
            marginBottom: 6,
            padding: 40,
        },
        ContentContainer: {
            marginTop: hp(-5),
            margin: 15,
            borderRadius: 10,
            padding: 15,
            backgroundColor: global.ContentContainer.backgroundColor
        },
        title: {
            color: global.text.color,
            fontSize: hp(2.4),
            fontWeight: 'bold',
            flexWrap: 'wrap',
            paddingBottom: 10
        },
        horizontalTabText: {
            padding: 5,
            marginHorizontal: 10,
            fontSize: hp(2.1),
            color: COLORS.white
        },
        ProfileComplitionButton: {
            borderRadius: 20,
            backgroundColor: COLORS.secondaryGray,
            marginTop: 10,
            marginHorizontal: 5
        },
        customInput: {
            width: '100%',
            height: 48,
            backgroundColor: global.textInput.backgroundColor,
            color: global.inputText.color,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
        },
        slider: {
            width: wp(67)
        },
        sliderContainer: {
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        sliderContentContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        dropDownContainer: {
            marginTop: hp(1),
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '50%',
            // marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            overflow: 'hidden', // Hide overflow content
        },
        location: {
            marginTop: 10,
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            paddingHorizontal: 10,
            justifyContent: 'center',
            height: 40,
        },
        dropDown: {
            width: '100%',
            minHeight: 40,
            color: global.inputText.color,
        },
        pickerItem: {
            height: 40, // Adjust Picker.Item's height
        },
        inputText: {
            color: global.inputText.color
        },
        horizontalLine: {
            borderBottomColor: '#eaebec',
            borderBottomWidth: 1,
            padding: 5,
            // marginHorizontal: 15,
        },
    });
};