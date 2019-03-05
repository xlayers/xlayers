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
  private hostStyle = [
    ':host {',
    `${this.indentationSymbol}display: block;`,
    `${this.indentationSymbol}position: relative;`,
    '}',
    ''
  ].join('\n');

  parseStyleSheet(ast: SketchMSLayer) {
    const styles: Array<StyleList> = [];

    this.buildStyleSheetAst(styles, ast);
    this.postProcessCss(styles);

    const reGenerateStyleSheet = this.reGenerateStyleSheet(styles);
    return `${this.hostStyle} \n${reGenerateStyleSheet}`;
  }

  private reGenerateStyleSheet(styles: StyleList[]) {
    return styles
      .filter(e => e.declarations.length > 0)
      .map(cssStyle => this.generateCssStyle(cssStyle).join('\n'))
      .join('\n');
  }

  private generateCssStyle(e: StyleList) {
    return [
      `.${e.className} {`,
      e.declarations.map(rule => this.indentationSymbol + rule).join('\n'),
      '}',
      ''
    ];
  }

  private buildStyleSheetAst(styles: StyleList[], ast: SketchMSLayer) {
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

  private reduceDuplicates(duplicates: any[], stylesAst: StyleList[]) {
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

  private setValuesInAst(stylesAst: StyleList[], currentIndex: number, currentDeclarationSet: Set<string>, checkingDecIndex: number, checkDeclarationPropertySet: Set<string>) {
    stylesAst[currentIndex].declarations = Object.assign(Array.from(currentDeclarationSet.values()));
    stylesAst[checkingDecIndex].declarations = Object.assign(Array.from(checkDeclarationPropertySet.values()));
  }
}
