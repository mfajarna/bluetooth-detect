import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@user_information';
const DEFAULT_USER = {
  bmi: '',
  age: '',
  isData: false,
};

/**
 * Get User store as object
 * @returns {}|null
 */
const getUser = async () => {
  const user = await AsyncStorage.getItem(STORAGE_KEY);
  return user !== null ? JSON.parse(user) : DEFAULT_USER;
};

/**
 * Set User store as JSON string from given object
 * @param {object} user
 * @returns object
 */
const setUser = async (user) => {
  const oldUser = await getUser();
  const newUser = {
    ...oldUser,
    ...user,
    isData: true,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
};

/**
 * Remove and reset user entity
 * @returns object
 */
const deleteUser = async () => {
  const resetUser = DEFAULT_USER;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resetUser));
  return resetUser;
};

export {getUser, setUser, deleteUser};