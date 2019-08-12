import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from '@app/core/state';

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
      :host(.wireframe) {
        box-shadow: 0 0 0 1px black;
      }
    `
  ]
})
export class ViewerPageComponent implements OnInit {
  @Input() data: SketchMSData;
  @Input() page: SketchMSPage;

  @Input() wireframe = false;
  @Input() level = 0;

  constructor(private store: Store) {}
  ngOnInit() {
    this.store.select(UiState.isWireframe).subscribe(isWireframe => {
      this.wireframe = isWireframe;
    });
  }
}
