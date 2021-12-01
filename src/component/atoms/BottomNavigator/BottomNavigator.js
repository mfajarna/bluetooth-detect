import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ic_bt_off, Ic_bt_on, Ic_home_off, Ic_home_on } from '../../../assets/icon';


const Icon = ({label, focus}) => {
  switch (label) {
    case 'Bluetooth':
      return focus ? <Ic_bt_on /> : <Ic_bt_off />;
    case 'Dashboard':
      return focus ? <Ic_home_on /> : <Ic_home_off />;
    default:
      return <Ic_bt_on />;
  }
};


const BottomNavigator = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.bottomNav}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}>
            <Icon label={label} focus={isFocused} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavigator

const styles = StyleSheet.create({
    bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#dbd8e3',
    paddingVertical: 10,
    paddingHorizontal: 90,
    justifyContent: 'space-between',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 18,
  },
})
