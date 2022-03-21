import React, {useState, useEffect, useMemo} from 'react';
import MainNavigation from './src/main';
import SplashScreen from 'react-native-splash-screen'
//import messaging from '@react-native-firebase/messaging';
import Parse from "parse/react-native.js";
import './src/helpers/ParseInit'

import { NetworkProvider } from './src/helpers/NetworkProvider';
import AppIntro from './src/screens/intro'

// Multi-language SUPPORT //
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize"; // Use for caching/memoize for better performance

import {  I18nManager,  Platform,  PermissionsAndroid, ToastAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

// Multi-language SUPPORT // 
import localDB from './src/database/AsyncStorage'
import RNRestart from 'react-native-restart';

import {
  UserState, UserContext,
  AppState, AppContext,
  LocationState, LocationContext,
  // DistanceState, DistanceContext,
  SearchState, SearchContext,
  // CardState, CardContext,
  // StoreState, StoreContext,
  // FavoritesState, FavoritesContext,
  // OrderState, OrderContext
 } from './src/context/AppContext'
import { Alert } from 'react-native';
 
import { configurePushNotifications } from './src/services/PushNotifications';


// Multi-language SUPPORT //
const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./src/assets/lang/en.json'),
  ar: () => require('./src/assets/lang/ar.json'),
  fr: () => require('./src/assets/lang/fr.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = (language, RTL) => {
  // fallback if no available language fits
  const fallback = { languageTag: 'fr', isRTL: false };
  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
  const a = language ? language : languageTag;
  const b = RTL ? RTL : isRTL;
  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(b);
  // set i18n-js config
  i18n.translations = { [a]: translationGetters[a]() };
  i18n.locale = a;
};
// Multi-language SUPPORT //


//  GPS ask for permission =======
const askGPSPermission = async () => {
  if (Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (hasPermission) return true;

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Autorisation localisation est  refusée par l\'utilisateur.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('Autorisation de localisation révoquée par l\'utilisateur.', ToastAndroid.LONG);
  }

  return false;
}




