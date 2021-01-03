import React from 'react'
import firebase from '@react-native-firebase/app'

import Background from '../components/Background';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import Title from '../components/Title'
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist'
import { withNavigationFocus, NavigationEvents } from 'react-navigation';
class History extends React.Component {

  state = {
    locationStackId: null,
    dateStackId: null
  }

  constructor(props){
    console.log('constructor for history');
    console.log(props.navigation.state);
    super()
    this.history = []
    setTimeout(() => {      
      this.data = [
        {time: 'Feb 19, 2:42PM', title: '-50.371637,-16.299051', circleColor: '#009688',lineColor:'#009688'},
        {time: 'Feb 19, 2:45PM', title: '-102.917438,44.590467'},
        {time: 'Feb 19, 2:49PM', title: '42.682435,-84.61776'},
        {time: `Feb 19, ${ new Date().getHours()-12}:${ new Date().getMinutes()}PM`, title: '-84.617760,42.682435',lineColor:'#009688'},
      ]
      this.name = 'Oranges' }, 1500);
   // x.each_with_index { |key,index| z << { date: key, minutes: y[index]} }

  }

  // componentDidMount() {

  //   if (this.props.isFocused) {
  //     console.log('running mount')

  //     // Use the `this.props.isFocused` boolean
  //     // Call any action
  //     console.log(this.props.isFocused);
  //     if (this.props.isFocused) {
  //       if (this.props.navigation.state.params){
  //         console.log(this.props.navigation.state.params)
  //       this.itemId = this.props.navigation.state.params.itemId || 0;
  //       this.getHistory();
  //       }
  //     }
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.isFocused !== this.props.isFocused) {
  //     console.log('running update')

  //     // Use the `this.props.isFocused` boolean
  //     // Call any action
  //     console.log(this.props.isFocused);
  //     if (this.props.isFocused) {
  //       if (this.props.navigation.state.params){
  //         console.log(this.props.navigation.state.params)
  //       this.itemId = this.props.navigation.state.params.itemId || 0;
  //       this.getHistory();
  //       }
  //     }
  //   }
  // }

  // clearParams = () => {
  //   this.props.navigation.setParams({itemId: null})
  // }

  getHistory  = async (payload) => {
    console.log(payload.state.params);
    if (!payload.state || !payload.state.params || payload.state.params.itemId == null) console.log('uhoh')
    if (!payload.state || !payload.state.params || payload.state.params.itemId == null) return;
    console.log(payload.state.params.itemId);

    const { drizzle, drizzleState } = this.props.screenProps;
    const contract = drizzle.contracts.ItemStore;

    // call the newItem method
    const locationStackId = await contract.methods["getLocations"].cacheSend(payload.state.params.itemId, {
      from: drizzleState.accounts[0],
      gas: 6721975
    });

    console.log(drizzle.store.getState().transactionStack);
    //const locations = await this.getEventResponse(locationStackId);

    const dateStackId = await contract.methods["getDates"].cacheSend(payload.state.params.itemId, {
      from: drizzleState.accounts[0],
      gas: 6721975
    });

    this.setState({ locationStackId, dateStackId });
    // const dates = await this.getEventResponse(dateStackId);

    // console.log(dates)
    // console.log(locations)
  }

  getEventResponse = () => {
    // console.log(this.props.screenProps.drizzle.store.getState().transactionStack)
    if (!this.state.locationStackId ||!this.state.dateStackId) return [];
    const { transactions, transactionStack } = this.props.screenProps.drizzleState;


    // get the transaction hash usisng stack id
    const locationHash = transactionStack[this.state.locationStackId];
    const dateHash = transactionStack[this.state.dateStackId];

    // console.log(transactions[txHash])
    // if transaction hash does not exist, don't display anything
    if (!locationHash || !dateHash) return [];

    console.log('hash data');
    // otherwise, return the transaction status
    if (transactions[locationHash] && transactions[locationHash].receipt && transactions[dateHash] && transactions[dateHash].receipt){
      const locations = transactions[locationHash].receipt.events.History.returnValues.arr.slice(1);
      const dates = transactions[dateHash].receipt.events.History.returnValues.arr.slice(1);
      return dates.map((date, i) => ({ 'time': date, 'title': locations[i] }));
    }
    return [];
  }



    render() {
      //'rgb(45,156,219)'
      return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => this.getHistory(payload)}
          onDidFocus={payload => console.log('did focus',payload)} // 
          onWillBlur={payload => console.log('will blur',payload)}
          onDidBlur={payload => console.log('did blur',payload)}
        />
        <Title>Details for: item name</Title>
        <Timeline 
          style={styles.list}
          data={this.getEventResponse()}
          circleSize={20}
          circleColor='rgb(45,156,219)'
          lineColor='rgb(45,156,219)'
          timeContainerStyle={{minWidth:52, marginTop: -5}}
          timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
          descriptionStyle={{color:'gray'}}
          options={{
            style:{paddingTop:5}
          }}
          innerCircle={'dot'}
        />
      </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
		backgroundColor:'white'
  },
  list: {
    flex: 1,
    marginTop:20,
  },
});

export default withNavigationFocus(History);