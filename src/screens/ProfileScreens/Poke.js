/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, ToastAndroid, Text, FlatList, TextInput, TouchableOpacity, View, Modal, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityicons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
// import { ToastAndroid } from 'react-native'
import Footer from '../../components/Footer';
import translations from '../../utils/localization/traslations';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import { getUserData } from '../../utils/localization/Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { onPokeUserApi } from '../../Service/Api';
import BasicHeader from '../../components/BasicHeader';
import { Loader } from '../../components/Loader';

const Poke = () => {
    const navigation = useNavigation();
    const user_data = useSelector(state => state.user_data)
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme),
    });

    const [pokeUsers, setPokeUsers] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchPoke('fetch')
    }, [])

    const fetchPoke = async (type, sendUserId,) => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('access_token')
            console.log(token)
            if (token != null) {
                const serverkey = 'ea53582bfecd4121c9cd18a8f019bd74';
                const formData = new FormData();
                formData.append('server_key', serverkey);
                formData.append('type', type);
                console.log(type)
                if (type === 'create') {
                    formData.append('user_id', sendUserId); // Pass the poke_id if it exists
                }

                const response = await onPokeUserApi(formData, token)
                if (response.data.api_status === 200) {
                    if (type === 'create') {
                        // If poke removed successfully, refetch the pokes
                        fetchPoke('fetch');
                        console.log('Poke removed successfully', response.data);
                    } else {
                        // If fetched successfully, update the list of pokes
                        setPokeUsers(response.data.data);
                        console.log('Pokes fetched successfully', response.data.data);
                    }
                    setLoading(false)
                } else if (response.data.api_status === 400 || 404) {
                    setLoading(false)
                    console.log(response.data.errors.error_text)
                }

            } else {
                setLoading(false)
                console.log('token not found', error.message)
            }
        } catch (err) {
            setLoading(false)
            console.log("Get Error::", err)
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: global.container.backgroundColor }}>
            <View style={styles.headerView}>
                <BasicHeader onPress={() => navigation.goBack()} title={'Pokes'} />
            </View>
            <View style={{
                flex: 0.92,
                width: '100%',
            }}>
                <View>
                    {/*   <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 25, backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10 }}>
                        <MaterialCommunityicons name="hand-pointing-right" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
                        <Text style={{ marginHorizontal: 10, fontSize: 18, fontFamily: fontFamily.FONTS.regular, color: global.text2.color, }}>Pokes</Text>
                    </View> */}

                    {loading ? (
                        <View style={{ flex: 1, marginVertical: hp(30), justifyContent: 'center', alignItems: 'center' }}>
                            <Loader isLoading={loading} />
                        </View>
                    ) : (
                        <FlatList
                            data={pokeUsers}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: hp(1), backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: wp(2), borderRadius: wp(2) }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
                                        <Image
                                            source={{ uri: item.user_data.avatar }}
                                            style={{ height: wp(12), width: wp(12), borderRadius: wp(12) }}
                                        />
                                        <View>
                                            <Text style={{ marginHorizontal: wp(2), fontSize: hp(2.2), fontFamily: fontFamily.FONTS.regular, color: global.text2.color, }} numberOfLines={1}>{item.user_data.username}</Text>
                                            <Text style={{ marginHorizontal: wp(2), fontSize: hp(1.6), fontFamily: fontFamily.FONTS.regular, color: COLORS.secondaryGray, }} numberOfLines={1}> {new Date(item.dt).toLocaleDateString()}</Text>
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: wp(2), alignItems: 'flex-end' }}>
                                        {loading ? (
                                            <Loader isLoading={loading} />
                                        ) : (
                                            <TouchableOpacity style={{ padding: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: COLORS.red, }} onPress={() => fetchPoke('create', item.user_data.user_id,)}>
                                                <MaterialCommunityicons name="hand-pointing-right" size={20} color={COLORS.white} />
                                                <Text style={{ fontSize: hp(2), color: COLORS.white, paddingHorizontal: wp(2), fontFamily: fontFamily.FONTS.regular, }}>Poke back</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                            keyExtractor={(item, index) => item.id.toString()}
                            ListEmptyComponent={() => (
                                <View style={styles.container}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', margin: hp(6) }}>
                                        <MaterialCommunityicons name="hand-pointing-right" size={40} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
                                        <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>No Pokes to show</Text>
                                    </View>
                                </View>
                            )}
                        />
                    )}

                </View>
            </View>
        </SafeAreaView>
    )
}

export default Poke


const localStyles = (theme) => {
    const global = globalStyles(theme);

    return StyleSheet.create({
        headerView: {
            flex: 0.08,
            width: '100%',
            justifyContent: 'center',
        },
    })
}