import React, { Component } from "react";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { theme } from './core/theme';

import Splash from './screens/Splash'
import Signup from './screens/Signup'
import Login from './screens/Login'
import Home from './screens/Home'
import Scan from './screens/Scan';
import NewItem from './screens/NewItem';
import History from './screens/History';

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
      screen: Scan,
      navigationOptions: {
        tabBarIcon: () => (
          <Icon name="search" size={30} color={theme.colors.primary} />
        ),
      },
    },
    Add: {
      screen: NewItem,
      navigationOptions: {
        unmountOnBlur: true,
        tabBarIcon: () => (
          <Icon name="add-circle" size={30} color={theme.colors.primary} />
        ),
      },
    },
    History: {
      screen: History,
      navigationOptions: {
        tabBarIcon: () => (
          <Icon name="list-outline" size={30} color={theme.colors.primary} />
        ),
      },
    },
    Message: {
      screen: Scan,
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

const AppNavigator = createStackNavigator(
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
    detachPreviousScreen: true
  }
);

// export default createAppContainer(App);

const AppContainer = createAppContainer(AppNavigator);

type Props = {};
export default class App extends Component<Props> {
  state = { loading: true, drizzleState: null };

  componentDidMount() {
    const { drizzle } = this.props;

    this.unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState();

      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return <AppContainer screenProps={{...this.props, ...{drizzleState: this.state.drizzleState}}}/>;
  }
}