import { defaults } from './globals.js';

class Element {
  level = 0;
  tag = '';
  id = '';
  classes = '';
  styles = {};
  attributes = {};
  contents = '';

  constructor(tagName) {
    this.tag = tagName.toLowerCase(); //browser convention outputs UPPERCASE
  }
}



/* .card
-#first-card.card
--h3.card.header `lorem25`
--p.card.contents `lorem50`
--img#banner.bannerTop.bannerActive <h:250 w:250>  {src:http://www.flashpoint.com/} 
--label.input-label {name:bob type:number value:bob} `Whatever`
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

  lines = [];
  levels = [];

  constructor() {}

  parse(rawText) {
    let result = '';
    //windows systems use CRLF where Unix uses LN
    this.lines = rawText.replaceAll('\r\n', '\n').trim().split('\n');
    this.getLineIndents();
    this.breakWords();
    return result;
  }

  getLineIndents() {
    //for each line, get the number of dashes
    this.levels = this.lines.map((line) => {
      let matches = line.match(/^[-]+/);
      return matches === null ? 0 : matches[0].length;
    });
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

  spawnElement(word) {
      let newElement = null;
      const hashPosition = word.indexOf('#');
      const dotPosition = word.indexOf('.');
      if (hashPosition === 0) {  //shorthand for 'div'
          //1 #id
          //2 #id.classList
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
          // .classList
          newElement = new Element('div');
          newElement.classes = word.slice(1);
      } else {
          newElement = this.getElementFromWord(word);
      }
      console.log(`newElement`, newElement);
      return newElement;
  }

  breakWords() {
    //for each line, break into words based on space char
    // const words = this.lines[0].replaceAll('-', '').split(' ');
    // console.log(`words`, words);
    // this.spawnElement(words[0]);

    for (let i = 0; i < this.lines.length; i++) {
      //strip off the levels, break on space char
      let words = this.lines[i].replaceAll('-', '').split(' ');
      this.spawnElement(words[0]); //this is the tag, id, classList parsed
    }
  }
}

export default Parser;
