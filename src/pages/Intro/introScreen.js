import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Ic_medical } from '../../assets/icon'
import { Gap } from '../../component'
import CustomButton from '../../component/atoms/CustomButton/CustomButton'
import CustomTextInput from '../../component/atoms/CustomTextInput/customTextInput'
import { utils } from '../../utils'
import {useDispatch} from 'react-redux';
import { setUser } from '../../utils/AsyncStoreService'
import { normalizeFont } from '../../utils/normalizeFont'
import { showMessage } from '../../utils/showMessage'
import UseForm from '../../utils/UseForm/UseForm'
import {setLoading} from '../../utils/redux/action/global';

const IntroScreen = ({navigation}) => {
    const[form,setForm] = UseForm({
        age: '',
        bmi: ''
    })

   const dispatch = useDispatch()
    const checkInput = () => {
        if(form.age == '' || form.bmi == '')
        {   
             showMessage("Data Cannot Be Empty")
            
             return false    
        }
    }

    const onSubmit = async () => {
        dispatch(setLoading(true))
         await checkInput();
         
         await setUser({
             bmi: form.bmi,
             age: form.age,
             isData: true
         })

         setTimeout(() => {
             setLoading(false)
             navigation.replace('MainApp')
         }, 2000)
    }

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Ic_medical />
                <Gap height={25} />
                <Text style={styles.title}>Medical Checkup</Text>
                <Text style={styles.desc}>fill in the check-up data below</Text>
            </View>
            <View style={{ marginTop: -50}}>
                <CustomTextInput
                    label="Age"
                    keyboardType = 'numeric'
                    placeholder="Input your age here ..."
                    value={form.age}
                    onChangeText={value => setForm('age', value)}
                />
                <Gap height={19} />
                <CustomTextInput
                    label="BMI"
                    keyboardType = 'numeric'
                    placeholder="Input your BMI here ..."
                    value={form.bmi}
                    onChangeText={value => setForm('bmi', value)}
                />
            </View>
            <View>
                <CustomButton
                    text="Continue"
                    onPress={onSubmit}
                />
            </View>
        </View>
    )
}

export default IntroScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: utils.color.primary,
        justifyContent: 'space-between'
    },
    title:{
        color: utils.color.white,
        fontFamily: utils.fonts.semibold,
        fontSize: normalizeFont(20)
    },
    desc:{
        color: utils.color.white,
        fontFamily: utils.fonts.light,
        fontSize: normalizeFont(18)
    }
})
