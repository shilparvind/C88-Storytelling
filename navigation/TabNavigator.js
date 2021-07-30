import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import CreateStoryScreen from "../screens/CreateStory";
import DisplayScreen from "../screens/FeedStory";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";

const Tab = createMaterialBottomTabNavigator();

export default class BottomNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lightTheme: true,
      isUpdated: false,
    };
  }

  changeUpdated = () => {
    this.setState({
      isUpdated: true,
    });
  };

  removeUpdated = () => {
    this.setState({
      isUpdated: false,
    });
  };
  renderFeed = props => {
    console.log("Going to display screen");
    return <DisplayScreen setUpdateToFalse={this.removeUpdated} {...props} />;
  };

  renderStory = props => {
    console.log("Going to create screen");
    return (
      <CreateStoryScreen setUpdateToTrue={this.changeUpdated} {...props} />
    );
  }

  componentDidMount() {
    console.log("Tab Navi");
    let theme;
    var refLoc = firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid);
    refLoc.on("value", (data) => {
      theme = data.val().current_theme;
      //alert(theme);
      console.log("Theme in tabNav", theme);
      this.setState({
        lightTheme: theme === "light" ? true : false,
      });
    });
  }

  render() {
    return (
      <Tab.Navigator
        labeled={false}
        barStyle={
          this.state.lightTheme
            ? styles.bottomTabStyleLight
            : styles.bottomTabStyle
        }
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "DisplayStories") {
              iconName = focused ? "book" : "book-outline";
            } else if (route.name === "CreateStory") {
              iconName = focused ? "create" : "create-outline";
            }
            return (
              <Ionicons
                name={iconName}
                size={RFValue(25)}
                color={color}
                style={styles.iconStyle}
              />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: "maroon",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="DisplayStories" component={this.renderFeed} options={{unmountOnBlue: true}} /> 
        <Tab.Screen name="CreateStory" component={this.renderStory} options={{unmountOnBlue: true}}  />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  bottomTabStyle: {
    height: "8%",
    backgroundColor: "#2f345d",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute",
  },
  bottomTabStyleLight: {
    height: "8%",
    backgroundColor: "#eaeaea",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute",
  },
  iconStyle: {
    width: RFValue(30),
    height: RFValue(30),
  },
});
