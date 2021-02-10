import React from 'react'
import Title from '../components/Title'
import {
  StyleSheet,
  View
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist'
import { withNavigationFocus, NavigationEvents } from 'react-navigation';
class History extends React.Component {

  state = {
    locationStackId: null,
    dateStackId: null
  }

  getHistory  = async (payload) => {
    if (!payload.state || !payload.state.params || payload.state.params.itemId == null) return;

    const { drizzle, drizzleState } = this.props.screenProps;
    const contract = drizzle.contracts.ItemStore;

    // call the contract method
    const locationStackId = await contract.methods["getLocations"].cacheSend(payload.state.params.itemId, {
      from: drizzleState.accounts[0],
      gas: 6721975
    });

    const dateStackId = await contract.methods["getDates"].cacheSend(payload.state.params.itemId, {
      from: drizzleState.accounts[0],
      gas: 6721975
    });

    this.setState({ locationStackId, dateStackId });
  }

  getEventResponse = () => {
    if (!this.state.locationStackId ||!this.state.dateStackId) return [];
    const { transactions, transactionStack } = this.props.screenProps.drizzleState;

    // get the transaction hashes usisng stack ids
    const locationHash = transactionStack[this.state.locationStackId];
    const dateHash = transactionStack[this.state.dateStackId];

    // if transaction hashes do not exist, don't display anything
    if (!locationHash || !dateHash) return [];

    // otherwise, return the transaction status
    if (transactions[locationHash] && transactions[locationHash].receipt && transactions[dateHash] && transactions[dateHash].receipt){
      const locations = transactions[locationHash].receipt.events.History.returnValues.arr.slice(1);
      const dates = transactions[dateHash].receipt.events.History.returnValues.arr.slice(1);
      return dates.map((date, i) => ({ 'time': date, 'title': locations[i] }));
    }
    return [];
  }



    render() {
      return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => this.getHistory(payload)}
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