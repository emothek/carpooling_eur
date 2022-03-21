// BACK4APP Parse settings 
import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
//import AsyncStorage from '@react-native-community/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';


//Initializing the SDK. 
Parse.setAsyncStorage(AsyncStorage);
//You need to copy BOTH the the Application ID and the Javascript Key from: Dashboard->App Settings->Security & Keys 
Parse.initialize('Zh0FtA0oVZgbZFjT2aWFREKp7MHqrYuW3nYKHSGx','oxWms2BZvVbsTNALpNOLkoJ2c2Dv6MZyKQa4LNyD','oGyrkJWtSuaca4wheXtOyGJmn0WdaIHWYdlkERMi');
Parse.serverURL = 'https://parseapi.back4app.com/';


// GoogleSignIn initial configuration
// iosClientId is required for iOS platform development and
// webCLientId for Android. Use only what is suitable to you
GoogleSignin.configure({
    webClientId:
        '382370935924-pgu5n1r5eivvg1vm8ct2r30euv6lrk3q.apps.googleusercontent.com',

        // client secret : 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
});
