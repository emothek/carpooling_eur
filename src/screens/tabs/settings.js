import React, { useContext } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";

import Parse from "parse/react-native.js";
import '../../helpers/ParseInit'
import { UserContext } from '../../context/AppContext'
import withContext from "../../context/Context_HOC";

function Settings (props) {
  const context = useContext(UserContext)


  const handleLogOut = () => {
    Parse.User.logOut()
    context.setUserID(null);
    context.setUser(null)
  }

  return (
    <NativeBaseProvider>
    <Center flex={1} px="3">
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
            Settings
          </Heading>
          <Heading mt="1" _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="xs">
            Settings
            {props.context.translate('Home')}
          </Heading>

          <VStack space={3} mt="5">
              <Text fontSize="sm" color="coolGray.600" _dark={{
                  color: "warmGray.200"
              }}>
                Start riding !
              </Text>

              <Button onPress={handleLogOut}>
                Log out
                </Button>  
          </VStack>
        </Box>
      </Center>
    </Center>
    </NativeBaseProvider>)
};
 
export default withContext(Settings);
    