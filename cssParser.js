class CSSParser {
  static cssMediaQueryRegex = '((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
  static cssKeyframeRegex = '((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
  static combinedCSSRegex = '((\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})'; //to match css & media queries together
  static cssCommentsRegex = '(\\/\\*[\\s\\S]*?\\*\\/)';

  constructor() {
    this.cssImportStatements = [];
    this.cssKeyframeStatements = [];
    this.cssImportStatementRegex = new RegExp('@import .*?;', 'gi');
    this.cssRegex = new RegExp('([\\s\\S]*?){([\\s\\S]*?)}', 'gi');
  }

  stripComments(cssString) {
    const regex = new RegExp(CSSParser.combinedCSSRegex, 'gi');
    return cssString.replace(regex, '');
  }

  parseCSS(source) {
    if (source === undefined) return [];
    let css = [];

    while (true) {
      let imports = this.cssImportStatementRegex.exec(source);
      if (imports !== null) {
        this.cssImportStatements.push(imports[0]);
        css.push({
          selector: '@imports',
          type: 'imports',
          styles: imports[0],
        });
      } else {
        break;
      }
    }
  }
}
