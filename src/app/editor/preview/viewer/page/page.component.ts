import { Component, Input } from '@angular/core';

@Component({
  selector: 'xly-viewer-page',
  template: `
    <xly-viewer-layer
      *ngFor="let layer of page.layers"
      class="layer"
      [ngClass]="{ wireframe: wireframe }"
      [data]="data"
      [layer]="layer"
      [level]="1"
      [wireframe]="wireframe"
      [attr.data-id]="layer?.do_objectID"
      [attr.data-name]="layer?.name"
      [attr.data-class]="layer?._class"
      [style.width.px]="layer?.frame?.width"
      [style.height.px]="layer?.frame?.height"
    ></xly-viewer-layer>
  `,
  styles: [
    `
      :host {
        display: block;
        position: static;
        box-sizing: border-box;
        overflow: visible;
        transition: transform 1s;
      }
    `
  ]
})
export class ViewerPageComponent {
  @Input() data: SketchMSData;
  @Input() page: SketchMSPage;

  @Input() wireframe = false;
  @Input() level = 0;
}
