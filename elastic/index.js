var elasticsearch = require('elasticsearch');


var Web3 = require("web3");
var ItemStore = require("../build/contracts/ItemStore.json");
const NODE_ADDRESS = `http://127.0.0.1:8545`;
const web3 = new Web3(new Web3.providers.HttpProvider(NODE_ADDRESS));


async function setContract() {
    addr=(await web3.eth.getAccounts())[0]
    console.log(addr);
    const networkId = await web3.eth.net.getId()
    const deployedAddress = ItemStore.networks[networkId].address
    var ItemContract = new web3.eth.Contract(ItemStore.abi, deployedAddress);
    //ItemContract.methods.addItem("grapes", "12345", "-69,69").send({from:addr, gas: 6721975});
    // out = await ItemContract.methods.getItems().call().send({from:addr, gas: 6721975});
    const out = await ItemContract.methods.scanItem(0).call()
    //const out = await ItemContract.methods.total_items.call().call()
    console.log(out);
}



// Connect to ES Client
const elasticsearchClient = new elasticsearch.Client({
	host: process.env.ELASTICSEARCH,
});

// Create Items index
function createIndex(index_name) {
  elasticsearchClient.indices.create({  
    index: index_name
  }, 
  function(err, resp, status) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("create", resp);
    }
  });
}

// Delete index
function deleteIndex(index_name) {
  elasticsearchClient.indices.delete(
    { 
      index: index_name
    },
    function(err, resp, status) {  
      console.log("delete",resp);
  })
}



// elasticsearchClient.cluster.health({},function(err,resp,status) {  
//     console.log("-- Client Health --",resp);
//   });

async function getBlock() {
    const block = await web3.eth.getBlockNumber();
    console.log(block)
}


// setContract();
deleteIndex('example2')

// put example3
// {
//     "mappings": {
//       "properties": {
//         "location": {
//           "type": "geo_shape"
//         }
//       }
//     }
//   }

// put example3/_doc/4
// {
//   "name": "granola",
//   "location": { 
//     "coordinates": [ [-79.12, 43.34], [-60.8264672, 49.129836], [-29.10, 79.123]], 
//     "type": "linestring" 
//   }  
// }
