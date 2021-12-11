import { validateDimensions, validateHowManyItems } from './validate.js';

import { FlexItem } from './classes.js';
import { clearFlexContainers } from './helpers.js';
import { elements, state, defaults, FLEX_ITEM_COUNT } from './globals.js';

/* Perform setup in advance of any User activated events */
initialize();

/* Hoisted... */
function initialize() {
  //we store references to all DOM elements we need in one global Object
  console.log(`elements`, elements);
  //additional properties of elements are set here b/c they are not accessible
  //in the elements constructor
  elements.flexContainer.buttons.reset = elements.flexContainer.buttons.list.children[0];
  elements.flexContainer.buttons.undo = elements.flexContainer.buttons.list.children[1];
  elements.flexContainer.buttons.apply = elements.flexContainer.buttons.list.children[2];
  elements.flexItems.buttons.reset = elements.flexItems.buttons.list.children[0];
  elements.flexItems.buttons.undo = elements.flexItems.buttons.list.children[1];
  elements.flexItems.buttons.apply = elements.flexItems.buttons.list.children[2];
  elements.mediaQueries.buttons.reset = elements.mediaQueries.buttons.list.children[0];
  elements.mediaQueries.buttons.undo = elements.mediaQueries.buttons.list.children[1];
  elements.mediaQueries.buttons.apply = elements.mediaQueries.buttons.list.children[2];
  setUpEventListeners();

  //allow dynamic number of div.flex-item using a CustomElement
  customElements.define('flex-item', FlexItem, { extends: 'div' });
  reset(); //establishes default state of app, calls setUpFlexItems();
}

function reset() {
    setUpFlexItems(defaults.flexContainer.howManyItems);
    //set menus back to defalut values
    setDefault('flexContainer', 'displayType');
    setDefault('flexContainer', 'overflow');
    setDefault('flexContainer', 'flexDirection');
    setDefault('flexContainer', 'flexWrap');
    setDefault('flexContainer', 'alignContent');
    setDefault('flexContainer', 'justifyContent');
    setDefault('flexContainer', 'alignItems');
    setDefault('flexContainer', 'gap');
    //   setDefault('flexContainer', 'flexOrder');
  }

function setUpFlexItems(newValue) {
  // const numItems = elements.flexContainer.howManyItems.value;
  // console.log(`newValue`, newValue);
  if (!validateHowManyItems(newValue)) return;
  clearFlexContainers(elements.flexContainer.landscape, elements.flexContainer.portrait);
  //now create new elements meeting the number specified
  const flexItemCount = +newValue; //coerce any user input value to a numeric
  for (let index = 0; index < flexItemCount; index++) {
    let newFlexItem = document.createElement('div', { is: 'flex-item' });
    newFlexItem.firstElementChild.textContent = (index + 1).toString();
    elements.flexContainer.landscape.append(newFlexItem);
    //newFlexItem.cloneNode(true) failed...created a ghost <span> instead of a true copy
    newFlexItem = document.createElement('div', { is: 'flex-item' });
    newFlexItem.firstElementChild.textContent = (index + 1).toString();
    elements.flexContainer.portrait.append(newFlexItem);
  }
}

function setUpEventListeners() {
  setUpCheckboxListeners();
  setUpValueFieldListeners();
  setUpMenuListeners();
  setUpButtonListeners();
}

function updateCSS() {
  //print out the .style property of the FlexContainer and each FlexIem
  //I found an interesting property called cssText on the style object
  //Is this the custom CSS added programatically???
  let style = elements.flexContainer.landscape.style.cssText;
  const landscapeStyle = style.replaceAll(';', ';\n');
  style = elements.flexContainer.portrait.style.cssText;
  const portraitStyle = style.replaceAll(';', ';\n');
  let cssText = '';
  if (state.flexContainer.landscape.checked) {
    cssText = `### Landscape:\ndiv.flex-container  { \n ${landscapeStyle}}\n\n`;
  }
  if (state.flexContainer.portrait.checked) {
    cssText += `### Portrait\ndiv.flex-container { \n ${portraitStyle}}`;
  }
  elements.cssOutput.textArea.textContent = cssText;
}

function setUpCheckboxListeners() {
  //checkboxes
  elements.flexContainer.checkbox.landscape.addEventListener('input', (event) => {
    setDimensions('flexContainer', 'landscape', event.target.checked);
  });
  elements.flexContainer.checkbox.portrait.addEventListener('input', (event) => {
    setDimensions('flexContainer', 'portrait', event.target.checked);
  });
}

function setUpValueFieldListeners() {
  //numeric input fields
  elements.flexContainer.dimensions.landscape.width.addEventListener('input', (event) => {
    setDimensions('flexContainer', 'landscape', state.flexContainer.landscape.checked);
  });
  elements.flexContainer.dimensions.landscape.height.addEventListener('input', (event) => {
    setDimensions('flexContainer', 'landscape', state.flexContainer.landscape.checked);
  });
  elements.flexContainer.dimensions.portrait.width.addEventListener('input', (event) => {
    setDimensions('flexContainer', 'portrait', state.flexContainer.portrait.checked);
  });
  elements.flexContainer.dimensions.portrait.height.addEventListener('input', (event) => {
    setDimensions('flexContainer', 'portrait', state.flexContainer.portrait.checked);
  });

  elements.flexContainer.gap.addEventListener('input', (event) => {
    setFlexContainerStyle('gap', event.target.value + 'px');
  });

  elements.flexContainer.howManyItems.addEventListener('input', (event) => {
    setUpFlexItems(event.target.value);
  });

  elements.flexItems.whichItems.addEventListener('input', (event) => {
    parseWhichItems(event.target.value);
  });
}

