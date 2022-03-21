import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Alert,
  Button, HStack, Center, NativeBaseProvider, IconButton, CloseIcon } from "native-base";

// import { Alert as UIAlert } from 'react-native'
import { UserContext } from '../context/AppContext'
import localDB from '../database/AsyncStorage'

import Parse from "parse/react-native.js";
import '../helpers/ParseInit';

const SignIn = (props) => {

  const { navigation } = props;
  
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)  

  const user_context = useContext(UserContext)
 
  const serverSignIn = () => {

    if (email && password) {
      // Create a new instance of the user class
      Parse.User
          .logIn(email, password).then(async function(user) {
            console.log('\n\n\n\n\n')
            console.log(user)
            console.log(user.getACL())
            console.log(user.relation('user').query())
            console.log('\n\n\n\n\n')

 

            const query = await new Parse.Query(Parse.Role).equalTo('users', user ).find()
            console.log(query[0] && query[0].getName())

            if(query && query[0] && query[0].getName() == 'user'){
              console.log('User logged-in successful with display name: ' + 
              user.get("display") + ' and email: ' + user.get("email"));

              user_context.setUserID(user.id);
              user_context.setUser(user)

              let installationId = null
              installationId = await localDB.getValue('installationId') || user.get('installationId');
              console.log('\n\n\n\n\n ===> installatoin local')
              console.log('=======> ', installationId)
              localDB.setValue('installationId', installationId)               

              setStatus('success')
              setMessage('Login successful.')

              navigation.navigate('BottomNavigator')
            }else{
              console.log('sorry you can\'t login')
              // UIAlert.alert('Vous ne pouvez s\'identifier !')
              setMessage('Vous ne pouvez s\'identifier !')
              setStatus('error')
              Parse.User.logOut()
            }
 
      }).catch(function(error){
        console.log(error)
        setMessage(error.message)
        setStatus('error')
      });
    }
  }


  const handleSignIn = () =>{
    console.log('state : ', email, password, message)
    if(!email || !password){
      setStatus('error')
      setMessage('Please verify your inputs.')
    }else{
      serverSignIn()
    }
  }

  return (<Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          Welcome
        </Heading>
        <Heading mt="1" _dark={{
        color: "warmGray.200"
      }} color="coolGray.600" fontWeight="medium" size="xs">
          Sign in to continue!
        </Heading>

        { message &&
        <Alert w="100%" status={status}>
          <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} justifyContent="space-between">
              <HStack space={2} flexShrink={1}>
                <Alert.Icon mt="1" />
                <Text fontSize="md" color="coolGray.800">
                  {message}
                </Text>
              </HStack>
              <IconButton variant="unstyled" icon={<CloseIcon size="3" color="coolGray.600" />} />
            </HStack>
          </VStack>
        </Alert> }
 

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input onChange={text=>setEmail(text.nativeEvent.text)}/>
          </FormControl>




          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" onChange={text=> setPassword(text.nativeEvent.text) }/>
            <Link _text={{
            fontSize: "xs",
            fontWeight: "500",
            color: "indigo.500"
          }} alignSelf="flex-end" mt="1">
              Forget Password?
            </Link>
          </FormControl>


          <Button mt="2" colorScheme="indigo" /*onPress={navigation.navigate('UserOTP')}*/>
            Request OTP
          </Button>

          <Button mt="2" colorScheme="indigo" onPress={()=> handleSignIn()}>
            Sign in
          </Button>
          
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
              I'm a new user.{" "}
            </Text>
            <Link _text={{
              color: "indigo.500",
              fontWeight: "medium",
              fontSize: "sm"
            }}
            onPress={()=> props.navigation.navigate('Signup') }>
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>);
};

    export default (props) => {
        return (
          <NativeBaseProvider>
            <Center flex={1} px="3">
                <SignIn navigation={props.navigation}/>
            </Center>
          </NativeBaseProvider>
        );
    };
    