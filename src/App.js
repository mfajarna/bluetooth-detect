import React from 'react'
import { LogBox } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import Route from './route';
import FlashMessage from 'react-native-flash-message';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const MainApp = () => {
  return(
    <NavigationContainer>
        <Route />
        <FlashMessage position="top" />
    </NavigationContainer>
  )
}


const App = () => {
  return (
    <MainApp />
  )
}

export default App

const styles = StyleSheet.create({})
