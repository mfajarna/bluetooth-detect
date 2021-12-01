import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AnimatedLoader from "react-native-animated-loader";

const loading = () => {
    return (
    <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0.75)"
        source={require("./loader.json")}
        animationStyle={styles.lottie}
        speed={1}
      >
      </AnimatedLoader>
    )
}

export default loading

const styles = StyleSheet.create({
  lottie: {
    width: 350,
    height: 350,
  }
});