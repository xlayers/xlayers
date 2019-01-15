import { Injectable } from '@angular/core';
import sdk from '@stackblitz/sdk';
import { CodeGenSettings } from 'src/app/core/state/page.state';
import { CodeGenService } from '../../code-editor/editor-container/codegen/codegen.service';
import { ExportStackblitzAngularService } from './stackblitz.angular.service';
import { ExportStackblitzReactService } from './stackblitz.react.service';
import { ExportStackblitzVueService } from './stackblitz.vue.service';
import { ExportStackblitzWCService } from './stackblitz.wc.service';

export interface StackBlitzProjectPayload {
  files: { [path: string]: string };
  title?: string;
  description?: string;
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
  constructor(
    private angularExport: ExportStackblitzAngularService,
    private reactExport: ExportStackblitzReactService,
    private vueExport: ExportStackblitzVueService,
    private wcExport: ExportStackblitzWCService
  ) {}

  async export(codegen: CodeGenSettings) {
    let project: StackBlitzProjectPayload = null;
    switch (codegen.kind) {
      case CodeGenService.Kind.React:
        project = this.reactExport.prepare(codegen.content);
        break;
      case CodeGenService.Kind.Vue:
        project = this.vueExport.prepare(codegen.content);
        break;
      case CodeGenService.Kind.WC:
        project = this.wcExport.prepare(codegen.content);
        break;
      case CodeGenService.Kind.Angular:
      default:
        project = this.angularExport.prepare(codegen.content);
        break;
    }

    sdk.openProject({
      files: project.files,
      title: project.description || 'xlayers' ,
      description: project.description || 'xLayers generated project',
      template: project.template,
      // tags: ['xlayers', ...project.tags],
      dependencies: project.dependencies || {}
    });
  }
}
