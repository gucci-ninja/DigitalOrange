var Web3 = require("web3");
const ItemStore = require("../build/contracts/ItemStore.json");
const ETH_CLIENT_ADDRESS = `http://127.0.0.1:8545`;

const web3 = new Web3(new Web3.providers.HttpProvider(ETH_CLIENT_ADDRESS));
var ItemContract;

module.exports.setContract = async function() {
  addr=(await web3.eth.getAccounts())[0]
  const networkId = await web3.eth.net.getId()
  const deployedAddress = ItemStore.networks[networkId].address
  ItemContract = new web3.eth.Contract(ItemStore.abi, deployedAddress);
}

async function getLastUpdatedItem() {
  const lastUpdated = await ItemContract.methods.last_updated.call().call()
  const item = await ItemContract.methods.allItems(lastUpdated).call();
  const locations = await ItemContract.methods.getLocations(lastUpdated).call();
  const timestamps = await ItemContract.methods.getDates(lastUpdated).call();
  return {
    itemId: item.itemId,
    name: item.name,
    timesTracked: item.timesTracked,
    creator: item.creator,
    "location": {
      "coordinates": locations.map(location => location.split(",").map(x=>parseFloat(x))),
      "type": "linestring"
    },
    "timestamps": timestamps.map(time => parseInt(time))
  }
}

module.exports.getLastBlockNumber = async function () {
  const block =  await web3.eth.getBlockNumber();
  return block
}

async function getBlock(blockId) {
	if (!blockId) {
		blockId = await getLastBlockNumber();
	}

	return await web3.eth.getBlock(blockId, true);
}

module.exports.processBlock = async function (block) {
	if (typeof block === "number") {
		block = await getBlock(block);
	}
	console.log(`analizying block #${ block.number }`);

	const originalTransactions = block.transactions;

	console.log(`\tcontaining ${ originalTransactions.length } transactions`);

  if (originalTransactions.length === 0) return []
  const item = await getLastUpdatedItem();
  return item
}