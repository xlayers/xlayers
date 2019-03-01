import { Injectable } from '@angular/core';
import { StyleSheetOptimizer } from '../optimizers/css/css-optimizer';

export enum Template {
  HTML,
  JSX
}

@Injectable({
  providedIn: 'root'
})
export class SharedCodegen {
  private indentationSymbol = '  '; // 2 spaces ftw
  generateComponentOptimizedStyles(ast: SketchMSLayer) {
    const optimizer = new StyleSheetOptimizer();
    return optimizer.parseStyleSheet(ast);
  }
  generateComponentStyles(ast: SketchMSLayer) {
    const styles: Array<string> = [
      [
        ':host {',
        `${this.indentationSymbol}display: block;`,
        `${this.indentationSymbol}position: relative;`,
        '}',
        ''
      ].join('\n')
    ];

    (function computeStyle(_ast: SketchMSLayer, _styles, indentationSymbol) {
      const content = (data: string) => {
        if (data) {
          _styles.push(data);
        }
      };
      if (_ast.layers && Array.isArray(_ast.layers)) {
        _ast.layers.forEach(layer => {
          if (layer.css) {
            const rules: string[] = [];
            // tslint:disable-next-line:forin
            for (const prop in layer.css) {
              rules.push(`${prop}: ${layer.css[prop]};`);
            }
            content(
              [
                `.${(layer as any).css__className} {`,
                rules.map(rule => indentationSymbol + rule).join('\n'),
                '}'
              ].join('\n')
            );
          }

          computeStyle(layer, styles, indentationSymbol);
        });
      }
    })(ast, styles, this.indentationSymbol);

    return styles.join('\n');
  }

  openTag(tag = 'div', attributes = []) {
    return `<${tag}${
      attributes.length !== 0 ? ' ' + attributes.join(' ') : ''
    }>`;
  }

  closeTag(tag = 'div') {
    return `</${tag}>`;
  }

  indent(n: number, content: string) {
    const indentation = !!n ? this.indentationSymbol.repeat(n) : '';
    return indentation + content;
  }

  generateComponentTemplate(ast: SketchMSLayer, kind: Template) {
    const template: Array<string> = [];
    this.computeTemplate(ast, template, 0, kind);
    return template.join('\n');
  }

  private computeTemplate(
    ast: SketchMSLayer,
    template = [],
    depth = 0,
    kind = Template.HTML
  ) {
    let classNameAttr = 'class';
    if (kind === Template.JSX) {
      classNameAttr = 'className';
    }

    if (ast.layers && Array.isArray(ast.layers)) {
      ast.layers.forEach(layer => {
        if (layer.css) {
          const attributes = [
            `${classNameAttr}="${(layer as any).css__className}"`,
            `role="${layer._class}"`,
            `aria-label="${layer.name}"`
          ];
          template.push(this.indent(depth, this.openTag('div', attributes)));
        }

        const content = this.computeTemplate(layer, template, depth + 1, kind);
        if (content) {
          template.push(this.indent(depth + 1, content));
        }

        if (layer.css) {
          template.push(this.indent(depth, this.closeTag('div')));
        }
      });
    } else {
      const innerText = [];

      if ((ast as any)._class === 'text') {
        innerText.push(this.openTag('span'));
        innerText.push(ast.attributedString.string);
        innerText.push(this.closeTag('span'));
      }

      return innerText.join('');
    }
  }
}
