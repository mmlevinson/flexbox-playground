import { validateDimensions, validateHowManyItems } from './js/validate.js';
import { LoremIpsum } from './js/classes.js';
import { clearAllChildren, toCamelCase } from './js/helpers.js';
import { elements, state, defaults } from './js/globals.js';
import CSSParser from './js/cssParser.js';
import Parser from './js/parser.js';
import { devices } from './data/devices.js';

let FLEX_ITEM_COUNT;
let WHICH_FLEX_ITEMS = new Set(); //any flex-items settings apply to these children
let customCSSDirty = false; //set this once user makes any changes

/* Perform setup in advance of any User activated events */
initialize();

/* Hoisted... */
function initialize() {
  //we store references to all DOM elements we need in one global Object
  console.log(`elements`, elements);
  //additional properties of elements are set here b/c they are not accessible
  //in the elements constructor
  // elements.flexItems.6

  // elements.flexItems.buttons.apply = elements.flexItems.buttons.list.children[1];
  elements.additionalCSS.buttons.reset = elements.additionalCSS.buttons.list.children[0];
  elements.additionalCSS.buttons.apply = elements.additionalCSS.buttons.list.children[1];
  setUpEventListeners();

  reset(); //establishes default state of app, calls setUpFlexItems();
  setUpDimensionWatcher();
}

function flexItemDefaults() {
  setDefault('flexItems', 'flexProportion');
  setDefault('flexItems', 'flexShrink');
  setDefault('flexItems', 'flexGrow');
  setDefault('flexItems', 'flexBasis');
  setDefault('flexItems', 'alignSelf');
  setDefault('flexItems', 'flexOrder');
}

function flexContainerDefaults() {
  //set menus back to defalut values

  setDefault('flexContainer', 'overflow');
  setDefault('flexContainer', 'flexDirection');
  setDefault('flexContainer', 'flexWrap');
  setDefault('flexContainer', 'alignContent');
  setDefault('flexContainer', 'justifyContent');
  setDefault('flexContainer', 'alignItems');
  setDefault('flexContainer', 'gap');
}

function reset() {
  setUpFlexItems(defaults.flexContainer.howManyItems);
  flexContainerDefaults();
  flexItemDefaults();
  setDefault('flexContainer', 'displayType');
  setDisplayType(defaults.flexContainer.displayType.default); //flex
  updateCSS();
}

function switchTab(identifier) {
  let words = identifier.split('-');
  words.splice(0, 1); //remove 'tab | panel'
  let clickedTab = toCamelCase(words.join('-'));
  //rebuild the correct key for elements.tabs
  console.log(`clickedTab`, clickedTab);
  for (const tab in elements.tabs.settings) {
    if (tab === clickedTab) {
      elements.tabs.settings[tab].classList.add('active-tab');
      elements.tabs.panels[tab].style.display = 'flex';
    } else {
      elements.tabs.settings[tab].classList.remove('active-tab');
      elements.tabs.panels[tab].style.display = 'none';
    }
  }
}

function setUpFlexItems(newValue) {
  //CACHE CONTENT OF EXISTING FLEX ITEMS BEFORE
  //  creating new ones, so prior work not lost
  //  then restore content when finished

  function newFlexItem(index) {
    /* factory method */
    const newDiv = document.createElement('div');
    newDiv.textContent = LoremIpsum.getSentence(defaults.loremText.words);
    newDiv.classList.add('flex-item');
    newDiv.id = `item__${index}`;
    const span = document.createElement('span');
    //RESTORE CACHED CONTENT?
    span.textContent = `${index + 1}`;
    span.classList.add('flex-item-number');
    newDiv.appendChild(span);
    return newDiv;
  }

  if (!validateHowManyItems(newValue)) return;
  clearAllChildren(elements.flexContainer.landscape);

  FLEX_ITEM_COUNT = +newValue; //coerce any user input value to a numeric
  for (let index = 0; index < FLEX_ITEM_COUNT; index++) {
    //create a new div.flex-item in the parent flex-container
    elements.flexContainer.landscape.append(newFlexItem(index));
  }
  //update our references to all the flex-items so we can change
  //their content using the Apply button
  elements.flexItems.list = document.querySelectorAll('.flex-item');
  updateCSS();
}

function setUpEventListeners() {
  setUpValueFieldListeners();
  setUpMenuListeners();
  setUpButtonListeners();
  setUpToolTipListeners();
}

