import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Splash from './Splash'
import Signup from './Signup'
import Login from './Login'
import Home from './Home'

const App = createStackNavigator(
  {
    Splash,
    Signup,
    Login,
    Home
  },
  {
    initialRouteName: 'Splash',
    headerMode: 'none',
  }
);

export default createAppContainer(App);

// import React from 'react'
// import { StyleSheet, Platform, Image, Text, View } from 'react-native'
// import { SwitchNavigator } from 'react-navigation'
// // import the different screens
// import Splash from './Splash'
// import Signup from './Signup'
// import Login from './Login'
// import Home from './Home'
// // create our app's navigation stack
// const App = SwitchNavigator(
//   {
//     Splash,
//     Signup,
//     Login,
//     Home
//   },
//   {
//     initialRouteName: 'Splash'
//   }
// )
// export default App