import { Injectable } from '@angular/core';

interface StyleList {
  className: string;
  declarations: string[];
}
@Injectable({
  providedIn: 'root'
})
export class StyleOptimizerService {
  private indentationSymbol = `  `; // 2 spaces ftw
  // default host style
  private hostStyle = [
    ':host {',
    `${this.indentationSymbol}display: block;`,
    `${this.indentationSymbol}position: relative;`,
    '}',
    ''
  ].join('\n');

  /**
   * This will parse the ast to return a optimized css stylesheet
   * @param ast SketchMSLayer the ast based on sketch json
   */
  parseStyleSheet(ast: SketchMSLayer) {
    const styles: Array<StyleList> = [];
    this.buildAstStyleSheet(styles, ast);
    this.postProcessCss(styles);
    const reGenerateStyleSheet = this.reGenerateStyleSheet(styles);
    return this.combineStyles(reGenerateStyleSheet);
  }
  /**
   * The complete string of css style
   * @param styles string of stylesheet
   */
  private combineStyles(styles: string): string {
    return `${this.hostStyle} \n${styles}`;
  }
  /**
   * Map over styles with normal css output
   * @param styles optimized list of styles
   */
  private reGenerateStyleSheet(styles: StyleList[]) {
    return styles
      .filter(e => e.declarations.length > 0)
      .map(cssStyle => this.generateCssStyle(cssStyle).join('\n'))
      .join('\n');
  }

  /**
   * Parse stylelist to understandable css class definition
   * @param style the declaration of style
   */
  private generateCssStyle(style: StyleList): string[] {
    return [
      `.${style.className} {`,
      style.declarations.map(rule => this.indentationSymbol + rule).join('\n'),
      '}',
      ''
    ];
  }

  /**
   * This is the main ast parser to go from sketch to css
   * @param styles newly created list
   * @param ast  sketch ast
   */
  private buildAstStyleSheet(styles: StyleList[], ast: SketchMSLayer): void {
    (function computeStyle(_ast: SketchMSLayer, _styles) {
      const content = (name: string, data: string[]) => {
        if (data) {
          styles.push({ className: name, declarations: data });
        }
      };
      if (_ast.layers && Array.isArray(_ast.layers)) {
        _ast.layers.forEach(layer => {
          const rules: string[] = [];
          if (layer.css) {
            // tslint:disable-next-line:forin
            for (const prop in layer.css) {
              rules.push(`${prop}: ${layer.css[prop]};`);
            }
            content(`${(layer as any).css__className}`, rules);
          }
          computeStyle(layer, [
            {
              className: `${(layer as any).css__className}`,
              declarations: rules
            }
          ]);
        });
      }
    })(ast, styles);
  }

  /**
   * This will optimize the AST to 'better' css
   * Basic concepts is to loop through ast and verify current & next
   * declaration.
   *
   * When equals css declarations found this will be placed
   * in a seperate css class
   * @param stylesAst sketch ast
   */
  postProcessCss(stylesAst: StyleList[]): void {
    const duplicates = [];
    for (let currentIndex = 0; currentIndex < stylesAst.length; currentIndex++) {
      let checkingDecIndex = currentIndex;
      const currentDeclaration: StyleList = stylesAst[currentIndex];
      const currentDeclarationSet = new Set<string>(
        currentDeclaration.declarations.sort()
      );
      while (++checkingDecIndex < stylesAst.length) {
        const nextDeclaration = stylesAst[checkingDecIndex];
        const checkDeclarationPropertySet = new Set<string>(
          nextDeclaration.declarations.sort()
        );

        for (const key of Array.from(currentDeclarationSet.values())) {
          if (checkDeclarationPropertySet.has(key)) {
            duplicates.push({
              className: `${currentDeclaration.className}, .${
                nextDeclaration.className
                }`,
              key
            });
            checkDeclarationPropertySet.delete(key);
            currentDeclarationSet.delete(key);
          }
        }

        this.setValuesInAst(stylesAst, currentIndex, currentDeclarationSet, checkingDecIndex, checkDeclarationPropertySet);
      }
    }
    this.reduceDuplicates(duplicates, stylesAst);
  }


  /**
   * Will remove the duplicates from ast
   * @param duplicates duplicaye css styles
   * @param stylesAst sketch ast
   */
  private reduceDuplicates(duplicates: { className: string, key: string }[], stylesAst: StyleList[]) {
    const deDuplicateCssValues: Object = duplicates.reduce((current, next, index, _array) => {
      if (index === 0 || !current.hasOwnProperty(next.className)) {
        current[next.className] = {
          className: next.className,
          declarations: [next.key]
        };
      } else {
        current[next.className].declarations = [
          ...current[next.className].declarations,
          ...[next.key]
        ];
      }
      return current;
    }, {});

    Object.values(deDuplicateCssValues)
      .filter(e => e.declarations.length > 0)
      .map(e => stylesAst.push({ className: e.className, declarations: e.declarations }));
  }

  /**
   * Helper function to set declaration for each css declaration
   * @param stylesAst
   * @param currentIndex
   * @param currentDeclarationSet
   * @param checkingDecIndex
   * @param checkDeclarationPropertySet
   */
  private setValuesInAst(stylesAst: StyleList[], currentIndex: number, currentDeclarationSet: Set<string>, checkingDecIndex: number, checkDeclarationPropertySet: Set<string>) {
    stylesAst[currentIndex].declarations = Object.assign(Array.from(currentDeclarationSet.values()));
    stylesAst[checkingDecIndex].declarations = Object.assign(Array.from(checkDeclarationPropertySet.values()));
  }
}
