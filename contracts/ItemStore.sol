pragma solidity ^0.6.4;
// pragma experimental ABIEncoderV2;

contract TrackItem {

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
  mapping(uint => Item) allItems;

  // total items
  uint256 total_items=0;

  // emitted when a new item is added
  event ItemAdded(uint256 index);

  // adding an item
  function addItem(string memory _text) public returns (uint) {
    Item memory newItem = Item({
      itemId: total_items,
      name: _text,
      timesTracked: 0,
      creator: msg.sender
    });
    allItems[total_items] = newItem;
    total_items = total_items + 1;
    emit ItemAdded(total_items-1);
    return (total_items - 1);
  }

  // update an item
  function updateItem(uint _itemId, string memory _date, string memory _location) public returns (bool) {
    require(_itemId <= total_items, "Invalid item id");
    State memory newState = State({
      date: _date,
      location: _location,
      editor: msg.sender
    });

    uint256 currState = allItems[_itemId].timesTracked;
    allItems[_itemId].states[currState] = newState;
    allItems[_itemId].timesTracked = currState + 1;
    return true;
  }

  // scan an item
  function scanItem(uint _itemId) public view returns (string memory, string memory) {
    require(_itemId <= total_items, "Invalid item id");
    uint256 currState = allItems[_itemId].timesTracked - 1;
    string memory date = allItems[_itemId].states[currState].date;
    string memory location = allItems[_itemId].states[currState].location;
    return (date, location);
  }
}