import React, { useEffect, useState } from 'react'
import { FlatList, PermissionsAndroid, StyleSheet, Text, View,   Platform,   NativeModules,
  NativeEventEmitter,
  ScrollView, } from 'react-native'
import { Gap } from '../../component'
import { utils } from '../../utils'
import ToggleSwitch from 'toggle-switch-react-native'
import { Ic_cerah } from '../../assets/icon'
import GetLocation from 'react-native-get-location'
import { useRequest, useRequestAPI } from '../../utils/API/httpClient'
import { showMessage } from '../../utils/showMessage'
import { normalizeFont } from '../../utils/normalizeFont'
import BleManager from '../../utils/BleManager'
import { getUser } from '../../utils/AsyncStoreService'
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'


const Dashboard = ({route}) => {


    const[toogle,setToogle] = useState(false)
    const[lat,setLat] = useState(0);
    const[long,setLong] = useState(0);
    const[temp,setTemp] = useState(0);
    const[status,setStatus] = useState('Powered-Off');
    const[data,setData] = useState({
        bmi: '',
        age: ''
    })

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const date = new Date();
    const tanggal = date.getDate()
    const bulan = monthNames[date.getMonth()]
    const tahun = date.getFullYear();
    const tanggal_akhir = `${tanggal} ${bulan} ${tahun}`

    const fetchData = async () => {
        const dataStorage = await getUser();

        setData({
            bmi: dataStorage.bmi,
            age: dataStorage.age
        })

    }

    const getLocation  =  () =>{
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
    const resultApiWeather = async () => {
        await getLocation()
        const url_endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=5b67ad92ff7aa1b6610d7a73884e9eb7&units=metric`
        const result = await useRequestAPI(url_endpoint, 'get')

        if(result.hasOwnProperty('message')){

            showMessage('Cant fetch data, please refresh')
        }else{
            setTemp(result.main.temp)
        }
    }

    useEffect(() => {
        resultApiWeather()
        fetchData()
    },[])

    return (
        <ScrollView>
        <View style={styles.container}>
            <Gap height={10} />
            <Text style={styles.textDashboard}>Dashboard</Text>
            <Text style={styles.textWelcome}>Welcome Back!</Text>
            <View style={styles.content}>
                <View style={styles.condition}>
                    <View style={{ flexDirection: 'row' }}>
                        <Ic_cerah />
                        <Text style={{ fontFamily: utils.fonts.semibold, color: utils.color.white, marginLeft: 5 }}>{temp}°C</Text>
                    </View>
                    <View>
                        <Text style={{ fontFamily: utils.fonts.semibold, color: utils.color.white, fontSize: 13 }}>{tanggal_akhir}</Text>
                    </View>

                </View>
                <Gap height={15} />
                <View style={styles.condition}>
                    <View>
                        <Text style={styles.textDashboard}>Information checkup: </Text>
                        <Gap height={10} />
                        <Text style={styles.statusInfo}>Age: {data.age}</Text>
                        <Text style={styles.statusInfo}>BMI: {data.bmi}</Text>
                    </View>
                </View>
                <Gap height={15} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View style={styles.conditionCheck}>
                        <View style={styles.contentCheck}>
                            <View>
                                <Text style={styles.textStats}>SpO2 (%)</Text>
                            </View>
                            <View>
                                <Text style={styles.angka}>70</Text>
                            </View>
                            <View>
                                <Text style={styles.statusIndicator}>Status: Normal </Text>
                            </View>
                        </View>
                        
                    </View>
                    <View style={styles.conditionCheck}>
                        <View style={styles.contentCheck}>
                            <View>
                                <Text style={styles.textStats}>HR (BPM)</Text>
                            </View>
                            <View>
                                <Text style={styles.angka}>90</Text>
                            </View>
                            <View>
                                <Text style={styles.statusIndicator}>Status: Sensitive </Text>
                            </View>
                        </View>
                    </View>       
                </View>
                <Gap height={15} />
                <View style={styles.condition}>
                    <View>
                        <Text style={styles.textDashboard}>Graph HR and Sp02: </Text>
                        <Gap height={10} />
                            <View style={{  }}>
                                <Chart
                                    style={{ height: 200, width: 350 }}
                                    data={[
                                    { x: 5, y: 15 },
                                    { x: 6, y: 6 },
                                    { x: 7, y: 15 },
                                    { x: 8, y: 3 },
                                    ]}
                                    padding={{ left: 20, bottom: 20, right: 20, top: 20 }}
                                    xDomain={{ min: 5, max: 8 }}
                                    >
                                    <VerticalAxis
                                        tickValues={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
                                        theme={{
                                        axis: { stroke: { color: '#aaa', width: 2 } },
                                        ticks: { stroke: { color: '#aaa', width: 2 } },
                                        labels: { formatter: (v: number) => v.toFixed(2) },
                                        }}
                                    />
                                    <HorizontalAxis
                                        tickCount={9}
                                        theme={{
                                        axis: { stroke: { color: '#aaa', width: 2 } },
                                        ticks: { stroke: { color: '#aaa', width: 2 } },
                                        labels: { label: { rotation: 50 }, formatter: (v) => v.toFixed(1) },
                                        }}
                                    />
                                    <Line theme={{ stroke: { color: 'red', width: 2 } }} />
                                    <Line smoothing="bezier" tension={0.15} theme={{ stroke: { color: 'blue', width: 2 } }} />
                                    </Chart>
                        </View>
                    </View>
                </View>
            </View>  
        </View>
    </ScrollView>
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
    },
    statusInfo:{
        color: 'white',
        fontSize: normalizeFont(15),
        fontFamily: utils.fonts.regular,
    },
    conditionCheck:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: utils.color.secondary,
        padding: 8,
        height: 200,
        borderRadius: 5,
        marginHorizontal: 5
    },
    contentCheck:{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between'
    },
    textStats:{
        fontSize: normalizeFont(18),
        fontFamily: utils.fonts.bold,
        color: 'white',
    },
    angka:{
        fontSize: normalizeFont(45),
        fontFamily: utils.fonts.bold,
        color: 'white', 
    },
    statusIndicator:{
        fontSize: normalizeFont(15),
        fontFamily: utils.fonts.semibold,
        color: 'white', 
    }
})
