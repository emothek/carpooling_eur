import React from "react";
import { View, Text } from "react-native";

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../assets/config.json';
const CustomIcon = createIconSetFromFontello(fontelloConfig);



export const AddBttn = ({ iconName, label, isCurrent, badgeCount }) => {
  return (
    <View
      style={{
        height: "25%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

 
 
    <CustomIcon 
        name={iconName}
        size={ isCurrent ? 54 : 50}
        color="rgba(0,0,0,1)" 
        style={{ color: isCurrent ? '#333333' : '#EAE6D8' }}
        />

    {badgeCount > 0 && (
        <View
          style={{
            // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
            position: 'absolute',
            right: -3,
            top: -3,
            backgroundColor: 'black',
            borderRadius: 12,
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            {badgeCount}
          </Text>
        </View>
    )}

    {
      label && 
      <Text style={{ 
          fontFamily: isCurrent ? 'Roboto-Light' : 'Roboto-Bold',
          fontSize: isCurrent ? 28 : 26,
          color: isCurrent ? '#3c6e71' : '#ced4da' 
          }}>
          {label}
      </Text>
    }
    </View>
  );
};