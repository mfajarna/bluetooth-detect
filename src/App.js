import React from 'react'
import { LogBox } from 'react-native';
import {useSelector} from 'react-redux';
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import Route from './route';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import store from './utils/redux/store';
import Loading from './component/atoms/Loading/Loading';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const MainApp = () => {
  const {isLoading} = useSelector(state => state.globalReducer);
  
  return(
    <NavigationContainer>
        <Route />
        <FlashMessage position="top" />
        {isLoading && <Loading />}
    </NavigationContainer>
  )
}


const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
    
  )
}

export default App

const styles = StyleSheet.create({})
