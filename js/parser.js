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
  elements = [];
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

  getElementFromWord(word) {
    if (!word) return null;
    //0 tag
    //1 tag#id
    //2 tag#id.class1.class2
    //3 tag.class1.class2
    const result = {
      tag: word,   //case 0
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

  breakWords() {
    //for each line, break into words based on space char
    // const words = this.lines[0].replaceAll('-', '').split(' ');
    // console.log(`words`, words);
    // this.spawnElement(words[0]);

    for (let i = 0; i < this.lines.length; i++) {
      this.parseLine(this.lines[i]);
      //strip off the levels, break on space char
      // let words = this.lines[i].replaceAll('-', '').split(' ');
      // let words = this.lines[i].split(' ');
      // let newElement = this.spawnElement(words[0])); //this is the tag, id, classList parsed
      let newElement = this.spawnElement(this.lines[i]); //this is the tag, id, classList parsed
      newElement.styles = this.getStyles(this.lines[i]);
      newElement.content = this.getContent(this.lines[i]);
      newElement.attributes = this.getAttributes(this.lines[i]);
      if (newElement.tag === 'a' || newElement.tag === 'img') {
        //we need the URLs
        newElement.link = this.parseLink(this.lines[i]);
      }
      // console.log(`newElement`, newElement);
      this.elements.push(newElement);
    }
  }

  buildElementFromIndex(index) {
    //given the index, create a new DOM element from our descriptive class
    const e = this.elements[index];
    const element = document.createElement(e.tag);
    if (e === null) return;
    //what is the previous elements level
    if (e.id) {
      element.setAttribute('id', e.id);
    }
    //some of these are empty strings so no harm donegirt
    element.classList.add(e.classList);
    element.textContent = e.content;
    //after configuring element, add to tree as sibling or child
    return element;
  }

  appendNewElement(element, index){
   //if we know the index this.elements, we can find the previous element
   //  unless its zeroth
   if (index === 0) {   //first one, so just append to this.tree
     this.tree.append(element)
     return;
    } 
    const prior = this.elements[index - 1]
    if (element.level === prior.level) {
      prior.parent.append(element)
    } else if (element.level > prior.level) {
      prior.append(element);
    } else {
      //we are outdenting, so the element is less than prior, so we
      //need to find out what level it is and get the next matching sibling
    }
  }

  /* Mother of all methods...walk down the array of Elements and build
  a node tree based on the levels of each element referenced off the previous element */
  buildTree() {
    const wrappingDiv = document.createElement('div');
    wrappingDiv.classList.add('wrapper');
    this.tree = wrappingDiv;
    //this is the head node of our tree
    //TEST ... lets just add the first one for now
    let e = this.buildElementFromIndex(0);
    this.appendNewElement(e, 0);
    e = this.buildElementFromIndex(1);
    // console.log(`e`, e);
    this.appendNewElement(e, 1);
    // this.tree.append(e);
    e = this.buildElementFromIndex(2);
    // console.log(`e`, e);
    this.appendNewElement(e, 2);
  }



  parseLine(line) {
    //Break off the first word 
    let firstWord = line.split(' ')[0];
    if (!firstWord) return null;

    //Q: How many preceeding hyphens (to indicate nesting level)
    const level = this.getLevel(firstWord);
    //Now chop off these hyphens
    if (level > 0) {
      firstWord = chop(firstWord, level, false);   //from beginning of string
    }
    //Examine for preceeding <tag> designation
    //1 tag
    //2 tag#id
    //3 tag#id.classes
    //4 tag.classes
    //Regex ... find all \w\d preceeding [#.\s], with groupings & indices
    const regex = new RegExp(/^([\w\d]+)(?=[#. ])/, 'gid');
    const match = regex.exec(firstWord);
    // console.log(`match`, match);
    if (match) {
      //there is a tag in the
      const tag = match[1];
      //now remove the preceeding tag, 
      const remaining = firstWord.slice(tag.length);  //to the end of string
      console.log(`tag, remaining`, tag, remaining);
    } else {
      //no preceeding tag, so default to <div>
      //process #id.classes
    }
  
  }





};//end of Class




export default Parser;
