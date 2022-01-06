import { defaults } from './globals.js';
import { chop, clip } from './helpers.js';

class Element {
  level = 0;
  tag = '';
  id = '';
  classes = '';
  styles = {};
  attributes = {};
  link = '';
  contents = '';

  constructor(tagName) {
    this.tag = tagName.toLowerCase(); //browser convention outputs UPPERCASE
  }
}

/*
.card
-#first-card.card
--h3.card.header `lorem25`
--p.card.contents `lorem50`
---a.active {href=http://www.something.com/whatever23.find-me/cgi?name='Max'&age='31'}
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
  static urlRegEx = /[\w]+=([\w]+:\/{2}[.-\w\d?=&'"/]+)/

  lines = [];
  levels = [];
  elements = [];

  constructor() {}

  parse(rawText) {
    let result = '';
    //windows systems use CRLF where Unix uses LN
    this.lines = rawText.replaceAll('\r\n', '\n').trim().split('\n');
    this.getLineIndents();
    this.breakWords();
    // console.log(`this.elements`, this.elements);
    return result;
  }

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
      let attributes = clip(matchResults[0], 1);  //remove both curly braces
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
    let styles = new RegExp(/(<.*>)/, 'gi');
    let stylesBlock = line.match(styles); //array or null
    if (stylesBlock) {
      //<key:value; key:value;>
      //split out each CSS rule
      let regex = new RegExp(/[-\w\d]+:[-\w\d\s]+;/, 'gi');
      let pairs = stylesBlock[0].match(regex);
      //array of ['key:value;', 'key:value;']
      let css = pairs.map((pair) => {
        //remove the terminating semicolon
        return chop(pair, 1);
      });
      // console.log(`css`, css);
      return css;
    }
    return [];
  }

  getContent(line) {
    if (!line) return ''; //guard, if empty string
    const regex = new RegExp(/`.*`/, 'gi');
    const matchResults = line.match(regex);
    if (matchResults) {
      return clip(matchResults[0]);  //remove tick marks
    }
    return '';
  }

  getElementFromWord(word) {
    if (!word) return null;
    //1 tag#identifier
    //2 tag#id.classes
    //3 tag.classes
    const result = {
      tagName: word,
      id: '',
      classList: '',
    };
    const hashPosition = word.indexOf('#');
    const dotPosition = word.indexOf('.');
    if (hashPosition >= 0) {
      result.tagName = word.slice(0, hashPosition);
      if (dotPosition >= 0) {
        //case 2
        result.classList = word.slice(dotPosition + 1).replaceAll('.', ' '); //to end of string
        result.id = word.slice(hashPosition + 1, dotPosition);
      } else {
        //case 1
        result.id = word.slice(hashPosition + 1); //to end of string
      }
    } else if (dotPosition >= 0) {
      //case 3
      result.tagName = word.slice(0, dotPosition);
      result.classList = word.slice(dotPosition + 1).replaceAll('.', ' ');
    }
    const newElement = new Element(result.tagName);
    newElement.id = result.id;
    newElement.classes = result.classList;
    return newElement;
  }

  spawnElement(line) {
    let firstWord = line.split(' ')[0]; //first word is the Tag#id.classList followed by space char
    //guard
    if (!firstWord) {
      //empty string or null ... returns null
      return null;
    }
    let newElement = null;
    let level = this.getLevel(firstWord);
    let word = firstWord;
    //remove preceeding hyphens
    if (level > 0) {
      word = chop(firstWord, level, false); //from the front
    }
    //Q: Starts with a Tag?
    const hashPosition = word.indexOf('#');
    const dotPosition = word.indexOf('.');
    if (hashPosition === 0) {
      //A:  No. so assume this is shorthand for a <div>
      //Q:  Is there an #id
      //        1 #id
      //        2 #id.classList
      newElement = new Element('div');
      if (dotPosition >= 0) {
        //case 2
        newElement.classList = word.slice(dotPosition + 1);
        newElement.id = word.slice(1, dotPosition);
      } else {
        //case 1
        newElement.id = word.slice(1); //returns all but first char
      }
    } else if (dotPosition === 0) {
      //A: No. so assume this is shorthand for a <div>
      //Q: is there a .classList
      newElement = new Element('div');
      newElement.classes = word.slice(1);
    } else {
      newElement = this.getElementFromWord(word);
    }
    newElement.level = level;
    // console.log(`newElement`, newElement);
    return newElement;
  }

  parseLink(line){
   //for <a> or <img> tags, there should be an attribute with the link
   //  delimited by curly braces
    const regex = new RegExp(/([\w]+)=([\w]+:\/{2}[-\w\d?=.&'"/]+)/, 'gi')
    const matchResult = regex.exec(line);
    if (matchResult) {
      // console.log(`matchResult`, matchResult);
      //matchResult[0] is the entire match
      //matchResult[1] is the protocol (src | href)
      //matchResult[2] is the link text 
      const linkText = matchResult[2];
      console.log(`linkText`, linkText);
      return linkText;
    }
    return '';
  }

  breakWords() {
    //for each line, break into words based on space char
    // const words = this.lines[0].replaceAll('-', '').split(' ');
    // console.log(`words`, words);
    // this.spawnElement(words[0]);

    for (let i = 0; i < this.lines.length; i++) {
      //strip off the levels, break on space char
      // let words = this.lines[i].replaceAll('-', '').split(' ');
      // let words = this.lines[i].split(' ');
      // let newElement = this.spawnElement(words[0])); //this is the tag, id, classList parsed
      let newElement = this.spawnElement(this.lines[i]); //this is the tag, id, classList parsed
      newElement.styles = this.getStyles(this.lines[i]);
      newElement.textContent = this.getContent(this.lines[i]);
      newElement.attributes = this.getAttributes(this.lines[i]);
      if (newElement.tag === 'a' || newElement.tag === 'img') {
        //we need the URLs
        newElement.link = this.parseLink(this.lines[i]);
      }
      console.log(`newElement`, newElement);
    }
  }
}

export default Parser;
