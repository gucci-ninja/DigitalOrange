var Web3 = require("web3");
const web3Helper = require('web3-abi-helper').Web3Helper;
const ItemStore = require("../build/contracts/ItemStore.json");
const ETH_CLIENT_ADDRESS = `http://127.0.0.1:8545`;

const web3 = new Web3(new Web3.providers.HttpProvider(ETH_CLIENT_ADDRESS));


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


async function getLastBlockNumber() {
  const block =  await web3.eth.getBlockNumber();
  console.log(block);
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
  const decoded = decode(transaction.input);
  console.log(web3.utils.toAscii(transaction.input));
  console.log(web3.getPastEvents("allEvents", {fromBlock: 67, toBlock: 68}));
	const overrides = {
		date,
		coin: "ETH",
		coinName: "Ether",
		decodedInput: decoded,
		sender: transaction.from,
		value: normalizeNumber(transaction.value, 18),
		gasPrice: normalizeNumber(transaction.gasPrice, 9)
	};

	if (decoded && decoded.method.name.startsWith("transfer")) {
		const token = TOKENS.get(transaction.to) || {
			symbol: "<UNK>",
			name: "Unknown",
			decimals: 18
		};

		overrides.coin = token.symbol;
		overrides.coinName = token.name;
		overrides.to = decoded.params.to;
		overrides.value = normalizeNumber(decoded.params.value, token.decimals);

		if (decoded.method.name.startsWith("transferFrom(")) {
			overrides.from = decoded.params.from;
		}
	}

	return Object.assign({}, transaction, overrides);
}

async function processBlock(block) {
	if (typeof block === "number") {
		block = await getBlock(block);
	}
	console.log(`analizying block #${ block.number }`);

	const originalTransactions = block.transactions;
	const date = new Date(block.timestamp * 1000).toISOString();

	console.log(`\tcontaining ${ originalTransactions.length } transactions`);

	return originalTransactions.map(transaction => processTransaction(transaction, date));
}


processBlock(67)