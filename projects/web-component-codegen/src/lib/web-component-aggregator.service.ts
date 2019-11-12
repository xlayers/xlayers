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
    const template = document.createElement('template');
    template.innerHTML = \`
    <style>
    ${this.formatService.indentFile(3, css).join('\n')}
    </style>

    ${this.formatService.indentFile(3, html).join('\n')}
    \`;

    class ${className} extends HTMLElement {
      static is = 'xly-page1';

      static get observedAttributes() {
        return [];
      }

      constructor() {
        super();
        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));
      }

      connectedCallback(){
        console.log("${className} custom element is first connected to the document's DOM.");
      }

      disconnectedCallback() {
        console.log("${className} custom element is disconnected from the document's DOM.");
      }

      adoptedCallback() {
        console.log("${className} custom element is moved to a new document.");
      }

      attributeChangedCallback(name, oldValue, newValue) {
        console.log("${className} custom element attributes changed.");
      }

    }

    customElements.define(${className}.is , ${className});`;
  }
}
