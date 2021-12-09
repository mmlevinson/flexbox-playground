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
    flexItemText: document.getElementById('flex-item-text'),
    flexGrow: document.getElementById('flexGrow'),
    flexShrink: document.getElementById('flexShrink'),
    flexBasis: document.getElementById('flexBasis'),
    flexBasisValue: document.getElementById('flexBasisValue'),
    alignSelf: document.getElementById('alignSelf'),
    flexItems: document.querySelectorAll('.flex-item-checkbox'), //array
    buttons: {
      list: document.getElementById('flex-item-buttons'),
    },
  },

  cssResults: {
    textArea: document.getElementById('css'),
  },
  mediaQueries: {
    buttons: {
      list: document.getElementById('media-query-buttons'),
    },
    textArea: document.getElementById('media-queries'),
  },
};


const state = {
    flexContainer: {
        landscape: {
            checked:false,
        },
        portrait: {
            checked:false,
        }
    },
    flexItems: {
        landscape: {
            checked:false,
        },
        portrait: {
            checked:false,
        }
    },
}

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
  console.log(`elements`, elements);
  setUpEventListeners();
}

function setUpCheckboxListeners() {
   //checkboxes
   elements.flexContainer.checkbox.landscape.addEventListener('input', (event) => {
    setDimensions('flexContainer', 'landscape', event.target.checked);
  });
  elements.flexContainer.checkbox.landscape.addEventListener('input', (event) => {
    setDimensions('flexContainer', 'portrait', event.target.checked);
  });  
}

function setUpValueFieldListeners() {
    //numeric input fields
    elements.flexContainer.dimensions.landscape.width.addEventListener('input', (event) => {
        setDimensions('flexContainer', 'landscape', state.flexContainer.landscape.checked);
    })
    elements.flexContainer.dimensions.landscape.height.addEventListener('input', (event) => {
        setDimensions('flexContainer', 'landscape', state.flexContainer.landscape.checked);
    })
}

function setUpEventListeners() {
    setUpCheckboxListeners();
    setUpValueFieldListeners();
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
}

function updateFlexContainer() {
  //set the style properties of the Flex Container
  flexContainer.style.display = displayTypeMenu.value;
}

function updateFlexItemText() {
  //stub for now
}
