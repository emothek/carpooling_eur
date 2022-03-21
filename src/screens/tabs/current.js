import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";

import withContext from "../../context/Context_HOC";

function Home (props) {
  return (
    <NativeBaseProvider>
    <Center flex={1} px="3">
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
            Current rides
          </Heading>
          <Heading mt="1" _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="xs">
            Home
            {props.context.translate('Home')}
          </Heading>

          <VStack space={3} mt="5">
              <Text fontSize="sm" color="coolGray.600" _dark={{
                  color: "warmGray.200"
              }}>
                Start riding !
                  </Text>
          </VStack>
        </Box>
      </Center>
    </Center>
    </NativeBaseProvider>)
};
 
export default withContext(Home);
    