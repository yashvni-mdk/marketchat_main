/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, FlatList, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../CustomInput';
import Button from '../Button';
import Footer from '../Footer';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
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

const information = [
    {
        id: 1,
        title: 'My Information',
        iconName: 'information',
        visible: false,
    },
    {
        id: 2,
        title: 'Posts',
        iconName: 'newspaper',
        visible: false,
    },
    {
        id: 3,
        title: 'Pages',
        iconName: 'flag',
        visible: false,
    },
    {
        id: 4,
        title: 'My Information',
        iconName: 'information',
        visible: false,
    },
    {
        id: 5,
        title: 'Following',
        iconName: 'person-add',
        visible: false,
    },
    {
        id: 6,
        title: 'Followers',
        iconName: 'information',
        visible: false,
    }
]

const MyInformation = () => {
    const user_data = useSelector(state => state.user_data);
    const [informationData, setInformationData] = useState(information);
    const [refresh, setRefresh] = useState(false);
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });

    const onHandlePress = (item1, index1) => {
        try {
            let array = informationData;
            array.map((item, index) => {
                if (index == index1) {
                    array[index].visible = !item.visible
                }
            })
            setInformationData(array);
            setRefresh(!refresh);
        } catch (err) {
            console.log('Error:', err);
        }
    }

    const renderItem = ({ item, index }) => (
        <View style={{ marginTop: 10 }}>
            <TouchableOpacity onPress={() => onHandlePress(item, index)}>
                <View style={[styles.Information, {borderColor: item.visible ? COLORS.red : '#727272'}]}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={item.iconName} size={20} color={COLORS.white} style={{ backgroundColor: item.visible ? COLORS.lightBlue : '#727272', borderRadius: 100, padding: 5 }} />
                    </View>
                    <Text style={[styles.title,{color: item.visible ? COLORS.red : '#727272'}]}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
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
                                            <MaterialCommunityIcons name='file-document' size={19} color={COLORS.white} style={{ backgroundColor: '#60869f', borderRadius: 50, padding: 5 }} />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(5) }}>
                                        <Text style={styles.username}>{user_data?.username}</Text>
                                        <Text style={styles.Handingtext}>
                                            My Information
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginTop: hp(3) }}>
                                    <Text style={styles.Note}>Please choose which information you would like to download</Text>
                                    <FlatList
                                        data={informationData}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.id}
                                        contentContainerStyle={{ paddingHorizontal: 10 }} // Adjust as needed
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', padding: 10, marginTop: hp(3), borderRadius: 10, justifyContent: 'center' }}>
                                    <TouchableOpacity style={{ backgroundColor: COLORS.red, borderRadius: 10, padding: 5, }} onPress={handelContactUs} >
                                        <Text style={{ paddingHorizontal: wp(4), fontSize: hp(2.3), color: COLORS.white }}>Generat file</Text>
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

export default MyInformation

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
            borderColor: '#f0f3f4',
            backgroundColor: '#f9fafa',
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: '#60869f',
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
        iconContainer: {
            borderRadius: 100,
            backgroundColor: COLORS.secondaryWhite,
            padding: 9
        },
        Note: {
            fontFamily: fontFamily.FONTS.Medium,
            color:COLORS.darkgray1,
            fontSize:  hp(2.2),
            flex: 1,
            paddingHorizontal: 10
        },
        username: {
            fontSize:  hp(2.2),
            color: '#60869f',
            fontFamily: fontFamily.FONTS.regular,
            marginVertical: 4,
        },
        Information: {
            height: hp(18),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#727272',
            // padding: 10,
            borderRadius: 8
        },
        title: {
            fontFamily: fontFamily.FONTS.Medium,
            color: '#727272',
            fontSize: hp(2.2),
            paddingTop: hp(2)
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};