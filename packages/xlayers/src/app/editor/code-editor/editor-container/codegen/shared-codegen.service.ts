import { Injectable } from '@angular/core';
import {
  StyleOptimizerService
} from '@xlayers/sketchapp-parser';
export enum Template {
  HTML,
  JSX
}

@Injectable({
  providedIn: 'root'
})
export class SharedCodegen {
  private indentationSymbol = '  '; // 2 spaces ftw
  constructor(private readonly optimizer: StyleOptimizerService) { }
  generateComponentStyles(ast: SketchMSLayer) {
    return this.optimizer.parseStyleSheet(ast);
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
