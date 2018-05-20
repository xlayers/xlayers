import { SketchContent } from './sketch.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-sketch-viewer',
  template: `
    <img  *ngFor="let image of data.previews" [src]="image"/>
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
export class SketchViewerComponent implements OnInit {
  @Input() data: SketchContent;
  constructor() {}

  ngOnInit() {}
}
