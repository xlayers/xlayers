import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebBlocGenOptions } from './web-blocgen';
import { WebRenderService } from './web-render.service';

@Injectable({
  providedIn: 'root'
})
export class WebComponentRenderService {
  constructor(
    private format: FormatService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    const files = this.webRender.render(current, options);
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
    const componentName = this.format.componentName(name);
    const tagName = this.format.normalizeName(name);

    return `\
class ${componentName} extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`
      <style>
${this.format.indentFile(3, css).join('\n')}
      </style>

${this.format.indentFile(3, html).join('\n')}
    \`
  }
}

customElements.define('${tagName}', ${componentName});`;
  }
}
