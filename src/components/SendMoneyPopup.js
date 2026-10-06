import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import fontFamily from '../../constants/fontFamily';
import { COLORS } from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import Modal from 'react-native-modal';

export function SendMoneyPopup({modelVisible, setModelVisible, onPress}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modelVisible}
      onRequestClose={() => setModelVisible(false)}>
      <View style={styles.maneModalView}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModelVisible(false);
          }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
        <View style={{
            flexDirection: 'row',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: COLORS.red,
            height: hp(10)
        }}>
            <View style={{
                width: wp(8),
                height: wp(8),
                borderRadius: wp(8),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.light_red
            }}>
                <MaterialCommunityIcons name="send" size={17} color={COLORS.white} />
            </View>
            <Text style={styles.referralTitleText}>Send money to friends</Text>
          </View>
          <View style={{
            marginVertical: hp(3),
            width: '94%',
            alignSelf: 'center',
            height: hp(10),
            paddingHorizontal: wp(3),
            justifyContent: 'center',
            backgroundColor: COLORS.light_yellow
          }}>
            <Text style={{
                fontSize: hp(2),
                fontFamily: fontFamily.FONTS.Medium,
                color: COLORS.orange
            }}>Your current wallet balance is: 0, please top up your wallet to continue. Top up</Text>
          </View>
          <Text style={{
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.black,
            alignSelf: 'center'
          }}>Amount</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',borderBottomColor: COLORS.black, borderBottomWidth: 1, width: wp(29), alignSelf: 'center', marginBottom: hp(5) }}>
            <Text style={{ color: COLORS.black, fontSize: hp(5.4), fontFamily: fontFamily.FONTS.regular}}>$</Text>
            <TextInput
                style={{ color: COLORS.red, paddingTop: hp(1), fontSize: hp(6), fontFamily: fontFamily.FONTS.regular}}
                placeholder='0.00'
                keyboardType='numeric'
                placeholderTextColor={COLORS.darkgray1}
            />
          </View>
          <View style={{alignSelf: 'center'}}>
          <Text style={{
            fontSize: hp(2),
            fontFamily: fontFamily.FONTS.Medium,
            color: COLORS.black,
          }}>To who you want to send?</Text>
          <TextInput
                style={{
                    color: COLORS.red,
                    fontSize: hp(1.8),
                    borderRadius: 5,
                    borderWidth:0.5,
                    paddingHorizontal: wp(3),
                    paddingVertical: hp(1),
                    width: wp(70),
                    fontFamily: fontFamily.FONTS.regular
                }}
                placeholder='Search by username or email'
                autoCapitalize='none'
                placeholderTextColor={COLORS.darkgray1}
            />
          </View>
          <TouchableOpacity style={{ backgroundColor: COLORS.red, flexDirection: 'row', borderRadius: 10, padding: 5, marginHorizontal: 14, width: wp(35), alignSelf: 'center', marginVertical: hp(3) }} onPress={() =>{setModelVisible(!modelVisible)}} >
            <MaterialCommunityIcons name="check-all" size={22} color={COLORS.white} style={{ paddingHorizontal: 5, }} />
            <Text style={{ paddingHorizontal: 7, fontSize: hp(2.3), color: COLORS.white, fontFamily: fontFamily.FONTS.Medium }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '94%',
    // height: hp(22),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // marginLeft: -wp(2.5),
    // paddingTop: hp(3),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  referralTitleText: {
    fontSize: hp(2.6),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.white,
    marginLeft: wp(3),
  },
  referralTitleText1: {
    color: COLORS.black,
    fontFamily: fontFamily.FONTS.regular,
    fontSize: hp(2),
    marginLeft: wp(5),
    marginTop: hp(1),
  },
  referralView: {
    width: '94%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.lightGreyColor,
    marginVertical: hp(3),
    borderRadius: 8,
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    alignSelf: 'center',
  },
  referralText: {
    fontSize: hp(1.6),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.black,
  },
  linkButton: {
    width: '30%',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.red,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: wp(3),
  },
  linkButton1: {
    width: '30%',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: wp(2),
  },
  linkText: {
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.white,
  },
  linkText1: {
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.black,
  },
  logoutButtonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(3),
  },
});
