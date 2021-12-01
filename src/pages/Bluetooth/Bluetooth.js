import React, { useEffect, useState } from 'react'
import { Alert, Button, FlatList, NativeEventEmitter, NativeModules, PermissionsAndroid, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import ToggleSwitch from 'toggle-switch-react-native'
import { utils } from '../../utils'
import {useDispatch} from 'react-redux';
import BleManager from '../../utils/BleManager'
import { setLoading } from '../../utils/redux/action/global';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Bluetooth = () => {

    const[toogle,setToogle] = useState(false)
    const[status,setStatus] = useState('Powered-Off');
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);
    const dispatch = useDispatch()


    const startScan = () => {
        if (!isScanning) {
        BleManager.scan([], 10, true).then((results) => {
            console.log('Scanning...');
            setIsScanning(true);
        }).catch(err => {
            console.error(err);
        });
        }    
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

    const enableBt = async () => {
        await BleManager.enableBluetooth()
            .then((res) => {
                // Success code
                console.log("The bluetooth is already enabled or the user confirm");
                
            })
            .catch((error) => {
                // Failure code
                console.log("The user refuse to enable bluetooth");
            });
    }

    const connectDevices = async () => {
            await BleManager.connect("36:63:1D:04:04:8A")
                .then(() => {
                    // Success code
                    console.log("Connected");
                })
                .catch((error) => {
                    // Failure code
                    console.log(error);
                    Alert.alert('Disconnect')
                });

            await BleManager.retrieveServices("36:63:1D:04:04:8A").then(
                    (peripheralInfo) => {
                        // Success code
                        console.log("Peripheral info:", peripheralInfo);
                    }
                    );
    }

        useEffect(() => {
            dispatch(setLoading(false))
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
            <Text style={styles.textDashboard}>Hold on..</Text>
            <Text style={styles.textWelcome}>Let set up the bluetooth!</Text>
            <View style={styles.status}>
                    <Text style={styles.statusText}>Status Bluetooth: {status} </Text>
                    <ToggleSwitch
                         isOn={toogle}
                            onColor="#34BE82"
                            offColor= "#393E46"
                            onToggle={async (isOn) => {
                                setToogle(isOn)
                                

                                if(isOn == true)
                                {
                                    enableBt()
                                }if(isOn == false){
                                    
                                }
                            }}
                    />

                </View>
                <Button 
                    title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                    onPress={connectDevices} 
                />
        </View>
    )
}

export default Bluetooth

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: utils.color.primary,
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    textDashboard:{
        color: utils.color.white,
        fontFamily: utils.fonts.bold,
        fontSize: 20
    },
    textWelcome:{
        color: utils.color.white,
        fontFamily: utils.fonts.regular,
        fontSize: 17
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
})
