import { Injectable } from '@angular/core';
import { CodeGenSettings } from '@app/core/state/page.state';
import { CodeGenKind } from '@app/editor/code/editor-container/codegen/codegen.service';
import sdk from '@stackblitz/sdk';
import { VM } from '@stackblitz/sdk/typings/VM';
import { ExportStackblitzAngularService } from './stackblitz.angular.service';
import { ExportStackblitzLitElementService } from './stackblitz.lit-element.service';
import { ExportStackblitzReactService } from './stackblitz.react.service';
import { ExportStackblitzStencilService } from './stackblitz.stencil.service';
import { ExportStackblitzVueService } from './stackblitz.vue.service';
import { ExportStackblitzWCService } from './stackblitz.wc.service';
import { defer, Subject, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface StackBlitzProjectPayload {
  files: { [path: string]: string };
  title?: string;
  onlyEditor?: boolean;
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
  vm$: BehaviorSubject<VM> = new BehaviorSubject(null);
  constructor(
    private angularExport: ExportStackblitzAngularService,
    private reactExport: ExportStackblitzReactService,
    private vueExport: ExportStackblitzVueService,
    private wcExport: ExportStackblitzWCService,
    private stencilExport: ExportStackblitzStencilService,
    private litElementExport: ExportStackblitzLitElementService
  ) { }

  async export(codegen: CodeGenSettings) {
    await this.setupStackBlitz(codegen).then(vm => {
      this.vm$.next(vm);
    }, () => this.vm$.next(null));
  }
  private setupStackBlitz(codegen: CodeGenSettings) {
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
    return sdk.embedProject(
      'stack',
      {
        files: project.files,
        title: project.description || 'xlayers',
        description: project.description || 'xLayers generated project',
        template: project.template,
        tags: [...project.tags],
        dependencies: project.dependencies || {}
      },
      {
        view: project.onlyEditor ? 'editor' : null,
        hideNavigation: true,
        hideDevTools: true,
        hideExplorer: false,
        clickToLoad: true,
        forceEmbedLayout: true,
        height: '100%'
      }
    );
  }

  public getContent() {
    return this.vm$.getValue().getFsSnapshot();
  }
}
