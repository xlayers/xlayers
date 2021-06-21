import { Injectable } from '@angular/core';
import { FormatService } from '@xlayers/sketch-lib';
import { SketchMSData, SketchMSLayer } from '@xlayers/sketchtypes';
import { WebCodeGenService } from '@xlayers/web-codegen';

type WebCodeGenOptions = any;

@Injectable({
  providedIn: 'root',
})
export class ReactAggregatorService {
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
    const html = files.find((file) => file.language === 'html');

    return [
      {
        kind: 'react',
        value: this.renderComponent(current, html.value),
        language: 'javascript',
        uri: `${options.componentDir}/${fileName}.jsx`,
      },
      {
        kind: 'react',
        value: this.renderSpec(current),
        language: 'javascript',
        uri: `${options.componentDir}/${fileName}.spec.js`,
      },
      ...files
        .filter((file) => file.language !== 'html')
        .map((file) => ({
          ...file,
          kind: 'react',
        })),
    ];
  }

  private renderComponent(current: SketchMSLayer, html: string) {
    const className = this.formatService.className(current.name);
    const importStatements = this.renderImportStatements(current);
    return `\
${importStatements}

class ${className} extends Component {
  render() {
    return (
      ${this.formatService.indentFile(1, html).join('\n')}
    );
  }
}

export default ${className};`;
  }

  private renderSpec(current: SketchMSLayer) {
    const className = this.formatService.className(current.name);
    const fileName = this.formatService.normalizeName(current.name);
    return `\
import React from 'react';
import ReactDOM from 'react-dom';
import ${className} from './${fileName}';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<${className} />, div);
  ReactDOM.unmountComponentAtNode(div);
})`;
  }

  private renderImportStatements(current: SketchMSLayer) {
    const fileName = this.formatService.normalizeName(current.name);
    return [
      `import React, { Component } from 'react';`,
      ...this.generateDynamicImport(current),
      `import \'./${fileName}.css\';`,
    ].join('\n');
  }

  private generateDynamicImport(current: SketchMSLayer) {
    const context = this.webCodeGenService.context(current);
    return context && context.components
      ? context.components.map((component) => {
          const importclassName = this.formatService.className(component);
          const importFileName = this.formatService.normalizeName(component);
          return `import { ${importclassName} } from "./${importFileName}";`;
        })
      : [];
  }
}
