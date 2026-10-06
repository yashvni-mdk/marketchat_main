import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import { COLORS, RobotoFonts } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
// import { globalStyles } from '../../components/GlobalTheme';
// import { useTheme } from '../../components/ThemeContext';

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
  firstView: {
    width: '94%',
    minHeight: hp(15),
    alignItems: 'center',
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: hp(2),
  },
  horizontalLine: {
    borderBottomColor: COLORS.secondaryGray,
    borderBottomWidth: 0.5,
    width: '100%',
    // marginHorizontal: 15,
  },
  secondView: {
    flex: 0.92,
    width: '100%',
  },
  conteredView: {
    alignItems: 'center',
    width: '100%',
  },
  modelView: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  modelContent: {
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    minHeight: hp(6)
  },
  modelContent2: {
    flexDirection: 'row',
    backgroundColor: COLORS.red,
    height: hp(7),
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  modelView1: {
    borderRadius: 10,
    padding: 13,
    width: '80%',
    height: 'auto',
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modelContent1: {
    padding: 3,
    flexDirection: 'row',
    paddingHorizontal: 6
  },
  modelText1: {
    fontSize: hp(2.2),
    padding: 4,
    paddingHorizontal: 15,
    fontFamily: fontFamily.FONTS.regular,
    color: '#555555',
  },
  // modelView: {
  //   backgroundColor: '#fff',
  //   borderRadius: 5,
  //   borderWidth: 0.2,
  //   borderColor: COLORS.gray,
  //   padding: 20,
  //   justifyContent: 'space-between',
  //   width: '100%',
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   alignItems: 'center',
  // },
  modelText: {
    fontSize: 16,
    padding: 4,
    color: '#000',
    fontFamily: fontFamily.FONTS.Medium,
  },
  OptionView: {
    width: wp(36),
    height: hp(10),
    borderWidth: 1,
    borderRadius: 5,
    marginTop: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumsText: {
    marginHorizontal: 10,
    fontSize: hp(2.4),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.darkgray1
  },
  likesAndCommentView: {
    width: '100%',
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: wp(3),
    marginTop: hp(1),
    marginBottom: hp(1)
  },
  likesCountView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  commentCountView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  storeText: {
    fontSize: hp(1.8),
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.black,
  },
  allButton: {
    width: wp(20),
    height: hp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.box,
  },
  OptionView1: {
    height: hp(10),
    alignItems: 'center',
    flexDirection: 'row',
  },
  filterModelView: {
    alignItems: 'flex-start',
    padding: 25,
    marginTop: 20,
    width: '100%',
  },
  modelDataView: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 0.2,
    borderColor: COLORS.gray,
    padding: 10,
    justifyContent: 'center',
    width: '100%',
  },
  modelText1: {
    fontSize: hp(1.5),
    color: '#000',
    fontFamily: fontFamily.FONTS.regular,
    paddingHorizontal: 4,
  },
  Picker: {
    width: '100%',
    borderRadius: 10,
    color: COLORS.black,
  },
  filterOptionView: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.box,
  },
  firstView1: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(2),
    alignSelf: 'center',

    paddingBottom: hp(2),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  showMoreView: {
    marginVertical: hp(2),
    width: '40%',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: hp(5),
    marginBottom: hp(2),
    alignSelf: 'center',
  },
  CommentInput: {
    width: '88%',
    // height: 40,
    // marginHorizontal: 4,
    backgroundColor: '#ededed',
    color: COLORS.black,
    borderColor: '#eeeff0',
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
  },
  CommentInput1: {
    width: '82%',
    height: 40,
    marginLeft: wp(2),
    backgroundColor: '#ededed',
    color: COLORS.secondaryGray,
    borderColor: '#eeeff0',
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: wp(3)
  },
  loadText: {
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.black,
  },
  reportModelContainer: {
    marginTop: hp(2.2),
    // padding: 15,
    width: wp(90),
    backgroundColor: COLORS.white,
    marginHorizontal: wp(2),
    borderRadius: wp(2.2)
  },
  ProfileComplitionContainer: {
    // marginTop: 25,
    width: '94%',
    backgroundColor: COLORS.white,
    // marginHorizontal: wp(2),
    borderRadius: wp(2),
    alignSelf: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginBottom: hp(1)
  },

  ProfileComplitionContainer1: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: hp(2),
    alignSelf: 'center'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container1: {
    marginHorizontal: 10,
    // backgroundColor: global.ContentContainer.backgroundColor,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  backgroundImage: {
    height: hp(15),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 5,
    right: 0,
    backgroundColor: COLORS.secondaryGray,
    borderRadius: 10,
  },
  userImageContainer: {
    position: 'absolute',
    top: hp(10),
    alignSelf: 'center',
  },
  userImage: {
    height: 70,
    width: 70,
    borderRadius: 70,
  },
  userNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(5),
  },
  username: {
    fontSize: hp(2),
    // color: global.text2.color,
    color: COLORS.black,
    fontFamily: fontFamily.FONTS.Medium,
  },
  username1: {
    fontSize: hp(1.8),
    // color: global.text2.color,
    color: COLORS.black,
    fontFamily: fontFamily.FONTS.regular,
    textAlign: 'center',
  },
  followOptionView: {
    marginVertical: hp(2),
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: wp(4),
  },
  trendingTagsView: {
    width: '94%',
    alignSelf: 'center',
    padding: wp(3),
    backgroundColor: COLORS.white,
    marginTop: hp(2),
    borderRadius: 10,
  },
  trendingPost: {
    marginTop: hp(2),
  },
  trendingText: {
    fontSize: hp(1.8),
    color: COLORS.red,
    fontFamily: fontFamily.FONTS.Medium,
  },
  postCount: {
    fontSize: hp(1.7),
    // color: global.text2.color,
    color: COLORS.black,
    fontFamily: fontFamily.FONTS.regular,
  },
  usersListView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    paddingVertical: hp(2),
  },
  userProfileView: {
    width: '48.5%',
    height: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    marginBottom: hp(1.2),
    borderRadius: wp(2),
  },
  followText: {
    fontSize: hp(2),
    // color: global.text2.color,
    color: COLORS.white,
    fontFamily: fontFamily.FONTS.Medium,
  },
  followButton: {
    width: '40%',
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.red,
    borderRadius: hp(1),
    marginTop: hp(1),
  },
  userLikeView: {
    width: '94%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp(2),
    paddingVertical: hp(2),
  },
  coverImage: {
    height: hp(15),
    width: '100%',
    marginTop: hp(1),
  },
  nameText: {
    fontSize: hp(2),
    // color: global.text2.color,
    color: COLORS.black,
    fontFamily: fontFamily.FONTS.regular,
  },
  nameText1: {
    fontSize: hp(1.6),
    color: COLORS.primarygray,
    fontFamily: fontFamily.FONTS.regular,
  },
  likeButton: {
    width: '96%',
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.red,
    borderRadius: hp(1),
    marginTop: hp(2),
    alignSelf: 'center',
  },
  groupView: {
    width: '48.5%',
    height: hp(29),
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    borderRadius: wp(2),
  },
  emailView: {
    width: '94%',
    alignSelf: 'center',
    padding: wp(2),
    backgroundColor: COLORS.golden,
    marginTop: hp(2),
    borderRadius: 10,
  },
  sentText: {
    fontSize: hp(2),
    // color: global.text2.color,
    color: COLORS.darkGolden,
    fontFamily: fontFamily.FONTS.Medium,
  },
  mailIconView: {
    height: hp(16),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageView: {
    width: '94%',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: COLORS.darkGolden,
    height: hp(6),
    alignSelf: 'center',
    borderRadius: 5,
    flexDirection: 'row'
  },
  userDetails: {
    width: '100%',
    // padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5'
  },
  userName: {
    padding: 5,
    fontSize: 16,
    fontFamily: fontFamily.FONTS.Medium,
    color: COLORS.black
  },
  modelText: {
    fontSize: 16,
    padding: 4,
    paddingHorizontal: 15,
    fontFamily: fontFamily.FONTS.regular,
    color: '#555555',
  },
  modelText2: {
    fontSize: hp(2),
    padding: 4,
    paddingHorizontal: 15,
    fontFamily: fontFamily.FONTS.Medium,
    color: '#fff',
  },
  donationText: {
    paddingTop: hp(2),
    fontSize: hp(2.2),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.white
  },
  donationButton: {
    width: wp(20),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: COLORS.white
  },
  donationView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  donationText1: {
    fontSize: hp(1.8),
    fontFamily: fontFamily.FONTS.regular,
    color: COLORS.white
  },
  postDetails: {
    marginVertical: hp(2),
    paddingHorizontal: wp(5),
    fontSize: hp(1.9),
    fontFamily: fontFamily.FONTS.regular,
    color: COLORS.black,
    width: '96%'
  },
  postDetails1: {
    marginVertical: hp(2),
    paddingLeft: wp(5),
    fontSize: hp(1.9),
    fontFamily: fontFamily.FONTS.regular,
    color: COLORS.black,
    textAlign: 'left',
    width: '96%'
  },
  postDetails2: {
    paddingLeft: wp(5),
    fontSize: hp(1.9),
    fontFamily: fontFamily.FONTS.regular,
    color: COLORS.black,
    textAlign: 'left',
    width: '96%'
  },
  postDetails3: {
    fontSize: hp(1.9),
    fontFamily: fontFamily.FONTS.regular,
    color: COLORS.black,
    textAlign: 'center'
  },
  dropDownContainer: {
    // marginTop: 10,
    borderColor: '#eeeff0',
    borderWidth: 0.5,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'space-between',
    height: 45,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(3)
  },
  optionView: {
    width: '100%',
    height: hp(6),
    marginLeft: wp(3),
    justifyContent: 'center'
  },
  collapsView: {
    width: '100%',
    minHeight: hp(12),
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#eeeff0',
  },
  titleText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
  optionText: { fontSize: hp(2), color: COLORS.black, fontFamily: fontFamily.FONTS.regular },
  lable: {
    fontFamily: fontFamily.FONTS.regular,
    color: COLORS.darkgray1,
    fontSize: hp(2.2),
    marginTop: hp(1)
  },
  descriptionInput: {
    width: '100%',
    height: 'auto',
    paddingHorizontal: 4,
    // backgroundColor: global.textInput.backgroundColor,
    color: COLORS.darkgray1,
    borderColor: '#eeeff0',
    borderWidth: 0.5,
    borderRadius: 8,
    justifyContent: 'center',
    fontSize: hp(2),
    fontFamily: fontFamily.FONTS.Medium,
  },
  postIconStyle: {
    backgroundColor: '#f3f3f3',
    borderRadius: 100,
    padding: 8
  },
  userListView: {
    position: 'absolute',
    top: hp(7),
    paddingVertical: hp(1),
    width: wp(78),
    backgroundColor: COLORS.white,
    zIndex: 1,
    left: wp(12),
    maxHeight: hp(26),
},
userListView1: {
  position: 'absolute',
  top: hp(5.5),
  paddingVertical: hp(2),
  width: wp(90),
  backgroundColor: COLORS.white,
  zIndex: 1,
  maxHeight: hp(30),
},
feelingListView1: {
  position: 'absolute',
  top: hp(20),
  paddingVertical: hp(2),
  width: wp(94.5),
  backgroundColor: COLORS.white,
  zIndex: 999,
  maxHeight: hp(30),
  // marginLeft: -wp(2)
},
userList1: {
  width: '100%',
  height: hp(6),
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
  // borderBottomWidth: 1,
  // borderBottomColor: COLORS.gray,
  borderRadius: 5,
  marginTop: hp(1),
},
userList: {
  width: '100%',
  height: hp(8),
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
  // borderBottomWidth: 1,
  // borderBottomColor: COLORS.gray,
  borderRadius: 5,
},
imageView: {
  width: wp(10),
  height: wp(10),
  borderRadius: wp(10),
  marginHorizontal: wp(3)
},
userNameText: {
  fontSize: hp(2),
  fontFamily: fontFamily.FONTS.Medium,
  color: COLORS.black,
},
dropdownButtonStyle: {
  width: 200,
  height: 50,
  backgroundColor: '#E9ECEF',
  borderRadius: 12,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 12,
},
dropdownButtonTxtStyle: {
  flex: 1,
  fontSize: 18,
  fontWeight: '500',
  color: '#151E26',
},
dropdownButtonArrowStyle: {
  fontSize: 28,
},
dropdownButtonIconStyle: {
  fontSize: 28,
  marginRight: 8,
},
dropdownMenuStyle: {
  backgroundColor: '#E9ECEF',
  borderRadius: 8,
  width: wp(40),
},
dropdownItemStyle: {
  width: '100%',
  flexDirection: 'row',
  paddingHorizontal: 12,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 8,
},
dropdownItemTxtStyle: {
  flex: 1,
  fontSize: hp(2),
  fontWeight: '500',
  color: '#151E26',
  marginLeft: wp(2)
},
dropdownItemIconStyle: {
  fontSize: 28,
  marginRight: 8,
},
locationTextInput: {
  width: '96%',
  flexDirection: 'row',
  alignItems: 'center',
  // height: hp(5.5),
  borderWidth: 1,
  borderColor: COLORS.gray,
  borderRadius: 5,
  alignSelf: 'center',
  marginTop: hp(1)
},
locationText: {
  fontSize: hp(1.8),
  fontFamily: fontFamily.FONTS.regular,
  color: COLORS.black,
  paddingVertical: 5
},
locationText1: {
  fontSize: hp(1.8),
  fontFamily: fontFamily.FONTS.Medium,
  color: COLORS.black,
  paddingVertical: 5
},
hashtagStyle: {
    fontSize: hp(1.9),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.red,
},
mentionStyle: {
  fontSize: hp(1.9),
    fontFamily: fontFamily.FONTS.bold,
    color: COLORS.primary,
},
emailStyle: {
  fontSize: hp(1.9),
  fontFamily: fontFamily.FONTS.bold,
  color: COLORS.red,
},
linkStyle: {
  fontSize: hp(1.9),
  fontFamily: fontFamily.FONTS.bold,
  color: COLORS.red,
},
commentCollapsView: {
  // width: '100%',
  backgroundColor: '#fff',
  borderWidth: 0.5,
  borderColor: '#eeeff0',
  paddingVertical: hp(1),
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
},
openButtonDesign: {
  width: wp(20),
  height: hp(3.5),
  borderRadius: wp(1),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: COLORS.greenColor,
}
});

export default styles;
