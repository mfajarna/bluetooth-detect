import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Ic_logo } from '../../assets/icon'
import { Gap } from '../../component'
import { utils } from '../../utils'

const SpashScreen = ({navigation}) => {

    
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('IntroScreen');
        }, 2000)
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Ic_logo />
                <Gap height={16} />
                <Text style={styles.title}>Pulse Oximetri</Text>
            </View>
        </View>
    )
}

export default SpashScreen

const styles = StyleSheet.create({
    container:{
        backgroundColor : utils.color.primary,
        flex: 1,
    },
    wrapper:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    title:{
        color: utils.color.white,
        fontFamily: utils.fonts.bold,
        fontSize: 19
    }
})
