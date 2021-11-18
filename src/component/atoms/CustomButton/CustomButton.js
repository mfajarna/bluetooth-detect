import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { utils } from '../../../utils'
import { normalizeFont } from '../../../utils/normalizeFont'

const CustomButton = ({color= utils.color.secondary, text, onPress, textColor = utils.color.white}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container(color)}>
                <Text style={styles.text(textColor)}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    container: color => ({
        backgroundColor: color,
        padding: 10,
        borderRadius: 10,
  }),
    text: textColor  => ({
        fontSize: normalizeFont(17),
        fontFamily: utils.fonts.medium,
        color: textColor,
        textAlign: 'center',
  }),
})
