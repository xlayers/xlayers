import { Injectable } from '@angular/core';
import { SketchService } from '@app/core/sketch.service';
import { StyleOptimizerService } from '@xlayers/sketchapp-parser';

export enum Template {
  HTML,
  JSX,
  XAML
}

@Injectable({
  providedIn: 'root'
})
export class SharedCodegen {

  // 2 spaces
  private indentationSymbol = '  ';

  constructor(
    private readonly sketchService: SketchService,
    private readonly optimizer: StyleOptimizerService
  ) { }

  generateComponentStyles(ast: SketchMSLayer) {
    return this.optimizer.parseStyleSheet(ast);
  }

  openTag(tag = 'div', attributes = [], autoclose = false) {
    return `<${tag}${
      attributes.length !== 0 ? ' ' + attributes.join(' ') : ''
      } ${autoclose ? '/' : ''}>`;
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
      const innerContent = [];

      if ((ast as any)._class === 'text') {
        innerContent.push(this.openTag('span'));
        innerContent.push(ast.attributedString.string);
        innerContent.push(this.closeTag('span'));
      } else if ((ast as any)._class === 'bitmap') {
        let base64Content = this.sketchService.getImageDataFromRef(
          (ast as any).image._ref
        ).source;
        base64Content = base64Content.replace('data:image/png;base64', '');

        const attributes = [
          `${classNameAttr}="${(ast as any).css__className}"`,
          `role="${ast._class}"`,
          `aria-label="${ast.name}"`,
          `src="${this.buildImageSrc(base64Content, false)}"`
        ];
        innerContent.push(this.openTag('img', attributes, true));
      } else if ((ast as any).shape) {
        innerContent.push((ast as any).shape);
      }

      return innerContent.join('');
    }
  }

  /**
   * Get the image source for the codegen.
   * @param base64Data The image data encoded as Base64
   * @param useBlob Should we convert to a Blob type
   */
  private buildImageSrc(base64Data: string, useBlob = true) {
    if (useBlob) {
      const blob = this.base64toBlob(base64Data, 'image/png');
      return URL.createObjectURL(blob);
    }

    // use fallback output
    return base64Data;
  }

  /**
   * Convert a Base64 content into a Blob type.
   * @param base64Data The image data encoded as Base64
   * @param contentType The desired MIME type of the result image
   */
  private base64toBlob(base64Data: string, contentType = 'image/png') {
    const blob = new Blob([base64Data], { type: contentType });
    return blob;
  }
}
