import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebAggregatorService } from './web-aggregator.service';
import { WebCodeGenOptions } from './web-codegen';

@Injectable({
  providedIn: 'root'
})
export class LitElementAggregatorService {
  constructor(
    private readonly formatService: FormatService,
    private readonly webAggretatorService: WebAggregatorService
  ) {}

  aggreate(current: SketchMSLayer, options: WebCodeGenOptions) {
    const fileName = this.formatService.normalizeName(current.name);
    const files = this.webAggretatorService.aggreate(current, options);
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

  aggreate() {
    return html\`
${this.formatService.indentFile(3, html).join('\n')}
    \`
  }
}

customElements.define('${tagName}' , ${className});`;
  }
}
