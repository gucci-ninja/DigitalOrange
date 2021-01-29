var Web3 = require("web3");
const web3Helper = require('web3-abi-helper').Web3Helper;
const ItemStore = require("../build/contracts/ItemStore.json");
const ETH_CLIENT_ADDRESS = `http://127.0.0.1:8545`;

const web3 = new Web3(new Web3.providers.HttpProvider(ETH_CLIENT_ADDRESS));

var addr;
var ItemContract;

module.exports.setContract = async function() {
  addr=(await web3.eth.getAccounts())[0]
  const networkId = await web3.eth.net.getId()
  const deployedAddress = ItemStore.networks[networkId].address
  ItemContract = new web3.eth.Contract(ItemStore.abi, deployedAddress);
  //ItemContract.methods.addItem("grapes", "12345", "-69,69").send({from:addr, gas: 6721975});
  // out = await ItemContract.methods.getItems().call().send({from:addr, gas: 6721975});
  // const out = await ItemContract.methods.scanItem(0).call()
  //const out = await ItemContract.methods.total_items.call().call()
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

function normalizeNumber(num, decimals) {
	if (typeof num === "string") {
		num = Number(num);
	}

	return num / Math.pow(10, decimals);
}

function decode(input) {
	try {
		return web3Helper.decodeMethod(input);
	} catch(e) {
		return null;
	}
}

function processTransaction(transaction, date) {
  // console.log(web3.utils.toAscii(transaction.input))
  const item = getLastUpdatedItem();
  const overrides = {
    item,
		date,
		coin: "ETH",
		coinName: "Ether",
		sender: transaction.from,
		value: normalizeNumber(transaction.value, 18),
		gasPrice: normalizeNumber(transaction.gasPrice, 9)
	};

	return Object.assign({}, transaction, overrides);
}

module.exports.processBlock = async function (block) {
	if (typeof block === "number") {
		block = await getBlock(block);
	}
	console.log(`analizying block #${ block.number }`);

	const originalTransactions = block.transactions;
	const date = new Date(block.timestamp * 1000).toISOString();

	console.log(`\tcontaining ${ originalTransactions.length } transactions`);

  if (originalTransactions.length === 0) return []
  const item = await getLastUpdatedItem();
  return item
}