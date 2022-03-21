import React, { useContext, useState } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link,
  Button, HStack, Center, NativeBaseProvider, IconButton, CloseIcon } from "native-base";

import Parse from "parse/react-native.js";
import '../helpers/ParseInit'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native';
import {StackActions} from '@react-navigation/native';
import { AppContext, UserContext } from '../context/AppContext'
import localDB from '../database/AsyncStorage'

import { Alert as UIAlert } from 'react-native'


const SignUp = (props) => {
  const { navigation } = props;
  const user_context = useContext(UserContext)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // const [errorMessage, setErrorMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)  
  
  const handleSignUp = async () => {
    console.log("handle signup")
    if( password !== confirmPassword ){
      setStatus('error')
      setMessage('Mot de passe pas identiques')
    }else if( !email || !password ){
      setStatus('error')
      setMessage( 'Vérifier votre e-mail et password' )
    }else if( !phoneNumber ){
      setStatus('error')
      setMessage( 'Vérifier votre numéro de téléphone' )
    }else{
 
      try {
        let user = new Parse.User();
        user.set('username', email)
        user.set('email', email)
        user.set('password', password)
        let installationId = await localDB.getValue('installationId')
        user.set('installationId', installationId || undefined)

        const query = await new Parse.Query(Parse.Role).equalTo('name', 'user').first()

        try {
          const createdUser = await user.signUp();
          if(query){
            query.getUsers().add(createdUser)
            query.save()
          }
        
          // UIAlert.alert(`Success! User ${createdUser.getUsername()} was successfully created!`);
          setStatus('success')
          setMessage(`Success! User ${createdUser.getUsername()} was successfully created!`)

          user_context.setUserID(createdUser.id);
          user_context.setUser(createdUser)
          navigation.dispatch(StackActions.popToTop());
          return true;
        } catch (error) {
          // signUp can fail if any parameter is blank or failed an uniqueness check on the server
          // console.warn(error)
          // UIAlert.alert(`Error! ${error}`);
          setStatus('error')
          setMessage(`Error! ${error}`)

          return false;
        }
 
      } catch (error) {
        // signUp can fail if any parameter is blank or failed an uniqueness check on the server
        // console.warn(error)
        // UIAlert.alert(`Error! ${error}`);
        setStatus('error')
        setMessage(`Error! ${error}`)
        return false;
      }
    }
  }


  return (
    <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading size="lg" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }} fontWeight="semibold">
          Welcome
        </Heading>
        <Heading mt="1" color="coolGray.600" _dark={{
        color: "warmGray.200"
      }} fontWeight="medium" size="xs">
          Sign up to continue!
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
            <FormControl.Label>Email</FormControl.Label>
            <Input onChangeText={email => setEmail(email)} 
              value={email}/>
          </FormControl>

          <FormControl>
            <FormControl.Label>Phone number</FormControl.Label>
            <Input type="text" keyboardType='phone-pad' onChangeText={pwd => setPhoneNumber(pwd) } 
              value={phoneNumber}/>
          </FormControl>

          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" onChangeText={pwd => setPassword(pwd)} 
              value={password}/>
          </FormControl>

          <FormControl>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input type="password" onChangeText={pwd => setConfirmPassword(pwd) } 
              value={confirmPassword}/>
          </FormControl>


          <Button mt="2" colorScheme="indigo" onPress={()=> handleSignUp() }>
            Sign up
          </Button>

          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
              I have an account.{" "}
            </Text>
            <Link _text={{
              color: "indigo.500",
              fontWeight: "medium",
              fontSize: "sm"
            }}
            onPress={()=> navigation.navigate('Signin') }>
              Sign In
            </Link>
          </HStack>

        </VStack>
      </Box>
    </Center>
  );
};

    export default (props) => {
        return (
          <NativeBaseProvider>
            <Center flex={1} px="3">
                <SignUp navigation={props.navigation}/>
            </Center>
          </NativeBaseProvider>
        );
    };
    