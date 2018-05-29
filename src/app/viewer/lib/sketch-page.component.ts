import { SketchMSLayer, CurrentLayer } from './../../state/ui.state';
import { Store } from '@ngxs/store';
import { SketchLayerComponent } from './sketch-layer.component';
import { Component, ViewChild, ElementRef, Renderer2, Input, ViewChildren, AfterContentInit, OnChanges, OnInit } from '@angular/core';
import { UiState } from '../../state/ui.state';

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
    [attr.data-id]="layer?.id"
    [attr.data-name]="layer?.name"
    [attr.data-class]="layer?._class"></sketch-layer>
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
export class SketchPageComponent extends SketchLayerComponent implements OnInit, AfterContentInit {
  @Input() page: SketchMSPage;

  currentLayer: SketchMSLayer;

  constructor(public store: Store, public renderer: Renderer2, public element: ElementRef<HTMLElement>) {
    super(store, renderer, element);
  }

  ngOnInit() {
    super.ngOnInit();

    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      this.currentLayer = currentLayer;
    });
    this.store.dispatch(new CurrentLayer(this.currentLayer));
  }

  ngAfterContentInit() {
    const ne = this.element.nativeElement;
    this.renderer.setStyle(ne, 'border-width', `${this.borderWidth}px`);
    this.renderer.setStyle(ne, 'left', `${this.page.frame.x * this.artboardFactor - this.borderWidth}px`);
    this.renderer.setStyle(ne, 'top', `${this.page.frame.y * this.artboardFactor - this.borderWidth}px`);
    this.renderer.setStyle(ne, 'width', `${this.page.frame.width * this.artboardFactor}px`);
    this.renderer.setStyle(ne, 'height', `${this.page.frame.height * this.artboardFactor}px`);
    this.renderer.setStyle(ne, 'visibility', this.page.isVisible ? 'visibile' : 'hidden');

    super.ngAfterContentInit();
  }
}
