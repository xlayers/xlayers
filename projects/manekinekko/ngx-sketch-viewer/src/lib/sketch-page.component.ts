import { Component, ViewChild, ElementRef, Renderer2, Input, ViewChildren, AfterContentInit, OnChanges } from '@angular/core';

@Component({
  selector: 'sketch-page',
  template: `
    <sketch-layer
      *ngFor="let layer of page.layers"
      [layer]="layer"
      [attr.data-id]="layer.do_objectID"
      [attr.data-name]="layer.name"
      [attr.data-class]="layer._class"></sketch-layer>
  `,
  styles: [
    `
    :host {
      display: block;
      position: absolute;
      box-sizing: border-box;
    }`
  ]
})
export class SketchPageComponent {

  @Input() page: SketchMSPage;


  constructor() {}

}
