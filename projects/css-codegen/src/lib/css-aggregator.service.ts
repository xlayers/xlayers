import { Injectable } from '@angular/core';
import { CssContextService } from './css-context.service';
import { CssCodeGenOptions } from './css-codegen';
import { FormatService } from '@xlayers/sketch-lib';

interface StyleList {
  className: string;
  declarations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CssAggregatorService {
  constructor(
    private readonly formatService: FormatService,
    private cssContext: CssContextService
  ) {}

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
   * @param current SketchMSLayer the ast based on sketch json
   */
  aggregate(current: SketchMSLayer, options?: CssCodeGenOptions) {
    const styles: Array<StyleList> = [];
    this.buildAstStyleSheet(styles, current);
    this.postProcessCss(styles);
    this.buildPseudoElementStyle(styles, current);
    const reGenerateStyleSheet = this.reGenerateStyleSheet(styles);

    const fileName = this.formatService.normalizeName(current.name);
    return [
      {
        kind: 'css',
        value: this.combineStyles(reGenerateStyleSheet),
        language: 'css',
        uri: `${options.componentDir}/${fileName}.css`
      }
    ];
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
   * Parse style pseudo element without any pre processing
   * @param styles curent created list
   * @param current  sketch ast
   */
  private buildPseudoElementStyle(styles: StyleList[], current: SketchMSLayer) {
    const computeStyle = (_current: SketchMSLayer) => {
      const content = (name: string, data: string[]) => {
        if (data) {
          styles.push({ className: name, declarations: data });
        }
      };
      if (_current.layers && Array.isArray(_current.layers)) {
        _current.layers.forEach(layer => {
          if (this.cssContext.identify(layer)) {
            const name = `${(layer as any).css.className}`;
            if ((layer.css as any).pseudoElements) {
              Object.entries((layer.css as any).pseudoElements).forEach(
                ([prop, value]) => {
                  content(
                    `${name}:${prop}`,
                    Object.entries(value).map(
                      ([ruleKey, ruleValue]) => `${ruleKey}: ${ruleValue};`
                    )
                  );
                }
              );

              computeStyle(layer);
            }
          }
        });
      }
    };

    computeStyle(current);
  }

  /**
   * This is the main ast parser to go from sketch to css
   * @param styles newly created list
   * @param current  sketch ast
   */
  private buildAstStyleSheet(
    styles: StyleList[],
    current: SketchMSLayer
  ): void {
    const computeStyle = (_current: SketchMSLayer, _styles) => {
      const content = (name: string, data: string[]) => {
        if (data) {
          styles.push({ className: name, declarations: data });
        }
      };
      if (_current.layers && Array.isArray(_current.layers)) {
        _current.layers.forEach(layer => {
          if (this.cssContext.identify(layer)) {
            const name = `${(layer as any).css.className}`;
            const rules: string[] = [];
            Object.entries((layer.css as any).rules).forEach(
              ([prop, value]) => {
                rules.push(`${prop}: ${value};`);
              }
            );
            content(name, rules);

            computeStyle(layer, [
              {
                className: `${(layer as any).css.className}`,
                declarations: rules
              }
            ]);
          }
        });
      }
    };

    computeStyle(current, styles);
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
    for (
      let currentIndex = 0;
      currentIndex < stylesAst.length;
      currentIndex++
    ) {
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
              className: `${currentDeclaration.className}, .${nextDeclaration.className}`,
              key
            });
            checkDeclarationPropertySet.delete(key);
            currentDeclarationSet.delete(key);
          }
        }

        this.setValuesInAst(
          stylesAst,
          currentIndex,
          currentDeclarationSet,
          checkingDecIndex,
          checkDeclarationPropertySet
        );
      }
    }
    this.reduceDuplicates(duplicates, stylesAst);
  }

  /**
   * Will remove the duplicates from ast
   * @param duplicates duplicaye css styles
   * @param stylesAst sketch ast
   */
  private reduceDuplicates(
    duplicates: { className: string; key: string }[],
    stylesAst: StyleList[]
  ) {
    const deDuplicateCssValues: Object = duplicates.reduce(
      (current, next, index, _array) => {
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
      },
      {}
    );

    Object.values(deDuplicateCssValues)
      .filter(e => e.declarations.length > 0)
      .map(e =>
        stylesAst.push({ className: e.className, declarations: e.declarations })
      );
  }

  /**
   * Helper function to set declaration for each css declaration
   * @param stylesAst
   * @param currentIndex
   * @param currentDeclarationSet
   * @param checkingDecIndex
   * @param checkDeclarationPropertySet
   */
  private setValuesInAst(
    stylesAst: StyleList[],
    currentIndex: number,
    currentDeclarationSet: Set<string>,
    checkingDecIndex: number,
    checkDeclarationPropertySet: Set<string>
  ) {
    stylesAst[currentIndex].declarations = Object.assign(
      Array.from(currentDeclarationSet.values())
    );
    stylesAst[checkingDecIndex].declarations = Object.assign(
      Array.from(checkDeclarationPropertySet.values())
    );
  }
}
