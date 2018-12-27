export const wcTemplate = (ast: string, style: string) => {

  const tpl = '`' + '<style>' + style + '</style>' + ast + '`';

  return `
// Web Components polyfills
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';

const template = document.createElement('template');
template.innerHTML = ${tpl};

class XLayersElement extends HTMLElement {
  static is = 'x-layers-element';

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
  }

  connectedCallback(){
    const shadowDOM = this.attachShadow({ mode: 'open' });
    shadowDOM.appendChild(template.content.cloneNode(true));
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

customElements.define( XLayersElement.is , XLayersElement);
  `;
};


export const readmeTemplate = `## Web Component x-layers-element `;
