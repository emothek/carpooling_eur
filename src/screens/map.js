import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";

import { Box, Text, VStack, FlatList, Heading, Spacer,
    Input, Icon, Link, Button, HStack, Center, Alert, NativeBaseProvider, IconButton, CloseIcon } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MapView, {PROVIDER_GOOGLE, Marker} from "react-native-maps";
import { mapDarkStyle, mapStandardStyle } from '../assets/mapData';
import SearchBar from '../components/SearchBar'

import { SearchContext, LocationContext } from '../context/AppContext'
import { useTheme } from '@react-navigation/native';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBIG0nagvMLrNUAMmSfSaWBnzEYo-KzwMg';


const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
// const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const ExploreScreen = (props) => {


  const { navigation } = props
  const SearchCtx = useContext(SearchContext)
  const LocationCtx = useContext(LocationContext)

  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)  

  const [departure, setDeparture] = useState(LocationCtx.departure ? LocationCtx.departure.address : '');
  const [arrival, setArrival] = useState(LocationCtx.arrival ? LocationCtx.arrival.address : '');

  const [predictions, setPredictions] = useState([])
  const [showList, setShowList] = useState(false)

  const [depMarker, setDepMarker] = useState(false)
  const [arrMarker, setArrMarker] = useState(false)

  useEffect(()=>{
    console.log('\n\n\n\n ======(search result)=======> \n')

    if(SearchCtx.searchResult){
        SearchCtx.searchResult.map((el, i)=>{
            console.log('=====>')
            console.log(el)
      
          })
    }


    console.log('\n\n\n\n ======(location)=======> \n')
    console.log(LocationCtx.location)

  }, [SearchCtx.searchResult])

  const theme = useTheme();

  const initialMapState = {
    markers: LocationCtx.location,
    region: {
      latitude: LocationCtx.location.lat || 35.217201, 
      longitude: LocationCtx.location.lng || -0.619032,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  };

  //console.warn(LocationCtx)

  const [state, setState] = useState(initialMapState);


  const _map = useRef(null);
  const _scrollView = useRef(null);

  const search = () => {
      console.log('update search !!!')
  }

  // console.warn(LocationCtx)

  const getSuggestedPlaces = (departure = null,  arrival = null) => {
    let input = departure || arrival;
    if(input){
      return fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&radius=500&key=${GOOGLE_PLACES_API_KEY}`)
      .then((response) => response.json())
      .then((json) => {
        console.log('\n\n\n places sugested \n')
        console.log(json)
        console.log(json.predictions.length)
        setPredictions(json.predictions)
        setShowList(true)
        // return json;
      })
      .catch((error) => {
        console.error(error);
        setStatus('error')
        setMessage(error)
        // throw Error(error)
      });
    }else{
      setStatus('error')
      setMessage('Error : departure and arrival can not be empty.')
      //throw Error('Error : departure and arrival can not be empty.')
    }
  };

  const reverseGeocoding = (coords) => {
    console.warn(coords)
    if(coords){
      return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_PLACES_API_KEY}`)
      .then((response) => response.json())
      .then((json) => {
        // console.log('\n\n\n coordinates reversed to address \n')
        // console.log(json.results)
        // console.warn(json.results[0].formatted_address)
        setDeparture(json.results[0].formatted_address)
        // return json;
      })
      .catch((error) => {
        console.error(error);
        setStatus('error')
        setMessage(error)
        // throw Error(error)
      });
    }else{
      setStatus('error')
      setMessage('Error : coords are empty.')
      //throw Error('Error : departure and arrival can not be empty.')
    }
  }

  useEffect(()=>{
    setDepMarker(true)
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        initialRegion={state.region}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        customMapStyle={theme.dark ? mapStandardStyle : mapDarkStyle}
        showsUserLocation={true}
        
      >
          { depMarker &&
          <Marker 
              key={1}
              coordinate={{ latitude: Number(state.region.latitude), 
              longitude: Number(state.region.longitude) }}
              // onPress={(e)=>onMarkerPress(e)}
              draggable
              onDrag={(e) => console.log('onDrag', e.nativeEvent.coordinate)}
              onDragStart={(e) => console.log('onDragStart', e.nativeEvent.coordinate)}
              onDragEnd={(e) => {
                console.log('onDragEnd', e.nativeEvent.coordinate)
                reverseGeocoding(e.nativeEvent.coordinate)
              }}
              >
              <Animated.View style={[styles.markerWrap]}>
              <Animated.Image
                  source={require('../assets/map_marker.png')}
                  style={[styles.marker]}
                  resizeMode="cover"
              />
              </Animated.View>
          </Marker> }

          { arrMarker &&
          <MapView.Marker 
              key={1}
              coordinate={{ latitude: Number(state.region.latitude), 
              longitude: Number(state.region.longitude) }}
              // onPress={(e)=>onMarkerPress(e)}
              >
              <Animated.View style={[styles.markerWrap]}>
              <Animated.Image
                  source={require('../assets/map_marker.png')}
                  style={[styles.marker]}
                  resizeMode="cover"
              />
              </Animated.View>
          </MapView.Marker>}

      </MapView>

      <View style={styles.searchBox}>

        <NativeBaseProvider>

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

        <VStack space={2} mt="5">
            <Box alignItems="center">
             <Input type="text"
              onEndEditing={()=> { getSuggestedPlaces(departure) }}
              style={{color:'white', backgroundColor:'black'}}
              placeholder="Starting location..."
              w="100%" maxW="300px" py="10px" 
              InputLeftElement={
                <Icon as={<MaterialIcons name="location-pin" />} size={5} ml="2" color="muted.400"/>
              }
              onChange={()=> { 
                console.log('jkjkj'); 
                if(showList)
                  setShowList(false)
              }}
              onChangeText={(text) => {
                  setDeparture(text);
                  LocationCtx.setDeparture(previousState=>
                    ({...previousState, address:text}));
                }}
              value={departure}
              InputRightElement={
                <Button size="4" rounded="none" w="1/5" h="full" 
                  onPress={()=> { getSuggestedPlaces(departure) }}>Search</Button>
              } 
              />

            { showList && predictions.length > 0 &&
            <Box bgColor="cyan.100" style={{ position:'absolute', top: true ? 50 : 105, zIndex:999, width:'70%'}}>
              <VStack space={2} flexShrink={1} w="100%" fontSize="md" p="4" pb="2">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Text fontSize="lg" color="coolGray.800">
                    Suggestions
                    </Text>
                  </HStack>
                  <IconButton 
                    variant="unstyled" 
                    icon={<CloseIcon size="3" color="coolGray.600" />} 
                    onPress={()=> setPredictions([])}
                    />
                </HStack>
              </VStack>

              <FlatList data={predictions} renderItem={({
              item
              }) => 
                <Pressable onPress={() => console.log("I'm Pressed")}>
                  <Box borderBottomWidth="1" _dark={{
                    borderColor: "gray.600"
                  }} borderColor="coolGray.200" pl="4" pr="5" py="2">
                  <HStack space={3} justifyContent="space-between">
                      <VStack>
                        {/* <Text _dark={{ color: "warmGray.50" }} color="coolGray.800" bold>
                          {item.reference}
                        </Text> */}
                        <Text color="coolGray.600" _dark={{ color: "warmGray.200" }}>
                          {item.description}
                        </Text>
                      </VStack>
                      <Spacer />
                  </HStack>
                  </Box>
                </Pressable>
                  } keyExtractor={item => item.place_id} />
            </Box>}

            </Box>

            <Box alignItems="center">
             <Input type="text"
              placeholder="Destination ..."
              style={{color:'white', backgroundColor:'black'}}
              w="100%" maxW="300px" py="10px" 
              onChangeText={(text) => { 
                  setArrival(text);
                  LocationCtx.setArrival(previousState=>
                    ({...previousState, address:text}));
                }}
              value={arrival}
              InputLeftElement={
                <Icon as={<MaterialIcons name="location-pin" />} size={5} ml="2" color="muted.400" />
              }
              InputRightElement={
                <Button size="4" rounded="none" w="1/5" h="full"
                  onPress={()=> {
                    getSuggestedPlaces(arrival)
                    }}>Search</Button>
              } 
              />
            </Box>

        </VStack>
        </NativeBaseProvider>

      </View>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position:'absolute', 
    marginTop: Platform.OS === 'ios' ? 40 : 2, 
    flexDirection:"row",
    width: '100%',
    justifyContent:'center'
  },
  chipsScrollView: {
    position:'absolute', 
    top:Platform.OS === 'ios' ? 90 : 100, 
    paddingHorizontal:10
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection:"row",
    backgroundColor:'#fff', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
 
    width: 120,
    height: 120,
  },
  marker: {
    width: 50,
    height: 50,
  },
  button: {
    alignItems: 'center',
    marginTop: 5
  },
  signIn: {
      width: '100%',
      padding:5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3
  },
  textSign: {
      fontSize: 14,
      fontWeight: 'bold'
  }
});