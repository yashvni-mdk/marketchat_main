import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  TouchableWithoutFeedback,
  Modal,
  Platform,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import { COLORS } from '../../constants';
import fontFamily from '../../constants/fontFamily';

export function AIGeneratePopup({
  modalVisible,
  setModalVisible,
  onPress,
  imageVisible,
  setImageVisible,
  contentDes,
  setContentDes,
  numLength,
  setNumLength,
  botConfig,
  setBotConfig,
}) {
  const [errorShow, setErrorShow] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.maneModalView}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.container]}>
          <View style={styles.firstStepView}>
            <Text style={styles.titleText}>Create blog using AI</Text>
            <View style={styles.leverageView}>
              <Text style={styles.leverageText}>Write something here..</Text>
              <TextInput
                value={contentDes}
                onChangeText={text => setContentDes(text)}
                style={styles.leverageTextInput1}
                multiline={true}
                numberOfLines={6}
                keyboardType={'default'}
                textAlignVertical='top'
                placeholder='Describe what is the article e.g'
              />
            </View>

            <View style={styles.leverageView}>
              <TextInput
                value={numLength}
                onChangeText={text => setNumLength(text)}
                style={styles.leverageTextInput}
                keyboardType={'number-pad'}
                placeholder='Choose the max word length for your article'
              />
            </View>

            <View style={styles.leverageView1}>
            <TouchableOpacity style={styles.checkbox} onPress={() => {setImageVisible(!imageVisible)}}>
                <View style={[styles.checkTrue, {backgroundColor: imageVisible ? COLORS.lightBlue : COLORS.white}]} />
            </TouchableOpacity>
              <Text style={styles.leverageText1}>Generate Thumbnail</Text>
              
            </View>

            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  if (
                    parseFloat(dailyProfit) > 0 &&
                    parseFloat(dailyLoss) > 0 &&
                    parseFloat(dailyProfit) < 10 &&
                    parseFloat(dailyLoss) < 10
                  ) {
                    setErrorShow(false);
                    onPress();
                  } else {
                    setErrorShow(true);
                  }
                }}>
                <Text style={styles.nextText}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    // minHeight: hp(25),
    // maxHeight: hp(60),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: hp(1.5),
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
  nextButton: {
    width: '30%',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.red,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: hp(3),
    marginRight: wp(3),
  },
  nextText: {
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.white,
  },
  firstStepView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leverageView: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '92%',
    marginVertical: hp(1),
  },
  leverageView1: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '92%',
    marginVertical: hp(1),
    flexDirection: 'row'
  },
  leverageText: {
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.black,
  },
  leverageTextInput: {
    fontSize: hp(1.8),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.black,
    width: '98%',
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    borderRadius: 5,
    paddingHorizontal: wp(2),
    marginTop: hp(1)
  },
  leverageTextInput1: {
    fontSize: hp(1.8),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.black,
    width: '98%',
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    borderRadius: 5,
    paddingHorizontal: wp(2),
    marginTop: hp(1),
    height: hp(20),
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '96%',
    marginLeft: wp(4),
  },
  listingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  titleText: {
    fontSize: hp(2.6),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.black,
    paddingVertical: hp(1)
  },
  errorText: {
    fontSize: hp(1.8),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.red,
  },
  manualText: {
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.black,
  },
  checkbox: {
    height: hp(3),
    width: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 3,
  },
  leverageText1: {
    fontSize: hp(2.2),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.black,
    marginLeft: wp(3)
  },
  checkTrue: {
    height: hp(2),
    width: hp(2),
    borderRadius: 3,
  }
});
