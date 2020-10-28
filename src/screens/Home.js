import React from 'react'
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth';

import Background from '../components/Background';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';

export default class Home extends React.Component {
  state = { currentUser: null }
  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }
  render() {
      const { currentUser } = this.state
  return (
        <Background>
          <Paragraph>
            Hi {currentUser && currentUser.email}!
          </Paragraph>
          <Button mode="outlined" onPress={() => this.props.navigation.navigate('Login')}>
            Logout
          </Button>
        </Background>
      )
  }
}