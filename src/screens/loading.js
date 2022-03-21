import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native'
import Parse from "parse/react-native.js";
import '../helpers/ParseInit'
import { UserContext } from '../context/AppContext'
import { Spinner, HStack, Heading, Center, NativeBaseProvider } from "native-base";

export default function Loading(props) {
    const context = useContext(UserContext)
    
    useEffect(()=>{

        const loadCurrentUser = async () =>{
          // Parse User 
          let currentUser = await Parse.User.currentAsync()
          if(currentUser){
            //console.warn(currentUser)
            context.setUserID(currentUser.id);
            context.setUser(currentUser)
            props.navigation.navigate('BottomNavigator');
          }else{
            props.navigation.navigate('Signin');
            context.setUserID(null);
            context.setUser(null)
          }

        }
        loadCurrentUser()

    },[context.user, context.userID])

    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <HStack space={2} justifyContent="center">
                    <Spinner accessibilityLabel="Loading posts" />
                    <Heading color="primary.500" fontSize="md">
                        Loading
                    </Heading>
                </HStack>;
            </Center>
        </NativeBaseProvider>

    )
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})