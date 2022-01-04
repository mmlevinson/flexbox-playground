const DEFAULT_FLEX_ITEM_COUNT = 4;

/* Globals */
/* For coding clarity, we store reference to DOM elements in one
place, a key:value object */
const elements = {
  tabs: {
    settings: {
      flexContainer: document.getElementById('tab-flex-container'),
      flexItems: document.getElementById('tab-flex-items'),
      flexItemContent: document.getElementById('tab-flex-item-content'),
      cssOutput: document.getElementById('tab-css-output'),
    },
    panels: {
      flexContainer: document.getElementById('panel-flex-container'),
      flexItems: document.getElementById('panel-flex-items'),
      flexItemContent: document.getElementById('panel-flex-item-content'),
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
  },
  childContent: {
    flexItemContent: document.getElementById('flex-item-text'),
    customCSS: document.getElementById('custom-CSS'),
  },
  additionalCSS: {
    buttons: {
      list: document.getElementById('additional-css-buttons'),
    },
    textArea: document.getElementById('custom-css-text'),
  },
  cssOutput: document.getElementById('css-output'),
  navigation: {
    undo: null,
    defaults: null,
    apply:null,
    reset: document.querySelector('.main-nav-item.reset-item'),
    copy: document.querySelector('.main-nav-item.copy-item'),
    load: document.querySelector('.main-nav-item.load-item'),
    save: document.querySelector('.main-nav-item.save-item'),
  },
  menus: {
    deviceMenu: document.getElementById('select-device-menu'),
  },
  icons: {
    deviceOutline: document.getElementById('device-outline'),
    rotateIcon: document.getElementById('rotate-icon'),
  },
  buttons: {
    restoreDefaults: {
      flexContainer: document.getElementById('flex-container-defaults-button'),
      flexItems: document.querySelector('.action-button.flex-items-defaults'),
      flexItemContents:null
    },
    apply: {
      flexContainer: document.getElementById('flex-container-apply-button'),
      flexItems: document.querySelector('.action-button.flex-items-apply'),
      flexItemContents:null,
    },
    undo: {
      flexContainer: null,
      flexItems: document.querySelector('.action-button.flex-items.undo'),
      flexItemContents:null,
    },
    copyToClipboard: document.querySelector('.action-button.copy-to-clipboard'),
    
  }
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


export { elements, state, defaults };
