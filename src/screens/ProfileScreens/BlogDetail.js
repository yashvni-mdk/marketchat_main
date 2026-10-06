import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel';
import fontFamily from '../../../constants/fontFamily';
import { WebView } from 'react-native-webview';

const BlogDetail = ({ route }) => {
    const { blogUrl } = route.params;
    const [loading, setLoading] = useState(false)
    console.log(blogUrl)
    const navigation = useNavigation();

    const onMessage = (event) => {

        console.log("Get Value::", event.nativeEvent.data);
        if (event.nativeEvent.data != blogUrl) {
            setLoading(true)
            navigation.navigate('TabStack')
            setLoading(false)
        }
        else {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {!loading ?
                <WebView
                    source={{ uri: blogUrl }}
                    onMessage={(event) => onMessage(event)}
                    injectedJavaScript={`
                    (function() {
                      window.ReactNativeWebView.postMessage(window.location.href);
                    })();
                  `}
                    style={{ flex: 1 }}
                />
                :
                <View style={{ flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.red} />
                </View>
            }
        </SafeAreaView>
    )
}

export default BlogDetail;