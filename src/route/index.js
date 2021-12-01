import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dashboard, SplashScreen } from "../pages";
import IntroScreen from "../pages/Intro/introScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomNavigator from "../component/atoms/BottomNavigator/BottomNavigator";
import Bluetooth from "../pages/Bluetooth/Bluetooth";

const stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = ({route}) => {
    return(
        <Tab.Navigator tabBar={props => <BottomNavigator {...props}/>} >
            <Tab.Screen 
                options={{headerShown: false}} 
                name="Bluetooth" 
                component={Bluetooth} />
            <Tab.Screen 
                options={{headerShown: false}} 
                name="Dashboard" 
                component={Dashboard} />
        </Tab.Navigator>
        )

}
const Route = () => {
    return (
        <stack.Navigator>
            <stack.Screen 
                name = "SplashScreen"
                component = {SplashScreen}
                options={{ headerShown: false }}
            />
            <stack.Screen 
                name = "Dashboard"
                component = {Dashboard}
                options={{ headerShown: false }}
            />
            <stack.Screen 
                name = "IntroScreen"
                component = {IntroScreen}
                options={{ headerShown: false }}
            />
            <stack.Screen
                name="MainApp"
                component={MainApp}
                options={{headerShown: false}}
            />
            <stack.Screen
                name="Bluetooth"
                component={Bluetooth}
                options={{headerShown: false}}
            />
        </stack.Navigator>
    )
}

export default Route


