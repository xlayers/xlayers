import { AfterContentInit, Component, OnInit } from '@angular/core';
import { CodeGenService, CodeGenKind } from './codegen/codegen.service';
import { CodeGen } from '@app/core/state/page.state';
import { Store } from '@ngxs/store';
import { CodeGenSettings } from '@app/core/state/page.state';

@Component({
  selector: 'sketch-editor-container',
  template: `
  <section class="framework_selection">
  <mat-tab-group color="accent" selectedIndex="0"  mat-align-tabs="center"  disableRipple="true" animationDuration="0ms" dynamicHeight="false">
    <mat-tab>
      <ng-template mat-tab-label>
        <div class="flex-container" (click)="generateAngular()">
          <mat-icon svgIcon="angular"></mat-icon>
            Angular
        </div>
      </ng-template>
    </mat-tab>
    <mat-tab>
      <ng-template mat-tab-label>
        <div class="flex-container" (click)="generateVue()">
          <mat-icon svgIcon="vue"></mat-icon>
          Vue
        </div>
      </ng-template>
    </mat-tab>
    <mat-tab>
      <ng-template mat-tab-label>
        <div class="flex-container" (click)="generateReact()">
          <mat-icon svgIcon="react"></mat-icon>
          React
        </div>
      </ng-template>
    </mat-tab>
    <mat-tab>
      <ng-template mat-tab-label>
        <div class="flex-container" (click)="generateWc()">
          <mat-icon svgIcon="wc"></mat-icon>
          WebComponents
        </div>
      </ng-template>
    </mat-tab>
    <mat-tab>
      <ng-template mat-tab-label>
        <div class="flex-container" (click)="generateStencil()">
          <mat-icon svgIcon="stencil"></mat-icon>
          Stencil
        </div>
      </ng-template>
    </mat-tab>
    <mat-tab>
      <ng-template mat-tab-label>
        <div class="flex-container" (click)="generateLitElement()">
          <mat-icon svgIcon="polymer"></mat-icon>
          LitElement
        </div>
      </ng-template>
    </mat-tab>
  </mat-tab-group>
  </section>
  <section class="file-section">
    <mat-tab-group selectedIndex="0" disableRipple="true" animationDuration="0ms" dynamicHeight="false">
      <mat-tab *ngFor="let file of codeSetting.content">

        <ng-template mat-tab-label>
          <mat-icon [svgIcon]="file.kind"></mat-icon>
          {{ file.uri }}
        </ng-template>

        <ng-template matTabContent>
        <div #codeContentEditor  spellcheck="false" class="code-highlight-editor">
        <pre><code contentEditable="true" [highlight]="file.value" (highlighted)="onEditorInit($event, codeContentEditor)"></code></pre>
        </div>
        </ng-template>
      </mat-tab>

    </mat-tab-group>
  </section>
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
      .code-highlight-editor pre {
        margin-top: 0px;
      }
      .code-highlight-editor {
        overflow: auto;
      }
      .code-highlight-editor code {
        font-family: Consolas, "Courier New", monospace;
        font-weight: normal;
        font-size: 15px;
        line-height: 20px;
        letter-spacing: 0px;
      }
      :host, .code-highlight-editor, .code-highlight-editor code {
        height: 100%;
        width: 100%;
        background-color: #1e1e1e;
        min-height: 100%;
        padding-bottom: 64px;
      }

      .framework_selection,
      .framework_selection ::ng-deep .mat-tab-group{
        background-color:#ff4f81;
      }

      .framework_selection .flex-container {
        display: flex;
        align-items: center;
      }
      .framework_selection ::ng-deep .mat-tab-labels{
        justify-content: center;
      }
      .framework_selection ::ng-deep .mat-tab-label{
        color:white;
        opacity: 0.5;
      }
  
      .framework_selection ::ng-deep .mat-tab-label[aria-selected="true"] {
        background-color: gray;
        opacity: 1;
      }
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
      :host mat-icon {
        margin: 0 4px;
      }
    `
  ]
})
export class EditorContainerComponent implements OnInit, AfterContentInit {
  codeSetting: CodeGenSettings;

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

  onEditorInit(editor: any, ctrl: HTMLElement) {
    ctrl.focus();
  }

  generateAngular() {
    this.codeSetting = this.codegen.generate(CodeGenKind.Angular);
    this.updateState();
  }

  generateReact() {
    this.codeSetting = this.codegen.generate(CodeGenKind.React);
    this.updateState();
  }

  generateVue() {
    this.codeSetting = this.codegen.generate(CodeGenKind.Vue);
    this.updateState();
  }

  generateWc() {
    this.codeSetting = this.codegen.generate(CodeGenKind.WC);
    this.updateState();
  }

  generateStencil() {
    this.codeSetting = this.codegen.generate(CodeGenKind.Stencil);
    this.updateState();
  }

  generateLitElement() {
    this.codeSetting = this.codegen.generate(CodeGenKind.LitElement);
    this.updateState();
  }

  updateState() {
    this.store.dispatch(new CodeGen(this.codeSetting.kind, this.codeSetting.content, this.codeSetting.buttons));
  }
}
