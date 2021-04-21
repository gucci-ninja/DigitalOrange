import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart';
import 'package:web_socket_channel/io.dart';

class Contract extends ChangeNotifier {
  final String _rpcUrl = "http://578028331b58.eu.ngrok.io";
  final String _wsUrl = "ws://10.0.2.2:7545";
  final String _privateKey =
      "f2c35fa624867c94418b52670c1baa8c1efe77b69cd555fcec57df38a23ff3f5";

  Web3Client _client;
  bool isLoading = true;

  String _abiCode;
  EthereumAddress _contractAddress;

  Credentials _credentials;

  DeployedContract _contract;
  ContractFunction _addItem;
  ContractFunction _updateItem;
  ContractFunction _last_updated;
  ContractFunction _getLocations;
  ContractFunction _getDates;
  ContractFunction _allItems;

  BigInt itemId;

  String itemName;
  List<dynamic> locations;
  List<dynamic> dates;

  Contract() {
    init();
  }

  init() async {
    // establish a connection to the ethereum rpc node. The socketConnector
    // property allows more efficient event streams over websocket instead of
    // http-polls. However, the socketConnector property is experimental.
    _client = Web3Client(_rpcUrl, Client(), socketConnector: () {
      return IOWebSocketChannel.connect(_wsUrl).cast<String>();
    });

    print('client');
    print(_client);

    await getAbi();
    await getCredentials();
    await getDeployedContract();
  }

  Future<void> getAbi() async {
    // Reading the contract abi
    String abiStringFile =
        await rootBundle.loadString("src/artifacts/ItemStore.json");
    var jsonAbi = jsonDecode(abiStringFile);
    _abiCode = jsonEncode(jsonAbi["abi"]);

    _contractAddress =
        EthereumAddress.fromHex(jsonAbi["networks"]["5777"]["address"]);
  }

  Future<void> getCredentials() async {
    _credentials = await _client.credentialsFromPrivateKey(_privateKey);
  }

  Future<void> getDeployedContract() async {
    // Telling Web3dart where our contract is declared.
    _contract = DeployedContract(
        ContractAbi.fromJson(_abiCode, "ItemStore"), _contractAddress);

    // Extracting the functions, declared in contract.
    _addItem = _contract.function("addItem");
    _updateItem = _contract.function("updateItem");
    _last_updated = _contract.function("last_updated");
    _getLocations = _contract.function("getLocations");
    _getDates = _contract.function("getDates");
    _allItems = _contract.function("allItems");
  }

  addItem(String name) async {
    print('Method to set name hit!');
    isLoading = true;
    notifyListeners();
    print('calling all items');
    await _client.sendTransaction(
        _credentials,
        Transaction.callContract(
            contract: _contract,
            function: _addItem,
            parameters: [
              name,
              "${DateTime.now().millisecondsSinceEpoch}",
              "43.727445,-79.897567"
            ],
            maxGas: 6721975,
            gasPrice: EtherAmount.inWei(BigInt.from(6721975))));
    getItemId();
  }

  getItemId() async {
    var numItems = await _client.call(
        contract: _contract,
        function: _last_updated,
        params: []).catchError((error, trace) {
      print(error);
    });
    itemId = numItems[0];
    print('Item id: $itemId');
    isLoading = false;
    notifyListeners();
  }

  updateItem(String itemId) async {
    int id = int.parse(itemId);
    print("Updating item with id $itemId");
    await _client.sendTransaction(
        _credentials,
        Transaction.callContract(
            contract: _contract,
            function: _updateItem,
            parameters: [
              BigInt.from(id),
              "1621464821000",
              "43.739352,-80.088583"
            ],
            maxGas: 6721975,
            gasPrice: EtherAmount.inWei(BigInt.from(6721975))));
    itemId = null;
    await getItem(id);
  }

  getItem(int itemId) async {
    var numItems = await _client.call(
        contract: _contract,
        function: _allItems,
        params: [BigInt.from(itemId)]).catchError((error, trace) {
      print(error);
    });
    itemName = numItems[1];
    var deployedLocations = await _client.call(
        contract: _contract,
        function: _getLocations,
        params: [BigInt.from(itemId)]).catchError((error, trace) {
      print(error);
    });
    locations = deployedLocations[0];
    var deployedDates = await _client.call(
        contract: _contract,
        function: _getDates,
        params: [BigInt.from(itemId)]).catchError((error, trace) {
      print(error);
    });
    dates = deployedDates[0];
    print('Finished retrieving item details');
  }
}
