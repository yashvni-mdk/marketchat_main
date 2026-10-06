import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ToastAndroid,
  SafeAreaView
} from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { useTheme } from './ThemeContext';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from './Pixel';
import fontFamily from '../../constants/fontFamily';
import background from '../../assets/image/img/backgrounds/background.jpg';
import welcome from '../../assets/image/img/backgrounds/welcome.jpg';
import sent from '../../assets/image/img/createPage/sent.png';
import love from '../../assets/image/img/createPage/love.png';
import { useSelector } from 'react-redux';

const CommonDetails = ({ userData, groupOptions, usersOptions, messageText, setMessageText }) => {

  const groups = useSelector(state => state.groups);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* user profile info */}
      <View style={styles.container1}>
        <View style={styles.imageContainer}>
          {/* Background Image */}
          <Image source={{ uri: userData?.cover }} style={styles.backgroundImage} />

          <View style={styles.userImageContainer}>
            <Image source={{ uri: userData?.avatar }} style={styles.userImage} />
          </View>
        </View>

        {/* Other Content Below Images */}
        <View>
          <View style={styles.userNameContainer}>
            <Text style={styles.username}>{userData?.username}</Text>
          </View>
          <Text style={styles.username1}>@{userData?.username}</Text>
        </View>

        <View style={styles.followOptionView}>
          <View>
            <Text style={styles.username}>Posts</Text>
            <Text style={styles.username1}>{userData?.details?.post_count}</Text>
          </View>
          <View>
            <Text style={styles.username}>Following</Text>
            <Text style={styles.username1}>{userData?.details?.following_count}</Text>
          </View>
          <View>
            <Text style={styles.username}>Followers</Text>
            <Text style={styles.username1}>{userData?.details?.followers_count}</Text>
          </View>
        </View>
      </View>

      {/* Trending */}
      <View style={styles.trendingTagsView}>
        <Text style={styles.username}>Trending !</Text>
        <View style={styles.trendingPost}>
          <Text style={styles.trendingText}>#blogs</Text>
          <Text style={styles.postCount}>13 post</Text>
        </View>

        <View style={styles.trendingPost}>
          <Text style={styles.trendingText}>#callerspot</Text>
          <Text style={styles.postCount}>13 post</Text>
        </View>

        <View style={styles.trendingPost}>
          <Text style={styles.trendingText}>#business</Text>
          <Text style={styles.postCount}>13 post</Text>
        </View>

        <View style={styles.trendingPost}>
          <Text style={styles.trendingText}>#technology</Text>
          <Text style={styles.postCount}>13 post</Text>
        </View>
      </View>

      {/* People you may know */}
      <View style={styles.trendingTagsView}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.username}>People you may know</Text>
        </View>
        <View style={styles.usersListView}>
          {usersOptions.map((item, index) => {
            return (
              <View style={styles.userProfileView}>
                <Image source={item.image} style={{ width: hp(6), height: hp(6), borderRadius: hp(6), marginVertical: hp(1) }} />
                <Text style={styles.username}>{item.text}</Text>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
              </View>
            )
          })}

        </View>
      </View>


      {/* People you may like */}
      <View style={styles.userLikeView}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(4) }}>
          <Text style={styles.username}>People you may like</Text>
        </View>
        <Image source={{ uri: userData?.cover }} style={styles.coverImage} />

        <View style={{ flexDirection: 'row', marginTop: hp(1), marginLeft: wp(3) }}>
          <Image source={background} style={{ width: hp(6), height: hp(6), borderRadius: hp(6), marginVertical: hp(1) }} />
          <View style={{ marginLeft: wp(2) }}>
            <Text style={styles.nameText}>mohil llp</Text>
            <Text style={[styles.nameText1, { marginTop: hp(1) }]}>Other</Text>
            <Text style={styles.nameText1}>1 People like this</Text>
          </View>
        </View>
        <View style={styles.horizontalLine} />
        <TouchableOpacity style={styles.likeButton}>
          <Text style={styles.followText}>Like</Text>
        </TouchableOpacity>
      </View>


      {/* People you may know */}
      <View style={styles.trendingTagsView}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.username}>Suggested groups</Text>
        </View>
        <View style={styles.usersListView}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        
          {groups?.groups?.map((item, index) => {
            return (
              <View style={styles.groupView}>
                <Image source={{ uri: item.avatar }} style={{ width: '100%', height: hp(16) }} />
                <View style={{ marginLeft: wp(2), marginTop: hp(1) }}>
                  <Text style={styles.nameText}>{item.group_title}</Text>
                  <Text style={styles.nameText1}>{item.members_count} Members</Text>
                </View>
                <TouchableOpacity style={styles.likeButton}>
                  <Text style={styles.followText}>Join</Text>
                </TouchableOpacity>
              </View>
            )
          })}
          </ScrollView>
        </View>
        {/* <FlatList 
        data={groups?.groups}
        keyExtractor={(value,index)=>index.toString()}
        horizontal
        renderItem={({item, index}) => {
          return (
            <View style={styles.groupView}>
              <Image source={{ uri: item.avatar }} style={{ width: '100%', height: hp(16) }} />
              <View style={{ marginLeft: wp(2), marginTop: hp(1) }}>
                <Text style={styles.nameText}>{item.group_title}</Text>
                <Text style={styles.nameText1}>{item.members_count} Members</Text>
              </View>
              <TouchableOpacity style={styles.likeButton}>
                <Text style={styles.followText}>Join</Text>
              </TouchableOpacity>
            </View>
          )
        }}
        /> */}
        
      </View>


      {/* People you may know */}
      <View style={styles.emailView}>
        <View style={styles.mailIconView}>
          <Image source={love} style={{ width: hp(6), height: hp(6), marginVertical: hp(1), resizeMode: 'contain' }} />
          <Text style={styles.sentText}>Invite Your Friends</Text>
        </View>
        <View style={styles.messageView}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder='E-mail'
            placeholderTextColor={COLORS.primarygray}
            style={{
              width: '85%',
              paddingHorizontal: wp(2),
              fontSize: hp(2),
              color: COLORS.black,
              fontFamily: fontFamily.FONTS.regular
            }}
          />
          <TouchableOpacity style={{
            width: wp(10),
            height: hp(5),
            padding: 4,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.red
          }}>
            <Image source={sent} style={{ width: hp(4), height: hp(2.2), resizeMode: 'contain', tintColor: COLORS.white }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CommonDetails;

const styles = StyleSheet.create({
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
    alignSelf: 'center',
    paddingVertical:hp(2)
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
    width:wp(40),
    height: hp(29),
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    borderRadius: wp(2),
    marginRight:wp(3),
    marginLeft:wp(2)
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
  horizontalLine: {
    borderBottomColor: COLORS.secondaryGray,
    borderBottomWidth: 1,
    padding: 5,
    width: '100%',
    // marginHorizontal: 15,
  },
});
