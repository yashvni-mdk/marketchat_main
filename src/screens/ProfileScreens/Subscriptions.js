/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../constants';
import Footer from '../../components/Footer';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { globalStyles } from '../../components/GlobalTheme';
import { useTheme } from '../../components/ThemeContext';
import translations from '../../utils/localization/traslations';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import BasicHeader from '../../components/BasicHeader';
// import { Svg, Image } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onGetMemories } from '../../Service/Api';
import { Loader } from '../../components/Loader';

const Subscriptions = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const global = globalStyles(theme);

  // Merge global styles with local component styles
  const styles = StyleSheet.create({
    ...global,
    ...localStyles(theme)
  });


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerView}>
          <BasicHeader onPress={() => navigation.goBack()} title={'Subscriptions'} />
        </View>
        <View style={{
          flex: 0.92,
          width: '100%',
        }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 25, backgroundColor: global.ContentContainer.backgroundColor, marginHorizontal: 10, borderRadius: 10 }}>
            <MaterialCommunityicons name="select-group" size={22} color={COLORS.white} style={{ backgroundColor: COLORS.red, borderRadius: 50, padding: 3 }} />
            <Text style={{ marginHorizontal: 10, fontSize: 18, color: global.text2.color, }}>Subscriptions</Text>
          </View>


          <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5), margin: hp(6) }}>
            <MaterialIcons name="event" size={26} color={COLORS.white} style={{ backgroundColor: '#8ba0ab', borderRadius: 50, padding: 15 }} />
            <Text style={{ paddingTop: hp(3), fontSize: hp(2.1), fontFamily: fontFamily.FONTS.regular, color: COLORS.darkgray1 }}>You dont have memories on this day.</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Subscriptions;

const localStyles = (theme) => {
  const global = globalStyles(theme);

  return StyleSheet.create({
    container: {
      backgroundColor: global.container.backgroundColor,
    },
    HandingtextContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    Handingtext: {
      color: COLORS.white,
      fontSize: wp(10),
      fontFamily: fontFamily.FONTS.regular,
    },
    ContentContainer: {
      marginHorizontal: 20,
      marginTop: hp(5),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      height: 'auto',
      padding: 10,
      backgroundColor: global.ContentContainer.backgroundColor,
    },
    title: {
      color: global.text.color,
      fontSize: 18,
      fontWeight: 'bold',
      flexWrap: 'wrap',
      paddingBottom: 10
    },
    mainContent: {
      color: global.text.color,
      fontSize: 15,
      flexWrap: 'wrap',
      paddingBottom: 10,
    },
    horizontalLine: {
      borderBottomColor: COLORS.secondaryGray,
      borderBottomWidth: 1,
      padding: 5,
      marginHorizontal: 15
    },
  });
};