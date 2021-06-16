import { Injectable } from '@angular/core';
import sdk from '@stackblitz/sdk';
import { ExportStackblitzAngularService } from './stackblitz.angular.service';
import { ExportStackblitzReactService } from './stackblitz.react.service';
import { ExportStackblitzVueService } from './stackblitz.vue.service';
import { ExportStackblitzWCService } from './stackblitz.wc.service';
import { ExportStackblitzStencilService } from './stackblitz.stencil.service';
import { ExportStackblitzLitElementService } from './stackblitz.lit-element.service';
import { CodeGenSettings } from '../../../../core/state/page.state';
import { CodeGenKind } from '../../editor-container/codegen/codegen.service';

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
  providedIn: 'root',
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
    const content = this.normalizeBase64Image(codegen);
    switch (codegen.kind) {
      case CodeGenKind.React:
        project = this.reactExport.prepare(content);
        break;
      case CodeGenKind.Vue:
        project = this.vueExport.prepare(content);
        break;
      case CodeGenKind.WC:
        project = this.wcExport.prepare(content);
        break;
      case CodeGenKind.Stencil:
        project = this.stencilExport.prepare(content);
        break;
      case CodeGenKind.LitElement:
        project = this.litElementExport.prepare(content);
        break;
      case CodeGenKind.Angular:
      default:
        project = this.angularExport.prepare(content);
        break;
    }

    sdk.openProject({
      files: project.files,
      title: project.description || 'xlayers',
      description: project.description || 'xLayers generated project',
      template: project.template,
      // tags: ['xlayers', ...project.tags],
      dependencies: project.dependencies || {},
    });
  }

  private normalizeBase64Image(codegen: CodeGenSettings) {
    if (!codegen.content) {
      return [];
    }

    return codegen.content.map((file) => {
      if (file.language === 'base64') {
        if (file.kind === 'png') {
          return {
            ...file,
            value: `data:image/png;base64,${file.value}`,
          };
        }
      }
      return file;
    });
  }
}
