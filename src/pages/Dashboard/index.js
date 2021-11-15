import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Gap } from '../../component'
import { utils } from '../../utils'
import ToggleSwitch from 'toggle-switch-react-native'
import { Ic_cerah } from '../../assets/icon'
import GetLocation from 'react-native-get-location'
import axios  from 'axios'

const Dashboard = () => {

    const[lat,setLat] = useState(0);
    const[long,setLong] = useState(0);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];


    const getLocation = () =>{
        GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            })
            .then(location => {
                setLat(location.latitude)
                setLong(location.longitude)
            
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }

    

    useEffect(() => {
        getLocation();

                    axios.get(`api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=5b67ad92ff7aa1b6610d7a73884e9eb7&units=metric`)
                        .then(res => {
                            console.log(res)
                        }).catch(err => {
                            console.log(err.messages)
                        })
    },[])




                        

    console.log(lat,long)

    
    const[status,setStatus] = useState('not-connected')
    const date = new Date();
    
    const tanggal = date.getDate()
    const bulan = monthNames[date.getMonth()]
    const tahun = date.getFullYear();

    const tanggal_akhir = `${tanggal} ${bulan} ${tahun}`

    return (
        <View style={styles.container}>
            <Gap height={10} />
            <Text style={styles.textDashboard}>Dashboard</Text>
            <Text style={styles.textWelcome}>Welcome Back!</Text>

            <View style={styles.content}>
                <View style={styles.condition}>
                    <View style={{ flexDirection: 'row' }}>
                        <Ic_cerah />
                        <Text style={{ fontFamily: utils.fonts.semibold, color: utils.color.white, marginLeft: 5 }}>23°C</Text>
                    </View>
                    <View>
                        <Text style={{ fontFamily: utils.fonts.semibold, color: utils.color.white, fontSize: 13 }}>{tanggal_akhir}</Text>
                    </View>

                </View>
                <View style={styles.status}>
                    <Text style={styles.statusText}>Status Devices: {status}</Text>
                    <ToggleSwitch
                         isOn={false}
                            onColor="green"
                            offColor= "#393E46"
                            onToggle={isOn => console.log("changed to : ", isOn)}
                    />
                </View>
            </View>
        </View>
    )
}

export default Dashboard

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: utils.color.primary,
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    textDashboard:{
        color: utils.color.white,
        fontFamily: utils.fonts.regular,
        fontSize: 17
    },
    textWelcome:{
        color: utils.color.white,
        fontFamily: utils.fonts.bold,
        fontSize: 20
    },
    content:{
        marginTop: 18,
        flex:1,
    },
    status:{
        marginTop: 15,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    statusText:{
        color: 'white',
        fontSize: 14
    },
    condition:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: utils.color.secondary,
        padding: 8,
        borderRadius: 5
    }
})
