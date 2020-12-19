import React from 'react'
import firebase from '@react-native-firebase/app'

import Background from '../components/Background';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';

export default class Home extends React.Component {

  componentDidMount() {

  }
  render() {
    return (
          <Background>
            <Paragraph>
              Hi!
            </Paragraph>
          </Background>
        )
    }
}