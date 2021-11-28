import React, { useEffect, useState } from 'react'
import { FlatList, PermissionsAndroid, StyleSheet, Text, View,   Platform,   NativeModules,
  NativeEventEmitter, } from 'react-native'
import { Gap } from '../../component'
import { utils } from '../../utils'
import ToggleSwitch from 'toggle-switch-react-native'
import { Ic_cerah } from '../../assets/icon'
import GetLocation from 'react-native-get-location'
import { useRequest, useRequestAPI } from '../../utils/API/httpClient'
import { showMessage } from '../../utils/showMessage'
import { normalizeFont } from '../../utils/normalizeFont'
import BleManager from '../../utils/BleManager'

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Dashboard = ({route}) => {


    const[toogle,setToogle] = useState(false)
    const dataInput = route.params
    const[lat,setLat] = useState(0);
    const[long,setLong] = useState(0);
    const[temp,setTemp] = useState(0);
    const[status,setStatus] = useState('Powered-Off');

    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const date = new Date();
    const tanggal = date.getDate()
    const bulan = monthNames[date.getMonth()]
    const tahun = date.getFullYear();
    const tanggal_akhir = `${tanggal} ${bulan} ${tahun}`

    const startScan = () => {
        if (!isScanning) {
        BleManager.scan([], 3, true).then((results) => {
            console.log('Scanning...');
            setIsScanning(true);
        }).catch(err => {
            console.error(err);
        });
        }    
    }

    const enableBt = () => {
        BleManager.enableBluetooth();
    }

    const disableBt = () => {
        BleManager.disableBluetooth();
    }

    const handleDisconnectedPeripheral = (data) => {
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
        }
        console.log('Disconnected from ' + data.peripheral);
  }

  const handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  }

  const handleDiscoverPeripheral = (peripheral) => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  }

    const testPeripheral = (peripheral) => {
    if (peripheral){
      if (peripheral.connected){
        BleManager.disconnect(peripheral.id);
      }else{
        BleManager.connect(peripheral.id).then(() => {
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            setList(Array.from(peripherals.values()));
          }
          console.log('Connected to ' + peripheral.id);


          setTimeout(() => {

            /* Test read current RSSI value */
            BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
              console.log('Retrieved peripheral services', peripheralData);

              BleManager.readRSSI(peripheral.id).then((rssi) => {
                console.log('Retrieved actual RSSI value', rssi);
                let p = peripherals.get(peripheral.id);
                if (p) {
                  p.rssi = rssi;
                  peripherals.set(peripheral.id, p);
                  setList(Array.from(peripherals.values()));
                }                
              });                                          
            });

          }, 900);
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
    }

  }

    const handleStopScan = () => {
        console.log('Scan is stopped');
        setIsScanning(false);
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
        BleManager.start({showAlert: false});
            bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );


        if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
                console.log("Permission is OK");
            } else {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    console.log("User accept");
                } else {
                    console.log("User refuse");
                }
                });
            }
        });
        }  


        
         return (() => {
      console.log('unmount');
      bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan );
      bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
      bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
    })

    },[])

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
                                console.log(isOn)

                                if(isOn == true)
                                {
                                    enableBt()
                                }if(isOn == false){
                                    disableBt()
                                }
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
