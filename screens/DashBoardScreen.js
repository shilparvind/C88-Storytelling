import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { Drawer } from 'react-native-paper';
import DrawerNavigator from '../navigation/Drawer';

export default class DashboardScreen extends React.Component{
  render(){
    return(
      <NavigationContainer>
        <DrawerNavigator></DrawerNavigator>
      </NavigationContainer>
    )
  }

}