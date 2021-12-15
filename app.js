import { validateDimensions, validateHowManyItems } from './validate.js';
import { LoremIpsum } from './classes.js';
import { clearFlexContainers } from './helpers.js';
import { elements, state, defaults } from './globals.js';

let FLEX_ITEM_COUNT;
let whichFlexItems = []; //any flex-items settings apply to these children

/* Perform setup in advance of any User activated events */
initialize();

/* Hoisted... */
function initialize() {
  //we store references to all DOM elements we need in one global Object
  console.log(`elements`, elements);
  //additional properties of elements are set here b/c they are not accessible
  //in the elements constructor
  elements.flexContainer.buttons.reset = elements.flexContainer.buttons.list.children[0];
  elements.flexItems.buttons.reset = elements.flexItems.buttons.list.children[0];
  elements.flexItems.buttons.undo = elements.flexItems.buttons.list.children[1];
  elements.flexItems.buttons.apply = elements.flexItems.buttons.list.children[2];
  elements.additionalCSS.buttons.reset = elements.additionalCSS.buttons.list.children[0];
  elements.additionalCSS.buttons.undo = elements.additionalCSS.buttons.list.children[1];
  elements.additionalCSS.buttons.apply = elements.additionalCSS.buttons.list.children[2];
  setUpEventListeners();


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
  //set the sizes of the FlexContainers, and their input fields
  // console.log(`defaults`, defaults);
  //   elements.flexContainer.landscape.style.setProperty('width', defaults.flexContainer.landscape.dimensions.width);
  //   elements.flexContainer.landscape.style.setProperty('height', defaults.flexContainer.landscape.dimensions.height);
  //   elements.flexContainer.portrait.style.setProperty('width', defaults.flexContainer.portrait.dimensions.width);
  //   elements.flexContainer.portrait.style.setProperty('height', defaults.flexContainer.portrait.dimensions.height);
}

function setUpFlexItems(newValue) {

    function newFlexItem(index) {
      /* factory method */
    const newDiv = document.createElement('div');
    newDiv.textContent = LoremIpsum.getSentence(10);
    newDiv.classList.add('flex-item');
    const span = document.createElement('span');
    span.textContent = index.toString();
    span.classList.add('flex-item-number');
    newDiv.appendChild(span);
    return newDiv;
  }
  // const numItems = elements.flexContainer.howManyItems.value;
  // console.log(`newValue`, newValue);
  if (!validateHowManyItems(newValue)) return;
  clearFlexContainers(elements.flexContainer.landscape, elements.flexContainer.portrait);
  //now create new elements meeting the number specified
  FLEX_ITEM_COUNT = +newValue; //coerce any user input value to a numeric
  for (let index = 0; index < FLEX_ITEM_COUNT; index++) {
    // let newFlexItem = document.createElement('div', { is: 'flex-item' });

    // newFlexItem.textContent = `${index + 1} ${LoremIpsum.getSentence(10)}`;
    //   console.log(`newFlexItem`, newFlexItem);
    // newFlexItem = document.createElement('div', { is: 'flex-item' });
    // newFlexItem.textContent = `${index + 1} ${LoremIpsum.getSentence(10)}`;
    //   let newFlexItem = spawnFlexItem(index, LoremIpsum.getSentence(10));
    elements.flexContainer.landscape.append(newFlexItem(index));
    elements.flexContainer.portrait.append(newFlexItem(index));
  }
  //update our references to all the flex-items so we can change
  //their content using the Apply button
  elements.flexItems.list = document.querySelectorAll('.flex-item');
}

function setUpEventListeners() {
  setUpCheckboxListeners();
  setUpValueFieldListeners();
  setUpMenuListeners();
  setUpButtonListeners();
  setUpToolTipListeners();
}

