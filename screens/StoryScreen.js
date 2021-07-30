import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import * as Speech from "expo-speech";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

let stories = require("./TempStories.json");

export default class ReadStories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      speakerColor: "gray",
      lightTheme: true,
    };
  }
  loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    this.setState({
      fontsLoaded: true,
    });
  };

  fetchUser = async () => {
    let refLoc = await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid);
    refLoc.on("value", (data) => {
      var theme = data.val().current_theme;
      this.setState({
        lightTheme: theme === "light" ? true : false,
      });
    });
  };

  componentDidMount() {
    this.loadFontsAsync();
    this.fetchUser();
  }

  async initiateTTS(title, author, story, moral) {
    const currentColor = this.state.speakerColor;
    this.setState({
      speakerColor: currentColor === "gray" ? "#ee8249" : "gray",
    });
    if (currentColor === "gray") {
      Speech.speak(`${title} by ${author}`);
      // Speech.speak("Title!!!")
      // Speech .speak(title);
      // Speech.speak("Author!!")
      // Speech.speak(author);
      Speech.speak(story);
      Speech.speak("The moral of the story is: ");
      Speech.speak(moral);
    } else {
      Speech.stop();
    }
  }

  keyExtractor = (item, index) => {
    index.toString();
  };

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
          <View style={{ flex: 1 }}>
            <ScrollView
              style={
                this.state.lightTheme ? styles.storyCardLight : styles.storyCard
              }
            >
              <Image
                source={require("../assets/story_image_1.png")}
                style={styles.storyImage}
              />
              <View style={styles.dataContainer}>
                <View style={{ justifyContent: "center", flex: 0.8 }}>
                  <Text
                    style={
                      this.state.lightTheme
                        ? [styles.storyTextLight, { fontSize: RFValue(25) }]
                        : [styles.storyText, { fontSize: RFValue(25) }]
                    }
                  >Title: {this.props.route.params.story.title}
                    
                  </Text>
                  <Text
                    style={
                      this.state.lightTheme
                        ? [styles.storyTextLight, { fontSize: RFValue(18) }]
                        : [styles.storyText, { fontSize: RFValue(18) }]
                    }
                  >Author: {this.props.route.params.story.author}
                    
                  </Text>
                  <Text
                    style={
                      this.state.lightTheme
                        ? [styles.storyTextLight, { fontSize: RFValue(18) }]
                        : [styles.storyText, { fontSize: RFValue(18) }]
                    }
                  >Created On: {this.props.route.params.story.createdOn}
                    
                  </Text>
                </View>
                <View style={{ flex: 0.2 }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.initiateTTS(
                        this.props.route.params.story.title,
                        this.props.route.params.story.author,
                        this.props.route.params.story.story,
                        this.props.route.params.story.moral
                      );
                    }}
                  >
                    <Ionicons
                      name={"volume-high-outline"}
                      size={RFValue(30)}
                      color={"gray"}
                      style={{ margin: RFValue(15) }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ padding: RFValue(10) }}>
                <Text
                  style={
                    this.state.lightTheme
                      ? [styles.storyTextLight, { fontSize: RFValue(15) }]
                      : [styles.storyText, { fontSize: RFValue(15) }]
                  }
                >Story: {this.props.route.params.story.story}
                   
                </Text>
                <Text
                  style={
                    this.state.lightTheme
                      ? [styles.storyTextLight, { fontSize: RFValue(15) }]
                      : [styles.storyText, { fontSize: RFValue(15) }]
                  }
                >
                  Moral: {this.props.route.params.story.moral}
                </Text>
              </View>
              <View style={{ marginBottom: RFValue(20) }}>
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
            </ScrollView>
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
  storyCard: {
    backgroundColor: "#2f345d",
    padding: RFValue(10),
  },
  storyCardLight: {
    backgroundColor: "white",
    padding: RFValue(10),
  },
  storyImage: {
    width: "100%",
    alignSelf: "center",
    height: RFValue(200),
    resizeMode: "contain",
  },
  dataContainer: {
    flexDirection: "row",
    padding: RFValue(20),
  },
  storyText: {
    fontFamily: "Bubblegum-Sans",
    color: "white",
  },
  storyTextLight: {
    fontFamily: "Bubblegum-Sans",
    color: "black",
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
