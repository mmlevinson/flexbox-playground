// import { validateDimensions } from './validate.js';

/* Globals */
/* For coding clarity, we store reference to DOM elements in one
place, a key:value object */
const elements = {
  flexContainer: {
    landscape: document.querySelector('.flex-container#landscape'),
    portrait: document.querySelector('.flex-container#portrait'),
    checkbox: {
      landscape: document.querySelectorAll('li.dimensions.flex-container input[type=checkbox]')[0],
      portrait: document.querySelectorAll('li.dimensions.flex-container input[type=checkbox]')[1],
    },
    dimensions: {
      landscape: {
        width: document.querySelector('.flex-container .landscape-width'),
        height: document.querySelector('.flex-container .landscape-height'),
      },
      portrait: {
        width: document.querySelector('.flex-container .portrait-width'),
        height: document.querySelector('.flex-container .portrait-height'),
      },
    },
    displayType: document.getElementById('displayType'),
    flexDirection: document.getElementById('flexDirection'),
    flexWrap: document.getElementById('flexWrap'),
    justifyContent: document.getElementById('justifyContent'),
    alignItems: document.getElementById('alignItems'),
    alignContent: document.getElementById('alignContent'),
    gap: document.getElementById('gap'),
    overflow: document.getElementById('overflowType'),
    buttons: {
      list: document.getElementById('flex-container-buttons'),
    },
  },
  flexItems: {
    checkbox: {
      landscape: document.querySelectorAll('li.dimensions.flex-items input[type=checkbox]')[0],
      portrait: document.querySelectorAll('li.dimensions.flex-items input[type=checkbox]')[1],
      list: document.querySelectorAll('.checkbox__flex-item'),
    },
    dimensions: {
      landscape: {
        width: document.querySelector('.flex-items .landscape-width'),
        height: document.querySelector('.flex-items .landscape-height'),
      },
      portrait: {
        width: document.querySelector('.flex-items .portrait-width'),
        height: document.querySelector('.flex-items .portrait-height'),
      },
    },
    flexProportion: document.getElementById('flexProportion'),
    flexGrow: document.getElementById('flexGrow'),
    flexShrink: document.getElementById('flexShrink'),
    flexBasis: document.getElementById('flexBasis'),
    flexBasisValue: document.getElementById('flexBasisValue'),
    alignSelf: document.getElementById('alignSelf'),
    flexItemText: document.getElementById('flex-item-text'),
    flexItems: document.querySelectorAll('.flex-item-checkbox'), //array
    buttons: {
      list: document.getElementById('flex-item-buttons'),
    },
    list: document.querySelectorAll('.flex-item'),
  },
  mediaQueries: {
    buttons: {
      list: document.getElementById('media-query-buttons'),
    },
    textArea: document.getElementById('media-queries'),
  },
  cssOutput: {
    buttons: {
      list: document.getElementById('css-output-buttons'),
    },
    textArea: document.getElementById('css-output'),
  },
};

const state = {
  flexContainer: {
    landscape: {
      checked: true,
    },
    portrait: {
      checked: true,
    },
  },
  flexItems: {
    landscape: {
      checked: false,
    },
    portrait: {
      checked: false,
    },
  },
};

const defaults = {
  displayType: 'BLOCK',
};

/* Perform setup in advance of any User activated events */
initialize();

/* Hoisted... */
function initialize() {
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
  elements.flexItems.buttons.reset = elements.flexItems.buttons.list.children[0];
  elements.flexItems.buttons.undo = elements.flexItems.buttons.list.children[1];
  elements.flexItems.buttons.apply = elements.flexItems.buttons.list.children[2];
  elements.flexItems.checkbox.itemOne = elements.flexItems.checkbox.list[0];
  elements.flexItems.checkbox.itemTwo = elements.flexItems.checkbox.list[1];
  elements.flexItems.checkbox.itemThree = elements.flexItems.checkbox.list[2];
  elements.flexItems.checkbox.itemFour = elements.flexItems.checkbox.list[3];
  console.log(`elements`, elements);
  setUpEventListeners();
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
    setGap(event.target.value);
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
  elements.flexContainer.justifyContent.addEventListener('change', (event) => {
    setFlexContainerStyle('align-items', event.target.value);
  });
  elements.flexContainer.justifyContent.addEventListener('change', (event) => {
    setFlexContainerStyle('align-content', event.target.value);
  });
  elements.flexContainer.justifyContent.addEventListener('change', (event) => {
    setFlexContainerStyle('overflow', event.target.value);
  });
}

function updateFlexItems() {
  //we need to poll listItem CheckBoxes and find which ones are checked
    //update the Flex-Item-Text field first

    const itemText = elements.flexItems.flexItemText.value;
    if (itemText) {
        console.log(`itemText`, itemText);
        //loop each item in elements.flexItems.itemsList and set their span.textContent
        for (let index = 0; index < 4; index++) {
            const portraitItem = elements.flexItems.list[index];
            const landscapeItem = elements.flexItems.list[index+4];
            if (elements.flexItems.checkbox.list[index].checked) {
                portraitItem.firstElementChild.textContent = itemText;
                landscapeItem.firstElementChild.textContent = itemText;
            } else {
                portraitItem.firstElementChild.textContent = index.toString();
                landscapeItem.firstElementChild.textContent = index.toString();
            }
            
        }

    }
}

function setUpButtonListeners() {
  //the FlexItem Apply button
  elements.flexItems.buttons.apply.addEventListener('click', (event) => {
    updateFlexItems();
  });
}

function setFlexContainerStyle(property, newValue) {
  elements.flexContainer.landscape.style[property] = newValue;
  elements.flexContainer.portrait.style[property] = newValue;
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
  elements.flexContainer.overflow.disabled = !isFlex;
  elements.flexItems.flexProportion.disabled = !isFlex;
  elements.flexItems.flexGrow.disabled = !isFlex;
  elements.flexItems.flexShrink.disabled = !isFlex;
  elements.flexItems.flexBasis.disabled = !isFlex;
  elements.flexItems.flexBasisValue.disabled = !isFlex;
  elements.flexItems.alignSelf.disabled = !isFlex;

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
  //stub for now
}
