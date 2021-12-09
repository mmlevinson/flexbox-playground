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
  console.log(`elements`, elements);
  setUpEventListeners();
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
}

function updateDislayType(event) {
  elements.flexContainer.landscape.style.display = event.target.value;
  elements.flexContainer.portrait.style.display = event.target.value;

  let isFlex = false;
  if (event.target.value === 'flex' || event.target.value === 'inline-flex') {
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

function updateFlexDirection(event) {
    elements.flexContainer.landscape.style.flexDirection = event.target.value;
    elements.flexContainer.portrait.style.flexDirection = event.target.value;
    updateCSS();
}

function setUpMenuListeners() {
  elements.flexContainer.displayType.addEventListener('change', (event) => {
    updateDislayType(event);
  });
  elements.flexContainer.flexDirection.addEventListener('change', (event) => {
    updateFlexDirection(event);
  });
}

function setUpEventListeners() {
  setUpCheckboxListeners();
  setUpValueFieldListeners();
  setUpMenuListeners();
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

function updateFlexContainer() {
  //set the style properties of the Flex Container
  flexContainer.style.display = displayTypeMenu.value;
}

function updateFlexItemText() {
  //stub for now
}
