import { CurrentLayer } from '../../state/ui.state';
import { Store } from '@ngxs/store';
import { Component, ViewChild, ElementRef, Renderer2, Input, ViewChildren, AfterContentInit, OnChanges, OnInit } from '@angular/core';
import { UiState } from 'src/app/state/ui.state';
import { ResizeEvent } from 'angular-resizable-element';


@Component({
  selector: 'sketch-layer',
  template: `
  <div
    *ngIf="!layer?.isLocked"
    mwlResizable
    [resizeSnapGrid]="{ left: 1, right: 1 }"
    [resizeEdges]="{bottom: true, right: true, top: true, left: true}"    (resizeStart)="resizeStart($event)"
    (resizing)="resizing($event)"
    (resizeEnd)="resizeEnd($event)"
    [style.width.px]="layer?.frame?.width"
    [style.height.px]="layer?.frame?.height"
    [style.left.px]="layer?.frame?.x"
    [style.top.px]="layer?.frame?.y"
    >
    <sketch-layer
      sketchStopEventPropagation
      (click)="setCurrentLayer(layer)"
      *ngFor="let layer of layer?.layers"
      class="layer"
      [layer]="layer"
      [wireframe]="wireframe"
      [ngClass]="{ 'wireframe': wireframe, 'currentLayer': layer?.id === currentLayer?.id }"
      [attr.data-id]="layer.id"
      [attr.data-name]="layer.name"
      [attr.data-class]="layer._class"></sketch-layer>
  </div>
  `,
  styles: [
    `
    :host {
      display: block;
      border: 1px solid transparent;
      position: absolute;
      box-sizing: border-box;
      transition: border-color 0.1s linear;
    }

    :host(:hover), :host(.currentLayer) {
      border-color: #51C1F8 !important;
      background-color: rgba(81, 193, 248, 0.2);
    }
    :host(.wireframe) {
      border-color: black;
    }
  `
  ]
})
export class SketchLayerComponent implements OnInit, AfterContentInit {
  @Input() layer: SketchMSSymbolMaster;
  @Input() wireframe = true;
  artboardFactor = 1;
  borderWidth = 1;
  nativeElement: HTMLElement;

  constructor(public store: Store, public renderer: Renderer2, public element: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.store.select(UiState.isWireframe).subscribe(isWireframe => {
      this.wireframe = isWireframe;
    });
    this.nativeElement = this.element.nativeElement;
  }

  ngAfterContentInit() {
    if (!this.layer) {
      return;
    }

    this.updateLayerStyle();
  }

  setCurrentLayer(layer: SketchMSSymbolMaster) {
    this.store.dispatch(new CurrentLayer(layer));
  }

  updateLayerStyle() {
    this.renderer.setStyle(this.nativeElement, 'border-width', `${this.borderWidth}px`);
    this.renderer.setStyle(this.nativeElement, 'left', `${this.layer.frame.x * this.artboardFactor - this.borderWidth}px`);
    this.renderer.setStyle(this.nativeElement, 'top', `${this.layer.frame.y * this.artboardFactor - this.borderWidth}px`);
    this.renderer.setStyle(this.nativeElement, 'width', `${this.layer.frame.width * this.artboardFactor}px`);
    this.renderer.setStyle(this.nativeElement, 'height', `${this.layer.frame.height * this.artboardFactor}px`);
    this.renderer.setStyle(this.nativeElement, 'visibility', this.layer.isVisible ? 'visibile' : 'hidden');
  }

  toggleSelected(layer: SketchMSSymbolMaster) {}

  resizeStart(event: ResizeEvent) {}
  resizing(event: ResizeEvent) {
    if (event.rectangle.width) {
      this.layer.frame.width = event.rectangle.width;
      this.renderer.setStyle(this.nativeElement, 'width', `${this.layer.frame.width * this.artboardFactor}px`);
    }
    if (event.rectangle.height) {
      this.layer.frame.height = event.rectangle.height;
      this.renderer.setStyle(this.nativeElement, 'height', `${this.layer.frame.height * this.artboardFactor}px`);
    }

    this.updateLayerStyle();
  }
  resizeEnd(event: ResizeEvent) {
    this.store.dispatch(new CurrentLayer(this.layer));
  }
}
