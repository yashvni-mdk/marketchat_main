import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { Login, SplashScreen, Register, ContactUs, Terms, PrivacyPolicy, About, ForgotPassword, Profile, GeneralSetting, ProfileSetting, Albums, Blog, Jobs, RequestScreen, MessageScreen, NotificationScreen, HomeScreen, Events, Explore, FindFriends, Funding, Forum, MyArticles, Pages, BlogDetails, SavedPosts, Groups, CreateAlbum, CreateAd, CreateBlog, CreateEvent, CreateGroup, CreatePage, CreateStatus, EditGroup, EditPages, SettingOption, SettingScreen, Poke, UserProfile, Likes, Followers, Followings, GroupsList, AlbumsList, CreateOption, GroupDetails, PageDetails, Advertising, Memories, Subscriptions, CommonThings, PopularPost, UpgradeToPro, Wallet, BlogDetail, EventDetails, EditEvent, ChatScreen, JobDetails, FundingDetails, Search, Chats, AlbumsDetails } from './src/screens';
import { ThemeProvider } from './src/components/ThemeContext';
import messaging from '@react-native-firebase/messaging';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './src/components/Pixel/index';
import store from './src/redux/store';
import { COLORS } from './constants';
import { MenuProvider } from 'react-native-popup-menu';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Notification from './src/components/Notification';
import i18n from './src/utils/localization/traslations';
import {I18nextProvider} from 'react-i18next';
import FlashMessage from 'react-native-flash-message';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabStack = () => {
  const userData = useSelector(state => state.user_data);
  return (
    <Tab.Navigator
      initialRouteName="Home"

      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          width: "100%",
          height: Platform.OS == "ios" ? hp(8) : hp(8),
          backgroundColor: "#fff",
          borderColor: "#000",
          borderWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}  // Change 'home' and 'home-outline' based on your preference
              size={focused ? hp(3.5) : hp(3.4)}
              color={focused ? COLORS.black : COLORS.darkgray1}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RequestScreen"
        component={RequestScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'person-add' : 'person-add-outline'}  // Change 'home' and 'home-outline' based on your preference
              size={focused ? hp(3.5) : hp(3.4)}
              color={focused ? COLORS.black : COLORS.darkgray1}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CreateOption"
        component={CreateOption}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, tintColor }) => (
            <View style={{
              width: wp(10),
              height: hp(5),
              borderRadius: 5,
              backgroundColor: COLORS.red,
              alignItems: "center",
              justifyContent: 'center'
            }}>
              <View style={{ width: 25, height: 25, borderRadius: 25, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: COLORS.white }}>
                <Image style={{
                  height: hp(6),
                  width: wp(3),
                  resizeMode: 'contain',
                  tintColor: COLORS.white
                }} source={require('./assets/icons/png/add-1.png')} />
              </View>
            </View>

          ),
        }}
      />
      <Tab.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? 'bell' : 'bell-outline'}  // Change 'home' and 'home-outline' based on your preference
              size={focused ? hp(3.5) : hp(3.4)}
              color={focused ? COLORS.black : COLORS.darkgray1}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={Profile}
        options={{
          headerShown: false,

          tabBarIcon: ({ focused, tintColor }) => (
            <Image style={{ width: wp(8), height: wp(8), resizeMode: 'contain', borderRadius: wp(8) }} source={{ uri: userData?.avatar }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      console.log('Get Message:::>>', remoteMessage);
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });
  }, []);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <SafeAreaProvider >
          <NavigationContainer>
            <ThemeProvider>
              <MenuProvider>
                <Stack.Navigator>
                  <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                  <Stack.Screen name="TabStack" component={TabStack} options={{ headerShown: false }} />
                  <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                  <Stack.Screen name="Terms" component={Terms} options={{ headerShown: false }} />
                  <Stack.Screen name="MessageScreen" component={MessageScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="ContactUs" component={ContactUs} options={{ headerShown: false }} />
                  <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
                  <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
                  <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
                  <Stack.Screen name="GeneralSetting" component={GeneralSetting} options={{ headerShown: false }} />
                  <Stack.Screen name="ProfileSetting" component={ProfileSetting} options={{ headerShown: false }} />
                  <Stack.Screen name="Albums" component={Albums} options={{ headerShown: false }} />
                  <Stack.Screen name="Blog" component={Blog} options={{ headerShown: false }} />
                  <Stack.Screen name="BlogDetails" component={BlogDetails} options={{ headerShown: false }} />
                  <Stack.Screen name="Jobs" component={Jobs} options={{ headerShown: false }} />
                  <Stack.Screen name="Events" component={Events} options={{ headerShown: false }} />
                  <Stack.Screen name="Explore" component={Explore} options={{ headerShown: false }} />
                  <Stack.Screen name="FindFriends" component={FindFriends} options={{ headerShown: false }} />
                  <Stack.Screen name="Funding" component={Funding} options={{ headerShown: false }} />
                  <Stack.Screen name="Forum" component={Forum} options={{ headerShown: false }} />
                  <Stack.Screen name="MyArticles" component={MyArticles} options={{ headerShown: false }} />
                  <Stack.Screen name="Pages" component={Pages} options={{ headerShown: false }} />
                  <Stack.Screen name="SavedPosts" component={SavedPosts} options={{ headerShown: false }} />
                  <Stack.Screen name="Groups" component={Groups} options={{ headerShown: false }} />
                  <Stack.Screen name="CreateAlbum" component={CreateAlbum} options={{ headerShown: false }} />
                  <Stack.Screen name="CreateAd" component={CreateAd} options={{ headerShown: false }} />
                  <Stack.Screen name="CreateBlog" component={CreateBlog} options={{ headerShown: false }} />
                  <Stack.Screen name="CreateEvent" component={CreateEvent} options={{ headerShown: false }} />
                  <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ headerShown: false }} />
                  <Stack.Screen name="CreatePage" component={CreatePage} options={{ headerShown: false }} />
                  <Stack.Screen name="EditGroup" component={EditGroup} options={{ headerShown: false }} />
                  <Stack.Screen name="EditPages" component={EditPages} options={{ headerShown: false }} />
                  <Stack.Screen name="CreateStatus" component={CreateStatus} options={{ headerShown: false }} />
                  <Stack.Screen name="SettingOption" component={SettingOption} options={{ headerShown: false }} />
                  <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Poke" component={Poke} options={{ headerShown: false }} />
                  <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
                  <Stack.Screen name="Likes" component={Likes} options={{ headerShown: false }} />
                  <Stack.Screen name="Followers" component={Followers} options={{ headerShown: false }} />
                  <Stack.Screen name="Followings" component={Followings} options={{ headerShown: false }} />
                  <Stack.Screen name="GroupsList" component={GroupsList} options={{ headerShown: false }} />
                  <Stack.Screen name="AlbumsList" component={AlbumsList} options={{ headerShown: false }} />
                  <Stack.Screen name="GroupDetails" component={GroupDetails} options={{ headerShown: false }} />
                  <Stack.Screen name="PageDetails" component={PageDetails} options={{ headerShown: false }} />
                  <Stack.Screen name="Advertising" component={Advertising} options={{ headerShown: false }} />
                  <Stack.Screen name="Memories" component={Memories} options={{ headerShown: false }} />
                  <Stack.Screen name="CommonThings" component={CommonThings} options={{ headerShown: false }} />
                  <Stack.Screen name="Subscriptions" component={Subscriptions} options={{ headerShown: false }} />
                  <Stack.Screen name="PopularPost" component={PopularPost} options={{ headerShown: false }} />
                  <Stack.Screen name="UpgradeToPro" component={UpgradeToPro} options={{ headerShown: false }} />
                  <Stack.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
                  <Stack.Screen name="BlogDetail" component={BlogDetail} options={{ headerShown: false }} />
                  <Stack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false }} />
                  <Stack.Screen name="EditEvent" component={EditEvent} options={{ headerShown: false }} />
                  <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="JobDetails" component={JobDetails} options={{ headerShown: false }} />
                  <Stack.Screen name="FundingDetails" component={FundingDetails} options={{ headerShown: false }} />
                  <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
                  <Stack.Screen name="Chats" component={Chats} options={{ headerShown: false }} />
                  <Stack.Screen name="AlbumsDetails" component={AlbumsDetails} options={{ headerShown: false }} />
                </Stack.Navigator>
              </MenuProvider>
            </ThemeProvider>
            <FlashMessage position={'top'} />
          </NavigationContainer>
        </SafeAreaProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
