/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../constants';
import CustomInput from '../../components/CustomInput';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import CheckBox from '../../components/CheckBox';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import { ToastAndroid } from 'react-native'


const ProfileSetting = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const global = globalStyles(theme);

    // Merge global styles with local component styles
    const styles = StyleSheet.create({
        ...global,
        ...localStyles(theme)
    });


    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [country, setCountry] = useState('');
    const [gender, setGender] = useState('');

    const handelContactUs = () => {
        ToastAndroid.show('Work in process', ToastAndroid.SHORT);
    }


    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View>
                        <View style={styles.container}>
                            <View style={styles.ContentContainer}>
                                <View style={styles.content}>
                                    <View style={styles.HandingtextContainer}>
                                        <View>
                                            <Image source={require('../../../assets/image/img/user4.jpg')} style={{ height: 70, width: 70, borderRadius: 50 }} />
                                        </View>
                                        <View style={{ paddingHorizontal: 9 }}>
                                            <Text style={styles.lable}>Mukesh</Text>
                                            <Text style={styles.Handingtext}>
                                                Profile Setting
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.lable}>First name</Text>
                                        <CustomInput
                                            keyboardType="default"
                                            value={userName}
                                            onChangeText={text => setUserName(text)}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.lable}>Last name</Text>
                                        <CustomInput
                                            keyboardType="default"
                                            value={phone}
                                            onChangeText={text => setPhone(text)}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.lable}>About me</Text>
                                        <CustomInput
                                            keyboardType="email-address"
                                            value={email}
                                            onChangeText={text => setEmail(text)}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.lable}>Location</Text>
                                        <CustomInput
                                            multiline={true}
                                            numberOfLines={4}
                                            keyboardType="default"
                                            value={birthday}
                                            onChangeText={text => setBirthday(text)}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.lable}>School</Text>
                                        <CustomInput
                                            multiline={true}
                                            numberOfLines={4}
                                            keyboardType="default"
                                            value={country}
                                            onChangeText={text => setCountry(text)}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.lable}>Working at</Text>
                                        <CustomInput
                                            multiline={true}
                                            numberOfLines={4}
                                            keyboardType="default"
                                            value={gender}
                                            onChangeText={text => setGender(text)}
                                        />
                                        <View style={styles.inputContainer}>
                                            <CustomInput
                                                multiline={true}
                                                numberOfLines={4}
                                                keyboardType="default"
                                                value={gender}
                                                onChangeText={text => setGender(text)}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.lable}>Website</Text>
                                        <CustomInput
                                            multiline={true}
                                            numberOfLines={4}
                                            keyboardType="default"
                                            value={gender}
                                            onChangeText={text => setGender(text)}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.lable}>RelationShip</Text>
                                        <CustomInput
                                            multiline={true}
                                            numberOfLines={4}
                                            keyboardType="default"
                                            value={gender}
                                            onChangeText={text => setGender(text)}
                                        />
                                    </View>

                                    <Button
                                        title="Send"
                                        onPress={handelContactUs}
                                    />
                                </View>
                            </View>
                            <View style={styles.horizontalLine} />
                            <Footer navigation={navigation} />
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
            padding: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: COLORS.black,
            backgroundColor: global.ContentContainer.backgroundColor,
            // justifyContent: 'center',
            alignItems: 'center',
        },
        Handingtext: {
            color: global.text.color,
            fontSize: 28,
            fontWeight: 'bold',
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
            fontSize: 15
        },
        horizontalLine: {
            borderBottomColor: COLORS.secondaryGray,
            borderBottomWidth: 1,
            padding: 5,
            marginHorizontal: 15
        },
    });
};