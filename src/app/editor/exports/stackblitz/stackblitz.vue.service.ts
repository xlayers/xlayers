import { Injectable } from '@angular/core';
import { XlayersNgxEditorModel } from '../../code-editor/editor-container/codegen/codegen.service';
import { StackBlitzProjectPayload } from './stackblitz.service';

@Injectable({
  providedIn: 'root'
})
export class ExportStackblitzVueService {
  constructor() {}
  prepare(content: XlayersNgxEditorModel[]): StackBlitzProjectPayload {
    const files = {};
    for (let i = 0; i < content.length; i++) {
      for (const prop in content[i]) {
        if (prop === 'uri') {
          files[`src/app/xlayers/` + content[i].uri] = content[i].value;
        }
      }
    }

    // add extra files
    // files['src/index.html'] = '<div>loading</div>';

    return {
      files,
      template: 'javascript',
      tags: ['vuejs']
    };
  }
}
