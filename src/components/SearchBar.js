import React from 'react'
import { View, TextInput, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';




export default function SearchBar(props){
    const { screen, navigation, search } = props
    return(
      <View>
        { (screen === 'browse' || screen === 'home') ?
          <Pressable 
            onPress={()=>{
              //navigation.navigate('Search')
              search()
            }}
            style={{
              backgroundColor: screen === 'home' ? 'white' : '#F9F9F9',
              borderRadius:15,
              paddingHorizontal:10, 
              width:'100%', 
              flexDirection:'row', alignItems:'center'}}>
            <Icon 
              name="search-outline" 
              size={25} 
              color="#828282" />
            <TextInput 
              placeholder='Rechercher des produits ou des restaurants'
              style={{
                fontSize:15,
                color:'#000',
                width:'80%'
              }}
              //editable={false}             
              />
            <Icon 
              name="options-sharp" 
              size={25} 
              color="#F88C07"
              style={{
                position:'absolute',
                right:15
              }}
              />
          </Pressable>
        :

          <View style={{
            backgroundColor: screen === 'home' ? 'white' : '#F9F9F9',
            borderRadius:15,
            paddingHorizontal:10, 
            width:'100%', 
            flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Icon 
              name="search-outline" 
              size={25} 
              color="#828282" />
            <TextInput 
              placeholder='Rechercher des produits ou des restaurants'
              style={{
                fontSize:15,
                color:'#000',
                width:'80%'
              }}
              onSubmitEditing={()=>{
                navigation.navigate('Results')
              }}
              />
            <Pressable 
              style={{justifyContent:'flex-end'}}
              onPress={()=>{
                navigation.navigate('Filters')
              }}>
            <Icon 
              name="options-sharp" 
              size={25} 
              color="#F88C07"
              />
            </Pressable>
          </View>
    
        }

      </View>
    )
}