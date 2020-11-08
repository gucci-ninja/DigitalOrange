import React from 'react'
import { View, Text } from 'react-native'

import Background from '../components/Background';
import Title from '../components/Title';
import Button from '../components/Button';
import InputField from '../components/InputField'

export default class NewItem extends React.Component {
  constructor(props) {
    console.log(props)
    super(props);
  }
  state = { itemId: null, itemName: "", details: "" };

  addItem = async itemName => {
    const { drizzle, drizzleState } = this.props.screenProps;
    const contract = drizzle.contracts.ItemStore;

    // call the newItem method
    const itemId = await contract.methods["addItem"].cacheSend(itemName, {
      from: drizzleState.accounts[0],
      gas: 100000
    });

    const details = contract.methods["getItem"].call(1, 2);



    // save the itemId for later
    this.setState( { itemId, details, itemName: '' });
  };

  render() {
    return (
      <Background>
        <Title>Register a new item</Title>
        <InputField
          label="Item Name"
          autoCapitalize="none"
          placeholder="Name of your item"
          onChangeText={itemName => this.setState({ itemName })}
          value={this.state.itemName}
        ></InputField>
      <Button mode="contained" onPress={this.submit}>
        Add Item
      </Button>
      <Title>{this.state.details}</Title>
      </Background>
    )
  }
}