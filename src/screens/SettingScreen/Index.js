import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import GeneralSetting from '../../components/Settings/GeneralSetting';
import ProfileSetting from '../../components/Settings/ProfileSetting';
import SocialLinks from '../../components/Settings/SocialLink';
import Avatar from '../../components/Settings/Avatar';
import Privacy from '../../components/Settings/Privacy';
import Password from '../../components/Settings/Password';
import Authentication from '../../components/Settings/Authentication';
import MyInformation from '../../components/Settings/MyInformation';
import MyAddresses from '../../components/Settings/MyAddress';
import MyEarnings from '../../components/Settings/MyEarning';
import Wallet from '../../components/Settings/Wallet';
import DeleteAccount from '../../components/Settings/DeleteAccount';
import Points from '../../components/Settings/Points';
import MyAffiliates from '../../components/Settings/MyAffiliates';
import NotificationSettings from '../../components/Settings/NotificationSettings';
import BlockList from '../../components/Settings/BlockList';
import Language from '../../components/Settings/Language';
import BasicHeader from '../../components/BasicHeader';
import { useNavigation } from '@react-navigation/native';


const SettingScreen = ({ route }) => {
    const { selectedOption } = route.params;
    const navigation = useNavigation();

    // Render the specific component based on the selected screen parameter
    const handleRenderComponent = (screenName) => {
        // Render a component based on the selected option
        switch (screenName) {
            case 'GeneralSetting':
                return <GeneralSetting />;
            case 'ProfileSetting':
                return <ProfileSetting />;
            case 'SocialLinks':
                return <SocialLinks />;
            case 'NotificationSettings':
                return <NotificationSettings />;
            case 'Avatar':
                return <Avatar />;
            case 'Privacy':
                return <Privacy />;
            case 'Language':
                return <Language />;
            case 'Password':
                return <Password />;
            case 'Authentication':
                return <Authentication />;
            case 'BlockList':
                return <BlockList />;
            case 'MyInformation':
                return <MyInformation />;
            case 'MyAddresses':
                return <MyAddresses />;
            case 'MyAffiliates':
                return <MyAffiliates />;
            case 'MyEarnings':
                return <MyEarnings />;
            case 'Wallet':
                return <Wallet />;
            case 'DeleteAccount':
                return <DeleteAccount />;
            case 'Points':
                return <Points />;
            case 'Wallet':
                return <Wallet />;
            default:
                return null;
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                flex: 0.08,
                width: '100%',
                justifyContent: 'center',
            }}>

                <BasicHeader onPress={() => navigation.goBack()} title={selectedOption} />
            </View>
            <View style={{
                flex: 0.92,
                width: '100%',
            }}>
                <View>
                    {handleRenderComponent(selectedOption)}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SettingScreen;
