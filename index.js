'use strict';

const STORE = {
  items: [
    { name: 'apples', checked: false },
    { name: 'oranges', checked: false },
    { name: 'milk', checked: true },
    { name: 'porgs', checked: false }
  ]
};

//new Searchbar for updated funtionality
function generateListFormHtml() {
  console.log('Generating list form');
  return `
  <form id="js-shopping-list-form-entry">
    <label for="shopping-list-entry">Add an item</label>
    <input type="text" name="shopping-list-entry" class="js-shopping-list-entry" placeholder="e.g., broccoli">
    <button type="submit">Add item</button>
  </form>
  <form id="js-shopping-list-form-search">
    <label for="shopping-list-search">Search</label>
    <input type="text" name="shopping-list-search" class="js-shopping-list-search" placeholder="Search">
    <button type="submit">Search</button>
  </form>
  <form id="js-shopping-list-form-checkbox">
  <label for="shopping-list-checkbox">Show Only Checked</label>
    <input type="checkbox" name="shopping-list-checkbox" class="js-shopping-list-checkbox">
  </form>`;
}
function renderListForm() {
  console.log('Rendering list form');
  $('.js-shopping-list-form').html(generateListFormHtml());
}

function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
          <span class="button-label">edit</span>
        </button>
        <input type="text" name="edit-text-box" class="edit-text-box ${itemIndex}">
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({ name: itemName, checked: false });
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form-entry').submit(function (event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

//function to actually delete item from array

function deleteListItem(itemIndex) {
  console.log(`deleting item from index ${itemIndex} from STORE list`);
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', function (event) {
    const itemIndex = getItemIndexFromElement(event.currentTarget);

    deleteListItem(itemIndex);
    renderShoppingList();
    //As a user, I can delete an item from the list
    console.log('`handleDeleteItemClicked` ran');
  });

}

function generateCheckedList(shoppingList) {
  console.log('Generating filtered shopping list element');
  const filteredItems = shoppingList.filter(item => item.checked);
  const filteredItemsString = generateShoppingItemsString(filteredItems);
  return filteredItemsString;
}

function renderFilteredShoppingList() {
  // render the filtered shopping list in the DOM
  console.log('`renderFilteredShoppingList` ran');
  const filteredShoppingListItemsString = generateCheckedList(STORE.items);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(filteredShoppingListItemsString);
}

// User can press a switch/checkbox to toggle between displaying all items or displaying only items that are unchecked
function handleCheckboxChecked() {
  $('.js-shopping-list-checkbox').change(function (event) {
    console.log('`handleCheckboxChecked` ran');
    if ($(event.currentTarget).is(':checked')) {
      renderFilteredShoppingList();
    } else {
      renderShoppingList();
    }
  });
}
function renderSearchShoppingList(searchName) {
  // render the search shopping list in the DOM
  console.log('`renderSearchShoppingList` ran');
  const searchShoppingListItemsString = generateSearchList(searchName);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(searchShoppingListItemsString);
}
// Function to search through STORE.items for something with same .name and return an array to be initalized
function generateSearchList(searchName) {
  console.log(`looking for ${searchName}`);
  const searchList = STORE.items.filter(itemName => itemName.name.toLowerCase().includes(searchName.toLowerCase()));
  const searchListString = generateShoppingItemsString(searchList);
  return searchListString;
}
// function to turn search array to html
// User can type in a search term and the displayed list will be filtered by item names only containing that search term
function handleSearchTextbox() {
  $('#js-shopping-list-form-search').submit(function (event) {
    event.preventDefault();
    console.log('`handleSearchTextbox` ran');
    console.log($('.js-shopping-list-search').val());
    const searchItemName = $('.js-shopping-list-search').val();
    $('.js-shopping-list-search').val('');
    renderSearchShoppingList(searchItemName);
  });
}

// Function to change the value of name in object
function changeName(itemIndex, newName) {
  console.log(`${STORE.items[itemIndex].name} to ${newName}`);
  STORE.items[itemIndex].name = newName;
}
// User can edit the title of an item
function handleItemEdit() {
  $('.js-shopping-list').on('click', '.js-item-edit', function(event) {
    console.log('`handleItemEdit` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    const newName = $(`.${itemIndex}`).val();
    //if empty string is submitted, do nothing
    if(newName !== '') {
      changeName(itemIndex, newName);
    } else {
      console.log('empty string edited');
    }
    renderShoppingList();
  });
  
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderListForm();
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleCheckboxChecked();
  handleSearchTextbox();
  handleItemEdit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);