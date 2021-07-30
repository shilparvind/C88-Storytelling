import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavigator from "./navigation/TabNavigator";
import DrawerNavigator from "./navigation/Drawer";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import firebase from "firebase";
import { firebaseConfig } from "./config";
import LoadingScreen from "./screens/LoadingScreen";
import DashboardScreen from "./screens/DashBoardScreen";
import LoginScreen from "./screens/LoginScreen";


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default function App() {
  return <AppNavigator />;
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
