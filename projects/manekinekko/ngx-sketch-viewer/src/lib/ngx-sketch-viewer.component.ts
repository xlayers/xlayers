import { NgxSketchViewerService, SketchContent } from './ngx-sketch-viewer.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-sketch-viewer',
  template: `
    <ngx-dropzone (changed)="onFileSelected($event)"></ngx-dropzone>
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
export class NgxSketchViewerComponent implements OnInit {
  error: string;

  constructor(private service: NgxSketchViewerService) {}

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