function updateCSS() {
  //print out the .style property of the FlexContainer and each FlexIem
  //I found an interesting property called cssText on the style object
  //Is this the custom CSS added programatically???
  let style = elements.flexContainer.landscape.style.cssText;
  const landscapeStyle = style.replaceAll(';', ';\n');
  style = elements.flexContainer.portrait.style.cssText;
  const portraitStyle = style.replaceAll(';', ';\n');
  let cssText = `\ndiv.flex-container  {\n${landscapeStyle}}\n\n`;

  let flexItemCSS = '';
  whichFlexItems.forEach((itemNumber) => {
    style = elements.flexItems.list[itemNumber - 1].style.cssText.replaceAll(';', ';\n');
    flexItemCSS += `div.flex-item_${itemNumber}:{ \n ${style}}\n\n`;
  });
  elements.cssOutput.textArea.textContent = cssText + flexItemCSS;
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

  elements.additionalCSS.buttons.apply.addEventListener('click', (event) => {
    //update the custom.css file which is imported into the project
    const additionalCSSText = elements.additionalCSS.textArea.value;
    const rules = additionalCSSText.split('}');
    console.log(`rules`, rules);
  });
}

function setUpToolTipListeners() {
  //get the label for each one of these elements, its the parent.firstElementChild?
  //set up a 'hover' event and set the tooltip text
}

function setFlexContainerStyle(property, newValue) {
  //   console.log(`property, newValue`, property, newValue);
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
  let itemText = elements.flexItems.flexItemText.value;

  if (!itemText) {
    return;
  }
  //is this LoremXX?
  const loremCount = LoremIpsum.isLorem(itemText);
  console.log(`loremCount`, loremCount);
  if (loremCount) {
    //returns 0 if not begins with 'lorem'
    itemText = LoremIpsum.getSentence(loremCount);
  }

  for (let index = 0; index < whichFlexItems.length; index++) {
    const portraitItem = elements.flexItems.list[whichFlexItems[index] - 1];
    portraitItem.textContent = `${index} ${itemText}`;
    const landscapeItem = elements.flexItems.list[whichFlexItems[index] + FLEX_ITEM_COUNT - 1];
    landscapeItem.textContent = `${index} ${itemText}`;
    //the flex item text
  }
}

function updateFlexItemProperty(property, newValue) {
  for (let index = 0; index < whichFlexItems.length; index++) {
    let portraitItem = elements.flexItems.list[whichFlexItems[index] - 1];
    let landscapeItem = elements.flexItems.list[whichFlexItems[index] + FLEX_ITEM_COUNT - 1];
    portraitItem.style.setProperty(property, newValue);
    landscapeItem.style.setProperty(property, newValue);
  }
}

function updateAllFlexItems(event) {
  console.log(`event`, event);
  parseWhichItems();
  updateFlexItemText();
  updateFlexItemProperty('flex-grow', elements.flexItems.flexGrow.value); //update flex-grow for whichFlexItems
  updateFlexItemProperty('flex-shrink', elements.flexItems.flexShrink.value); //update flex-shrink for whichFlexItems
  updateFlexItemProperty('flex-basis', elements.flexItems.flexBasis.value); //update flex-basis for whichFlexItems
  updateFlexItemProperty('align-self', elements.flexItems.alignSelf.value); //update align-self for whichFlexItems
  updateCSS();
}

/* whichItems is a field that takes a space-delimited array of numbers
which tells us which FlexItems to be modified by the Apply button.  This allows
the user to set individual properties for each FlexItem */
import { isValidIndex } from './validate.js';
function parseWhichItems() {
  whichFlexItems = []; //reset
  const userEntry = elements.flexItems.whichItems.value;
  let choices = userEntry.trim().split(' ');
  choices.forEach((choice) => {
    if (isValidIndex(choice, FLEX_ITEM_COUNT)) {
      whichFlexItems.push(+choice); //output a Number
    }
  });
  console.log(`whichFlexItems`, whichFlexItems);
}

function setDefault(container, key) {
  //   console.log(`defaults`, defaults);
  const property = defaults[container][key].property;
  const defaultValue = defaults[container][key].default;
  elements[container][key].value = defaultValue;
  //programmatically setting the menu.value did not fire an 'input' event
  //so we must also simulate this manually
  if (container === 'flexContainer') {
    setFlexContainerStyle(property, defaultValue);
  }
}
