import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import localDB from '../database/AsyncStorage'
import { AppContext } from '../context/AppContext' 

const data = [
  {
    title: 'Découvrez des lieux près de chez vous',
    subtitle: 'Entrez votre adresse et laissez-nous le reste',
    image: require('../assets/1.png'),
    bg: '#088387',
  },
  {
    title: 'Commandez votre favori',
    subtitle: 'Lorsque vous commandez, nous traitons la commande pour vous et la livrons à votre porte',
    image: require('../assets/2.png'),
    bg: '#088387',
  },
  {
    title: 'Livraison la plus rapide',
    subtitle: 'Commencer dès maintenant !',
    image: require('../assets/3.png'),
    bg: '#088387',
  },
];


const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0, // Add padding to offset large buttons and pagination in bottom of page
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginTop: 32,
  },
  title: {
    marginTop:30,
    fontSize: 24,
    color: 'white',
    fontFamily:'Ubuntu-Regular',
    textAlign: 'center',
  },
  subtitle: {
    marginVertical:30,
    fontSize: 16,
    color: 'white',
    fontFamily:'Ubuntu-Regular',
    textAlign: 'center',
  },
});

export default function Intro (props) {

    const context = useContext(AppContext);

    const _renderItem = ({item}) => {
        return (
        <View
            style={{
            flex: 1,
            backgroundColor: item.bg,
            }}>
            <SafeAreaView style={styles.slide}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
            </SafeAreaView>
        </View>
        );
    };

    const _keyExtractor = (item) => item.title;

 
    return (
        <View style={{flex: 1}}>
            <StatusBar translucent backgroundColor="transparent" />
            <AppIntroSlider
                keyExtractor={_keyExtractor}
                renderItem={_renderItem}
                nextLabel='Suivant'
                prevLabel='Précedent'
                skipLabel='Sauter'
                doneLabel='Commencer'
                showSkipButton
                showPrevButton
                onDone={ async () => {
                    await localDB.setValue('onDone', 'defined');
                    //props.onDone()
                    context.setIntro(false)
                }}
                data={data}
            />
        </View>
    );
   
}
  