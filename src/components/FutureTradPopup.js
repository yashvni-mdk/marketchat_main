import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import fontFamily from '../../constants/fontFamily';
import { COLORS } from '../../constants';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

export function FutureTradPopup({
    futureTradingModelVisible,
    setFutureTradingModelVisible,
    tradName,
    setTradName,
    tradType,
    setTradType,
    entryPrice,
    setEntryPrice,
    profitPrice,
    setProfitPrice,
    futureStopLoss,
    setFutureStopLoss,
    onPress
}) {
  const {t} = useTranslation();
  
  return (
    <Modal
    isVisible={futureTradingModelVisible}
    onBackdropPress={() => {
      setFutureTradingModelVisible(false);
      setTradName('')
      setTradType('')
      setEntryPrice('')
      setProfitPrice('')
      setFutureStopLoss('')
    }}
    backdropOpacity={0.5}
  >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Post structure inside the modal */}
      <View style={styles.ProfileComplitionContainer1}>
        <View style={{ padding: 10 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.yellow, fontSize: hp(2.5), padding: 5 }}> Educational Tips</Text> */}
            <Text style={{ fontFamily: fontFamily.FONTS.Medium, color: COLORS.black, fontSize: hp(2.3), }}>{t('future_trading')}</Text>
          </View>
          <View style={{ paddingVertical: hp(1), maxWidth: '100%'}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
              <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), width: wp(20) }}>{t('name')}</Text>
              <TextInput
                placeholder={t('enter_name')}
                value={tradName}
                onChangeText={(text) => {setTradName(text)}}
                placeholderTextColor={COLORS.secondaryGray}
                style={styles.CommentInput1}
              />
            </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
                <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), width: wp(20) }}>{t('type')}</Text>
                <TextInput
                  placeholder={t('enter_type')}
                  value={tradType}
                  onChangeText={(text) => {setTradType(text)}}
                  placeholderTextColor={COLORS.secondaryGray}
                  style={styles.CommentInput1}
                />
              </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
              <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), width: wp(20) }}>{t('entry_price')}</Text>
              <TextInput
                placeholder={t('enter_buy_price')}
                value={entryPrice}
                onChangeText={(text) => {setEntryPrice(text)}}
                placeholderTextColor={COLORS.secondaryGray}
                style={styles.CommentInput1}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
              <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), width: wp(20) }}>{t('profit_price')}</Text>
              <TextInput
                placeholder={t('enter_sell_price')}
                value={profitPrice}
                onChangeText={(text) => {setProfitPrice(text)}}
                placeholderTextColor={COLORS.secondaryGray}
                style={styles.CommentInput1}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hp(1) }}>
              <Text style={{ fontFamily: fontFamily.FONTS.regular, color: COLORS.black, fontSize: hp(2), width: wp(20) }}>{t('stop_loss')}</Text>
              <TextInput
                placeholder={t('stop_loss')}
                value={futureStopLoss}
                onChangeText={(text) => {setFutureStopLoss(text)}}
                placeholderTextColor={COLORS.secondaryGray}
                style={styles.CommentInput1}
              />
            </View>
          </View>
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <TouchableOpacity style={{
              backgroundColor: COLORS.red,
              borderRadius: 10,
              // padding: 3,
              height: hp(4.5),
              width: wp(25),
              justifyContent: 'center',
              alignItems: 'center',
            }} onPress={onPress}>
                <Text style={{ paddingHorizontal: wp(2), fontSize: hp(2.3), color: COLORS.white, fontFamily: fontFamily.FONTS.Medium }}>{t('post')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </Modal>
  );
}

const styles = StyleSheet.create({
    ProfileComplitionContainer1: {
        width: '105%',
        backgroundColor: COLORS.white,
        borderRadius: hp(2),
        marginLeft: wp(0.5)
      },
      CommentInput1: {
        width: '70%',
        height: 40,
        backgroundColor: '#ededed',
        color: COLORS.secondaryGray,
        borderColor: '#eeeff0',
        borderWidth: 0.5,
        borderRadius: 10,
        justifyContent: 'center',
        paddingLeft: wp(2),
      },
});
