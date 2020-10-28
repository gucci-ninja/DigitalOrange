import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { theme } from './core/theme';

import Splash from './screens/Splash'
import Signup from './screens/Signup'
import Login from './screens/Login'
import Home from './screens/Home'
import Dummy from './screens/Dummy';
import NewItem from './screens/NewItem';

const bottomNav = createBottomTabNavigator(
  {
    // The name `Feed` is used later for accessing screens
    Home: {
      // Define the component we will use for the Feed screen.
      screen: Home,
      navigationOptions: {
        tabBarIcon: () => (
          <Icon name="home" size={30} color={theme.colors.primary} />
        ),
      },
    },
    // All the same stuff but for the Photo screen
    Scan: {
      screen: Dummy,
      navigationOptions: {
        tabBarIcon: () => (
          <Icon name="search" size={30} color={theme.colors.primary} />
        ),
      },
    },
    Add: {
      screen: NewItem,
      navigationOptions: {
        tabBarIcon: () => (
          <Icon name="add-circle" size={30} color={theme.colors.primary} />
        ),
      },
    },
    Profile: {
      screen: Dummy,
      navigationOptions: {
        tabBarIcon: () => (
          <Icon name="person" size={30} color={theme.colors.primary} />
        ),
      },
    },
    Message: {
      screen: Dummy,
      navigationOptions: {
        tabBarIcon: () => (
          <Icon name="heart" size={30} color={theme.colors.primary} />
        ),
      },
    },
  },
  {
    // We want to hide the labels and set a nice 2-tone tint system for our tabs
    tabBarOptions: {
      showLabel: false,
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
    },
  },
);

const App = createStackNavigator(
  {
    Splash,
    Signup,
    Login,
    Main: {
      screen: bottomNav
    }
  },
  {
    initialRouteName: 'Splash',
    headerMode: 'none',
  }
);

export default createAppContainer(App);