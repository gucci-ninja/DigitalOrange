import React from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { PermissionsAndroid } from 'react-native';
import Background from '../components/Background';
import Title from '../components/Title';
import Geolocation from 'react-native-geolocation-service';
import { Snackbar } from 'react-native-paper';

export default class Scan extends React.Component {

  state = { 
    itemId: null,
    itemName: '',
    details: '',
    longitude: '',
    latitude: '',
    time: '',
    updated: false,
  };

  componentDidMount() {
    this.getCoordinates();
  }

  onSuccess = async (e) => {
    const itemId = parseInt(e.data);

    this.setState( { itemId });
    const { drizzle, drizzleState } = this.props.screenProps;
    const contract = drizzle.contracts.ItemStore;

    const time = this.state.time.toString();
    const location = this.state.longitude.toString() + "," + this.state.latitude.toString();

    // call the method to add a new state
    const stackId = await contract.methods["updateItem"].cacheSend(itemId, time, location, {
      from: drizzleState.accounts[0],
      gas: 6721975
    });

    this.setState( { updated: true });

  }

  getCoordinates = async () => {
    const hasLocationPermission = await this.checkPerms();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const time = position.timestamp;
          this.setState( { latitude, longitude, time });
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
  };

  // check permissions for location services
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
    const onDismissSnackBar = () => this.setState({ updated: false});

    return (
      <Background>
        <Title>Scan an item</Title>
      <QRCodeScanner
        reactivate={true}
        reactivateTimeout={3000}
        onRead={this.onSuccess.bind(this)}
      />
      <Snackbar
        visible={this.state.updated}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'View',
          onPress: () => {
            this.props.navigation.navigate('History', {itemId: this.state.itemId})
          },
        }}>
        Item Updated!
      </Snackbar>
      </Background>
    );
  }
}