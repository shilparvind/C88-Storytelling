import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';

export default class LoadingScreen extends React.Component{

  checkIfLoggedIn=()=>{
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        console.log("user",user)
        this.props.navigation.navigate("DashboardScreen")

      }
      else{
        this.props.navigation.navigate("LoginScreen")
      }
    })
  }

  componentDidMount(){
    this.checkIfLoggedIn();
  }

  render(){
    return(
      <View style = {{flex: 1,justifyContent: "center", alignItems: "center"}}>
        <Text>Loading Screen</Text>
        
      </View>
    )
  }

}