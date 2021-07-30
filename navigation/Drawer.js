import React from "react";
import BottomNavigator from "./TabNavigator";
import ProfileScreen from "../screens/Profile";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigator from "./stackNavigator";
import LogoutScreen from "../screens/logout";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={StackNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="LogOut" component={LogoutScreen} />  
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
