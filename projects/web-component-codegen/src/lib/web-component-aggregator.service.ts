import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebCodeGenService } from '@xlayers/web-codegen';

type WebCodeGenOptions = any;

@Injectable({
  providedIn: 'root'
})
export class WebComponentAggregatorService {
  constructor(
    private readonly formatService: FormatService,
    private readonly webCodeGenService: WebCodeGenService
  ) {}

  aggreate(current: SketchMSLayer, options: WebCodeGenOptions) {
    const fileName = this.formatService.normalizeName(current.name);
    const files = this.webCodeGenService.aggreate(current, options);
    const html = files.find(file => file.language === 'html');
    const css = files.find(file => file.language === 'css');
    return [
      {
        kind: 'wc',
        value: this.renderComponent(current.name, html.value, css.value),
        language: 'javascript',
        uri: `${options.componentDir}/${fileName}.js`
      }
    ];
  }

  private renderComponent(name: string, html: string, css: string) {
    const className = this.formatService.className(name);
    const tagName = this.formatService.normalizeName(name);
    return `\
class ${className} extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`
      <style>
${this.formatService.indentFile(3, css).join('\n')}
      </style>

${this.formatService.indentFile(3, html).join('\n')}
    \`
  }
}

customElements.define('${tagName}', ${className});`;
  }
}
