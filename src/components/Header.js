import { StyleSheet, Text, View, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { useTheme } from './ThemeContext';
import fontFamily from '../../constants/fontFamily';

const Header = ({ navigation }) => {

    const [modelVisible, setModelVisible] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const toggelModel = () => {
        setModelVisible(!modelVisible);
    };

    const switchTheme = () => {
        toggleTheme();
        toggelModel();
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
            <View>
                <View style={{ alignItems: 'flex-end', padding: 5 }}>
                    <TouchableOpacity onPress={toggelModel}>
                        <Text style={{ color: COLORS.white, fontSize: 18, fontFamily: fontFamily.FONTS.Medium }}>
                            Guest
                        </Text>
                    </TouchableOpacity>

                    <Modal visible={modelVisible} transparent animationType="slide">
                        <TouchableOpacity onPress={toggelModel}>
                            <View style={styles.conteredView}>
                                <View style={styles.modelView}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={styles.modelText}>Login</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                        <Text style={styles.modelText}>Register</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={switchTheme}>
                                        <Text style={styles.modelText}>
                                            {theme === 'dark' ? 'DayMode' : 'DarkMode'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Header;

const styles = StyleSheet.create({
    conteredView: {
        alignItems: 'flex-end',
        padding: 30,
        marginTop: 20,
    },
    modelView: {
        backgroundColor: COLORS.white,
        borderRadius: 5,
        padding: 20,
        justifyContent: 'center',
    },
    modelText: {
        fontSize: 16,
        padding: 4,
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.regular
    }

});
