import { SketchService, SketchContent } from './sketch.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-sketch-container',
  template: `
    <ng-template #noData>
      <ngx-sketch-dropzone (changed)="onFileSelected($event)"></ngx-sketch-dropzone>
    </ng-template>
    
    <ngx-sketch-preview *ngIf="data else noData"  [data]="data"></ngx-sketch-preview>
  `,
  styles: [
    `
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }
  `
  ]
})
export class SketchContainerComponent implements OnInit {
  error: string;

  constructor(private service: SketchService) {}

  public data: SketchContent;

  ngOnInit() {}

  async onFileSelected(file: File) {
    try {
      this.data = await this.service.process(file);
    } catch {
      alert('Only .sketch files that were saved using Sketch v43 and above are supported.');
    }
  }
}
