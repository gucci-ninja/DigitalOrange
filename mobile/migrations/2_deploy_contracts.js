const ItemStore = artifacts.require("ItemStore");

module.exports = function(deployer) {
  deployer.deploy(ItemStore);
};
