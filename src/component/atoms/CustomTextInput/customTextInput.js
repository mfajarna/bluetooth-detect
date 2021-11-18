import React from 'react'
import { StyleSheet, Text, View, TextInput as TextInputRN } from 'react-native'
import { utils } from '../../../utils'
import { normalizeFont } from '../../../utils/normalizeFont'

const CustomTextInput = ({label, placeholder, ...restProps}) => {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TextInputRN
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={utils.color.white}
                {...restProps}
            ></TextInputRN>
        </View>
    )
}

export default CustomTextInput

const styles = StyleSheet.create({
    label:{
        fontFamily: utils.fonts.semibold,
        fontSize: normalizeFont(15),
        marginBottom: 12,
        color: utils.color.white
    },
    input:{
        backgroundColor: utils.color.secondary,
        borderRadius: 8,
        padding: 7,
        color: utils.color.white,
        fontFamily: utils.fonts.regular
    }
})
