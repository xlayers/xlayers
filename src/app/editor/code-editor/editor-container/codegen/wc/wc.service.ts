import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { SharedCodegen } from '../shared-codegen.service';
import { wcTemplate, readmeTemplate } from './wc.template';

@Injectable({
  providedIn: 'root'
})
export class WCCodeGenService implements CodeGenFacade {
  constructor(private sharedCodegen: SharedCodegen) {}

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [
      {
        uri: 'README.md',
        value: this.generateReadme(),
        language: 'markdown',
        kind: 'text'
      },
      {
        uri: 'x-layers-element-file.js',
        value: this.generateComponent(ast),
        language: 'javascript',
        kind: 'wc'
      }
    ];
  }

  private generateReadme() {
    return readmeTemplate();
  }

  private generateComponent(ast: SketchMSLayer) {
    return wcTemplate(
      this.sharedCodegen.generateComponentTemplate(ast, 1),
      this.sharedCodegen.generateComponentStyles(ast)
    );
  }
}
