import { Injectable } from '@angular/core';
import sdk from '@stackblitz/sdk';
import { XlayersNgxEditorModel } from '../code-editor/editor-container/codegen/codegen.service';
import { ExportStackblitzAngularService } from './stackblitz.angular.service';

export interface StackBlitzProjectPayload {
  files: { [path: string]: string };
  title: string;
  description: string;
  template: 'angular-cli' | 'create-react-app' | 'typescript' | 'javascript';
  tags?: string[];
  dependencies?: { [name: string]: string };
  settings?: {
    compile?: {
      trigger?: 'auto' | 'keystroke' | 'save';
      action?: 'hmr' | 'refresh';
      clearConsole?: boolean;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ExportStackblitzService {
  constructor(private angularExport: ExportStackblitzAngularService) {}

  async export(content: Array<XlayersNgxEditorModel>) {
    const project: StackBlitzProjectPayload = this.angularExport.prepare(
      content
    );
    sdk.openProject(project);
  }
}
