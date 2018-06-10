import { AfterContentInit, Component, OnInit } from '@angular/core';
import { SourceCodeService } from '../source-code.service';

@Component({
  selector: 'sketch-editor',
  template: `
  <mat-tab-group dynamicHeight="true">
    <mat-tab [label]="file.fileName" *ngFor="let file of files">
      <ngx-monaco-editor
        [options]="editorOptions"
        [(ngModel)]="file.content"
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
export class EditorComponent implements OnInit, AfterContentInit {
  editorOptions: monaco.editor.IEditorConstructionOptions; // { [key: string]: string | boolean | number };
  code: string;
  currentFileType = SourceCodeService.TYPE.MODULE;
  files;
  constructor(private sourceCode: SourceCodeService) {}

  ngOnInit() {
    this.files = [
      {
        fileName: 'xlayer.module.ts',
        content: this.sourceCode.generate(SourceCodeService.TYPE.MODULE)
      },
      {
        fileName: 'xlayer.component.ts',
        content: this.sourceCode.generate(SourceCodeService.TYPE.COMPONENT)
      },
      {
        fileName: 'xlayer.component.spec.ts',
        content: this.sourceCode.generate(SourceCodeService.TYPE.COMPONENT_SPEC)
      }
    ];
  }

  ngAfterContentInit() {
    this.editorOptions = {
      theme: 'vs-dark',
      language: 'typescript',
      automaticLayout: true, // Warning: this might have a severe performance impact,
      // fontFamily: 'Open Sans',
      fontSize: 15,
      fontLigatures: true,
      formatOnPaste: false,
      scrollBeyondLastLine: false,
    };
  }
  onEditorInit(editor: monaco.editor.ICodeEditor) {

    monaco.languages.typescript.javascriptDefaults.addExtraLib(`declare module '@angular/core' {}`);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`declare module '@angular/common' {}`);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`declare module '@angular/core/testing' {}`);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`declare module './xlayer.component' {}`);

    setTimeout(_ => editor.render(), 500);
  }
}
