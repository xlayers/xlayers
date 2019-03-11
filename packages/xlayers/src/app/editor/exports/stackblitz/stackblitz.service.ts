import { Injectable } from '@angular/core';
import sdk from '@stackblitz/sdk';
import { CodeGenSettings } from '@app/core/state/page.state';
import { CodeGenKind } from '@app/editor/code-editor/editor-container/codegen/codegen.service';
import { ExportStackblitzAngularService } from './stackblitz.angular.service';
import { ExportStackblitzReactService } from './stackblitz.react.service';
import { ExportStackblitzVueService } from './stackblitz.vue.service';
import { ExportStackblitzWCService } from './stackblitz.wc.service';
import { ExportStackblitzStencilService } from './stackblitz.stencil.service';
import { ExportStackblitzLitElementService } from './stackblitz.lit-element.service';
import { Project, EmbedOptions } from '@stackblitz/sdk/typings/interfaces';



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
  private embeddedConfig: EmbedOptions = { hideNavigation: true, hideDevTools: true, hideExplorer: true, height: '100%', forceEmbedLayout: true, view: 'preview' };
  constructor(
    private angularExport: ExportStackblitzAngularService,
    private reactExport: ExportStackblitzReactService,
    private vueExport: ExportStackblitzVueService,
    private wcExport: ExportStackblitzWCService,
    private stencilExport: ExportStackblitzStencilService,
    private litElementExport: ExportStackblitzLitElementService

  ) { }
  private getProjectSettings(codegen: CodeGenSettings): Project {
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
    return this.getStackBlitzProjectConfig(project);
  }

  private getStackBlitzProjectConfig(project: StackBlitzProjectPayload): Project {
    return {
      files: project.files,
      title: project.description || 'xlayers',
      description: project.description || 'xLayers generated project',
      template: project.template,
      // tags: ['xlayers', ...project.tags],
      dependencies: project.dependencies || {}

    };
  }
  async export(codegen: CodeGenSettings) {
    sdk.openProject(this.getProjectSettings(codegen));
  }

  async embedded(codegen: CodeGenSettings) {
    sdk.embedProject('stack', this.getProjectSettings(codegen), this.embeddedConfig);
  }
}
