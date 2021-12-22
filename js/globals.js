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
      portraitLayout: document.getElementById('tab-portrait-layout'),
    },
    panels: {
      flexContainer: document.getElementById('panel-flex-container'),
      flexItems: document.getElementById('panel-flex-items'),
      customCSS: document.getElementById('panel-custom-CSS'),
      cssOutput: document.getElementById('panel-css-output'),
      portraitLayout: document.getElementById('panel-portrait-layout'),
    },
  },
  flexContainer: {
    landscape: document.querySelector('.flex-container#landscape'),
    portrait: document.querySelector('.flex-container#portrait'),
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
      list: document.getElementById('flex-item-buttons'),
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
    text: 'Tip',
  },
  displayType: {
    text: 'Tip',
  },
  flexDirection: {
    text: 'Tip',
  },
  flexWrap: {
    text: 'Tip',
  },
  justifyContent: {
    text: 'Tip',
  },
  alignItems: {
    text: 'Tip',
  },
  alignContent: {
    text: 'Tip',
  },
  order: {
    text: 'Tip',
  },
  gap: {
    text: 'Tip',
  },
};

export { elements, state, defaults, toolTips };
