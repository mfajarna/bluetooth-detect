import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dashboard, SplashScreen } from "../pages";
import IntroScreen from "../pages/Intro/introScreen";

const stack = createNativeStackNavigator();

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
        </stack.Navigator>
    )
}

export default Route


