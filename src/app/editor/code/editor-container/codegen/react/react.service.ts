import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { SharedCodegen, Template } from '../shared-codegen.service';

@Injectable({
  providedIn: 'root'
})
export class ReactCodeGenService implements CodeGenFacade {

  constructor(private sharedCodegen: SharedCodegen) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [
      {
        uri: 'README.md',
        value: this.generateReadme(),
        language: 'text/plain',
        kind: 'text'
      },
      {
        uri: 'XLayers.js',
        value: this.generateComponent(ast),
        language: 'javascript',
        kind: 'react'
      },
      {
        uri: 'XLayers.test.js',
        value: this.generateTestComponent(),
        language: 'javascript',
        kind: 'react'
      },
      {
        uri: 'XLayers.css',
        value: this.sharedCodegen.generateComponentStyles(ast),
        language: 'css',
        kind: 'react'
      }
    ];
  }

  private generateReadme() {
    return ``;
  }

  /**
   * @todo make this dynamic
   */
  private generateTestComponent() {
    return `
import React from 'react';
import ReactDOM from 'react-dom';
import XLayers from './XLayers';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<XLayers />, div);
  ReactDOM.unmountComponentAtNode(div);
});
    `;
  }

  private generateComponent(ast: SketchMSLayer) {
    return `
import React, { Component } from 'react';
import './XLayers.css';

class XLayers extends Component {
  render() {
    return (
      <div className="XLayers">
        ${this.sharedCodegen.generateComponentTemplate(ast, Template.JSX)}
      </div>
    );
  }
}

export default XLayers;
    `;
  }
}
