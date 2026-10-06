import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import { COLORS, RobotoFonts } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
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
  inputToolbarContainer: {
    backgroundColor: '#30303c',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    marginHorizontal: 10,
  },
  textInputContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textInput: {
    color: 'white',
    flex: 1,
    width: '100%',
  },
  attachmentContainer: {
    backgroundColor: '#30303c',
    borderBottomColor: 'black',
    borderBottomWidth: .2,
    width: '100%',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 75,
    zIndex: 1000,
  },
  attachmentView: {
    width: 80,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentText: {
    color: 'white',
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    marginTop: 10,
  },
  reportModelContainer: {
    marginTop: hp(2),
    padding: hp(2),
    width: wp(90),
    backgroundColor: COLORS.white,
    marginHorizontal: wp(2),
    borderRadius: wp(2)
  },
});

export default styles;
