import { AfterContentInit, Component, OnInit } from '@angular/core';
import { CodeGenService, XlayersNgxEditorModel } from './codegen/codegen.service';
import { CodeGen } from 'src/app/core/state/page.state';
import { Store } from '@ngxs/store';

// tslint:disable-next-line
const githubIssueLink = 'https://github.com/xlayers/xlayers/issues/new?assignees=&labels=type%3A+question+%2F+discussion+%2F+RFC%2C+Scope%3A+CodeGen&template=codegen--add-xxxxx-support.md&title=CodeGen%3A+add+XXXXX+support';

@Component({
  selector: 'sketch-editor-container',
  template: `
  <section class="meu-container">
    <button mat-icon-button [matMenuTriggerFor]="menu" title="Choose framework">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="generateAngular()">
        <mat-icon svgIcon="angular"></mat-icon>
        <span>Angular</span>
      </button>
      <button mat-menu-item (click)="generateVue()">
        <mat-icon svgIcon="vue"></mat-icon>
        <span>Vue</span>
      </button>
      <button mat-menu-item (click)="generateReact()">
        <mat-icon svgIcon="react"></mat-icon>
        <span>React</span>
      </button>
      <!-- uncomment this when Vue codegen is ready -->
      <!--<button mat-menu-item (click)="generateVue()">
        <mat-icon svgIcon="vue"></mat-icon>
        <span>Vue</span>
      </button>-->
      <button mat-menu-item (click)="generateWc()">
        <mat-icon svgIcon="wc"></mat-icon>
        <span>Web Component</span>
      </button>
      <a class="request-new-library" target="__blank" href="${githubIssueLink}">
        <span>Add a new library!</span>
      </a>
    </mat-menu>
  </section>

  <mat-tab-group selectedIndex="0" disableRipple="true" animationDuration="0ms" dynamicHeight="false">
    <mat-tab *ngFor="let file of files">

      <ng-template mat-tab-label>
        <mat-icon [svgIcon]="file.kind"></mat-icon>
        {{ file.uri }}
      </ng-template>

      <ng-template matTabContent>
        <ngx-monaco-editor
          [options]="{ language: file.language }"
          [ngModel]="file.value"
          (onInit)="onEditorInit($event)"
        ></ngx-monaco-editor>
      </ng-template>
    </mat-tab>

  </mat-tab-group>
  `,
  styles: [
    `
      :host {
        margin-top: 64px;
        position: absolute;
        right: 0;
        z-index: 9;
        background-repeat: no-repeat;
        background-size: 56px 56px;
        background-position: center center;
        display: block;
        min-height: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      :host,
      ngx-monaco-editor {
        height: 100%;
        width: 100%;
        background-color: #1e1e1e;
        min-height: 100%;
        padding-bottom: 64px;
      }
      .mat-tab-group,
      .mat-tab-group ::ng-deep .mat-tab-body-wrapper {
        height: 100%;
        position: relative;
      }
      .mat-tab-group ::ng-deep .mat-tab-body-wrapper .mat-tab-body .mat-tab-body-content {
        overflow: hidden;
      }
      .mat-tab-group ::ng-deep .mat-tab-body-wrapper {
        padding-top: 5px;
      }
      .mat-tab-group ::ng-deep .mat-tab-header {
        width: calc(100% - 60px);
      }
      :host mat-icon {
        margin: 0 4px;
      }
      .meu-container {
        position: absolute;
        right: 15px;
        z-index: 999;
      }
      a.request-new-library {
        text-align: center;
        color: white;
        display: inline-block;
        width: 100%;
        font-size: 13px;
        padding-top: 10px;
      }
    `
  ]
})
export class EditorContainerComponent implements OnInit, AfterContentInit {
  editorOptions: monaco.editor.IEditorConstructionOptions = {};
  files: Array<XlayersNgxEditorModel>;

  frameworks: Array<{
    title: string;
    logo: FunctionStringCallback;
  }>;

  constructor(
    private codegen: CodeGenService,
    private readonly store: Store
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.generateAngular();
  }

  onEditorInit(editor: monaco.editor.ICodeEditor) {
    editor.layout();
    editor.focus();
  }

  generateAngular() {
    this.files = this.codegen.generate(CodeGenService.Kind.Angular);
    this.updateState(CodeGenService.Kind.Angular);
  }

  generateReact() {
    this.files = this.codegen.generate(CodeGenService.Kind.React);
    this.updateState(CodeGenService.Kind.React);
  }

  generateVue() {
    this.files = this.codegen.generate(CodeGenService.Kind.Vue);
    this.updateState(CodeGenService.Kind.Vue);
  }

  generateWc() {
    this.files = this.codegen.generate(CodeGenService.Kind.WC);
    this.updateState(CodeGenService.Kind.WC);
  }

  updateState(kind: number) {
    this.store.dispatch(new CodeGen(kind, this.files));
  }

}
