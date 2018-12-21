import { Injectable } from '@angular/core';
import { XlayersNgxEditorModel } from '../../code-editor/editor-container/codegen/codegen.service';
import { StackBlitzProjectPayload } from './stackblitz.service';

@Injectable({
  providedIn: 'root'
})
export class ExportStackblitzReactService {
  constructor() {}
  prepare(content: XlayersNgxEditorModel[]): StackBlitzProjectPayload {
    const files = {};
    for (let i = 0; i < content.length; i++) {
      for (const prop in content[i]) {
        if (prop === 'uri') {
          files[`src/` + content[i].uri] = content[i].value;
        }
      }
    }

    // add extra files
    files['public/index.html'] = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>React App</title>
      </head>
      <body>
        <noscript>
          You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>
      </body>
    </html>`;

    files['src/index.js'] = `
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import XLayers from './src/XLayers';

ReactDOM.render(<XLayers />, document.getElementById('root'));
`;

    return {
      files,
      template: 'create-react-app',
      tags: ['react']
    };
  }
}
