import { AfterContentInit, Component, OnInit } from '@angular/core';
import { SourceCodeService } from '../source-code.service';
import { NgxEditorModel } from 'ngx-monaco-editor';

@Component({
  selector: 'sketch-editor-container',
  template: `
  <mat-tab-group dynamicHeight="true">
    <mat-tab [label]="file.uri" *ngFor="let file of files; let idx = index">
      <ngx-monaco-editor
        [options]="editorOptions"
        [(ngModel)]="files[idx].value"
        (onInit)="onEditorInit($event)"></ngx-monaco-editor>
    </mat-tab>
  </mat-tab-group>
  `,
  styles: [
    `
      :host {
        top: 90px;
        position: absolute;
        right: 0;
        z-index: 9;
        background-image: url('assets/lg.flip-circle-google-loader.gif');
        background-repeat: no-repeat;
        background-size: 56px 56px;
        background-position: center center;
        display: block;
      }
      :host,
      ngx-monaco-editor {
        height: 100%;
        width: 100%;
        background-color: #1e1e1e;
        min-height: 100%;
      }
      .mat-tab-group,
      .mat-tab-group ::ng-deep .mat-tab-body-wrapper {
        height: 100%;
        min-height: 100%;
        position: relative;
      }
    `
  ]
})
export class EditorContainerComponent implements OnInit, AfterContentInit {
  editorOptions: monaco.editor.IEditorConstructionOptions; // { [key: string]: string | boolean | number };
  code: string;
  currentFileType = SourceCodeService.TYPE.MODULE;
  files: Array<NgxEditorModel>;
  constructor(private sourceCode: SourceCodeService) {}

  ngOnInit() {
    this.files = [
      {
        uri: 'xlayers.module.ts',
        value: this.sourceCode.generate(SourceCodeService.TYPE.MODULE)
      },
      {
        uri: 'xlayers.component.ts',
        value: this.sourceCode.generate(SourceCodeService.TYPE.COMPONENT)
      },
      {
        uri: 'xlayers.component.spec.ts',
        value: this.sourceCode.generate(SourceCodeService.TYPE.COMPONENT_SPEC)
      }
    ];
  }

  ngAfterContentInit() {}
  onEditorInit(editor: monaco.editor.ICodeEditor) {
    editor.layout();
  }
}
