import React from 'react';
import LottieView from 'lottie-react-native';

export default class WelcomeAnimation extends React.Component {
    render() {
        return <LottieView source={require('../../../assets/image/img/SplashAnimation/Animation - 1706440302011.json')} autoPlay loop />;
    }
}