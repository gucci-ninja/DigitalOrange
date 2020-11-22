import React from 'react'
import Background from '../components/Background';
import Title from '../components/Title';
import Button from '../components/Button';
import InputField from '../components/InputField'
import {
  PermissionsAndroid,
  Platform
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default class NewItem extends React.Component {
  constructor(props) {
    console.log(props)
    super(props);
  }
  state = { 
    itemId: null,
    itemName: "",
    details: "",
    longitude: '',
    latitude: '',
    time: ''
  };

  componentDidMount() {
    this.getCoordinates(); //
  }

  submit = () => {
    this.addItem(this.state.itemName);
  }

  addItem = async itemName => {
    const { drizzle, drizzleState } = this.props.screenProps;
    const contract = drizzle.contracts.ItemStore;

    // call the newItem method
    const itemId = await contract.methods["addItem"].cacheSend(itemName, {
      from: drizzleState.accounts[0],
      gas: 100000
    });

    // const details = contract.methods["getItem"].call(1, 2);

    // save the itemId for later
    this.setState( { itemId, itemName: '' });
  };

  checkPerms = async () => {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    else {
      console.log('Perms denied')
    }
  }

  getCoordinates = async () => {
    const hasLocationPermission = await this.checkPerms();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const time = position.timestamp;
          this.setState( { latitude, longitude, time });
          
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
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
      <Title>{this.state.itemId}</Title>
      <Title>{this.state.location}</Title>
      <Title>location above</Title>
      </Background>
    )
  }
}