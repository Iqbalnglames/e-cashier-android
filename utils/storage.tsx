import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async(key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error('save error', e)
    }
}

export const getData = async(key: string) => {
    try {
        const json = await AsyncStorage.getItem(key)
        return json != null ? JSON.parse : null
    } catch (e) {
        console.error('Get Error', e)
        return null
    }
}

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Remove error', e);
  }
};