function updateCSS() {
  //print out the .style property of the FlexContainer and each FlexIem
  //I found an interesting property called cssText on the element.style object
  //Is this the custom CSS added programatically???
  let style = elements.flexContainer.landscape.style.cssText;
  const landscapeStyle = style.replaceAll(';', ';\n');
  // style = elements.flexContainer.portrait.style.cssText;
  // const portraitStyle = style.replaceAll(';', ';\n');
  let cssText = `\ndiv.flex-container  {\n${landscapeStyle}}\n\n`;

  let flexItemCSS = '';
  let additionalCSSTemplate = '/*Additional CSS Rules*/\n\n';

  for (let index = 0; index < FLEX_ITEM_COUNT; index++) {
    const element = elements.flexItems.list[index];
    style = element.style.cssText.replaceAll(';', ';\n');
    flexItemCSS += `div.flex-item#item__${index + 1} { \n ${style}}\n\n`;
    additionalCSSTemplate += `div.flex-item#item__${index + 1} { \n\n}\n\n`;
  }

  elements.cssOutput.textContent = cssText + flexItemCSS;

  //If not edits in AdditionalCSS...embed a new template
  if (!customCSSDirty) {
    elements.additionalCSS.textArea.value = additionalCSSTemplate;
  }
}

function setUpValueFieldListeners() {
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

  elements.menus.deviceMenu.addEventListener('change', (event) => {
    console.log(`value`, event.target.value);
      const deviceName = event.target.value; //ie iPhone12
     //lookup the default w/h
    const dimensions = devices[deviceName];
    console.log(`dimensions`, dimensions);
    switchLayoutSize(dimensions);
  });
}

// function setUpItemButtons() {
//   //create <span.item-number>digit</span> for each FLEX_ITEM_COUNT
//   //remove all children
//   while (elements.flexItems.buttons.items.lastChild) {
//     elements.flexItems.buttons.items.removeChild(elements.flexItems.buttons.items.lastChild);
// }
//   for (let index = 0; index < FLEX_ITEM_COUNT; index++) {
//     let newSpan = document.createElement('span');
//     newSpan.classList.add('item-number');
//     newSpan.textContent = index.toString();
//     elements.flexItems.buttons.items.appendChild(newSpan);
//   }
  
// }

function setUpButtonListeners() {
  //    Main Nav Menu buttons
  elements.navigation.reset.addEventListener('click', () => {
    reset();
  });

  for (const key in elements.tabs.settings) {
    elements.tabs.settings[key].addEventListener('click', (event) => {
      switchTab(event.srcElement.id);
    });
  }

  // setUpItemButtons();

  

  //FlexContainer Restore Defaults
  // elements.flexContainer.buttons.restoreDefaults.addEventListener('click', (event) => {
  //   flexContainerDefaults();
  // });

  elements.flexItems.buttons.defaults.addEventListener('click', (event) => {
    flexItemDefaults();
    updateAllFlexItems(event);
  });

  // the FlexItem Apply button
  elements.flexItems.buttons.apply.addEventListener('click', (event) => {
    updateAllFlexItems(event);
  });

  //AdditionalCSS Apply Button
  elements.additionalCSS.buttons.apply.addEventListener('click', (event) => {
    //update the custom.css file which is imported into the project
    parseAdditionalCSS(elements.additionalCSS.textArea.value);
  });

  elements.icons.rotateIcon.addEventListener('click', (event) => {
    rotateOrientation(event);
  });
}

function setUpToolTipListeners() {
  //get the label for each one of these elements, its the parent.firstElementChild?
  //set up a 'hover' event and set the tooltip text
}

function setFlexContainerStyle(property, newValue) {
  //   console.log(`property, newValue`, property, newValue);
  elements.flexContainer.landscape.style.setProperty(property, newValue);
  // elements.flexContainer.portrait.style.setProperty(property, newValue);
  updateCSS();
}

function setDisplayType(newValue) {
  elements.flexContainer.landscape.style.display = newValue;
  // elements.flexContainer.portrait.style.display = newValue;

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
  elements.flexItems.flexOrder.disabled = !isFlex;

  updateCSS();
}

function updateFlexItemText() {
  let itemText = elements.flexItems.flexItemText.value;

  if (!itemText) return;

  //TESTING
  const parser = new Parser();
  parser.parse(itemText);
  // is this LoremXX?
  const loremCount = LoremIpsum.isLorem(itemText);
  if (loremCount) {
    //returns 0 if not begins with 'lorem'
    itemText = LoremIpsum.getSentence(loremCount);
  }

  for (let index = 0; index < WHICH_FLEX_ITEMS.length; index++) {
    const flexItem = elements.flexItems.list[WHICH_FLEX_ITEMS[index] - 1];
    flexItem.firstChild.textContent = itemText; //update the textNode associated with the
  }
}

function updateFlexItemProperty(property, newValue) {
  for (let index = 0; index < WHICH_FLEX_ITEMS.length; index++) {
    let flexItem = elements.flexItems.list[WHICH_FLEX_ITEMS[index] - 1];
    flexItem.style.setProperty(property, newValue);
  }
}

