var elasticsearch = require('elasticsearch');
const ethClient = require("./processor");

const itemBody = {
  "mappings": {
    "properties": {
      "location": {
        "type": "geo_shape"
      },
    }
  }
}

// Connect to ES Client
const elasticsearchClient = new elasticsearch.Client({
	host: process.env.ELASTICSEARCH,
});

// Create Items index
function createIndex(indexName) {
  elasticsearchClient.indices.create({  
    index: indexName,
    body: itemBody
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
function deleteIndex(indexName) {
  elasticsearchClient.indices.delete(
    { 
      index: indexName
    },
    function(err, resp, status) {  
      console.log("delete",resp);
  })
}

function addDocument(indexName, itemId, docBody) {
  elasticsearchClient.index({  
    index: indexName,
    id: parseInt(itemId)+1,
    type: '_doc',
    body: docBody
  },function(err,resp,status) {
      console.log(resp);
  });
}

async function postTransactions(transaction) {
  if (transaction.length === 0) {
    console.log("\tempty block - skipping");
    return;
  }
  addDocument('item', transaction.itemId, transaction)

  // const t = await ethClient.get
  // Get 
	// const bulkBody = transactions
	// 	.map(createBulkEntry)
	// 	.reduce((a, b) => a.concat(b), []);

	// elasticsearchClient.bulk({
	// 	body: bulkBody
	// }, (err, resp) => {
	// 	if (err) {
	// 		console.log("\terror sending bulk: ", err);
	// 	} else {
	// 		console.log("\tbulk sent successfully");
	// 	}
	// });
}

async function iterateBlocks(current, end) {

	const latestBlockNumber = await ethClient.getLastBlockNumber();

	end = Math.max(latestBlockNumber, end || latestBlockNumber);
	while (current <= end) {
		try {
      postTransactions(await ethClient.processBlock(current));
			current++;
		} catch (e) {
			console.log(`failed to retrieve last block: ${e}`);
			return current;
		}
	}
	return current;
}

async function main() {
  // createIndex('item') 
  await ethClient.setContract();
	let resolvePromise;
	const promise = new Promise(resolve => {
		resolvePromise = resolve;
	});

	const endBlock = await ethClient.getLastBlockNumber();
	const startBlock = 7;

	let lastProcessed = startBlock;
	const thread = async () => {
    lastProcessed = await iterateBlocks(lastProcessed, endBlock);

		if (lastProcessed) {
			setTimeout(thread, 10000);
		} else {
			resolvePromise();
		}
	}
	await thread();

	return promise;
}

main().then(() => console.log("Your blockchain is fully synced!"));


// setContract();
// deleteIndex('item')
// createIndex('item')
// addDocument('item', '1', {
//   "name": "crabs",
//   "locations": { 
//     "coordinates": [ [-80.12, 43.34], [-60.8264672, 49.129836], [-29.10, 79.123]], 
//     "type": "linestring" 
//   }  
// }
// )

