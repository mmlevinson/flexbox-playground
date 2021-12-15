function clearFlexContainers(landscape, portrait) {
 
    //while loops were illustrated in MDN Node.removeChild()
    //but I substituted .lastChild for .firstChild b/c it 
    //is more efficient to peal a list off from the bottom
    //so the next element does not have to be advanced upwards
    while (portrait.lastChild) {
        portrait.removeChild(portrait.lastChild);
    }

    while (landscape.lastChild) {
        landscape.removeChild(landscape.lastChild);
    }
}


function parseCSSRules(rawText) {
    let result = rawText.split(/[{}]/).filter(String).map((str) => {
        return str.trim();
    })


    return result;
}




/* LoremIpsum adapted from https://github.com/fffilo/lorem-ipsum-js/blob/master/src/lorem-ipsum.js */

class LoremIpsum {
    /* Source Words (Array) */
    static _words = [
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
  
    /* given an imput string...does it begin with 'lorem' 
      @param text as String ... i.e. lorem25
      @return Number ... 0 means not a lorem request...otherwise the number of words*/
    static isLorem(text) {
      const lower = text.toLowerCase();
      const startsWith = lower.slice(0, 5);
      if (startsWith !== 'lorem') {
        return 0; //falsy value
      }
      return Number(lower.substring(5)); //assumes to the end of string
    }
  
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
      let result = ['Lorem ipsum'];
      const count = this.getCount(min, max);
      //get random words from array
      while (result.length < count) {
        let position = Math.floor(Math.random() * LoremIpsum._words.length);
        let randomWord = LoremIpsum._words[position];
        //no duplicates after each other
        if (result.length && result[result.length - 1] === randomWord) {
          continue;
        }
        result.push(randomWord);
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
      
      //upper case first char
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      let result = words.join(' ');
      //add some punctuation
      let punct = '...!?';
      return result + punct.charAt(Math.floor(Math.random() * punct.length));
    }
  
    /* generate random sentence with max,min words
      @param min (optional) as Number (minimal word count) 
      @param max (optional) as Number (maximum word count)
      @return String*/
    static getParagraph(min = 20, max = 60) {
      let result = '';
      var count = this.getCount(min, max);
  
      //append sentences until max limit
      while (result.slice(0, -1).split(' ').length < count) {
        result += this.getSentence + '';
      }
      result = result.slice(0, -1);
  
      //remove words
      if (result.split(' ').length > count) {
        let punct = result.slice(-1);
        result = result.split(' ').slice(0, count).join(' ');
        result = result.replace(/,$/, '');
        result += punct;
      }
      return result;
    }
  }
  

export {
    clearFlexContainers,
    parseCSSRules,
    LoremIpsum
}