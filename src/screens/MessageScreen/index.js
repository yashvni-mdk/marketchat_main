import React from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import BasicHeader from '../../components/BasicHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import { COLORS } from '../../../constants';

const MessageScreen = ({ navigation }) => {


return(
    <View style={styles.container}>
         <View style={styles.headerView}>
      <BasicHeader onPress={()=>navigation.goBack()} title={'Message'} />
      </View>
      <View style={styles.secondView}>
      <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center', height: hp(10), alignSelf: 'center'}}>
                 <Text style={[styles.albumsText, { textAlign: 'center'}]} onPress={()=>navigation.navigate('ChatScreen')}>No Chats Found</Text>
            </View>
      </View>
    </View>
)
}

export default MessageScreen;
