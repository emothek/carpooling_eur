import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useCallback } from 'react';
import 'react-native-gesture-handler';
 
import Go from './tabs/go'
import Current from './tabs/current'
import Settings from './tabs/settings'
 
const Tab = createBottomTabNavigator();

import TabBar from '../components/BottomMenu/TabBar'
import { AppContext } from '../context/AppContext'
import { BackHandler } from 'react-native';
//import { useFocusEffect } from '@react-navigation/native';
 
export default function BottomNavigator({navigation}) {

//   useFocusEffect(
//     useCallback(()=> {
//       const ev = BackHandler.addEventListener('hardwareBackPress', function() {return true})  
//       return () =>
//         ev.remove()
//     }, [])
// )

  return (
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen 
          name="Go" 
          options={{
            headerShown: false,
            iconName: "home-1",
          }} 
          component={Go} />

        <Tab.Screen 
          name="Current" 
          options={{
            headerShown: false,
            iconName: "home-1",
          }} 
          component={Current} />

        <Tab.Screen 
          name="Settings" 
          options={{
            headerShown: false,
            iconName: "home",
          }} 
          component={Settings} />
      </Tab.Navigator>
  );
}
