import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth';

import Title from '../components/Title';
import Background from '../components/Background';
import Button from '../components/Button';
import InputField from '../components/InputField'

import { theme } from '../core/theme';

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Home'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  render() {
    return (
      <Background>
        <Title>Welcome back</Title>
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
        <Button mode="contained" onPress={this.handleLogin}>
          Login
        </Button>
        <View style={styles.row}>
          <Text style={styles.label}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
      </View>
      </Background>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})