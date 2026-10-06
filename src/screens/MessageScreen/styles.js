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
    width: "100%",
    alignSelf: "center",
    backgroundColor:COLORS.white
  },
  headerView: {
    flex: 0.08,
    width: '100%',
    justifyContent: 'center',
  },
  secondView: {
    flex: 0.92,
    width: '100%',
  },
  albumsText: {
    marginHorizontal: 10,
    fontSize: hp(2.5),
    fontFamily: fontFamily.FONTS.Medium,
    // color: global.text2.color
  },
});
export default styles;
