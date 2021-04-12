pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract ItemStore {

  event ItemAdded(uint256 index);
  event StateAdded(uint256 index);
  event History(string[] arr);

  struct State {
    string date;
    string location;
    address editor;
  }

  struct Item {
    uint256 itemId;
    string name;
    uint256 timesTracked;
    address creator;
    mapping (uint256 => State) states;
  }

  // array of items
  mapping(uint => Item) public allItems;

  uint256 public total_items=0;
  uint256 public last_updated=0;

  // adding an item
  function addItem(string memory text, string memory _date, string memory _location) public returns (uint) {
    Item memory newItem = Item({
      itemId: total_items,
      name: text,
      timesTracked: 1,
      creator: msg.sender
    });
    State memory newState = State({
      date: _date,
      location: _location,
      editor: msg.sender
    });

    allItems[total_items] = newItem;
    allItems[total_items].states[0] = newState;
    last_updated = total_items;

    total_items = total_items + 1;
    emit ItemAdded(total_items-1);
    return (total_items - 1);
  }

  // add state to an item
  function updateItem(uint _itemId, string memory _date, string memory _location) public returns (uint) {
    require(_itemId <= total_items, "Invalid item id");

    State memory newState = State({
      date: _date,
      location: _location,
      editor: msg.sender
    });

    allItems[_itemId].states[allItems[_itemId].timesTracked] = newState;
    allItems[_itemId].timesTracked = allItems[_itemId].timesTracked + 1;
    last_updated = _itemId;
    emit StateAdded(allItems[_itemId].timesTracked - 1);
    return last_updated;
  }

  // retrieves all locations 
  function getLocations(uint _itemId) public returns (string[] memory) {
    require(_itemId <= total_items, "Invalid item id");
    string[] memory output = new string[](allItems[_itemId].timesTracked);
    for (uint256 i = 0; i < allItems[_itemId].timesTracked; i++) {
        output[i] = allItems[_itemId].states[i].location;
    }
    emit History(output);
    return output;
  }

  // retrieves all timestamps
  function getDates(uint _itemId) public returns (string[] memory) {
    require(_itemId <= total_items, "Invalid item id");
    string[] memory output = new string[](allItems[_itemId].timesTracked);
    for (uint256 i = 0; i < allItems[_itemId].timesTracked; i++) {
        output[i] = allItems[_itemId].states[i].date;
    }
    emit History(output);
    return output;
  }
}