import { SketchService, SketchContent } from './sketch.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-sketch-container',
  template: `
    <ng-template #noData>
      <ngx-sketch-dropzone (changed)="onFileSelected($event)"></ngx-sketch-dropzone>
    </ng-template>
    
    <ngx-sketch-viewer *ngIf="data else noData"  [data]="data"></ngx-sketch-viewer>
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

  data: SketchContent;

  ngOnInit() {}

  async onFileSelected(file: File) {
    try {
      this.data = await this.service.processSketchFile(file);
    } catch {
      this.error = 'Only .sketch files that were saved using the new Sketch 43 are supported.';
    }
  }
}
