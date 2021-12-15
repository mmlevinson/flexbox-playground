/* Factory Class for creating new FlexItems for populating the FlexContainer */
class FlexItem extends HTMLDivElement {
  constructor() {
    super();
    this.classList.add('flex-item');
    // const span = document.createElement('span');
    // span.classList.add('flex-item-content');
    // this.appendChild(span);
  }
}

/* LoremIpsum adapted from https://github.com/fffilo/lorem-ipsum-js/blob/master/src/lorem-ipsum.js */

class LoremIpsum {
  /* Source Words (Array) */
  _words = [
    'a',
    'ac',
    'accumsan',
    'ad',
    'adipiscing',
    'aenean',
    'aenean',
    'aliquam',
    'aliquam',
    'aliquet',
    'amet',
    'ante',
    'aptent',
    'arcu',
    'at',
    'auctor',
    'augue',
    'bibendum',
    'blandit',
    'class',
    'commodo',
    'condimentum',
    'congue',
    'consectetur',
    'consequat',
    'conubia',
    'convallis',
    'cras',
    'cubilia',
    'curabitur',
    'curabitur',
    'curae',
    'cursus',
    'dapibus',
    'diam',
    'dictum',
    'dictumst',
    'dolor',
    'donec',
    'donec',
    'dui',
    'duis',
    'egestas',
    'eget',
    'eleifend',
    'elementum',
    'elit',
    'enim',
    'erat',
    'eros',
    'est',
    'et',
    'etiam',
    'etiam',
    'eu',
    'euismod',
    'facilisis',
    'fames',
    'faucibus',
    'felis',
    'fermentum',
    'feugiat',
    'fringilla',
    'fusce',
    'gravida',
    'habitant',
    'habitasse',
    'hac',
    'hendrerit',
    'himenaeos',
    'iaculis',
    'id',
    'imperdiet',
    'in',
    'inceptos',
    'integer',
    'interdum',
    'ipsum',
    'justo',
    'lacinia',
    'lacus',
    'laoreet',
    'lectus',
    'leo',
    'libero',
    'ligula',
    'litora',
    'lobortis',
    'lorem',
    'luctus',
    'maecenas',
    'magna',
    'malesuada',
    'massa',
    'mattis',
    'mauris',
    'metus',
    'mi',
    'molestie',
    'mollis',
    'morbi',
    'nam',
    'nec',
    'neque',
    'netus',
    'nibh',
    'nisi',
    'nisl',
    'non',
    'nostra',
    'nulla',
    'nullam',
    'nunc',
    'odio',
    'orci',
    'ornare',
    'pellentesque',
    'per',
    'pharetra',
    'phasellus',
    'placerat',
    'platea',
    'porta',
    'porttitor',
    'posuere',
    'potenti',
    'praesent',
    'pretium',
    'primis',
    'proin',
    'pulvinar',
    'purus',
    'quam',
    'quis',
    'quisque',
    'quisque',
    'rhoncus',
    'risus',
    'rutrum',
    'sagittis',
    'sapien',
    'scelerisque',
    'sed',
    'sem',
    'semper',
    'senectus',
    'sit',
    'sociosqu',
    'sodales',
    'sollicitudin',
    'suscipit',
    'suspendisse',
    'taciti',
    'tellus',
    'tempor',
    'tempus',
    'tincidunt',
    'torquent',
    'tortor',
    'tristique',
    'turpis',
    'ullamcorper',
    'ultrices',
    'ultricies',
    'urna',
    'ut',
    'ut',
    'varius',
    'vehicula',
    'vel',
    'velit',
    'venenatis',
    'vestibulum',
    'vitae',
    'vivamus',
    'viverra',
    'volutpat',
    'vulputate',
  ];

  /* return a random value between x and y
    @param x as Number
    @param y as Number
    @return Number */
  static getRandom(x, y) {
    const rnd = Math.random() * 2 - 1 + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
    return Math.round(Math.abs(rnd) * x + y);
  }

  /* random number between min and max
  @param min (optional) as Number lower result limit
  @param max (optional) as Number upper result limit
  @return Number as Number*/
  static getCount(min, max) {
    let result;
    if (min && max) result = Math.floor(Math.random() * (max - min + 1) + min);
    else if (min) result = min;
    else if (max) result = max;
    else result = this.getRandom(8, 2);
    return result;
  }

  /* return a block of random words
     @param min (optional) minimal word count
     @param max (optional) maximal word count
     @return [String]  array of random words */
  static getWords(min, max) {
    const result = [];
    const count = this.getCount(min, max);
    //get random words from array
    while (result.length < count) {
      let pos = Math.floor(Math.random() * this._words.length);
      let rnd = this._words[pos];
      //no duplicates after each other
      if (result.length && result[result.length - 1] === rnd) {
        continue;
      }
      result.push(rnd);
    }
    return result;
  }
  /* generate random sentence with max,min words
    @param min (optional) as Number (minimal word count) 
    @param max (optional) as Number (maximum word count)
    @return String*/
  static getSentence(min, max) {
    let words = this.getWords(min, max);
    //add some commas
    let index = this.getRandom(6, 2);
    while (index < words.length - 2) {
      words[index] += ', ';
      index += this.getRandom(6, 2);
    }
    //add some punctuation
    let punct = '...!?';
    words[words.length - 1] = punct.charAt(Math.floor(Math.random() * punct.length));
    //upper case first char
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  }

      /* generate random sentence with max,min words
    @param min (optional) as Number (minimal word count) 
    @param max (optional) as Number (maximum word count)
    @return String*/
  static getParagraph(min = 20, max = 60) {
    let result = '';
    var count = this.getCount(min, max);

    //append sentences until max limit
    while (result.slice(0, -1).split(" ").length < count) {
      result += this.getSentence + '';
    }
    result = result.slice(0, -1);

    //remove words
    if (result.split(" ").length > count) {
      let punct = result.slice(-1);
      result = result.split(" ").slice(0, count).join(" ");
      result = result.replace(/,$/, "");
      result += punct;
    }
    return result;
  }
}

export { FlexItem, LoremIpsum };
