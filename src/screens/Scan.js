import React from 'react'

import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  PermissionsAndroid
} from 'react-native';
import Background from '../components/Background';
import Title from '../components/Title';
import Geolocation from 'react-native-geolocation-service';


export default class Scan extends React.Component {

  state = { 
    itemId: null,
    itemName: "",
    details: "",
    longitude: '',
    latitude: '',
    time: '',
    updated: false,
  };

  componentDidMount() {
    this.getCoordinates(); //
  }

  onSuccess = async (e) => {
    const itemId = parseInt(e.data);
    console.log(e.data);
    this.setState( { itemId });
    const { drizzle, drizzleState } = this.props.screenProps;
    const contract = drizzle.contracts.ItemStore;

    const time = this.state.time.toString();
    const location = this.state.longitude.toString() + "," + this.state.latitude.toString();

    // call the newItem method
    const stackId = await contract.methods["updateItem"].cacheSend(itemId, location, time, {
      from: drizzleState.accounts[0],
      gas: 6721975
    });

    this.setState( { updated: true });

    console.log(drizzle.store.getState().transactionStack);
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

  render() {
    return (
      <Background>
        <Title>Scan an item</Title>
      <QRCodeScanner
        reactivate={true}
        reactivateTimeout={3000}
        onRead={this.onSuccess.bind(this)}
      />
      { this.state.updated && <Title>Item Updated</Title>}
      </Background>
    );
  }
}