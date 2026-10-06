/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import CheckBox from '../../components/CheckBox';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { ToastAndroid } from 'react-native'
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import view from '../../../assets/image/img/createPage/view.png'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import BasicHeader from '../../components/BasicHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCreateAdsApi, onSearchApi } from '../../Service/Api';
import { Loader } from '../../components/Loader';
import translations from '../../utils/localization/traslations';
import text from '../../../assets/image/img/createPage/text.png'
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Collapsible from 'react-native-collapsible';
import { fetchAllPage } from '../../redux/reducer';
import { useDispatch } from 'react-redux';
import CountryPicker from 'react-native-country-picker-modal'
import {useTranslation} from 'react-i18next';

const Advertising = () => {
    const {t} = useTranslation();
    const user_data = useSelector(state => state.user_data);
    const pages = useSelector(state => state.pages);

    // Filter the pages where is_page_owner is true
    const ownedPages = pages.filter(page => page.is_page_onwer === true);

    // Log the page names to the console
    // console.log('Pages owned by the user:', ownedPages.map(page => page.page_name));

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    // const [pageData, setPageData] = useState([])
    const [selectedOption, setSelectedOption] = useState('Campaigns');
    const [loading, setLoading] = useState(false)
    const [fromVisible, setFromVisible] = useState(false)
    const [ads, setAds] = useState([])
    const [showAddFunds, setShowAddFunds] = useState(false); // State to toggle Add Funds components
    const [companyName, setCompanyName] = useState('');
    const [campaignTitle, setCampaignTitle] = useState('');
    const [campaignDescription, setCampaignDescription] = useState('')
    const [startDate, setStartDate] = useState({ date: 'DD-MM-YYYY', });
    const [endDate, setEndDate] = useState({ date: 'DD-MM-YYYY' });
    const [websiteUrl, setWebsiteUrl] = useState('')
    const [myPagesVisible, setMyPagesVisible] = useState(false)
    const [myPages, setMyPages] = useState('')
    const [location, setLocation] = useState('')
    const [audience, setAudience] = useState('');
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedCategoryCode, setSelectedCountryCode] = useState(null)

    const onSelectCountry = (country) => {
        // Update the list of selected countries
        setSelectedCountries([...selectedCountries, country]);
        setSelectedCountryCode(country.callingCode)
    };

    const onRemoveCountry = (countryCode) => {
        // Remove the selected country
        const updatedCountries = selectedCountries.filter((c) => c.cca2 !== countryCode);
        setSelectedCountries(updatedCountries);
    };

    // Convert selected countries to a comma-separated string
    const displaySelectedCountries = selectedCountries.map((country) => country.name).join(', ');

    const [campaignBudget, setCampaignBudget] = useState('')
    const [modelVisible, setModelVisible] = useState(false);
    const [imageContainerHeight, setImageContainerHeight] = useState(200);
    const [messageText, setMessageText] = useState('')
    const [selectedImage, setSelectedImage] = useState(null);
    const [adImage, setAdImage] = useState(null)
    const [adImageType, setAdImageType] = useState(null);
    const [pageCount, setPageCount] = useState(0)
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    const [genderVisible, setGenderVisible] = useState(false)
    const [gender, setGender] = useState('All')
    const [biddingVisible, setBiddingVisible] = useState(false)
    const [bidding, setBidding] = useState('Pay Per Click ($0.05)')
    const [placementVisible, setPlacementVisible] = useState(false)
    const [placement, setPlacement] = useState('Entire Site (File Format Image)')
    const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);


    const toggleAddFunds = () => {
        setShowAddFunds(!showAddFunds);
    };

    const handleCountryPicker = () => {
        setCountryPickerVisibility(true); // Open the CountryPicker when the dropDownContainer is pressed
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        // Perform other actions based on the selected option if needed
    };

    const toggelFrom = () => {
        setFromVisible(!fromVisible)
    }

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }

    const toggleStartDatePicker = () => {
        setStartDatePickerVisibility((prevState) => !prevState);
    };

    const toggleEndDatePicker = () => {
        setEndDatePickerVisibility((prevState) => !prevState);
    };

    const handleStartDateConfirm = (date) => {
        setStartDate((prevState) => ({
            ...prevState,
            date: formatDate(date),
        }));
        toggleStartDatePicker(); // Hide the start date picker after confirming the date
    };

    const handleEndDateConfirm = (date) => {
        setEndDate((prevState) => ({
            ...prevState,
            date: formatDate(date),
        }));
        toggleEndDatePicker(); // Hide the end date picker after confirming the date
    };

    // Helper function to format date to 'dd-mm-yyyy' format
    const formatDate = (date) => {
        if (!date) {
            return ''; // Return empty string if date argument is not provided
        }
        const day = date.getDate();
        const month = date.getMonth() + 1; // Month starts from 0, so add 1
        const year = date.getFullYear();

        // Pad single digit day/month with leading zero
        const formattedDay = day < 10 ? `0${day}` : `${day}`;
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;

        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    useEffect(() => {
        // Fetch ads when the component mounts
        createAds('fetch_ads');
        fetchPages()
    }, []);

    const fetchPages = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token');
            
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData()
                formData.append('server_key', serverkey)

                const response = await onSearchApi(formData, token)
                if (response.data.api_status === 200) {
                    // setPages(response.data.pages)
                    // setPagesData(response.data.pages)
                    setLoading(false)
                    console.log('this is the pages', response.data.pages)
                    dispatch(fetchAllPage(response.data.pages))
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('Error fetching events', response.data.errors.error_text)
                }
            } else {
                setLoading(false)
                console.log('Token not found', error.message)
            }
        } catch (err) {
            setLoading(false)
            console.log("Get Error::", err)
        }
    }

    const createAds = async (type) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)
                formData.append('type', type)
                if (type === 'create') {
                    formData.append('name', companyName)
                    formData.append('website', websiteUrl)
                    formData.append('headline', campaignTitle)
                    formData.append('description', campaignDescription)
                    formData.append('bidding', bidding)
                    formData.append('appears', placement)
                    formData.append('gender', gender)
                    formData.append('location', location)
                    formData.append('start', startDate.date.toString())
                    formData.append('end', endDate.date.toString())
                    formData.append('budget', campaignBudget)
                    formData.append('media', adImage)
                    formData.append('page', myPages)
                    let countryCodeArray = selectedCategoryCode;
                    let countryCode = countryCodeArray[0];

                    console.log(countryCode);  // Outputs: '91'
                    formData.append('audience-list', countryCode)
                }

                console.log('type', type)
                console.log('name', companyName)
                console.log('website', websiteUrl)
                console.log('headline', campaignTitle)
                console.log('description', campaignDescription)
                console.log('bidding', bidding)
                console.log('appears', placement)
                console.log('gender', gender)
                console.log('location', location)
                console.log('start', startDate.date.toString())
                console.log('end', endDate.date.toString())
                console.log('budget', campaignBudget)
                console.log('media', adImage)
                console.log('page', myPages)
                // console.log('audience-list', countryCode)

                const response = await onCreateAdsApi(formData, token)
                console.log(response)
                if (response.data.api_status === 200) {
                    setAds(response.data)
                    setLoading(false)
                    console.log('this is the ads', response.data)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log('somthing went wrong', response.data.errors.error_text)
                }
            } else {
                setLoading(false)
                console.log('User token not found', error.mesage)
            }
        } catch (error) {
            setLoading(false)
            console.log('Get Error::', error)
        }
    }

    // Function to open image picker for selecting from gallery
    const openImagePicker = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                multiple: false, // Allow selecting only one image
            });

            if (image) {
                const filename = image.path.substring(
                    image.path.lastIndexOf("/") + 1
                );

                let imageData = {
                    uri: image.path,
                    type: image.mime,
                    name: filename,
                };

                // Set the selected image path to state
                setAdImage(imageData)
                setSelectedImage(imageData);
                setAdImageType(image.mime);

                // Set the image container height
                setImageContainerHeight(200); // Default height
            } else {
                console.log('No image selected');
            }
        } catch (error) {
            console.log('Error selecting image:', error);
        }
    };



    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        adImage: '',
        campaignTitle: '',
        campaignDescription: '',
        startDate: '',
        endDate: '',
        websiteUrl: '',
        location: '',
        audience: '',
        gender: '',
        placement: '',
        campaignBudget: '',
        bidding: '',
        // Add other form fields as needed
    });

    const handleSubmit = () => {
        // Handle form submission with formData
        console.log(formData);
        setFromVisible(false); // Hide the form after submission
    };

    const toggleForm = () => {
        setFromVisible(!fromVisible);
        setStep(1); // Reset to step 1 when form is toggled
    };


    const renderStepOne = () => (
        <View style={styles.container}>
            <View style={styles.ContentContainer}>
                <View style={styles.content}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(2) }}>
                        <MaterialIcons name="perm-media" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                        <Text style={{ marginHorizontal: wp(2), fontSize: hp(2.3), color: global.text2.color, }}>Campaigns</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>Company name</Text>
                        <CustomInput
                            keyboardType="default"
                            value={companyName}
                            onChangeText={text => setCompanyName(text)}
                        />
                    </View>
                    {/* Image selection */}
                    {/* <View style={styles.inputContainer}>
                        <Text style={styles.lable}>{translations.Image}</Text>
                        <TouchableOpacity onPress={openImagePicker} style={styles.imagePicker}>
                            {selectedImage ? (
                                <Image
                                    source={{ uri: selectedImage.uri }}
                                    style={{ width: '100%', height: hp(35), borderRadius: 10 }}
                                />
                            ) : (
                                <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                                    <MaterialCommunityIcons name='image' size={24} color={COLORS.white} />
                                    <Text style={{ color: COLORS.white, padding: 6, fontFamily: fontFamily.FONTS.Medium }}>Choose Image</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View> */}

                    <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(4), marginHorizontal: wp(2), borderRadius: 10, justifyContent: 'space-evenly' }}>
                        <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5, }}
                            onPress={() => {
                                if (!companyName || !adImage) {
                                    // Show a message if required fields are not filled
                                    Alert.alert(
                                        'Validation Error',
                                        'Please fill in all the required fields.'
                                    );
                                } else {
                                    setStep(2);
                                }
                            }}>
                            <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )

    const renderStepTwo = () => (
        <View style={styles.container}>
            <View style={styles.ContentContainer}>
                <View style={styles.content}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(2) }}>
                        <MaterialCommunityIcons name="information" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                        <Text style={{ marginHorizontal: wp(2), fontSize: hp(2.3), color: global.text2.color, }}>Details</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>Compaign title</Text>
                        <CustomInput
                            keyboardType="default"
                            value={campaignTitle}
                            onChangeText={text => setCampaignTitle(text)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>Compaign description</Text>
                        <TextInput
                            keyboardType="default"
                            multiline={true}
                            numberOfLines={5}
                            value={campaignDescription}
                            onChangeText={text => setCampaignDescription(text)}
                            style={styles.descriptionInput}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>start date</Text>
                        <TouchableOpacity onPress={toggleStartDatePicker} style={styles.timepickerContainer}>
                            <Text style={styles.selctedDate}>{startDate.date}</Text>
                            <MaterialIcons name='date-range' size={20} color={COLORS.secondaryGray} />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isStartDatePickerVisible}
                            mode="date"
                            onConfirm={handleStartDateConfirm}
                            onCancel={toggleStartDatePicker}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>end date</Text>
                        <TouchableOpacity onPress={toggleEndDatePicker} style={styles.timepickerContainer}>
                            <Text style={styles.selctedDate}>{endDate.date}</Text>
                            <MaterialIcons name='date-range' size={20} color={COLORS.secondaryGray} />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isEndDatePickerVisible}
                            mode="date"
                            onConfirm={handleEndDateConfirm}
                            onCancel={toggleEndDatePicker}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>website URL</Text>
                        <CustomInput
                            placeholder="Website URL"
                            placeholderTextColor={COLORS.secondaryGray}
                            keyboardType="default"
                            value={websiteUrl}
                            onChangeText={text => setWebsiteUrl(text)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>My Pages</Text>
                        <View>
                            <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setMyPagesVisible(!myPagesVisible) }}>
                                <Text style={styles.titleText}>{myPages}</Text>
                                {myPagesVisible ?
                                    <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                    :
                                    <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                                }

                            </TouchableOpacity>
                            <Collapsible collapsed={!myPagesVisible}>
                                <View style={styles.collapsView}>
                                    {ownedPages.map(page => (
                                        <TouchableOpacity
                                            key={page.page_id}
                                            style={styles.optionView}
                                            onPress={() => { setMyPages(page.page_name), setWebsiteUrl(page.url), setMyPagesVisible(!myPagesVisible) }}
                                        >
                                            <Text style={styles.optionText}>{page.page_name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </Collapsible>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(5), marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                        <TouchableOpacity onPress={() => setStep(1)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                <Text style={{ padding: 5, fontSize: hp(2.2), color: '#737373', }}>{t('go_back')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5, }}
                            onPress={() => {
                                if (!campaignTitle || !campaignDescription || !startDate.date || !endDate.date || !websiteUrl || !myPages) {
                                    // Show a message if required fields are not filled
                                    Alert.alert(
                                        'Validation Error',
                                        'Please fill in all the required fields.'
                                    );
                                } else {
                                    setStep(3);
                                }
                            }}>
                            <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )

    const renderStepThree = () => (
        <View style={styles.container}>
            <View style={styles.ContentContainer}>
                <View style={styles.content}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(2) }}>
                        <Feather name="target" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                        <Text style={{ marginHorizontal: 10, fontSize: hp(2.3), color: global.text2.color, }}>Targeting</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>Location</Text>
                        <CustomInput
                            keyboardType="default"
                            value={location}
                            onChangeText={text => setLocation(text)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>Audience</Text>
                        <TouchableOpacity onPress={handleCountryPicker} style={styles.CountrydropDownContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={styles.selectedCountry}>{displaySelectedCountries || 'Select Country'}</Text>
                                {/*  <Materialicons name="arrow-drop-down" size={29} color={COLORS.black} />* */}
                            </View>
                        </TouchableOpacity>
                        {isCountryPickerVisible && (
                            <CountryPicker
                                visible={isCountryPickerVisible}
                                onClose={() => setCountryPickerVisibility(false)}
                                withFilter
                                withFlag
                                withCountryNameButton
                                withAlphaFilter
                                onSelect={onSelectCountry}
                                onRemove={onRemoveCountry}
                                selectedCountries={selectedCountries}
                            />
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>Gender</Text>
                        <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setGenderVisible(!genderVisible) }}>
                            <Text style={styles.titleText}>{gender}</Text>
                            {genderVisible ?
                                <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                :
                                <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                            }

                        </TouchableOpacity>
                        <Collapsible collapsed={!genderVisible}>
                            <View style={styles.collapsView}>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setGender('All'), setGenderVisible(!genderVisible) }}>
                                    <Text style={styles.optionText}>{'All'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setGender('Female'), setGenderVisible(!genderVisible) }} >
                                    <Text style={styles.optionText}>{'Female'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setGender('Male'), setGenderVisible(!genderVisible) }} >
                                    <Text style={styles.optionText}>{'Male'}</Text>
                                </TouchableOpacity>
                            </View>
                        </Collapsible>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>Placement</Text>
                        <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setPlacementVisible(!placementVisible) }}>
                            <Text style={styles.titleText}>{placement}</Text>
                            {placementVisible ?
                                <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                :
                                <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                            }

                        </TouchableOpacity>
                        <Collapsible collapsed={!placementVisible}>
                            <View style={styles.collapsView}>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setPlacement('Entire Site'), setPlacementVisible(!placementVisible) }}>
                                    <Text style={styles.optionText}>{'Entire Site (File Format image)'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setPlacement('Post'), setPlacementVisible(!placementVisible) }} >
                                    <Text style={styles.optionText}>{'Post (File Format image)'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setPlacement('Sidebar'), setPlacementVisible(!placementVisible) }} >
                                    <Text style={styles.optionText}>{'Sidebar (File Format image)'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setPlacement('Jobs'), setPlacementVisible(!placementVisible) }} >
                                    <Text style={styles.optionText}>{'Jobs (File Format image)'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setPlacement('Forum'), setPlacementVisible(!placementVisible) }} >
                                    <Text style={styles.optionText}>{'Forum (File Format image)'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setPlacement('Fundings'), setPlacementVisible(!placementVisible) }} >
                                    <Text style={styles.optionText}>{'Fundings (File Format image)'}</Text>
                                </TouchableOpacity>
                            </View>
                        </Collapsible>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>Campaigns Budget</Text>
                        <CustomInput
                            placeholder="Username"
                            placeholderTextColor={COLORS.secondaryGray}
                            keyboardType="default"
                            value={campaignBudget}
                            onChangeText={text => setCampaignBudget(text)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.lable}>Bidding</Text>
                        <TouchableOpacity style={styles.dropDownContainer} onPress={() => { setBiddingVisible(!biddingVisible) }}>
                            <Text style={styles.titleText}>{bidding}</Text>
                            {biddingVisible ?
                                <MaterialIcons name="arrow-drop-up" size={29} color={COLORS.black} />
                                :
                                <MaterialIcons name="arrow-drop-down" size={29} color={COLORS.black} />
                            }
                        </TouchableOpacity>
                        <Collapsible collapsed={!biddingVisible}>
                            <View style={styles.collapsView}>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setBidding('Click'), setBiddingVisible(!biddingVisible) }}>
                                    <Text style={styles.optionText}>{'Pay Per Click ($0.05)'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionView} onPress={() => { setBidding('Impression'), setBiddingVisible(!biddingVisible) }} >
                                    <Text style={styles.optionText}>{'Pay Per Impression ($0.01)'}</Text>
                                </TouchableOpacity>
                            </View>
                        </Collapsible>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 10, marginTop: 25, marginHorizontal: 10, borderRadius: 10, justifyContent: 'space-evenly' }}>
                        <TouchableOpacity onPress={() => setStep(2)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AntDesign name="arrowleft" size={17} color={'#737373'} />
                                <Text style={{ padding: 5, fontSize: hp(2.2), color: '#737373', }}>{t('go_back')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5, }} onPress={() => createAds('create')}>
                            <Text style={{ paddingHorizontal: wp(10), fontSize: hp(2.3), color: COLORS.white }}>{t('create')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>

    )

    const renderItem = ({ item }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.nameCell1}>{item.id}</Text>
                <Text style={styles.nameCell}>{item.name}</Text>
                <Text style={styles.nameCell}>{item.bidding}</Text>
                <Text style={styles.nameCell}>{item.clicks}</Text>
                <Text style={styles.nameCell}>{item.views}</Text>
                <Text style={styles.nameCell}>{item.status === 1 ? 'active' : 'inactive'}</Text>

            </View>
        );
    };

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Advertisings'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>
                        <View style={styles.container}>
                            <View style={styles.content}>
                                <View style={{ padding: 10, marginTop: hp(2), backgroundColor: COLORS.white, borderRadius: wp(2) }}>
                                    <View style={{ padding: 10, paddingHorizontal: wp(4), minHeight: hp(10), marginHorizontal: wp(2), backgroundColor: COLORS.red, borderRadius: 7 }}>
                                        <Text style={{ marginVertical: hp(1), fontSize: hp(2.3), color: COLORS.secondaryWhite, fontFamily: fontFamily.FONTS.Medium }}>Current Balance</Text>
                                        <Text style={{ fontSize: hp(4), color: COLORS.white }}>$ {user_data?.wallet}</Text>
                                    </View>
                                    <View style={{ padding: 15 }}>
                                        <TouchableOpacity style={[{ flexDirection: 'row', alignItems: "center" }, selectedOption === 'Campaigns' && styles.walletView2]} onPress={() => { handleOptionClick('Campaigns'); createAds('fetch_ads'); setFromVisible(false) }}>
                                            <AntDesign name="notification" size={18} color={COLORS.black} />
                                            <Text style={{ padding: 10, fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2) }}>Campaigns</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }} onPress={() => navigation.navigate('SettingScreen', { selectedOption: 'Wallet' })}>
                                            <MaterialCommunityIcons name="wallet" size={18} color={COLORS.black} />
                                            <Text style={{ padding: 10, fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2) }}>Wallets & Credits</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[{ flexDirection: 'row', alignItems: "center" }, selectedOption === 'New Campaigns' && styles.walletView2]} onPress={() => { handleOptionClick('New Campaigns'); toggelFrom(); }}>
                                            <AntDesign name="pluscircle" size={18} color={COLORS.black} />
                                            <Text style={{ padding: 10, fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1, fontSize: hp(2.2) }}>New Campaigns</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>


                            {!fromVisible ? (
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, marginTop: hp(2), backgroundColor: global.ContentContainer.backgroundColor, borderRadius: wp(2) }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="select-group" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                                            <Text style={{ marginHorizontal: 10, fontSize: hp(2.3), color: global.text2.color, }}>Campaigns</Text>
                                        </View>
                                    </View>
                                    {loading ? (
                                        <View style={{ flex: 1, marginVertical: hp(20), justifyContent: 'center', alignItems: 'center' }}>
                                            <Loader isLoading={loading} />
                                        </View>
                                    ) : (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View>
                                                {/* Your header row */}
                                                <View style={styles.headerRow}>
                                                    <Text style={styles.headerCell1}>Id</Text>
                                                    <Text style={styles.headerCell}>Company</Text>
                                                    <Text style={styles.headerCell}>Bidding</Text>
                                                    <Text style={styles.headerCell}>Clicks</Text>
                                                    <Text style={styles.headerCell}>View</Text>
                                                    <Text style={styles.headerCell}>Status</Text>
                                                </View>

                                                {/* User data */}
                                                <FlatList
                                                    data={ads.data}
                                                    renderItem={renderItem}
                                                    keyExtractor={(item) => item.id}
                                                />
                                            </View>
                                        </ScrollView>
                                    )}

                                </View>
                            ) : (
                                <View>
                                    <View style={styles.ContentContainer1}>
                                        <View style={styles.walletView3}>
                                            <View style={{ width: 30, height: 30, borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.red, marginHorizontal: wp(3) }}>
                                                <Image style={styles.imageStyle2} source={view} />
                                            </View>
                                            <Text style={styles.newCampaign}>Ad preview</Text>
                                        </View>
                                        <View style={styles.walletView4}>
                                            <View style={{ flexDirection: 'row', marginVertical: hp(1) }}>
                                                <Image style={{ width: wp(10), height: wp(10), borderRadius: wp(10) }} source={{ uri: user_data.avatar }} />
                                                <View>
                                                    <Text style={styles.optionText}> {companyName ? companyName : 'Company'}</Text>
                                                    <Text style={styles.optionText1}> {location ? location : 'location'}</Text>
                                                </View>
                                            </View>
                                            <Text style={[styles.optionText, { marginVertical: hp(1) }]}>{campaignDescription ? campaignDescription : ' Description'}</Text>
                                        </View>
                                        <View style={styles.walletView5}>
                                            <Image style={styles.imageStyle3} source={text} />
                                            <Text style={[styles.newCampaign, { marginLeft: wp(2) }]}>{campaignTitle ? campaignTitle : 'Title'}</Text>
                                        </View>
                                        <View style={styles.walletView4}>
                                            {selectedImage ? (
                                                <Image
                                                    source={{ uri: selectedImage.uri }}
                                                    style={{ width: '100%', height: hp(18), borderRadius: 10 }}
                                                />
                                            ) : null}
                                        </View>
                                    </View>
                                    {step === 1 && renderStepOne()}
                                    {step === 2 && renderStepTwo()}
                                    {step === 3 && renderStepThree()}
                                </View>
                            )}


                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Advertising

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: '#f2f2f2',
        },
        headerCell1: {
            fontSize: hp(2.2),
            color: '#333',
            paddingHorizontal: wp(20),
            width: wp(50),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.Medium
        },
        headerCell: {
            fontSize: hp(2.2),
            color: '#333',
            paddingHorizontal: wp(10),
            width: wp(40),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.Medium
        },
        // User data row styles
        row: {
            flexDirection: 'row',
            backgroundColor: COLORS.white,
            marginHorizontal: wp(3),
            borderRadius: 5,
            // justifyContent: 'center',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.lightGray,
        },
        cell: {
            flex: 1,
            fontSize: hp(2.2),
            color: '#555',
            justifyContent: 'space-around'
            // textAlign: 'center',
            // alignItems: 'center'
        },
        // Width for each column
        nameCell: {
            fontSize: hp(2.2),
            color: '#555',
            width: wp(40),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.Medium,
            paddingVertical: hp(1)
        },
        nameCell1: {
            fontSize: hp(2.2),
            color: '#555',
            width: wp(45),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.Medium,
            paddingVertical: hp(1)
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
            // margin: 10,
            marginVertical: hp(1),
            borderRadius: wp(2),
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
        imagePicker: {
            width: '100%',
            height: hp(35),
            // marginHorizontal: 15,
            backgroundColor: '#eaeaea',
            color: global.inputText.color,
            // borderColor: COLORS.secondaryBlack,
            borderRadius: 8,
            justifyContent: 'space-between'
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
            borderColor: COLORS.gray,
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            justifyContent: 'space-between',
            height: 45,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: wp(3)
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

        pickerItem: {
            height: 40, // Adjust Picker.Item's height
        },
        optionView: {
            width: '100%',
            height: hp(6),
            marginLeft: wp(3),
            justifyContent: 'center'
        },
        walletView2: {
            width: '100%',
            height: hp(7),
            alignSelf: 'center',
            alignItems: "center",
            borderLeftColor: COLORS.red,
            borderLeftWidth: 2,
            marginVertical: hp(1.5),
            paddingLeft: wp(2),
            flexDirection: 'row'
        },
        ContentContainer1: {
            // margin: 10,
            marginVertical: hp(1),
            borderRadius: wp(2),
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        walletView3: {
            width: '100%',
            height: hp(6),
            alignSelf: 'center',
            alignItems: "center",
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 1,
            marginVertical: hp(1.5),
            paddingLeft: wp(2),
            flexDirection: 'row'
        },
        imageStyle2: {
            height: hp(5),
            width: wp(4.5),
            resizeMode: 'contain',
            tintColor: COLORS.white
        },
        newCampaign: {
            fontSize: hp(2.2),
            color: COLORS.black,
            fontFamily: fontFamily.FONTS.bold,
        },
        walletView4: {
            width: '100%',
            height: hp(20),
            alignSelf: 'center',
            paddingLeft: wp(2),
        },
        optionText: {
            fontSize: hp(2),
            color: COLORS.gray,
            fontFamily: fontFamily.FONTS.Medium,
            marginLeft: wp(3)
        },
        optionText1: {
            fontSize: hp(1.8),
            color: COLORS.gray,
            fontFamily: fontFamily.FONTS.regular,
            marginLeft: wp(3)
        },
        walletView5: {
            width: '100%',
            height: hp(5),
            alignSelf: 'center',
            alignItems: "center",
            borderTopColor: COLORS.gray,
            borderTopWidth: 1,
            paddingLeft: wp(2),
            flexDirection: 'row'
        },
        imageStyle3: {
            height: hp(5),
            width: wp(4.5),
            resizeMode: 'contain',
            marginLeft: wp(3)
        },
        collapsView: {
            width: '100%',
            minHeight: hp(12),
            backgroundColor: '#fff',
            borderWidth: 0.5,
            borderColor: COLORS.primarygray
        },
        titleText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
        optionText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
        selectedCountry: {
            color: '#585858',
            fontSize: hp(2.2)
        },
        CountrydropDownContainer: {
            marginTop: 10,
            // backgroundColor: global.textInput.backgroundColor,
            borderColor: '#eeeff0',
            borderWidth: 0.5,
            borderRadius: 8,
            width: '100%',
            // marginHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingHorizontal: wp(4),
            height: hp(6.5),
            overflow: 'hidden',
        },
    });
};