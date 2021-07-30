import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  Switch,
} from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";
import { isEnabled } from "react-native/Libraries/Performance/Systrace";

var customFont = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

//var bgImg = loadImage("abc.png")

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      lightTheme: true,
      isEnabled: false,
      name: "",
      profileImage: "",
      themeColor: "",
    };
  }

  loadFontAsync = async () => {
    await Font.loadAsync(customFont);
    this.setState({
      fontsLoaded: true,
    });
  };

  fetchUser = async () => {
    let name, profileImage, theme;
    let refLoc = await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid);
    refLoc.on("value", (data) => {
      name = `${data.val().first_name} ${data.val().last_name}`;
      // console.log("name", name);
      profileImage = data.val().profile_picture;
      theme = data.val().current_theme;
    });
    this.setState({
      profileImage: profileImage,
      name: name,
      lightTheme: theme === "light" ? true : false,
      isEnabled: theme === "light" ? false : true,
    });
  };

  toggleSwitch() {
    const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? "dark" : "light";
    var updates = {};
    updates["/users/" + firebase.auth().currentUser.uid + "/current_theme"] =
      theme;
    firebase.database().ref().update(updates);
    this.setState({ isEnabled: !previous_state, lightTheme: previous_state });
  }

  componentDidMount() {
    this.loadFontAsync();
    this.fetchUser();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.lightTheme
              ? { flex: 1, backgroundColor: "white" }
              : { flex: 1, backgroundColor: "#15193c" }
          }
        >
          <SafeAreaView style={styles.androidSafeArea} />
          <View style={styles.titleStyle}>
            <View style={styles.logoImageView}>
              <Image
                style={styles.logoImage}
                source={require("../assets/logo.png")}
              />
            </View>
            <View style={styles.titleTextView}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.titleTextLight
                    : styles.titleText
                }
              >
                Story Telling App
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.85 }}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: this.state.profileImage }}
                style={styles.profileImage}
              />
              <Text
                style={
                  this.state.lightTheme ? styles.nameTextLight : styles.nameText
                }
              >
                {this.state.name}
              </Text>
            </View>
            <View style={styles.themeContainer}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.themeTextLight
                    : styles.themeText
                }
              >
                Dark Theme
              </Text>
              <Switch
                style={{
                  transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                }}
                trackColor={{ false: "#767577", true: "white" }}
                thumbColor={this.state.isEnabled ? "orange" : "purple"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  this.toggleSwitch();
                }}
                value={this.state.isEnabled}
              />
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  androidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  titleStyle: {
    flexDirection: "row",

    flex: 0.07,
  },
  titleTextView: {
    flex: 0.7,

    justifyContent: "center",
  },

  titleText: {
    fontSize: RFValue(35),
    fontFamily: "Bubblegum-Sans",
    color: "white",
  },
  titleTextLight: {
    fontSize: RFValue(35),
    fontFamily: "Bubblegum-Sans",
    color: "black",
  },
  logoImageView: {
    justifyContent: "center",
    flex: 0.3,
  },
  logoImage: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(100),
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.5,
  },
  nameText: {
    fontSize: RFValue(35),
    fontFamily: "Bubblegum-Sans",
    color: "white",
    marginTop: RFValue(12),
  },
  nameTextLight: {
    fontSize: RFValue(35),
    fontFamily: "Bubblegum-Sans",
    color: "black",
    marginTop: RFValue(12),
  },
  themeContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  themeText: {
    fontFamily: "Bubblegum-Sans",
    color: "white",
    fontSize: RFValue(25),
  },
  themeTextLight: {
    fontFamily: "Bubblegum-Sans",
    color: "black",
    fontSize: RFValue(25),
  },
});
