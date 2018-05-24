import { Store } from '@ngxs/store';
import { SketchLayerComponent } from './sketch-layer.component';
import { Component, ViewChild, ElementRef, Renderer2, Input, ViewChildren, AfterContentInit, OnChanges } from '@angular/core';

@Component({
  selector: 'sketch-page',
  template: `
  <sketch-layer
    sketchStopEventPropagation
    (click)="setCurrentLayer(layer)"
    *ngFor="let layer of page?.layers"
    class="layer"
    [layer]="layer"
    [wireframe]="wireframe"
    [ngClass]="{ 'wireframe': wireframe }"
    [attr.data-id]="layer.do_objectID"
    [attr.data-name]="layer.name"
    [attr.data-class]="layer._class"
    [matTooltip]="tooltipInfo"></sketch-layer>
  `,
  styles: [
    `
    :host {
      display: block;
      position: static;
      box-sizing: border-box;
    }`
  ]
})
export class SketchPageComponent extends SketchLayerComponent {
  @Input() page: SketchMSPage;
  constructor(public renderer: Renderer2, public el: ElementRef<HTMLElement>, public store: Store) {
    super(renderer, el, store);
  }
}
