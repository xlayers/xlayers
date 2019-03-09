import { Injectable } from '@angular/core';
import sdk from '@stackblitz/sdk';
import { CodeGenSettings } from '@app/core/state/page.state';
import { CodeGenKind } from '@app/editor/code/editor-container/codegen/codegen.service';
import { ExportStackblitzAngularService } from './stackblitz.angular.service';
import { ExportStackblitzReactService } from './stackblitz.react.service';
import { ExportStackblitzVueService } from './stackblitz.vue.service';
import { ExportStackblitzWCService } from './stackblitz.wc.service';
import { ExportStackblitzStencilService } from './stackblitz.stencil.service';
import { ExportStackblitzLitElementService } from './stackblitz.lit-element.service';



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
    private wcExport: ExportStackblitzWCService,
    private stencilExport: ExportStackblitzStencilService,
    private litElementExport: ExportStackblitzLitElementService

  ) {}

  async export(codegen: CodeGenSettings) {
    let project: StackBlitzProjectPayload = null;
    switch (codegen.kind) {
      case CodeGenKind.React:
        project = this.reactExport.prepare(codegen.content);
        break;
      case CodeGenKind.Vue:
        project = this.vueExport.prepare(codegen.content);
        break;
      case CodeGenKind.WC:
        project = this.wcExport.prepare(codegen.content);
        break;
      case CodeGenKind.Stencil:
        project = this.stencilExport.prepare(codegen.content);
        break;
      case CodeGenKind.LitElement:
        project = this.litElementExport.prepare(codegen.content);
        break;
      case CodeGenKind.Angular:
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
