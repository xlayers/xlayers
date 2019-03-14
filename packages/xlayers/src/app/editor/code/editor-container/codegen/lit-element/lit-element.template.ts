export const litElementTemplate = (domContent: string, style: string) => {
  const strTplWrap = (code) =>  '`' + code + '`'  ;

  return `
import { LitElement, html, css } from 'lit-element';

class XLayersElement extends LitElement {

  static get styles() {
    return css${strTplWrap(style)}
  }

  constructor() {
    super();
  }

  render(){
    return html${strTplWrap(domContent)}
  }
}

customElements.define( 'x-layers-element' , XLayersElement);
  `;
};

export const readmeTemplate = () => {
  const codeBlock = '```';
  return `
## How to use the Xlayers Web Components built with LitElement

This implementation export the assets as single file web component that can be consumed in the following ways:

${codeBlock}
  // index.html
  <script src="./x-layers-element.js"></script>
  <x-layers-element></x-layers-element>
${codeBlock}

> Needed polyfills must be imported, in most cases you can import it globally or use different strategy. For example:

${codeBlock}
  //index.html
  <!-- Load polyfills; note that "loader" will load these async -->
  <script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js" defer></script>

  <!-- Load a custom element definitions in 'waitFor' and return a promise -->
  <script type="module">
    WebComponents.waitFor(() => {
    return import('./x-layers-element.js');
    });
  </script>

  <!-- Use the custom element -->
  <x-layers-element></x-layers-element>
${codeBlock}

>  [LitElement website](https://lit-element.polymer-project.org/)
>  For more information about [web components and browser support](https://github.com/WebComponents/webcomponentsjs#browser-support)
  `;
};
