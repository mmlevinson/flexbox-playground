import { defaults } from './globals.js';
import { chop, clip, LoremIpsum } from './helpers.js';

class Element {
  level = 0;
  tag = '';
  id = '';
  classes = '';
  styles = {};
  attributes = {};
  link = '';
  content = '';

  constructor(tagName) {
    this.tag = tagName.toLowerCase(); //browser convention outputs UPPERCASE
  }
}

/*
.card
.card
-#first-card.card
--h3.card.header `lorem25`
--p.card.contents `lorem50`
---a.active {href=http://www.something.com/whatever23.find-me/?name='Max'&age='31'}
--img#banner.bannerTop.bannerActive <h:250; w:250; border:1px solid green;>  {src=http://www.flashpoint.com/} 
--label.input-label {name:bob, type:number, value:'pop warner'} `Whatever`
--input#bobsAge.numericInput {value:40} `40`
--button#apply {data-tooltip-id:apply} `Apply`
 
 
 */

class Parser {
  static indentLevelRegex = '^[-]+';
  static idRegex = '#[a-zA-Z0-9_]';
  static anyWordRegex = '(.w+)*s';
  static beginsWithHash = '#([-a-zA-z0-9_])*';
  static beginsWithNotALetter = '^[^a-zA-Z]';
  static beginsWithDotHash = '^[#.]';
  static tagRegEx = '^([^#.]*)';
  static bracketedStylesRegEx = '(<.*>)';
  static bracketedAttributesRegEx = '({.*})';
  static tickDelimitedTextContent = `.*`;
  static keyValuePairRegEx = '[-A-Za-z0-9_]+:[-A-Za-z0-9_ ]+;';
  static cssRuleRegEx = '[-wd]+:[-wds]+;';
  static urlRegEx = /[\w]+=([\w]+:\/{2}[.-\w\d?=&'"/]+)/;

  lines = [];
  levels = [];
  domos = [];    //{level:number, element:HTMLElement}
  tree = null;

  constructor() {}

  parse(rawText) {
    //windows systems use CRLF where Unix uses LN
    this.lines = rawText.replaceAll('\r\n', '\n').trim().split('\n');
    // this.getLineIndents();
    this.breakWords();
    // console.log(`this.elements`, this.elements);
    this.buildTree();
    return this.tree;
  }

  /* DEPRECATED */
  getLineIndents() {
    //for each line, get the number of dashes
    this.levels = this.lines.map((line) => {
      let matches = line.match(/^[-]+/);
      return matches === null ? 0 : matches[0].length;
    });
  }

  getLevel(firstWord) {
    let matches = firstWord.match(/^[-]+/);
    return matches === null ? 0 : matches[0].length;
  }

  getAttributes(line) {
    if (!line) return []; //guard, if empty string
    //use regex to pull out the attributes block
    let regex = new RegExp(/({.*})/, 'gi');
    let matchResults = line.match(regex); //array or null
    if (matchResults) {
      // console.log(`attrBlock`, attrBlock);
      let attributes = clip(matchResults[0], 1); //remove both curly braces
      // console.log(`attributes`, attributes);
      //pull out key:value pairs
      regex = new RegExp(/[-\w\d]+:(?:[-\w\d\s'"]+)/, 'gi');
      let pairs = attributes.match(regex);
      // console.log(`pairs`, pairs);
      return pairs;
    }
    return [];
  }

  getStyles(line) {
    //inline style block is <key:value; key:value;>
    if (!line) return []; //guard, if empty string
    let regex = new RegExp(/(<.*>)/, 'gi');
    let match = line.match(regex); //array or null
    if (match) {
      //<key:value; key:value;>
      //split out each CSS rule
      let stylesBlock = match[0];
      console.log(`stylesBlock`, stylesBlock);
      let regex = new RegExp(/([-\w\d]+):([-\w\d\s(.,%)]+);/, 'gi');
      let styles = stylesBlock.matchAll(regex);
      //array of ['key:value;', 'key:value;']
      console.log(`styles`, styles);
      // let css = pairs.map((pair) => {
      //   //remove the terminating semicolon
      //   return chop(pair, 1);
      // });
      // // console.log(`css`, css);
      // return css;
    }
    return [];
  }

  getContent(line) {
    if (!line) return ''; //guard, if empty string
    const regex = new RegExp(/`.*`/, 'gi');
    const matchResults = line.match(regex);
    if (matchResults) {
      let rawContents = clip(matchResults[0]); //remove tick marks
      const loremCount = LoremIpsum.isLorem(rawContents);
      if (loremCount) {
        //0 means the string did not begins with 'lorem'
        return LoremIpsum.getSentence(loremCount);
      } else {
        return rawContents;
      }
    }
    return '';
  }

  /* DEPRECATED */
  getElementFromWord(word) {
    if (!word) return null;
    //0 tag
    //1 tag#id
    //2 tag#id.class1.class2
    //3 tag.class1.class2
    const result = {
      tag: word, //case 0
      id: '',
      classes: '',
    };
    const hashPosition = word.indexOf('#');
    const dotPosition = word.indexOf('.');
    //Q1: Is there an #id
    if (hashPosition >= 0) {
      //A1: Yes ... (cases 1,2)
      // ... grab the tag chars from the string start
      result.tag = word.slice(0, hashPosition);
      //Q2: Is there also .class.class
      if (dotPosition >= 0) {
        //A2: Yes, there is .class.class (case #2)
        // ... grab the id
        result.id = word.slice(hashPosition + 1, dotPosition);
        // ... grab the classes (to end of string)
        result.classes = word.slice(dotPosition + 1).replaceAll('.', ' '); //to end of string
      } else {
        //A2: No classes (case 1)
        //  ... grab just the #id
        result.id = word.slice(hashPosition + 1); //to end of string
      }
    } else if (dotPosition >= 0) {
      //A1: No #id but .class1.class present (case 3)
      // ... grab tag then classes
      result.tag = word.slice(0, dotPosition);
      result.classes = word.slice(dotPosition + 1).replaceAll('.', ' ');
    }
    const newElement = new Element(result.tag);
    newElement.id = result.id;
    newElement.classes = result.classes;
    return newElement;
  }

  /* DEPRECATED */
  spawnElement(line) {
    let firstWord = line.split(' ')[0]; //first word is the Tag#id.classList followed by space char
    //guard
    if (!firstWord) {
      //empty string or null ... returns null
      return null;
    }
    let newElement = null;
    //Q: How deeply nested is this line?
    let level = this.getLevel(firstWord);
    let word = firstWord;
    //Next ... remove preceeding hyphens
    if (level > 0) {
      word = chop(firstWord, level, false); //from the front
    }
    //Then, examine for a leading <tag> string
    //   ... which must preceeed any #id or .class designation
    const hashPosition = word.indexOf('#');
    const dotPosition = word.indexOf('.');
    //Q1: starts with a tag designation?

    // 3 .class1.class2
    if (hashPosition === 0) {
      //A1: No ... first char is a hash (#) ie starts with an #id

      newElement = new Element('div');
      //Q2:  Is there also .class string?
      if (dotPosition >= 0) {
        //A2: Yes so grab #id then .classes
        // 2 #id.class1.class2
        newElement.id = word.slice(1, dotPosition);
        newElement.classes = word.slice(dotPosition + 1);
      } else {
        //A2 :No classes, so just grab #id
        // 1 #id
        newElement.id = word.slice(1); //returns all but first char
      }
    } else if (dotPosition === 0) {
      //Q3: starts with a .classes string
      //A3:  Yes ... default <div> with .classes
      newElement = new Element('div');
      newElement.classes = word.slice(1);
    } else {
      //A1 Yes...there is a tag, so create with specific tag
      newElement = this.getElementFromWord(word);
    }
    newElement.level = level;
    // console.log(`newElement`, newElement);
    return newElement;
  }

  parseLink(line) {
    //for <a> or <img> tags, there should be an attribute with the link
    //  delimited by curly braces
    const regex = new RegExp(/([\w]+)=([\w]+:\/{2}[-\w\d?=.&'"/]+)/, 'gi');
    const matchResult = regex.exec(line);
    if (matchResult) {
      // console.log(`matchResult`, matchResult);
      //matchResult[0] is the entire match
      //matchResult[1] is the protocol (src | href)
      //matchResult[2] is the link text
      const linkText = matchResult[2];
      // console.log(`linkText`, linkText);
      return linkText;
    }
    return '';
  }

  /* Multiple copies of the same tree need to have their 
  #id's and name attributes adjusted to prevent duplicates
  within the same document.    
  Also, creating a tree is the same as creating unique elements
  so you cannot just pass a copy by reference.  You must create
  new elements to utilize multiples with the same content
  This method utilizes node.clone(deep) and then walks the tree
  to append the index number to the #id */
  clone(tree, index) {
    if (!tree || index < 0) {
      return null;
    }
      
    let root = tree.clone(true); //deep.. all nodes/text
  }

  breakWords() {
    //for each line, break into words based on space char
    // const words = this.lines[0].replaceAll('-', '').split(' ');
    // console.log(`words`, words);
    // this.spawnElement(words[0]);
    // this.parseLine(this.lines[i]);
    //strip off the levels, break on space char
    // let words = this.lines[i].replaceAll('-', '').split(' ');
    // let words = this.lines[i].split(' ');
    // let newElement = this.spawnElement(words[0])); //this is the tag, id, classList parsed

    for (let i = 0; i < this.lines.length; i++) {
      let line = this.lines[i];
      let firstWord = line.split(' ')[0];
      let config = this.parseLine(line); //this is the tag, id, classList parsed
      config.styles = this.getStyles(line);
      config.content = this.getContent(line);
      config.attributes = this.getAttributes(line);
      if (config.tag === 'a' || config.tag === 'img') {
        //we need the URLs
        config.link = this.parseLink(this.lines[i]);
      }
      this.domos.push({
        level: this.getLevel(firstWord),
        element:this.buildElement(config),
      });
    }
    // console.log(`this.domos`, this.domos);
  }

  buildElement(config) {
    //given the index, create a new DOM element from our descriptive class
    const element = document.createElement(config.tag);
    if (element === null) return null;
    //embed the #id
    if (config.id) {
      element.setAttribute('id', config.id);
    }
    //embed all .classes
    if (config.classes) {
      // for (const className of config.classes) {
      //   element.classList.add(className);
      // }
      element.classList.add(config.classes);   //will accept an array
    }
    if (config.styles) {
      for (const style of config.styles) {
        element.style.setAttribute(style.key, style.property);
      }
    }
    element.textContent = config.content;
    //after configuring element, add to tree as sibling or child
    return element;
  }

  getNextPrior(currentIndex) {
    //walk up domos, checking each level for one before ours
    const current = this.domos[currentIndex];
    // console.log(`current`, current);
    let prior = null;
    let priorIndex = currentIndex - 1;
    while (priorIndex > 0) {
      // console.log(`priorIndex`, priorIndex);
      prior = this.domos[priorIndex];
      // console.log(`prior`, prior);
      if (current.level === prior.level) {
        // console.log(`prior`, prior);
        return prior.element;
      }
      priorIndex = priorIndex - 1;
    }
    return null;
  }

  appendNewElement(index) {
    //if we know the index this.elements, we can find the previous element
    //  unless its zeroth

    if (index === 0) {
      //first one, so just append to this.tree
      this.tree.append(this.domos[0].element);
      return;
    }

    const current = this.domos[index];
    const prior = this.domos[index - 1];
    // console.log(`current`, current);
    // console.log(`prior`, prior);
    // this.tree.append(current.element);
    if (current.level === prior.level) {
      // console.log(`prior.parent`, prior.parent);
      prior.element.parentElement.append(current.element);
    } else if (current.level > prior.level) {
      prior.element.append(current.element);
    } else {
      //we are outdenting, so the element is less than prior, so we
      //need to walk back until we find the nearest element one level before
      console.log(`neither`);
      const priorSibling = this.getNextPrior(index);
      // console.log(`priorSibling`, priorSibling);
      if (priorSibling) {
        priorSibling.parentElement.append(current.element);
      }
    }
  }

  /* Mother of all methods...walk down the array of Elements and build
  a node tree based on the levels of each element referenced off the previous element */
  buildTree() {
    const wrappingDiv = document.createElement('div');
    wrappingDiv.classList.add('wrapper');
    this.tree = wrappingDiv;
    for (let index = 0; index < this.domos.length; index++) {
      this.appendNewElement(index);
    }
  }

  parseLine(line) {
    //Break off the first word
    let firstWord = line.split(' ')[0];
    if (!firstWord) return null;   

    //Q: How many preceeding hyphens (to indicate nesting level)
    const level = this.getLevel(firstWord);
    //Now chop off these hyphens
    if (level > 0) {
      firstWord = chop(firstWord, level, false); //from beginning of string
    }
    //Build a new Element()
    let tag = 'div'; //default, if none specified
    let remaining = firstWord; //#id.classes if no tag present
    //Examine for preceeding <tag> designation
    //1 tag
    //2 tag#id
    //3 tag#id.classes
    //4 tag.classes
    //Regex ... find all \w\d preceeding [#.\s], using groupings
    //any isolated tags have no space chars after them so ???
    //hack
    // firstWord += ' ';   //now it does so will satisfy RegEx
    // console.log(`firstWord`, firstWord);  //h2 should now have trailing space
    const regex = new RegExp(/^([\w\d]+)(?=[#.\s])/, 'gid');
    const result = regex.exec(firstWord + " ");
    // console.log(`result`, result);
    // console.log(`result`, result);
    if (result) {
      //starts with name of tag
      tag = result[1];
      //now remove the tag,
      remaining = firstWord.slice(tag.length); //to the end of string
    }
    //now we know what tag we are creating
    const newElement = new Element(tag);
    newElement.level = level;
    //now pull off #id and .classes
    const hashPosition = remaining.indexOf('#');
    const dotPosition = remaining.indexOf('.');

    if (hashPosition === 0) {
      // remaining starts with #id
      if (dotPosition > 0) {
        //there is also .classes
        //#id.classes
        newElement.id = remaining.slice(1, dotPosition); //#id
        newElement.classes = remaining.slice(dotPosition + 1).split('.'); //.classes
      } else {
        //#id
        newElement.id = remaining.slice(1); //to end of string
      }
    } else if (dotPosition === 0) {
      //.classes    (but no #id)
      newElement.classes = remaining.slice(1).split('.');
    }
    // console.log(`newElement`, newElement);
    return newElement;
  }
} //end of Class

export default Parser;