const App = () => {

    const handleSignout = () => {
      Parse.User.logOut()
      RNRestart.Restart();
      // auth().signOut().then(async function() {
      //   await localDB.removeValue('uid');
      //   await localDB.removeValue('user');
      //   await localDB.removeValue('onDone');
      //   RNRestart.Restart();
    
      // }).catch(function(error) {
      //   // An error happened.
      //   console.warn(error);
      // });
    }

    // App Context
    const [intro, setIntro] = useState(AppState.intro)
    const [language, setLanguage] = useState(AppState.language)
    const [RTL, setRTL] = useState(AppState.RTL)
    const [homeStoresFilter, setHomeStoresFilter] = useState(AppState.homeStoresFilter)

    const appContextValue = useMemo(() => ({
      language, setLanguage, 
      RTL, setRTL, 
      homeStoresFilter, setHomeStoresFilter,
      intro, setIntro, translate }), [language, RTL, intro, homeStoresFilter]);

    // User Context
    const [userID, setUserID] = useState(UserState.userID)
    const [user, setUser] = useState(UserState.user)

    const userContextValue = useMemo(() => ({
      user, setUser,
      userID, setUserID, 
      signOut: handleSignout }), [user, userID]);

    
    // Location Context
    const [location, setLocation] = useState(LocationState.location)
    const [address, setAddress] = useState(LocationState.address)
    const [name, setName] = useState(LocationState.name)

    const [departure, setDeparture] = useState(LocationState.departure)
    const [arrival, setArrival] = useState(LocationState.arrival)


    const locationContextValue = useMemo(()=> ({
      location, setLocation,
      address, setAddress,
      departure, setDeparture,
      arrival, setArrival,
      name, setName
    }), [ location, name, address, departure, arrival ])
    
    // Distance Context
    // const [distance, setDistance] = useState(DistanceState.distance)
    
    // const distanceContextValue = useMemo(()=> ({
    //   distance, setDistance}), [ distance ])


    // // Shopping Card Context 
    // const [products, setProducts] = useState(CardState.products)
    // const [discount, setDiscount] = useState(CardState.discount)
    // const [shippingCost, setShippingCost] = useState(CardState.shippingCost)
    // const [totalPrice, setTotalPrice] = useState(CardState.totalPrice)

    // const CardContextValue = useMemo(() => ({
    //   products, setProducts,
    //   discount, setDiscount, 
    //   shippingCost, setShippingCost,
    //   totalPrice, setTotalPrice }), [ products, discount, shippingCost, totalPrice ]);

    
    // // Search Context
    const [searchResult, setSearchResult] = useState(SearchState.searchResult)
    const [searchTerm, setSearchTerm] = useState(SearchState.searchTerm)

    const SearchContextValue = useMemo(()=> ({
      searchResult, setSearchResult,
      searchTerm, setSearchTerm
    }), [ searchResult, searchTerm ])

    // // Current Store Context
    // const [store, setStore] = useState(StoreState.store)
    
    // const StoreContextValue = useMemo(()=>({
    //   store, setStore
    // }), [ store ])

    // // Favorite Context
    // const [favorites, setFavorites] = useState(FavoritesState.favorites)
    
    // const FavoritesContextValue = useMemo(()=>({
    //   favorites, setFavorites
    // }), [ favorites ])


    // // Order Context
    // const [order, setOrder] = useState(OrderState.order)

    // const OrderContextValue = useMemo(()=>({
    //   order, setOrder
    // }), [ order ])

    const onDone = () => {
        setIntro(false)
    }

    const handleLocalizationChange = (language, RTL) => {
        setI18nConfig(language, RTL);
        //forceUpdate();
    }

    
    useEffect(()=>{

      let permission = askGPSPermission()
      
      if(permission){
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position)
            setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
            setName('default')
            
          },
          (error) => {
            console.log(error)
            Alert.alert(error.message)
          },
          //{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
          Platform.OS === 'android' ? { enableHighAccuracy: true, timeout: 25000 } : { enableHighAccuracy: true, timeout: 25000, maximumAge: 3600000  }
        );
  
      }else{
        console.log('something')
        Alert.alert('SVP activer la localisation GPS')
        return false;
      }

    }, [])
  
    // useEffect(()=>{
    //   const unsubscribe = messaging().onMessage(async remoteMessage=>{
    //     Alert.alert('new message here FCM', JSON.stringify(remoteMessage))
    //   })
      
    //   return unsubscribe
    // }, [])


    useEffect(()=>{
        configurePushNotifications() // configure Push notification 
        setI18nConfig(); // set initial config

        console.log('coords -> \n')
        
        fetchData = async () => {
          //  User UID
          let user_id = await localDB.getValue('uid');
          if(user_id) setUserID(user_id)

          // Intro data
          let onDone = await localDB.getValue('onDone');
          if(onDone){
            setIntro(false)
          }else{
            setIntro(true)
          }

          // language
          const cachedLang = await localDB.getValue('lang');
          if (cachedLang === 'ar'){
              setLanguage('ar')
              setRTL(true)
              setI18nConfig('ar', true);
            }else if(!cachedLang){
              setLanguage('en')
              setRTL(false)
              setI18nConfig('en', false);
            }else{
              setLanguage(cachedLang)
              setRTL(false)
              setI18nConfig(cachedLang, false);
          }
        }

        fetchData()

        setTimeout(() => SplashScreen.hide() , 200);
        RNLocalize.addEventListener('change', handleLocalizationChange);
    }, [])

    return(
        <AppContext.Provider value = {appContextValue}>
        <UserContext.Provider value = {userContextValue}>
        <LocationContext.Provider value = {locationContextValue}>
        <SearchContext.Provider value = {SearchContextValue}>

        {/*         
          <DistanceContext.Provider value = {distanceContextValue}>
          <CardContext.Provider value = {CardContextValue}>
          <StoreContext.Provider value={StoreContextValue}>
          <FavoritesContext.Provider value={FavoritesContextValue}>
          <OrderContext.Provider value={OrderContextValue}> */}
            
            <NetworkProvider> 
            {
                intro 
                ?
                <AppIntro/>
                :
                <MainNavigation />
            }
            </NetworkProvider>

          {/* </OrderContext.Provider>
          </FavoritesContext.Provider>          
          </StoreContext.Provider>
          </CardContext.Provider>
          </DistanceContext.Provider>
           */}
        </SearchContext.Provider>
        </LocationContext.Provider>
        </UserContext.Provider>
        </AppContext.Provider>
    )

}

export default App;