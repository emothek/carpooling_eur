import React, { useContext, useEffect } from 'react';
import 'react-native-gesture-handler';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,
  HeaderStyleInterpolators,
  StackCardInterpolationProps,
  StackNavigationOptions,
  TransitionSpecs,} from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const Stack = createStackNavigator();

// React Native 
import { Animated  } from 'react-native';
import { NetworkContext } from './helpers/NetworkProvider';
import { UserContext } from './context/AppContext'

import Signup from './screens/signup'
import Signin from './screens/signin'
import Loading from './screens/loading'
import UserOTP from './screens/userOTP'

import Map from './screens/map'

 
// import Search from './containers/screens/Search'
// import Filters from './containers/screens/Filters'
// import Results from './containers/screens/Results'
 
// import Store from './containers/screens/Store'
// import Basket from './containers/screens/Basket'
// import Checkout from './containers/screens/Checkout'
// import OrderTracking from './containers/screens/OrderTracking'
// import OrderMap from './containers/screens/OrderMap'
// import BrowseMap from './containers/screens/BrowseMap' 
 
import BottomNavigator from './screens/bottomNavigator'

 const horizontalAnimation = {
               
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({
    current,
    layouts,
  }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
}



export default function AppNavigation() {

    const { isConnected } = useContext(NetworkContext)
    const { userID } = useContext(UserContext)
  
    const animation = new Animated.Value(0);
    const hAnimation = new Animated.Value(0);
  
    const animatedStyle ={
      opacity : animation,
      height: hAnimation
    }
  
  
    startAnimation=()=>{
  
      Animated.timing(animation, {
        toValue : 1,
        timing : 500,
        useNativeDriver: false,
  
      }).start(()=>{
        Animated.timing(animation,{
          toValue : 0,
          duration : 1000,
          delay: 2000,
          useNativeDriver: false,
  
        }).start();
      })
  
      Animated.timing(hAnimation, {
        toValue : 20,
        timing : 500,
        useNativeDriver: false,
  
      }).start(()=>{
        Animated.timing(hAnimation,{
          toValue : 0,
          duration : 1000,
          delay: 2000,
          useNativeDriver: false,
        }).start();
      })
    }
  
    useEffect(()=>{
      try{
  
        startAnimation()
  
      } catch (err) {
  
   
  
      }
    }, [isConnected])
  
  
    return (
      <SafeAreaProvider>


      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Loading" 
          screenOptions={
            {headerShown: false}
          }
          >
  

            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="UserOTP" component={UserOTP} />

 
            <Stack.Screen name="BottomNavigator" component={BottomNavigator} />

            <Stack.Screen name="Map" 
              component={Map} 
              options={{ animationEnabled: false }} />


{/*  
            <Stack.Screen name="Search" component={Search} options={horizontalAnimation}  />
            <Stack.Screen name="Filters" component={Filters} options={horizontalAnimation}  />
            <Stack.Screen name="Results" component={Results} options={horizontalAnimation}  />


            <Stack.Screen name="Store" component={Store}  options={{ animationEnabled: false }} />
            <Stack.Screen name="Basket" component={Basket} options={{ animationEnabled: false }} />
            <Stack.Screen name="Checkout" component={Checkout} options={{ animationEnabled: false }}  />
            <Stack.Screen name="OrderTracking" component={OrderTracking} options={{ animationEnabled: false }}  />
            <Stack.Screen name="OrderMap" component={OrderMap} options={{ animationEnabled: false }} />

 */}

  
        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
    );
  }
  