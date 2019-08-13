import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { WebRenderService } from './web-render.service';
import { WebBlocGenOptions } from './web-blocgen';
import { WebContextService } from './web-context.service';

@Injectable({
  providedIn: 'root'
})
export class ReactRenderService {
  constructor(
    private format: FormatService,
    private webContext: WebContextService,
    private webRender: WebRenderService
  ) {}

  render(current: SketchMSLayer, options: WebBlocGenOptions) {
    const fileName = this.format.normalizeName(current.name);
    const context = this.webContext.contextOf(current);
    const files = this.webRender.render(current, options);
    const html = files.find(file => file.language === 'html');

    return [
      {
        kind: 'react',
        value: this.renderComponent(
          current.name,
          html.value,
          context.components,
          options
        ),
        language: 'javascript',
        uri: `${options.componentDir}/${fileName}.jsx`
      },
      {
        kind: 'react',
        value: this.renderSpec(current.name),
        language: 'javascript',
        uri: `${options.componentDir}/${fileName}.spec.js`
      },
      ...files
        .filter(file => file.language !== 'html')
        .map(file => ({
          ...file,
          kind: 'react'
        }))
    ];
  }

  private renderComponent(
    name: string,
    html: string,
    components: string[],
    options: WebBlocGenOptions
  ) {
    const componentName = this.format.componentName(name);
    const fileName = this.format.normalizeName(name);
    const dynamicImports = components.map(
      component =>
        `import ${component} from "${options.componentDir}/${component}";`
    );

    return `\
import React from 'react';
${dynamicImports.join('\n')},
import './${fileName}.css';

export const ${componentName} = () => (
${this.format.indentFile(1, html).join('\n')}
);`;
  }

  private renderSpec(name: string) {
    const componentName = this.format.componentName(name);
    const fileName = this.format.normalizeName(name);

    return `\
import React from 'react';
import ReactDOM from 'react-dom';
import ${componentName} from './${fileName}';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<${componentName} />, div);
  ReactDOM.unmountComponentAtNode(div);
})`;
  }
}
