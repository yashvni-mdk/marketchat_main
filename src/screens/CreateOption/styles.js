import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import fontFamily from '../../../constants/fontFamily';
import { COLORS } from '../../../constants';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  conteredView: {
    alignItems: 'center',
    width: '100%',
    flex: 0.92
  },
  modelText: {
    fontSize: 16,
    padding: 4,
    color: '#000',
    fontFamily: fontFamily.FONTS.Medium,
  },
  OptionView: {
    width: wp(40),
    height: hp(10),
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    marginTop: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelView: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 0.2,
    borderColor: '#eeeff0',
    padding: wp(7),
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
export default styles;
