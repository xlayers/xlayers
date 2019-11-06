import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebCodeGenService } from '@xlayers/web-codegen';

type WebCodeGenOptions = any;

@Injectable({
  providedIn: 'root'
})
export class LitElementAggregatorService {
  constructor(
    private readonly formatService: FormatService,
    private readonly webCodeGenService: WebCodeGenService
  ) {}

  aggregate(
    current: SketchMSLayer,
    data: SketchMSData,
    options: WebCodeGenOptions
  ) {
    const fileName = this.formatService.normalizeName(current.name);
    const files = this.webCodeGenService.aggregate(current, data, options);
    const html = files.find(file => file.language === 'html');
    const css = files.find(file => file.language === 'css');
    return [
      {
        kind: 'litElement',
        value: this.renderComponent(
          current.name,
          html.value,
          css.value,
          options
        ),
        language: 'javascript',
        uri: `${options.componentDir}/${fileName}.js`
      }
    ];
  }

  private renderComponent(
    name: string,
    html: string,
    css: string,
    options: WebCodeGenOptions
  ) {
    const className = this.formatService.className(name);
    const normalizedName = this.formatService.normalizeName(name);
    const tagName = `${options.xmlPrefix}${normalizedName}`;
    return `\
import { LitElement, html, css } from 'lit-element';

class ${className} extends LitElement {
  static get styles() {
    return css\`
${this.formatService.indentFile(3, css).join('\n')}
    \`
  }

  aggregate() {
    return html\`
${this.formatService.indentFile(3, html).join('\n')}
    \`
  }
}

customElements.define('${tagName}' , ${className});`;
  }
}
