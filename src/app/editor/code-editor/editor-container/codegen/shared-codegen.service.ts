import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedCodegen {

  private indentationSymbol = '  '; // 2 spaces ftw

  generateComponentStyles(ast: SketchMSLayer) {

    const styles: Array<string> = [
      [
        ':host {',
        `${this.indentationSymbol}display: block;`,
        `${this.indentationSymbol}position: relative;`,
        '}', ''
      ].join('\n')
    ];

    (function computeStyle(ast: SketchMSLayer, styles, indentationSymbol) {
      if (ast.layers && ast.layers.length > 0) {
        ast.layers.forEach(layer => styles.push(computeStyle(layer, styles, indentationSymbol)));
      } else {
        if (ast.css) {
          const rules: string[] = [];
          for (let prop in ast.css) {
            rules.push(`${prop}: ${ast.css[prop]};`);
          }

          return [
            `.${(ast as any).css__className} {`,
            rules.map(rule => indentationSymbol + rule).join('\n'),
            '}'
          ].join('\n');
        }
        else {
          return null;
        }
      }

    })(ast, styles, this.indentationSymbol);

    return styles.join('\n');
  }

  openTag(tag = 'div', attributes = []) {
    return `<${tag}${attributes.length !== 0 ? ' ' + attributes.join(' ') : ''}>`;
  }

  closeTag(tag = 'div') {
    return `</${tag}>`;
  }

  indent(n: number, content: string) {
    const indentation = !!n ? this.indentationSymbol.repeat(n) : '';
    return indentation + content;
  }

  generateComponentTemplate(ast: SketchMSLayer) {
    const template: Array<string> = [];
    this.computeTemplate(ast, template);
    return template.join('\n');
  }

  private computeTemplate(ast: SketchMSLayer, template = [], depth = 0) {
    if (ast.layers && Array.isArray(ast.layers)) {

      ast.layers.forEach(layer => {
        if (layer.css) {
          const attributes = [
            `class="${(layer as any).css__className}"`,
            `role="${layer._class}"`,
            `aria-label="${layer.name}"`,
          ];
          template.push(this.indent(depth, this.openTag('div', attributes)));
        }

        const content = this.computeTemplate(layer, template, depth + 1);
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
