import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sketch-select-demo-files',
  template: `
    <p class="sketch-select-demo-files-label">OR</p>
    <mat-form-field>
      <mat-select [(value)]="selectedDemoFile">
        <mat-option value="">Select a demo file</mat-option>
        <mat-option *ngFor="let file of demoFiles" value="{{file}}">{{file}}</mat-option>
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
  public demoFiles = [
    'md-components-notifications-heads-up',
    'md-components-cards-welcome-back',
    'md-components-keyboards',
    'md-components-tabs-status-bar',
    'md-components-cards-safari',
    'md-components-date-picker',
    'md-components-chips-open-chip',
    'md-components-cards-homes',
    'md-components-buttons-lights',
    'md-components-cards-pooch',
    'md-components-buttons-fabs-light'
  ];

  @Input() public error: boolean;
  @Output() private changed: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  confirmSelectedDemoFile() {
    this.changed.emit(this.selectedDemoFile);
  }
}
