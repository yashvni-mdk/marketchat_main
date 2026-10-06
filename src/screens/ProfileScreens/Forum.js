/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '../../components/ThemeContext';
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import BasicHeader from '../../components/BasicHeader';
import fontFamily from '../../../constants/fontFamily';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onSearchApi } from '../../Service/Api';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';

// const capital = [
//     {name: 'A', visible:false},
//     {name: 'B', visible:false},
//     {name: 'C', visible:false},
//     {name: 'D', visible:false},
//     {name: 'E', visible:false},
//     {name: 'F', visible:false},
//     {name: 'G', visible:false},
//     {name: 'H', visible:false},
//     {name: 'I', visible:false},
//     {name: 'J', visible:false},
//     {name: 'K', visible:false},
//     {name: 'L', visible:false},
//     {name: 'M', visible:false},
//     {name: 'N', visible:false},
//     {name: 'O', visible:false},
//     {name: 'P', visible:false},
//     {name: 'Q', visible:false},
//     {name: 'R', visible:false},
//     {name: 'S', visible:false},
//     {name: 'T', visible:false},
//     {name: 'U', visible:false},
//     {name: 'V', visible:false},
//     {name: 'W', visible:false},
//     {name: 'X', visible:false},
//     {name: 'Y', visible:false},
//     {name: 'Z', visible:false}
// ]