function updateAllFlexItems(event) {
  // console.log(`event`, event);
  parseWhichItems();
  updateFlexItemText();
  updateFlexItemProperty('flex', elements.flexItems.flexProportion.value);
  updateFlexItemProperty('flex-grow', elements.flexItems.flexGrow.value);
  updateFlexItemProperty('flex-shrink', elements.flexItems.flexShrink.value);
  updateFlexItemProperty('flex-basis', elements.flexItems.flexBasis.value);
  updateFlexItemProperty('align-self', elements.flexItems.alignSelf.value);
  updateFlexItemProperty('order', elements.flexItems.flexOrder.value);
  updateCSS();
}

/* whichItems is a field that takes a space-delimited array of numbers
which tells us which FlexItems to be modified by the Apply button.  This allows
the user to set individual properties for each FlexItem */
import { isValidIndex } from './js/validate.js';
function parseWhichItems() {
  WHICH_FLEX_ITEMS = []; //reset
  const userEntry = elements.flexItems.whichItems.value;
  let choices = userEntry.trim().split(' ');
  
  choices.forEach((choice) => {
    if (isValidIndex(choice, FLEX_ITEM_COUNT)) {
      WHICH_FLEX_ITEMS.push(+choice); //output a Number
    }
  });
  //   console.log(`WHICH_FLEX_ITEMS`, WHICH_FLEX_ITEMS);
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

/* MML...December 15, 2021 @ 16:08...Refactored public cssParser
 */

/* CSSParser.parseCSS(source:string) : [Objects]:
  {  selector: "div.flex-item#item__1:" 
     rules: Array(3)
        0: {property: 'flex', value: '0 1 auto'}
        1: {property: 'align-self', value: 'auto'}
        2: {property: 'order', value: '0'
  }
  */
function parseAdditionalCSS(rawText) {
  function setRule(index, property, value) {
    let flexItem = elements.flexItems.list[index - 1];
    flexItem.style.setProperty(property, value);
  }
  //there is new AdditionalCSS Content so
  customCSSDirty = true;
  const parser = new CSSParser();
  const cssData = parser.parseCSS(rawText);

  cssData.forEach((css) => {
    let whichItem = css.selector.match(/([0-9]+)/)[0]; //only retrieve the first match
    // console.log(`whichItem`, whichItem);
    let index = +whichItem; //coerce to number
    // console.log(`index`, index);
    let flexItem = elements.flexItems.list[index - 1];
    css.rules.forEach((rule) => {
      flexItem.style.setProperty(rule.property, rule.value);
    });
  });
  updateCSS();
}

function updateDeviceOutlineSize(dimensions) {
  //we need to break this out so that manual resizing of the flexContainer
  //   can resize the deviceOutline as well, but
  //   we must do this separately b/c we are tracking the resize event with the
  //   ResizeObserver API and we can't just call switchLayoutSize or we have
  //   an endless loop (re-triggering the observer, then switchLayoutSize etc.)
  elements.flexContainer.deviceOutline.style.width = `${dimensions.width}px`;
  elements.flexContainer.deviceOutline.style.height = `${dimensions.height + 23}px`;
  
}

function switchLayoutSize(dimensions) {
  elements.flexContainer.landscape.style.width = `${dimensions.width}px`;
  elements.flexContainer.landscape.style.maxWidth = `${dimensions.width}px`;
  elements.flexContainer.landscape.style.height = `${dimensions.height}px`;
  elements.flexContainer.landscape.style.maxHeight = `${dimensions.height}px`;
  updateDeviceOutlineSize(dimensions);   //must be separate b/c also called by the observer
}

function rotateOrientation() {
  //just swap width/height of current layout dimensions
  const width = elements.flexContainer.landscape.offsetWidth;
  const height = elements.flexContainer.landscape.offsetHeight;
  switchLayoutSize({
    width: height,
    height:width,
  })
}

/* From StackOverflow Example  ResizeObserver API  */
function onResize(element, callback) {
  const resizeObserver = new ResizeObserver(() => callback());
  resizeObserver.observe(element);
}

function setUpDimensionWatcher() {
  const layoutDimensions = document.querySelector('.layout-dimensions');
  onResize(elements.flexContainer.landscape, () => {
    const summary = `${elements.flexContainer.landscape.offsetWidth} px x ${elements.flexContainer.landscape.offsetHeight} px`;
    layoutDimensions.textContent = summary;
    updateDeviceOutlineSize({
      width: elements.flexContainer.landscape.width,
      height: elements.flexContainer.landscape.height,
    })
  });
}
