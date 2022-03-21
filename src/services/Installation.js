import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import localDB from '../database/AsyncStorage'

export default function (pushToken, userId) {
  console.log('\n\n ====================>')
  console.log(DeviceInfo.getUniqueId());
  console.log('====================> \n\n')

  const data = {
    channels: [],
    appIdentifier: DeviceInfo.getBundleId(),
    appName: DeviceInfo.getApplicationName(),
    appVersion: DeviceInfo.getVersion(),
    deviceToken: pushToken,
    userId: userId || null,
    deviceType: Platform.OS,
    installationId: DeviceInfo.getUniqueId(),
    GCMSenderId: '382370935924',
    //localeIdentifier: DeviceInfo.getDeviceLocale(),
    parseVersion: '3.3.0',
    //timeZone: DeviceInfo.tim .getTimezone(),
    pushType: Platform.OS === 'android' ? 'gcm' : undefined
  };

  return fetch('https://parseapi.back4app.com/parse/installations', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'X-Parse-Application-Id': 'VbTosKh76ZPhaR0D8odlMPd5PUdR2xn9DlqgI34v',
        'X-Parse-REST-API-Key': 'uXu3Tp5chQFuHYCMXKK0jmVBqk0U6EgoIAmoMpmI',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => {
      if (!response.ok) {
        throw response
      }
      return response.json()
    })
    .then((response) => {

      console.log(response)

      if(response.objectId){
        console.log('Parse Installation registered successfully with objectId=%s', response.objectId)
        localDB.setValue('installationId', response.objectId) 
        return response.objectId
      }

    })
    .catch((err) => console.log(err))
};