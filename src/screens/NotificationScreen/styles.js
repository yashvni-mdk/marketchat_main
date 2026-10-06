import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import { COLORS } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    backgroundColor: '#f0f2f5'
  },
  headerView: {
    flex: 0.08,
    width: '100%',
    justifyContent: 'center',
  },
  secondView: {
    flex: 0.92,
    width: '100%',
    backgroundColor: COLORS.white
  },
  notificationView: {
    width: '93%',
    height: hp(8),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: hp(1)
  },
  subProfileView: {
    width: '11%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDataView: {
    width: '83%',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: wp(4),
  },
  nameView: {
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal : wp(1),
    width:'99%'
  },
  nameText: {
    fontFamily: fontFamily.FONTS.bold,
    fontSize: hp(2),
    color: COLORS.darkgray1
  },
  desText: {
    fontFamily: fontFamily.FONTS.regular,
    fontSize: hp(1.9),
    color: COLORS.darkgray1,
    width: '100%',
    lineHeight: hp(3)
  },
  timeText: {
    // paddingBottom: hp(1),
    fontFamily: fontFamily.FONTS.regular,
    fontSize: hp(1.6),
    color: COLORS.secondaryGray,
    // marginTop: hp(1)
  },
  userImage: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(9)
  },
  albumsText: {
    marginHorizontal: 10,
    color: COLORS.darkgray1,
    fontSize: hp(2.5),
    fontFamily: fontFamily.FONTS.Medium,
  }
});
export default styles;
