import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SketchService } from './sketch.service';

@Component({
  selector: 'sketch-select-demo-files',
  template: `
    <p class="sketch-select-demo-files-label">OR</p>
    <mat-expansion-panel color="secondary">
      <mat-expansion-panel-header>
        <mat-panel-title>
          Select a demo file
        </mat-panel-title>
      </mat-expansion-panel-header>

      <mat-nav-list>
      <ng-container *ngFor="let group of sketchService.getDemoFiles(); let i=index">
        <h3 mat-subheader>
          SketchApp v{{group.value}}
          <span *ngIf="i > 0">(legacy support)</span>
        </h3>

        <a mat-list-item *ngFor="let file of group.files" color="warn" (click)="confirmSelectedDemoFile(group.value+'/'+file)">
          <mat-icon mat-list-icon>note</mat-icon>
          <h4 mat-line><b>{{file}}</b></h4>
          <p mat-line>SketchApp v{{group.value}}</p>
        </a>

      </ng-container>
    </mat-nav-list>

    </mat-expansion-panel>
    <p class="sketch-select-demo-files-label-error" *ngIf="error">Error: please choose different file</p>
  `,
  styles: [
    `
      :host {
        padding: 0 20px;
        min-width: 460px;
      }
      .sketch-select-demo-files-label {
        margin-bottom: 25px;
        font-size: 15px;
      }
      .sketch-select-demo-files-label-error {
        margin: 0;
        color: #c2185b;
        font-size: 15px;
      }
      .mat-nav-list {
        display: block;
        height: 400px;
        overflow: auto;
        color: black;
        background: white;
      }
      .mat-list-icon, .mat-list-item, h3 {
        color: rgba(0, 0, 0, 0.54);
        text-align: left;
      }
      h3 span {
        display: inline-block;
        margin-left: 5px;
        color: gray;
      }
      .mat-list-item:hover {
        background-color: rgba(194, 24, 91, 0.4);
      }
      .mat-subheader {
        color: rgba(0, 0, 0, 1);
      }
    `
  ]
})
export class SketchSelectDemoFilesComponent {

  @Input() public error: boolean;
  @Output() private changed: EventEmitter<string> = new EventEmitter();

  constructor(public sketchService: SketchService) { }

  confirmSelectedDemoFile(file: string) {
    this.changed.emit(file);
  }
}
