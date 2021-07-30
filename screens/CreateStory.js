import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import DropDownPicker from "react-native-dropdown-picker";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

export default class CreateStoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: "image1",
      dropDownHeight: 50,
      title: "",
      description: "",
      story: "",
      moral: "",
      lightTheme: true,
    };
  }

  fetchUser = async () => {
    let theme;
    var refLoc = await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid);
    refLoc.on("value", (data) => {
      theme = data.val().current_theme;
      console.log("theme", theme);
      this.setState({
        lightTheme: theme === "light" ? true : false,
      });
    });
  };

  addStory = async () => {
    if (
      this.state.title &&
      this.state.description &&
      this.state.moral &&
      this.state.story
    ) {
      var refLoc = await firebase
        .database()
        .ref("/posts/" + Math.random().toString(36).slice(2));
      refLoc.set({
        previewImage: this.state.previewImage,
        title: this.state.title,
        description: this.state.description,
        story: this.state.story,
        moral: this.state.moral,
        author: firebase.auth().currentUser.displayName,
        createdOn: new Date(),
        authorUid: firebase.auth().currentUser.uid,
        likes: 0,
      });
      this.props.setUpdateToTrue();
      this.props.navigation.navigate("DisplayStories");
    } else {
      Alert.alert(
        "Error",
        "All Fields Required!!!",
        [{ text: "OK", onPress: () => console.log("Ok Pressed") }],
        { cancelable: false }
      );
    }
  };

  loadFonts = async () => {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  };

  componentDidMount() {
    this.loadFonts();
    this.fetchUser();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let previewImages = {
        image1: require("../assets/story_image_1.png"),
        image2: require("../assets/story_image_2.png"),
        image3: require("../assets/story_image_3.png"),
        image4: require("../assets/story_image_4.png"),
        image5: require("../assets/story_image_5.png"),
      };
      return (
        <View
          style={
            this.state.lightTheme
              ? { flex: 1, backgroundColor: "white" }
              : { flex: 1, backgroundColor: "#15193c" }
          }
        >
          <SafeAreaView style={styles.androidSafeArea} />

          <View style={styles.titleContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logoStyle}
              />
            </View>
            <View style={styles.titleView}>
              <Text
                style={
                  this.state.lightTheme
                    ? styles.titleTextLight
                    : styles.titleText
                }
              >
                New Story
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.85 }}>
            <ScrollView>
              <Image
                source={previewImages[this.state.previewImage]}
                style={styles.dropDownDefaultImg}
              />
              <View style={{ height: RFValue(this.state.dropDownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: "Image 1", value: "image1" },
                    { label: "Image 2", value: "image2" },
                    { label: "Image 3", value: "image3" },
                    { label: "Image 4", value: "image4" },
                    { label: "Image 5", value: "image5" },
                  ]}
                  defaultValue={this.state.previewImage}
                  containerStyle={{
                    height: 40,
                    borderRadius: 20,
                    marginBottom: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                  onOpen={() => {
                    this.setState({ dropDownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropDownHeight: 35 });
                  }}
                  style={{ backgroundColor: "transparent" }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  dropDownStyle={
                    this.state.lightTheme
                      ? { backgroundColor: "white", marginLeft: 10 }
                      : { backgroundColor: "#2f345d", marginLeft: 10 }
                  }
                  labelStyle={
                    this.state.lightTheme
                      ? {
                          color: "black",
                          fontFamily: "Bubblegum-Sans",
                        }
                      : {
                          color: "white",
                          fontFamily: "Bubblegum-Sans",
                        }
                  }
                  arrowStyle={{
                    color: "white",
                    fontFamily: "Bubblegum-Sans",
                  }}
                  onChangeItem={(item) => {
                    this.setState({ previewImage: item.value });
                  }}
                />
              </View>

              <TextInput
                style={
                  this.state.lightTheme
                    ? styles.inputFontLight
                    : styles.inputFont
                }
                placeholder={"Title"}
                placeholderTextColor={this.state.lightTheme ? "black" : "white"}
                onChangeText={(input) => {
                  this.setState({ title: input });
                }}
              ></TextInput>

              <TextInput
                style={
                  this.state.lightTheme
                    ? styles.inputFontLight
                    : styles.inputFont
                }
                placeholder={"Description"}
                placeholderTextColor={this.state.lightTheme ? "black" : "white"}
                multiline={true}
                numberOfLines={4}
                onChangeText={(input) => {
                  this.setState({ description: input });
                }}
              ></TextInput>

              <TextInput
                style={
                  this.state.lightTheme
                    ? styles.inputFontLight
                    : styles.inputFont
                }
                placeholder={"Story"}
                placeholderTextColor={this.state.lightTheme ? "black" : "white"}
                multiline={true}
                numberOfLines={20}
                onChangeText={(input) => {
                  this.setState({ story: input });
                }}
              ></TextInput>

              <TextInput
                style={
                  this.state.lightTheme
                    ? styles.inputFontLight
                    : styles.inputFont
                }
                placeholder={"Moral"}
                placeholderTextColor={this.state.lightTheme ? "black" : "white"}
                multiline={true}
                numberOfLines={4}
                onChangeText={(input) => {
                  this.setState({ moral: input });
                }}
              ></TextInput>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  this.addStory();
                }}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
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
  titleContainer: {
    flex: 0.07,
    flexDirection: "row",
    justifyContent: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 0.4,
  },
  logoStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
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
  titleView: {
    flex: 0.55,
    justifyContent: "center",
  },
  dropDownDefaultImg: {
    height: RFValue(250),
    width: "93%",
    resizeMode: "contain",
    justifyContent: "center",
    alignSelf: "center",
  },
  inputFont: {
    height: RFValue(40),
    borderRadius: RFValue(10),
    borderColor: "white",
    borderWidth: RFValue(1),
    fontFamily: "Bubblegum-Sans",
    color: "white",
    marginLeft: RFValue(10),
    marginRight: RFValue(10),
    marginTop: RFValue(10),
    padding: RFValue(10),
  },
  inputFontLight: {
    height: RFValue(40),
    borderRadius: RFValue(10),
    borderColor: "black",
    borderWidth: RFValue(1),
    fontFamily: "Bubblegum-Sans",
    color: "black",
    marginLeft: RFValue(10),
    marginRight: RFValue(10),
    marginTop: RFValue(10),
    padding: RFValue(10),
  },
  submitButtonText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(20),
    color: "white",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#841584",
    marginTop: RFValue(20),
    width: RFValue(100),
    height: RFValue(60),
    alignSelf: "center",
    justifyContent: "center",
  },
});
