import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import { COLORS } from '../../../constants';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignSelf: "center",
      },
      userImage:{
        width: wp(15),
        height: wp(15),
        borderRadius: wp(15)
      },
      notificationView: {
        width: '100%',
        height: hp(6.5),
        backgroundColor: COLORS.white
      }
});
export default styles;
