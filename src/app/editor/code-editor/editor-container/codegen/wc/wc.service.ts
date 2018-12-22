import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';

@Injectable({
  providedIn: 'root'
})
export class WCCodeGenService implements CodeGenFacade {

  constructor() {}

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [{
      uri: 'README.md',
      value: this.generateReadme(),
      language: 'text/plain',
      kind: 'text'
    }, {
      uri: 'xlayers.js',
      value: this.generateComponent(),
      language: 'javascript',
      kind: 'wc'
    }];
  }

  private generateReadme() {
    return ``;
  }

  /**
   * @todo make this dynamic
   */
  private generateComponent() {
    return `
class XLayersElement extends HTMLElement {

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
  }
  disconnectedCallback() {
    console.log('XLayersElement element removed from page.');
  }
  adoptedCallback() {
    console.log('XLayersElement element moved to new page.');
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('XLayersElement element attributes changed.');
  }
}
customElements.define('xly-component', XLayersElement);
    `;
  }
}
