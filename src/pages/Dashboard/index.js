import React, { useEffect, useState } from 'react'
import { FlatList, PermissionsAndroid, StyleSheet, Text, View } from 'react-native'
import { Gap } from '../../component'
import { utils } from '../../utils'
import ToggleSwitch from 'toggle-switch-react-native'
import { Ic_cerah } from '../../assets/icon'
import GetLocation from 'react-native-get-location'
import { useRequest, useRequestAPI } from '../../utils/API/httpClient'
import { showMessage } from '../../utils/showMessage'
import { normalizeFont } from '../../utils/normalizeFont'
import { BleManager } from 'react-native-ble-plx'

export const manager = new BleManager()

const requestPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: "Request for Location Permission",
      message: "Bluetooth Scanner requires access to Fine Location Permission",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK"
    }
  );
  return (granted === PermissionsAndroid.RESULTS.GRANTED);
}

const Dashboard = ({route}) => {

    // Bluetooth state
    const [logData, setLogData] = useState([]);
    const [logCount, setLogCount] = useState(0);
    const [scannedDevices, setScannedDevices] = useState({});
    const [deviceCount, setDeviceCount] = useState(0);

    const[toogle,setToogle] = useState(false)
    const dataInput = route.params
    const[lat,setLat] = useState(0);
    const[long,setLong] = useState(0);
    const[temp,setTemp] = useState(0);
    const[status,setStatus] = useState('Powered-Off');

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const date = new Date();
    const tanggal = date.getDate()
    const bulan = monthNames[date.getMonth()]
    const tahun = date.getFullYear();
    const tanggal_akhir = `${tanggal} ${bulan} ${tahun}`

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

        manager.onStateChange((state) => {
        const subscription = manager.onStateChange(async (state) => {
            console.log(state);
            const newLogData = logData;
            newLogData.push(state);
            await setLogCount(newLogData.length);
            await setLogData(newLogData);
            subscription.remove();
        }, true);
        return () => subscription.remove();
        });
    },[manager])

    return (
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
                <View style={styles.status}>
                    <Text style={styles.statusText}>Status Bluetooth: {status}</Text>
                    <ToggleSwitch
                         isOn={toogle}
                            onColor="#34BE82"
                            offColor= "#393E46"
                            onToggle={async (isOn) => {
                                setToogle(isOn)
                                const btState = await manager.state(); 

                                if(btState === 'Unsupported')
                                {
                                    showMessage('Bluetooth is not supported')
                                    setToogle(false)
                                    return false
                                }

                                if(btState !=="PoweredOn")
                                {
                                    await manager.enable()
                                }else{
                                    await manager.disable()
                                     setToogle(false)
                                }

                                const permission = await requestPermission();
                                 if (permission) {
                                        manager.startDeviceScan(null, null, async (error, device) => {
                                            // error handling
                                            if (error) {
                                                console.log(error);
                                                return
                                            }
                                            // found a bluetooth device
                                            if (device) {
                                                console.log(`${device.name} (${device.id})}`);
                                                const newScannedDevices = scannedDevices;
                                                newScannedDevices[device.id] = device;
                                                await setDeviceCount(Object.keys(newScannedDevices).length);
                                                await setScannedDevices(scannedDevices);
                                            }
                                        });
                                        }
        
                                return true
                            }}
                    />
                </View>
                <Gap height={15} />
                <View style={styles.condition}>
                    <View>
                        <Text style={styles.textDashboard}>Information checkup: </Text>
                        <Gap height={10} />
                        <Text style={styles.statusInfo}>Age: {dataInput.age}</Text>
                        <Text style={styles.statusInfo}>BMI: {dataInput.bmi}</Text>
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
                <View>
                        <Text style={styles.statusIndicator}>Scanned Devices</Text>
                        {/* <FlatList
                            data={Object.values(scannedDevices)}
                            renderItem={({item}) => {
                                return (
                                    <Text>{`${item.name} (${item.id})`}</Text>
                                    )
                            }}
                        /> */}
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
