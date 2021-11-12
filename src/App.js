import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import Route from './route';


const MainApp = () => {
  return(
    <NavigationContainer>
        <Route />
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
