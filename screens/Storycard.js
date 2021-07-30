import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

export default class Storycard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      lightTheme: true,
      storyId: this.props.story.key,
      storyData: this.props.story.value,
    };
  }

  loadFontsAync = async () => {
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

  componentDidMount() {
    this.loadFontsAync();
    this.fetchUser();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      images ={
        image1: require("../assets/story_image_1.png"),
        image2: require("../assets/story_image_2.png"),
        image3: require("../assets/story_image_3.png"),
        image4: require("../assets/story_image_4.png"),
        image5: require("../assets/story_image_5.png"),
      }
      return (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            this.props.navigation.navigate("ReadStories", {
              story: this.state.storyData,
            });
          }}
        >
          <View
            style={
              this.state.lightTheme
                ? styles.cardContainerLight
                : styles.cardContainer
            }
          >
            <Image
              source={images[this.state.storyData.previewImage]}
              style={styles.cardImage}
            />
            <View style={styles.textContainer}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.titleTextLight
                    : styles.titleText
                }
              >
                {this.state.storyData.title}
              </Text>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.authorTextLight
                    : styles.authorText
                }
              >
                {this.state.storyData.author}
              </Text>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.authorDescLight
                    : styles.authorDesc
                }
              >
                {this.state.storyData.description}
              </Text>
            </View>
            <View style={{ padding: RFValue(10) }}>
              <View style={styles.iconStyle}>
                <Ionicons
                  name={"heart"}
                  size={RFValue(30)}
                  color={this.state.lightTheme ? "black" : "white"}
                />
                <Text
                  style={
                    this.state.lightTheme
                      ? styles.likeTextLight
                      : styles.likeText
                  }
                >
                  12k
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  androidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  cardContainer: {
    backgroundColor: "#2f345d",
    margin: RFValue(14),
    borderRadius: RFValue(20),
  },
  cardContainerLight: {
    backgroundColor: "white",
    margin: RFValue(14),
    borderRadius: RFValue(20),
  },
  cardImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250),
  },
  titleText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
  },
  titleTextLight: {
    color: "black",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
  },
  textContainer: {
    marginLeft: RFValue(20),
  },
  authorText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(15),
  },
  authorTextLight: {
    color: "black",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(15),
  },
  authorDesc: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(13),
    marginTop: RFValue(10),
  },
  authorDescLight: {
    color: "black",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(13),
    marginTop: RFValue(10),
  },
  iconStyle: {
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "red",
    borderRadius: RFValue(20),
    width: RFValue(160),
    height: RFValue(30),
  },
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5),

    alignSelf: "center",
  },
  likeTextLight: {
    color: "black",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5),

    alignSelf: "center",
  },
});
