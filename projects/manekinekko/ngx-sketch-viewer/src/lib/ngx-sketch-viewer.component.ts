import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-sketch-viewer',
  template: `
    <ngx-dropzone></ngx-dropzone>
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
  constructor() {}

  ngOnInit() {}
}
