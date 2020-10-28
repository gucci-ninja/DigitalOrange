import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'

import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth';

import Background from '../components/Background';
import InputField from '../components/InputField';
import Title from '../components/Title';
import Button from '../components/Button';

import { theme } from '../core/theme';

export default class Signup extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
render() {
    return (
      <Background>
        <Title>Create account</Title>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <InputField
          label="Email"
          returnKeyType="next"
          autoCapitalize="none"
          autoCompleteType="email"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <InputField
          secureTextEntry
          label="Password"
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
      <Button mode="contained" onPress={this.handleSignUp} style={styles.button}>
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
      </Background>
    )
  }
}
const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})