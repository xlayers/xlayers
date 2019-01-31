import { Injectable } from '@angular/core';
import { CodeGenFacade, XlayersNgxEditorModel } from '../codegen.service';
import { SharedCodegen, Template } from '../shared-codegen.service';
import { wcTemplate, readmeTemplate } from './wc.template';
import { Store } from '@ngxs/store';
import { ExportStackblitzService } from 'src/app/editor/exports/stackblitz/stackblitz.service';
import { CodeGenSettings } from 'src/app/core/state/page.state';

@Injectable({
  providedIn: 'root'
})
export class WCCodeGenService implements CodeGenFacade {

  constructor(
    private sharedCodegen: SharedCodegen,
    private readonly exporter: ExportStackblitzService
  ) {}

  buttons() {
    return {
      stackblitz: (codegen: CodeGenSettings) => {
        this.exporter.export(codegen);
      }
    };
  }

  generate(ast: SketchMSLayer): Array<XlayersNgxEditorModel> {
    return [
      {
        uri: 'README.md',
        value: this.generateReadme(),
        language: 'markdown',
        kind: 'text'
      },
      {
        uri: 'index.js',
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
      this.sharedCodegen.generateComponentTemplate(ast, Template.HTML),
      this.sharedCodegen.generateComponentStyles(ast)
    );
  }
}
