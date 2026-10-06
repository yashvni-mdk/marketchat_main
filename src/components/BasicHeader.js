import { StyleSheet, Text, View, TouchableOpacity, Modal, SafeAreaView, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from './Pixel';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import fontFamily from '../../constants/fontFamily';

const BasicHeader = ({onPress,title}) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white,justifyContent:"center" }}>

                <View style={{ alignItems: 'center',flexDirection:'row', padding: wp(3) }}>
                    <TouchableOpacity onPress={onPress}>
                    <Materialicons name={'arrow-back'} size={24} color={'#000'} />
                    </TouchableOpacity>
                    
                    <Text style={{fontSize:hp(2.6),color:COLORS.black,fontFamily:fontFamily.FONTS.bold,marginLeft:wp(5)}}>{title}</Text>
                </View>
        </SafeAreaView>
    );
};

export default BasicHeader;

const styles = StyleSheet.create({
    conteredView: {
        alignItems: 'flex-end',
        padding: 30,
        marginTop: 20,
    },
    imageStyle:{
        height:hp(6),
        width:wp(3),
        resizeMode:'contain',
        tintColor:COLORS.white
    },
    buttonView:{
        width:wp(10),
        height:hp(5),
        borderRadius:5,
        backgroundColor:COLORS.red,
        alignItems:"center",
        justifyContent:'center'
    }

});
                                                                         