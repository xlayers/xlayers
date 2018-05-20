import { SketchContent } from './sketch.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-sketch-preview',
  template: `
    <img  *ngFor="let image of data.previews" [src]="image"/>
  `,
  styles: [
    `
  :host {
    width: 100%;
    display: flex;
    height: 100%;
    justify-content: center;
  }
  `
  ]
})
export class SketchPreviewComponent implements OnInit {
  @Input() data: SketchContent;
  constructor() {}

  ngOnInit() {}
}
