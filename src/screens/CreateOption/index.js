import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import add from '../../../assets/image/img/createPage/add.png';
import users from '../../../assets/image/img/createPage/users.png';
import gallery from '../../../assets/image/img/createPage/gallery.png';
import flag from '../../../assets/image/img/createPage/flag.png';
import dollar from '../../../assets/image/img/createPage/dollar.png';
import calendar from '../../../assets/image/img/createPage/calendar.png';
import { widthPercentageToDP as wp,heightPercentageToDP as hp } from '../../components/Pixel';
import BasicHeader from '../../components/BasicHeader';
import { COLORS } from '../../../constants';
import {useTranslation} from 'react-i18next';

const CreateOption = ({navigation}) => {
  const {t} = useTranslation();
  const navigationOptions = [
    // {text: 'Create Albums', image: gallery, navigateTo: 'CreateAlbum'},
    // {text: 'Create Ad', image: dollar, navigateTo: 'CreateAd'},
    {text: t('create_blog'), image: calendar, navigateTo: 'CreateBlog'},
    {text: t('create_event'), image: add, navigateTo: 'CreateEvent'},
    {text: t('create_group'), image: users, navigateTo: 'CreateGroup'},
    {text: t('create_page'), image: flag, navigateTo: 'CreatePage'},
  ];

  const renderModelItems = () => {
    return navigationOptions.map((option, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          option.navigateTo && navigation.navigate(option.navigateTo);
        }}
        style={styles.OptionView}>
        <Image
          style={{width: wp(7), height: hp(5), resizeMode: 'contain'}}
          source={option.image}
        />
        <Text style={styles.modelText}>{option.text}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={{flex:0.08,borderBottomColor:COLORS.box,borderBottomWidth:2}}>
      <BasicHeader onPress={() => navigation.goBack()} title={t('create_option')} />
      </View>
        <View style={styles.conteredView}>
          <View style={styles.modelView}>{renderModelItems()}</View>
        </View>
    </View>
  );
};

export default CreateOption;
