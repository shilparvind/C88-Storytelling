import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { RFValue } from "react-native-responsive-fontsize";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
    };
  }

  loadFontAsync = async () => {
    await Font.loadAsync(customFonts);
    this.setState({
      fontsLoaded: true,
    });
  };

  componentDidMount() {
    this.loadFontAsync();
  }

  isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onSignIn(googleUser) {
    console.log("Google User", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        console.log("firebase User", firebaseUser);
        // Build Firebase credential with the Google ID token.
        const credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        console.log("Credentials", credential);

        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            console.log("45********* " + result.additionalUserInfo);
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref("/users/" + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: "dark",
                })
                .then(function (snapshot) {});
            }
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The credential that was used.
            const credential = error.credential;
            console.log(error);
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  }

  signInWithGoogleAsync = async () => {
    console.log("signin");
    try {
      const result = await Google.logInAsync({
        behavior: "web",
        androidClientId:
          "78363895733-fk6cq1v350eph8m8l82ej73j7ej99enu.apps.googleusercontent.com",
        iosClientId:
          "78363895733-af33vme5vj4c6n68931dkrjhn251vild.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });
      console.log(result);
      if (result.type === "success") {
        console.log("success");
        this.onSignIn(result);
        this.props.navigation.navigate("DashboardScreen");
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: "#15193c" }}>
          <SafeAreaView style={styles.androidSafeArea} />

          <View style={styles.imageView}>
            <Image
              source={require("../assets/logo.png")}
              style={{
                width: RFValue(130),
                height: RFValue(130),
                alignSelf: "center",
                resizeMode: "contain",
              }}
            ></Image>
            <Text style={styles.titleText}>Story Telling App</Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.signInWithGoogleAsync()}
            >
              <Image
                source={require("../assets/google_icon.png")}
                style={styles.buttonIconImage}
              />
              <Text style={styles.buttonTextStyle}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.6 }}>
            <Image
              source={require("../assets/cloud.png")}
              style={styles.cloudImage}
            />
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
  imageView: {
    flex: 0.4,
    justifyContent: "center",
    alignSelf: "center",
  },
  titleText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(35),
    color: "white",
    textAlign: "center",
  },
  buttonView: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextStyle: {
    fontFamily: "Bubblegum-Sans",
    textAlign: "center",
  },
  buttonStyle: {
    backgroundColor: "white",
    borderRadius: RFValue(20),
    width: RFValue(180),
    height: RFValue(40),
    fontWeight: "bold",
    fontSize: 30,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  buttonIconImage: {
    width: RFValue(25),
    height: RFValue(25),
    resizeMode: "contain",
  },
  cloudImage: {
    width: "100%",
    resizeMode: "contain",

    position: "absolute",
    bottom: RFValue(-10),
  },
});
