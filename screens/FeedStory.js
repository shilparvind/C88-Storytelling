import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  SafeAreaView,
} from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { RFValue } from "react-native-responsive-fontsize";
import { FlatList } from "react-native-gesture-handler";
import Storycard from "./Storycard";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

//let stories = require("./TempStories.json");

export default class DisplayScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      lightTheme: true,
      stories: [],
    };
  }

  loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    this.setState({
      fontsLoaded: true,
    });
  };

  fetchUser = async () => {
    let theme;
    var refLoc = await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid);
    refLoc.on("value", (data) => {
      theme = data.val().current_theme;
      this.setState({
        lightTheme: theme === "light" ? true : false,
      });
    });
  };

  fetchStories = () => {
    let keyStory;

    firebase
      .database()
      .ref("/posts/")
      .on(
        "value",
        (snapshot) => {
          let stories = [];
          if (snapshot.val()) {
            keyStory = Object.keys(snapshot.val());
            console.log("keyStory", keyStory);
            keyStory.forEach((key) => {
              stories.push({
                key: key,
                value: snapshot.val()[key],
              });
            });
            // Object.keys(snapshot.val()).forEach((key) => {
            //   stories.push({
            //     key: key,
            //     value: snapshot.val()[key],
            //   });
            // });
          }
          this.setState({
            stories: stories,
          });
          this.props.setUpdateToFalse();
        },
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }
      );
  };

  componentDidMount() {
    this.loadFontsAsync();
    this.fetchUser();
    this.fetchStories();
    //console.log(this.state.stories);
  }

  keyExtractor = (item, index) => {
    index.toString();
  };

  renderItem = ({ item: story }) => {
    return <Storycard story={story} navigation={this.props.navigation} />;
  };

  render() {
    // console.log(this.state.stories);
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.lightTheme
              ? { flex: 1, backgrounfColor: "white" }
              : { flex: 1, backgroundColor: "#15193c" }
          }
        >
          <SafeAreaView style={styles.androidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.titleTextLight
                    : styles.titleText
                }
              >
                StoryTelling App
              </Text>
            </View>
          </View>
          {this.state.stories.length === 0 ? (
            <View
              style={{
                flex: 0.85,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={
                  this.state.lightTheme
                    ? styles.noStoriesTextLight
                    : styles.noStoriesText
                }
              >
                No Stories Available
              </Text>
            </View>
          ) : (
            <View style={{ flex: 0.85 }}>
              <FlatList
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                data={this.state.stories}
              />
            </View>
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  androidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.5,
  },
  titleText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(28),
    color: "white",
  },
  titleTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(28),
    color: "black",
  },
  flatListContainer: {
    flex: 0.85,
  },
  noStoriesTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(35),
    color: "black",
  },
  noStoriesText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(35),
    color: "white",
  },
});
