import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Heading, VStack, FormControl,
  Input, Icon, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import withContext from "../../context/Context_HOC";
import { LocationContext } from "../../context/AppContext";

const GOOGLE_PLACES_API_KEY = 'AIzaSyBIG0nagvMLrNUAMmSfSaWBnzEYo-KzwMg';

function Home (props) {
  const { navigation } = props;
  const { departure, arrival, setArrival, setDeparture } = useContext(LocationContext);

  const [inputDepart, setInputDepart] = useState(departure ? departure.address : '');
  const [inputArrival, setInputArrival] = useState(arrival ? arrival.address : '');

 
  useEffect(()=>{
    setInputDepart(departure.address);
    setInputArrival(arrival.address);
  }, [departure, arrival])

  return (
    <NativeBaseProvider>
    <Center flex={1}>
      <Center w="100%" h="full" >
        <Box safeArea p="2" py="8" w="90%" maxW="290" h="100%">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
            Welcome
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

            <Box alignItems="center">
             <Input type="text"
              placeholder="Starting location..."
              w="100%" maxW="300px" py="15px" 
              InputLeftElement={
                <Icon as={<MaterialIcons name="location-pin" />} size={5} ml="2" color="muted.400" />
              }
              onChangeText={(text) => {
                setInputDepart(text);  
                setDeparture( depart=> ({...depart, address:text}) )
              }}
              value={inputDepart}
              InputRightElement={
                <Button size="4" rounded="none" w="1/5" h="full" 
                  onPress={()=> {
                    console.log('hello'); 
                    navigation.navigate('Map');
                    }}>
                  Map
                </Button>
              } 
              
              /> 

            {/* <GooglePlacesAutocomplete
                  query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'en', // language of the results
                  }}
                  styles={{
                    textInputContainer:{
                      width:200,
                    }
                  }}
                  onPress={(data, details) => console.log(data, details)}

                /> */}

            </Box>

            <Box alignItems="center">
             <Input type="text"
              placeholder="Destination ..."
              w="100%" maxW="300px" py="15px" 
              onChangeText={(text) => {
                setInputArrival(text);  
                setArrival( arrival=> ({...arrival, address:text}) )
              }}
              value={inputArrival}
              InputLeftElement={
                <Icon as={<MaterialIcons name="location-pin" />} size={5} ml="2" color="muted.400" />
              }
              InputRightElement={
                <Button size="4" rounded="none" w="1/5" h="full"
                  onPress={()=> {
                    console.log('hello'); 
                    navigation.navigate('Map');
                    }}>
                  Map
                </Button>
              } 
              />
            </Box>

          </VStack>
        </Box>
      </Center>
    </Center>
    </NativeBaseProvider>)
};
 
export default withContext(Home);
    