function setUpMenuListeners() {
  elements.flexContainer.displayType.addEventListener('change', (event) => {
    setDisplayType(event.target.value);
    //   setFlexContainerStyle('display', event.target.value);
  });
  elements.flexContainer.flexDirection.addEventListener('change', (event) => {
    setFlexContainerStyle('flex-direction', event.target.value);
  });
  elements.flexContainer.flexWrap.addEventListener('change', (event) => {
    setFlexContainerStyle('flex-wrap', event.target.value);
  });
  elements.flexContainer.justifyContent.addEventListener('change', (event) => {
    setFlexContainerStyle('justify-content', event.target.value);
  });
  elements.flexContainer.alignItems.addEventListener('change', (event) => {
    setFlexContainerStyle('align-items', event.target.value);
  });
  elements.flexContainer.alignContent.addEventListener('change', (event) => {
    setFlexContainerStyle('align-content', event.target.value);
  });
  elements.flexContainer.overflow.addEventListener('change', (event) => {
    setFlexContainerStyle('overflow', event.target.value);
  });
}

function setUpButtonListeners() {
  //the FlexItem Apply button
  elements.flexItems.buttons.apply.addEventListener('click', (event) => {
    updateAllFlexItems(event);
  });
  elements.flexContainer.buttons.reset.addEventListener('click', () => {
    reset();
  });
}

function setFlexContainerStyle(property, newValue) {
  console.log(`property, newValue`, property, newValue);
  elements.flexContainer.landscape.style.setProperty(property, newValue);
  elements.flexContainer.portrait.style.setProperty(property, newValue);
  updateCSS();
}

function setDisplayType(newValue) {
  elements.flexContainer.landscape.style.display = newValue;
  elements.flexContainer.portrait.style.display = newValue;

  let isFlex = false;
  if (newValue === 'flex' || newValue === 'inline-flex') {
    isFlex = true;
  }
  elements.flexContainer.flexDirection.disabled = !isFlex;
  elements.flexContainer.flexWrap.disabled = !isFlex;
  elements.flexContainer.justifyContent.disabled = !isFlex;
  elements.flexContainer.alignItems.disabled = !isFlex;
  elements.flexContainer.alignContent.disabled = !isFlex;
  elements.flexContainer.gap.disabled = !isFlex;
  elements.flexItems.flexProportion.disabled = !isFlex;
  elements.flexItems.flexGrow.disabled = !isFlex;
  elements.flexItems.flexShrink.disabled = !isFlex;
  elements.flexItems.flexBasis.disabled = !isFlex;
  elements.flexItems.flexBasisValue.disabled = !isFlex;
  elements.flexItems.alignSelf.disabled = !isFlex;
  elements.flexItems.whichItems.disabled = !isFlex;

  updateCSS();
}

function setDimensions(target, orientation, isChecked) {
  state[target][orientation].checked = isChecked;
  if (isChecked) {
    const width = elements[target].dimensions[orientation].width.value;
    const height = elements[target].dimensions[orientation].height.value;
    console.log(`width, height`, width, height);
    elements[target][orientation].style.width = width + 'px';
    elements[target][orientation].style.height = height + 'px';
  } else {
    elements[target][orientation].style.width = 'auto';
    elements[target][orientation].style.height = 'auto';
  }
  updateCSS();
}

function updateFlexItemText() {
  const itemText = elements.flexItems.flexItemText.value;
  if (!itemText) {
    return;
  }
  for (let index = 0; index < FLEX_ITEM_COUNT; index++) {
    const portraitItem = elements.flexItems.list[index];
    const landscapeItem = elements.flexItems.list[index + FLEX_ITEM_COUNT];
    if (elements.flexItems.checkbox.list[index].checked) {
      portraitItem.firstElementChild.textContent = itemText;
      landscapeItem.firstElementChild.textContent = itemText;
    } else {
      portraitItem.firstElementChild.textContent = (index + 1).toString();
      landscapeItem.firstElementChild.textContent = (index + 1).toString();
    }
  }
}

function updateFlexItemProperty(property, newValue) {
  function updateItem(index) {
    let portraitItem = elements.flexItems.list[index];
    let landscapeItem = elements.flexItems.list[index + FLEX_ITEM_COUNT];
    portraitItem.style[property] = newValue;
    landscapeItem.style[property] = newValue;
  }
  //set flowGrow on each flexItem
  for (let index = 0; index < FLEX_ITEM_COUNT; index++) {
    updateItem(index);
  }
  updateCSS();
}

function updateAllFlexItems(event) {
  console.log(`event`, event);
  updateFlexItemText();
}

/* whichItems is a field that takes a space-delimited array of numbers
which tells us which FlexItems to be modified by the Apply button.  This allows
the user to set individual properties for each FlexItem */
import { isValidIndex } from './validate.js';
function parseWhichItems(userEntry) {
  const items = [];
  let choices = userEntry.trim().split(' ');
  choices.forEach((choice) => {
    if (isValidIndex(choice)) {
      items.push(+choice); //output a Number
    }
  });
  console.log(`items`, items);
}

function setDefault(container, key) {
  const property = defaults[container][key].property;
  const defaultValue = defaults[container][key].default;
  elements[container][key].value = defaultValue;
  //programmatically setting the menu.value did not fire an 'input' event
  //so we must also simulate this manually
  if (container === 'flexContainer') {
    setFlexContainerStyle(property, defaultValue);
  }
}


