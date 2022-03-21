import AsyncStorage from '@react-native-async-storage/async-storage';

const localDB = {
    getValue: async (key) => {
        try {
          const value = await AsyncStorage.getItem('@'+key)
          return value;
        } catch(e) {
          // read error
        }
      },

    setValue: async (key, value) => {
        try {
          await AsyncStorage.setItem('@'+key, value)
        } catch(e) {
          // save error
        }        
      },

    removeValue: async (key) => {
        try {
          await AsyncStorage.removeItem('@'+key)
        } catch(e) {
          // remove error
        }
      },
}

export default localDB