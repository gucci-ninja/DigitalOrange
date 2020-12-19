pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract ItemStore {

  event ItemAdded(uint256 index);
  event StateAdded(uint256 index);
  event Locations(string[] locations);
  event Dates(string[] dates);

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

  // total items
  uint256 public total_items=0;
  uint256 public last_updated=0;

  // // emitted when a new item is added
  // event ItemAdded(uint256 index);

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

  // function getItem(uint index) public view returns (uint) {
  //   return index+69;
  // }

  // update an item
  function updateItem(uint _itemId, string memory _date, string memory _location) public returns (uint) {
    require(_itemId <= total_items, "Invalid item id");

    State memory newState = State({
      date: _date,
      location: _location,
      editor: msg.sender
    });

    allItems[_itemId].states[allItems[_itemId].timesTracked] = newState;
    allItems[_itemId].timesTracked = allItems[_itemId].timesTracked + 1;
    // allItems[_itemId].states[currState] = newState;
    // allItems[_itemId].timesTracked = currState + 1;
    last_updated = _itemId;
    emit StateAdded(allItems[_itemId].timesTracked - 1);
    return 69;
  }

  // scan an item
  function getLocations(uint _itemId) public returns (string[] memory) {
    require(_itemId <= total_items, "Invalid item id");
    string[] memory output = new string[](allItems[_itemId].timesTracked);
    for (uint256 i = 0; i < allItems[_itemId].timesTracked; i++) {
        output[i] = allItems[_itemId].states[i].location;
    }
    emit Locations(output);

    // uint256 currState = allItems[_itemId].timesTracked - 1;
    // string memory date = allItems[_itemId].states[currState].date;
    // string memory location = allItems[_itemId].states[currState].location;
    return output;
  }

  function getDates(uint _itemId) public returns (string[] memory) {
    require(_itemId <= total_items, "Invalid item id");
    string[] memory output = new string[](allItems[_itemId].timesTracked);
    for (uint256 i = 0; i < allItems[_itemId].timesTracked; i++) {
        output[i] = allItems[_itemId].states[i].date;
    }
    emit Dates(output);

    // uint256 currState = allItems[_itemId].timesTracked - 1;
    // string memory date = allItems[_itemId].states[currState].date;
    // string memory location = allItems[_itemId].states[currState].location;
    return output;
  }

  // function getItems() public view returns (Item[] memory) {
  //   Item[] memory items = new Item[](total_items);
  //   for (uint i = 0; i < total_items; i++) {
  //       Item storage item = allItems[i];
  //       items[i] = item;
  //   }
  //   return items;
  // }
}