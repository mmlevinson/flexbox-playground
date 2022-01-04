const DEFAULT_FLEX_ITEM_COUNT = 4;

/* Globals */
/* For coding clarity, we store reference to DOM elements in one
place, a key:value object */
const elements = {
  tabs: {
    settings: {
      flexContainer: document.getElementById('tab-flex-container'),
      flexItems: document.getElementById('tab-flex-items'),
      cssOutput: document.getElementById('tab-css-output'),
      customCSS: document.getElementById('tab-custom-CSS'),
    },
    panels: {
      flexContainer: document.getElementById('panel-flex-container'),
      flexItems: document.getElementById('panel-flex-items'),
      customCSS: document.getElementById('panel-custom-CSS'),
      cssOutput: document.getElementById('panel-css-output'),
    },
  },
  flexContainer: {
    landscape: document.querySelector('.flex-container#landscape'),
    deviceOutline:document.querySelector('.layout.device-outline'),
    // portrait: document.querySelector('.flex-container#portrait'),
    overflow: document.getElementById('overflowType'),
    displayType: document.getElementById('displayType'),
    flexDirection: document.getElementById('flexDirection'),
    flexWrap: document.getElementById('flexWrap'),
    justifyContent: document.getElementById('justifyContent'),
    alignItems: document.getElementById('alignItems'),
    alignContent: document.getElementById('alignContent'),
    order: null,
    gap: document.getElementById('gap'),
    howManyItems: document.getElementById('howManyItems'),
    buttons: {
      restoreDefaults: document.getElementById('flex-container-defaults-button'),
    },
  },
  flexItems: {
    list: document.querySelectorAll('.flex-item'),
    flexProportion: document.getElementById('flexProportion'),
    flexGrow: document.getElementById('flexGrow'),
    flexShrink: document.getElementById('flexShrink'),
    flexBasis: document.getElementById('flexBasis'),
    flexBasisValue: document.getElementById('flexBasisValue'),
    alignSelf: document.getElementById('alignSelf'),
    flexOrder: document.getElementById('flexOrder'),
    flexItemText: document.getElementById('flex-item-text'),
    // flexItems: document.querySelectorAll('.flex-item-checkbox'), //array
    whichItems: document.getElementById('whichItems'),
    buttons: {
      apply: document.querySelector('.flex-items-apply'),
      defaults: document.querySelector('.flex-items-defaults'),
      undo: document.querySelector('.flex-items-undo'),
    },
  },
  additionalCSS: {
    buttons: {
      list: document.getElementById('additional-css-buttons'),
    },
    textArea: document.getElementById('custom-css-text'),
  },
  cssOutput: document.getElementById('css-output'),
  navigation: {
    reset: document.querySelector('.main-nav-item.reset-item'),
    copy: document.querySelector('.main-nav-item.copy-item'),
    load: document.querySelector('.main-nav-item.load-item'),
    save: document.querySelector('.main-nav-item.save-item'),
  },
  menus: {
    deviceMenu: document.getElementById('select-device-menu'),
  },
  toolTip: {
    text: document.querySelector('.tooltip > .tooltip-text'),
  },
  icons: {
    deviceOutline: document.getElementById('device-outline'),
    rotateIcon: document.getElementById('rotate-icon'),
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
    set: [],
  },
};

const defaults = {
  flexContainer: {
    howManyItems: DEFAULT_FLEX_ITEM_COUNT,
    landscape: {
      dimensions: {
        width: '800px',
        height: '800px',
        maxWidth: '100%',
        maxHeight: '100%',
        resize: 'both',
      },
    },
    portrait: {
      dimensions: {
        width: '300px',
        height: '100%',
        maxWidth: '300px',
        maxHeight: '100%',
        resize: 'vertical',
      },
    },
    displayType: {
      property: 'display',
      default: 'flex',
    },
    overflow: {
      property: 'overflow',
      default: 'auto',
    },
    flexDirection: {
      property: 'flex-direction',
      default: 'row',
    },
    flexWrap: {
      property: 'flex-wrap',
      default: 'nowrap',
    },
    justifyContent: {
      property: 'justify-content',
      default: 'flex-start',
    },
    alignItems: {
      property: 'align-items',
      default: 'stretch',
    },
    alignContent: {
      property: 'align-content',
      default: 'normal',
    },
    gap: {
      property: 'gap',
      default: 4,
    },
    flexOrder: {
      property: 'flex-order',
      default: 0,
    },
  },
  flexItems: {
    flexProportion: {
      property: 'flex',
      default: '0',
    },
    flexShrink: {
      property: 'flex-shrink',
      default: 1,
    },
    flexGrow: {
      property: 'flex-grow',
      default: 0,
    },
    flexBasis: {
      property: 'flex-basis',
      default: 'auto',
    },
    alignSelf: {
      property: 'align-self',
      default: 'auto',
    },
    flexOrder: {
      property: 'order',
      default: '0',
    },
  },
  loremText: {
    words: 10,
  },
};

const toolTips = {
  overflow: {
    text: 'How the browser displays content that \n exceeds the bounds of the \n enclosing box',
  },
  display: {
    text: 'The CSS Display Property, which determines \n how an element (and children ) \n participates in flow layout',
  },
  flexDirection: {
    text: 'Placement (and direction ) of items \n  positioned along the Main Axis in a \n Flex Container',
  },
  flexWrap: {
    text: 'Sets whether flex items are forced into one line \n or allowed to wrap into muliple lines (and the wrapping direction)',
  },
  justifyContent: {
    text: 'Specifies how the browser distributes excess space around items \n along the Main Axis of a Flex Container',
  },
  alignItems: {
    text: 'Controls placement of items along the Cross Axis \n of a Flex Container by setting \n the align-self of every item as a group',
  },
  alignSelf: {
    text:'Sets positioning for a single item on the Cross Axis \n by overriding the group value  set by the \n align-items property'
  },
  alignContent: {
    text: 'Sets the distribution of excess space \n around items on the Cross Axis',
  },
  order: {
    text: 'Sets the visual ordering of any single item within \n its container (which overrides the default DOM based ordering of a layout) ',
  },
  gap: {
    text: 'Optional space between items',
  },
  flexGrow: {
    text:'Sets an items proportional growth, \n if possible, along the Main Axis'
  },
  flexShrink: {
    text:'Sets an items proportional shrink-to-fit \n behavior along the Main Axis'
  },
  flexBasis: {
    text: 'Sets the initial size of an item along \n the Main Axis based on the content box unless \n otherwise set by the box-sizing property'
  },
  value: {
    text:'Quantity used for the flex-basis calculation,   such as\n%, px, (r)em, fill, max-content, min-content, fit-content'
  }
};

export { elements, state, defaults, toolTips };
