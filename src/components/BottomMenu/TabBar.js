import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet, Text
} from "react-native";
import { BottomMenuItem } from "./MenuItem";
import { AddBttn } from "./AddBttn";


export default TabBar = ({
  state,
  descriptors,
  navigation,
}) => {
  const [translateValue] = useState(new Animated.Value(0));
  const totalWidth = Dimensions.get("window").width;
  const tabWidth = totalWidth / state.routes.length;
  
  return (
    <View style={[style.tabContainer, { width: totalWidth }]}>
      <View style={{ flexDirection: "row" }}>


        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];


          const label = options.title;
          const badgeCount = options.badgeCount || 0;

          const iconName = options.iconName ? options.iconName : route.name;
          const iconNameFocused = options.iconNameFocused ? options.iconNameFocused : iconName;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if(route.name === 'Add')
                navigation.navigate('Workout');
              else
                navigation.navigate(route.name);
            }

            Animated.spring(translateValue, {
              toValue: index * tabWidth,
              velocity: 10,
              useNativeDriver: true,
            }).start();
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });

            if (!isFocused) {
              navigation.navigate(route.name);
            }
            
            Animated.spring(translateValue, {
              toValue: index * tabWidth,
              velocity: 10,
              useNativeDriver: true,
            }).start();
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ["selected"] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
              key={index}
            >
              {
                route.name === 'Add' ?
                  <AddBttn 
                    iconName={isFocused ? iconName.toString() : iconNameFocused.toString()}
                    label={label}
                    isCurrent={isFocused}
                    badgeCount={badgeCount || 0}
                  />
                :
                <BottomMenuItem
                  iconName={isFocused ? iconName.toString() : iconNameFocused.toString()}
                  label={label}
                  isCurrent={isFocused}
                  badgeCount={badgeCount || 0}
                />
              }
              
            </TouchableOpacity>
          );
        })}
 
        
        {/*<Animated.View
          style={[
            style.slider,
            {
              transform: [{ translateX: translateValue }],
              width: tabWidth - 20,
            },
          ]}
        />*/}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  tabContainer: {
    height: 63,
    backfaceVisibility:'hidden',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.0,
    backgroundColor: "#fff",
    elevation: 10,
    position: "absolute",
    bottom: 0,
  },
  slider: {
    height: 2,
    position: "absolute",
    bottom: 0,
    left: 10,
    backgroundColor: '#3c6e71',
    borderRadius: 10,
  },
});