const Forum = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const SearchType = [
        { id:1, label: 'Search subject only', value: 'Search subject only' },
        { id:2, label: 'Search Post', value: 'Search Post' }
      ];

      const SearchIn = [
        { id:1, label: 'Search Forums', value: 'Search Forums' },
        { id:2, label: 'Search in messages', value: 'Search in messages' },
        { id:3, label: 'Search in threads', value: 'Search in threads' }
      ];

      const SearchSection = [];

    const [allUsers, setAllUsers] = useState([])
    const [filterAllUsers, setFilterAllUsers] = useState([])
    const [fromVisible, setFromVisible] = useState(false);
    const [image, setImage] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Search subject only');
    const [searchIn, setSearchIn] = useState('Search in threads');
    const [searchSection, setSearchSection] = useState('');
    const [capital, setCapital] = useState([
        {name: 'A', visible:false},
        {name: 'B', visible:false},
        {name: 'C', visible:false},
        {name: 'D', visible:false},
        {name: 'E', visible:false},
        {name: 'F', visible:false},
        {name: 'G', visible:false},
        {name: 'H', visible:false},
        {name: 'I', visible:false},
        {name: 'J', visible:false},
        {name: 'K', visible:false},
        {name: 'L', visible:false},
        {name: 'M', visible:false},
        {name: 'N', visible:false},
        {name: 'O', visible:false},
        {name: 'P', visible:false},
        {name: 'Q', visible:false},
        {name: 'R', visible:false},
        {name: 'S', visible:false},
        {name: 'T', visible:false},
        {name: 'U', visible:false},
        {name: 'V', visible:false},
        {name: 'W', visible:false},
        {name: 'X', visible:false},
        {name: 'Y', visible:false},
        {name: 'Z', visible:false}
    ]);
    const [selectedSection, setSelectedSection] = useState('Browse Forum'); // State to manage the selected section
    const toggelFrom = () => {
        setFromVisible(!fromVisible)
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    const [selectedAlphabet, setSelectedAlphabet] = useState('');

    const getAllUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token')
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey)


                const response = await onSearchApi(formData, token)
                if (response.data.api_status === 200) {
                    console.log('this is the all users', response.data.users)
                    setAllUsers(response.data.users)
                    setFilterAllUsers(response.data.users)
                    // Filter users based on the selectedAlphabet
                    const filteredUsers = response.data.users.filter(user =>
                        user.username.startsWith(selectedAlphabet)
                    );
                } else if (response.data.api_status === 400 || 404) {
                    console.log('somthing went wrong', response.data.errors.error_text)
                }
            } else {
                console.log('User token not found', error.message)
            }
        } catch (error) {
            console.log('Get Error::', error)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <View style={styles.headerRow}>
                <View style={{
                    justifyContent: 'space-between',
                    height: hp(6)
                }}>
                <Text style={styles.nameCell1}>{item.username}</Text>
                <Text style={styles.nameCell1}>{item.admin != 1 ? 'Registered' : 'Site Admin'}</Text>
                </View>
                <Text style={styles.nameCell}>{item.registered}</Text>
                <Text style={styles.nameCell}>{item.lastseen}</Text>
                <Text style={styles.nameCell}>{item.details.post_count}</Text>
                <Text style={styles.nameCell}>{item.referrer}</Text>

            </View>
        );
    };

    const onHandleSearchData = (item, index) => {
        let allData = filterAllUsers;
        let filterData = [];
        capital.map((item1, index1) => {
            if (index1 == index) {
                capital[index].visible = true;
            } else {
                capital[index1].visible = false;
            }
        })
        
        filterAllUsers.map((item1, index1) => {
            console.log(' GEt Value::::', item1)
            if (item1.username.charAt(0) == item.name.toLowerCase() || item1.username.charAt(0) == item.name) {
                filterData.push(item1)
            }
        })
     setAllUsers(filterData)
     setRefresh(!refresh);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerView}>
                    <BasicHeader onPress={() => navigation.goBack()} title={'Forum'} />
                </View>
                <View style={{
                    flex: 0.92,
                    width: '100%',
                }}>
                    <View>

                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(2), backgroundColor: global.ContentContainer.backgroundColor, borderRadius: 10, justifyContent: 'space-between' }}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <TouchableOpacity onPress={() => setSelectedSection('Browse Forum')} style={[styles.optionButtonView, { borderBottomColor: selectedSection == 'Browse Forum' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                        <Text style={{ paddingHorizontal: 10, fontSize: 16, color: '#766b66' }}>Browse Forum</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSelectedSection('Members')} style={[styles.optionButtonView, { borderBottomColor: selectedSection == 'Members' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                        <Text style={{ paddingHorizontal: 10, fontSize: 16, color: COLORS.darkgray1 }}>Members</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSelectedSection('Search')} style={[styles.optionButtonView, { borderBottomColor: selectedSection == 'Search' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                        <Text style={{ paddingHorizontal: 10, fontSize: 16, color: COLORS.darkgray1 }} >Search</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSelectedSection('My Threads')} style={[styles.optionButtonView, { borderBottomColor: selectedSection == 'My Threads' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                        <Text style={{ paddingHorizontal: 10, fontSize: 16, color: COLORS.darkgray1 }}>My Threads</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSelectedSection('My Messages')} style={[styles.optionButtonView, { borderBottomColor: selectedSection == 'My Messages' ? COLORS.red : global.ContentContainer.backgroundColor }]}>
                                        <Text style={{ paddingHorizontal: 10, fontSize: 16, color: COLORS.darkgray1 }}>My Messages</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>


                            {selectedSection === 'Browse Forum' && (
                                <View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                                        <MaterialIcons name="format-list-bulleted" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.3), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No Forums to Show</Text>
                                    </View>
                                </View>
                            )}
                            {selectedSection === 'Members' && (
                                <View>
                                    <View style={{ marginTop: hp(4), alignItems: 'center', padding: 10, backgroundColor: COLORS.black, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 10, borderRadius: 10 }}>
                                        <Text style={{ fontSize: 15, color: COLORS.white, lineHeight: 24 }}>List of Users</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            alignItems: 'center'
                                        }}>
                                            {capital.map((item, index) => {
                                                return(
                                                    <Text
                                                      onPress={() => onHandleSearchData(item, index)}
                                                      style={{
                                                        fontSize: item.visible ? hp(2.2) : hp(1.8),
                                                        color: COLORS.white,
                                                        letterSpacing: 2,
                                                        lineHeight: 24,
                                                        fontFamily: item.visible ? fontFamily.FONTS.bold : fontFamily.FONTS.regular
                                                        }}>{item.name}</Text>
                                                );
                                            })}
                                        </View>
                                    </View>

                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View>
                                            {/* Your header row */}
                                            <View style={styles.headerRow}>
                                                <Text style={styles.nameCell1}>Name</Text>
                                                <Text style={styles.nameCell}>Joined</Text>
                                                <Text style={styles.nameCell}>Last Visit</Text>
                                                <Text style={styles.nameCell}>Posts Count</Text>
                                                <Text style={styles.nameCell}>Referrals</Text>
                                            </View>

                                            {/* User data */}
                                            <FlatList
                                                data={allUsers}
                                                renderItem={renderItem}
                                                keyExtractor={(item) => item.id}
                                            />
                                        </View>
                                    </ScrollView>
                                </View>
                            )}

                            {selectedSection === 'Search' && (
                                <View style={styles.container}>
                                    {/** <View style={{ padding: 10, backgroundColor: COLORS.white, marginHorizontal: 10, borderRadius: 10 }}>
                                        <Text style={{ marginHorizontal: 10, fontSize: 18, color: COLORS.darkgray1 }}>Search</Text>
                                    </View> */}
                                    <View style={styles.ContentContainer}>
                                        <View style={styles.content}>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Search for term</Text>
                                                <TextInput
                                                    keyboardType="default"
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    style={styles.descriptionInput}
                                                    textAlignVertical="top"
                                                />
                                                <Text style={{ fontSize: 12, fontFamily: fontFamily.FONTS.regular, color: COLORS.secondaryGray }}>Type in one or more search terms,each must be at least 4 characters</Text>
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Search type</Text>
                                                {/* <CustomInput
                                                    keyboardType="default"
                                                    value={image}
                                                    onChangeText={text => setImage(text)}
                                                /> */}
                                                <View style={styles.dropDownContainer}>
                                                    <Picker
                                                    selectedValue={selectedCategory}
                                                    onValueChange={(itemValue, itemIndex) => {
                                                        const category = SearchType[itemIndex];
                                                        setSelectedCategory(itemValue);
                                                    }
                                                    }
                                                    style={styles.dropDown} itemStyle={styles.pickerItem}
                                                    >
                                                    {SearchType.map((category, index) => (
                                                        <Picker.Item key={index} label={category.label} value={category.value} />
                                                    ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Search in</Text>
                                                <View style={styles.dropDownContainer}>
                                                    <Picker
                                                        selectedValue={searchIn}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            const category = SearchIn[itemIndex];
                                                            setSearchIn(itemValue);
                                                        }}
                                                        style={styles.dropDown}
                                                        itemStyle={styles.pickerItem}
                                                    >
                                                    {SearchIn.map((category, index) => (
                                                        <Picker.Item key={index} label={category.label} value={category.value} />
                                                    ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.lable}>Search section</Text>
                                                <View style={styles.dropDownContainer}>
                                                    <Picker
                                                        selectedValue={searchSection}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            const category = SearchSection[itemIndex];
                                                            setSearchSection(itemValue);
                                                        }}
                                                        style={styles.dropDown}
                                                        itemStyle={styles.pickerItem}
                                                    >
                                                    {SearchSection.map((category, index) => (
                                                        <Picker.Item key={index} label={category.label} value={category.value} />
                                                    ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: hp(2), borderRadius: 10, justifyContent: 'space-evenly' }}>
                                                <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5 }} >
                                                    <Text style={{ paddingHorizontal: wp(3), fontSize: 20, color: COLORS.white }}>Search</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {selectedSection === 'My Threads' && (
                                <View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                                        <MaterialIcons name="format-list-bulleted" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.3), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No Threads to Show</Text>
                                    </View>
                                </View>
                            )}

                            {selectedSection === 'My Messages' && (
                                <View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
                                        <MaterialIcons name="format-list-bulleted" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.3), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No Messages to Show</Text>
                                    </View>
                                </View>
                            )}

                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Forum

const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        container: {
            backgroundColor: global.container.backgroundColor,
            marginTop: hp(2),
        },
        ContentContainer: {
            // margin: 10,
            borderRadius: 10,
            padding: 20,
            backgroundColor: global.ContentContainer.backgroundColor,
        },
        inputContainer: {
            marginTop: 10,
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
        optionButtonView: {
            borderBottomWidth: 2,
            alignItems: "center",
            justifyContent: 'center',
            height: hp(7)
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
            fontSize: 15,
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15,
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
        // Header styles
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: hp(8),
            backgroundColor: '#fff',
            alignItems: 'center'
        },
        headerCell1: {
            fontSize: hp(1.8),
            color: '#333',
            paddingHorizontal: wp(20),
            width: wp(65),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.Medium
        },
        headerCell: {
            fontSize: hp(1.8),
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
            fontSize: hp(1.8),
            color: '#555',
            justifyContent: 'space-around'
            // textAlign: 'center',
            // alignItems: 'center'
        },
        // Width for each column
        nameCell: {
            fontSize: hp(1.8),
            color: '#555',
            width: wp(40),
            textAlign: 'center',
            fontFamily: fontFamily.FONTS.Medium,
        },
        nameCell1: {
            fontSize: hp(1.8),
            color: '#555',
            width: wp(65),
            textAlign: 'left',
            fontFamily: fontFamily.FONTS.Medium,
            paddingLeft: wp(4)
        },

    });
};
