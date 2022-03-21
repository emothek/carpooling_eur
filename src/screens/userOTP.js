import React, {useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native';
import Parse from 'parse/react-native';
import {useNavigation} from '@react-navigation/native';

const UserOTP = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState('');
  const [userToken, setUserToken] = useState('');
  const [tokenRequested, setTokenRequested] = useState(false);

  const requestOTP = async function () {
    // Note that this values come from state variables that we've declared before
    const userDataValue = userData;
    // Check if value is an email if it contains @. Note that in a real
    // app you need a much better validator for this field
    const verificationType =
      userDataValue.includes('@') === true ? 'email' : 'sms';
    // We need to call it using await
    try {
      await Parse.Cloud.run('requestOTP', {
        userData: userDataValue,
        verificationType: verificationType,
      });
      // Show token input field
      setTokenRequested(true);
      Alert.alert('Success!', `Token requested via ${verificationType}!`);
      return true;
    } catch (error) {
      Alert.alert('Error!', error.message);
      return false;
    }
  };

  const verifyOTP = async function () {
    // Note that this values come from state variables that we've declared before
    const userDataValue = userData;
    const userTokenValue = userToken;
    // Check if value is an email if it contains @. Note that in a real
    // app you need a much better validator for this field
    const verificationType =
      userDataValue.includes('@') === true ? 'email' : 'sms';
    // We need the installation id to allow cloud code to create
    // a new session and login user without password
    const parseInstallationId = await Parse._getInstallationId();
    // We need to call it using await
    try {
      // Verify OTP, if successful, returns a sessionId
      let response = await Parse.Cloud.run('verifyOTP', {
        userData: userDataValue,
        verificationType: verificationType,
        userToken: userTokenValue,
        parseInstallationId: parseInstallationId,
      });
      if (response.sessionId !== undefined) {
        // Use generated sessionId to become a user,
        // logging in without needing to inform password and username
        await Parse.User.become(response.sessionId);
        const loggedInUser= await Parse.User.currentAsync();
        Alert.alert(
          'Success!',
          `User ${loggedInUser.get('username')} has successfully signed in!`,
        );
        // Navigation.navigate takes the user to the home screen
        navigation.navigate('BottomNavigator');
        return true;
      } else {
        throw response;
      }
    } catch (error) {
      Alert.alert('Error!', error.message);
      return false;
    }
  };

  return (
    <View style={Styles.login_wrapper}>
      {tokenRequested === false ? (
        <View style={Styles.form}>
          <TextInput
            style={Styles.form_input}
            value={userData}
            placeholder={'Email or mobile phone number'}
            onChangeText={(text) => setUserData(text)}
            autoCapitalize={'none'}
            keyboardType={'email-address'}
          />
          <TouchableOpacity onPress={() => requestOTP()}>
            <View style={Styles.button}>
              <Text style={Styles.button_label}>{'Request OTP'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={Styles.form}>
          <Text>{'Inform the received token to proceed'}</Text>
          <TextInput
            style={Styles.form_input}
            value={userToken}
            placeholder={'Token (6 digits)'}
            onChangeText={(text) => setUserToken(text)}
            autoCapitalize={'none'}
            keyboardType={'default'}
          />
          <TouchableOpacity onPress={() => verifyOTP()}>
            <View style={Styles.button}>
              <Text style={Styles.button_label}>{'Verify'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => requestOTP()}>
            <View style={Styles.button}>
              <Text style={Styles.button_label}>{'Resend token'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Styles = StyleSheet.create({
  login_container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  login_header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 50,
    backgroundColor: '#208AEC',
  },
  login_header_logo: {
    width: 220,
    resizeMode: 'contain',
  },
  login_header_text: {
    marginTop: 15,
    color: '#f0f0f0',
    fontSize: 16,
  },
  login_header_text_bold: {
    color: '#fff',
    fontWeight: 'bold',
  },
  login_wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    marginTop: -10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 280,
  },
  form_input: {
    height: 44,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#EDF0F7',
    borderRadius: 50,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    backgroundColor: '#0065A4',
    borderRadius: 50,
  },
  button_label: {
    color: '#fff',
    fontSize: 15,
  },
  login_social: {
    width: '100%',
    maxWidth: 280,
    marginTop: 20,
  },
  login_social_separator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  login_social_separator_line: {
    flex: 1,
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  login_social_separator_text: {
    marginHorizontal: 10,
    color: '#808080',
    fontSize: 16,
  },
  login_social_buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  login_social_button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 60,
  },
  login_social_icon: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  login_social_facebook: {
    backgroundColor: '#4267B2',
    borderColor: '#4267B2',
  },
  login_footer_text: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#808080',
    fontSize: 15,
  },
  login_footer_link: {
    color: '#208AEC',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default UserOTP