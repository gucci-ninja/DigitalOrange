import React from 'react'
import { View, Text } from 'react-native'

import Background from '../components/Background';
import Title from '../components/Title';
import Paragraph from '../components/Paragraph';

export default class NewItem extends React.Component {

  render() {
    return (
      <Background>
        <Title>Register a new item</Title>
      </Background>
    )
  }
}