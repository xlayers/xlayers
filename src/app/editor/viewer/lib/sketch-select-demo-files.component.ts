import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SketchService } from './sketch.service';

@Component({
  selector: 'sketch-select-demo-files',
  template: `
    <p class="sketch-select-demo-files-label">OR</p>
    <mat-form-field>
      <mat-select [(value)]="selectedDemoFile">
        <mat-option value="">Select a demo file</mat-option>
        <mat-option *ngFor="let file of sketchService.getDemoFiles()" value="{{file}}">{{file}}</mat-option>
      </mat-select>
    </mat-form-field>
    <button mat-icon-button class="confirm-button" *ngIf="selectedDemoFile" (click)="confirmSelectedDemoFile()">
      <mat-icon>done</mat-icon>
    </button>
    <p class="sketch-select-demo-files-label-error" *ngIf="error">Error: please choose different file</p>
  `,
  styles: [
    `
      :host {
        padding: 0 20px;
      }
      .sketch-select-demo-files-label {
        margin-bottom: 5px;
        font-size: 15px;
      }
      .sketch-select-demo-files-label-error {
        margin: 0;
        color: #c2185b;
        font-size: 15px;
      }
      .mat-select-value {
        color: #b0b0b0;
        text-align: center;
      }
      mat-select {
        margin-left: 10px;
      }
      .confirm-button {
        margin-left: 20px;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class SketchSelectDemoFilesComponent implements OnInit {
  public selectedDemoFile = '';

  @Input() public error: boolean;
  @Output() private changed: EventEmitter<string> = new EventEmitter();

  constructor(public sketchService: SketchService) { }

  ngOnInit() { }

  confirmSelectedDemoFile() {
    this.changed.emit(this.selectedDemoFile);
  }
}
