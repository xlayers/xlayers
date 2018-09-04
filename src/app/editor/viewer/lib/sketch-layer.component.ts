import { AfterContentInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngxs/store';
import { ResizeEvent } from 'angular-resizable-element';
import { UiState, CurrentLayer } from 'src/app/core/state/ui.state';

@Component({
  selector: 'sketch-layer',
  template: `
  <div
    *ngIf="!layer?.isLocked"
    mwlResizable
    [resizeSnapGrid]="{ left: 1, right: 1 }"
    [resizeEdges]="{bottom: true, right: true, top: true, left: true}"
    (resizeStart)="resizeStart($event)"
    (resizing)="resizing($event)"
    (resizeEnd)="resizeEnd($event)"
    [style.width.px]="layer?.frame?.width"
    [style.height.px]="layer?.frame?.height"
    [style.left.px]="layer?.frame?.x"
    [style.top.px]="layer?.frame?.y"
    >

    <span *ngIf="textContent">{{textContent}}</span>

    <sketch-layer
      sketchSelectedLayer
      (selectedLayer)="selectLayer($event)"
      *ngFor="let layer of layer?.layers"
      class="layer"
      [layer]="layer"
      [level]="level + 1"
      [wireframe]="wireframe"
      [ngClass]="{ 'wireframe': wireframe }"
      [attr.data-id]="layer?.do_objectID"
      [attr.data-name]="layer?.name"
      [attr.data-class]="layer?._class"></sketch-layer>
  </div>
  `,
  styles: [
    `
      :host {
        display: block;
        border: 1px solid transparent;
        position: absolute;
        box-sizing: border-box;
        transition: border-color 0.1s linear, transform 1s;
        transform-origin: 0 0;
        transform-style: preserve-3d;
        will-change: transform, transition;
      }

      :host(:hover) {
        border-color: #51c1f8 !important;
        background-color: rgba(81, 193, 248, 0.2);
      }
      :host(.isCurrentLayer) {
        border-color: #ee4743 !important;
        background-color: rgba(238, 71, 67, 0.2);
      }
      :host(.wireframe) {
        border-color: black;
      }
    `
  ]
})
export class SketchLayerComponent implements OnInit, AfterContentInit {
  @Input() layer: SketchMSLayer;
  @Input() wireframe = false;

  @Input() level = 0;

  artboardFactor = 1;
  borderWidth = 1;
  nativeElement: HTMLElement;

  offset3d = 20;

  textContent;

  constructor(public store: Store, public renderer: Renderer2, public element: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.nativeElement = this.element.nativeElement;
    this.store.select(UiState.isWireframe).subscribe(isWireframe => {
      this.wireframe = isWireframe;
    });
    this.store.select(UiState.is3dView).subscribe(is3dView => {
      if (this.nativeElement) {
        if (is3dView === true) {
          if (this.level > 0) {
            this.renderer.setStyle(this.nativeElement, 'transform', `translateZ(${(this.level * this.offset3d).toFixed(3)}px)`);
          }
        } else {
          this.renderer.setStyle(this.nativeElement, 'transform', `none`);
        }
      }
    });
  }

  ngAfterContentInit() {
    if (this.layer) {
      this.updateLayerStyle();
      this.isTextContent();
    }
  }

  isTextContent() {
    if (this.layer._class as 'text' === 'text') {
      this.textContent = this.layer.name;
    }
  }

  updateLayerStyle() {
    if (this.layer && this.nativeElement) {
      this.renderer.setStyle(this.nativeElement, 'border-width', `${this.borderWidth}px`);
      this.renderer.setStyle(this.nativeElement, 'left', `${this.layer.frame.x * this.artboardFactor - this.borderWidth}px`);
      this.renderer.setStyle(this.nativeElement, 'top', `${this.layer.frame.y * this.artboardFactor - this.borderWidth}px`);
      this.renderer.setStyle(this.nativeElement, 'width', `${this.layer.frame.width * this.artboardFactor}px`);
      this.renderer.setStyle(this.nativeElement, 'height', `${this.layer.frame.height * this.artboardFactor}px`);
      this.renderer.setStyle(this.nativeElement, 'visibility', this.layer.isVisible ? 'visibile' : 'hidden');

      this.applyDefaultStyles();
    }
  }

  toggleSelected(layer: SketchMSSymbolMaster) {}

  applyDefaultStyles() {
    const css = (this.layer as any).css as { [key: string]: string };
    if (css) {
      for (const property in css) {
        if (css.hasOwnProperty(property)) {
          this.renderer.setStyle(this.nativeElement, property, css[property]);
        }
      }
    }
  }

  resizeStart(event: ResizeEvent) {}
  resizing(event: ResizeEvent) {
    if (event.rectangle.width && (event.edges.left || event.edges.right)) {
      this.layer.frame.width = event.rectangle.width;

      if (typeof event.edges.left === 'number') {
        this.layer.frame.x = event.edges.left;
      }
    }

    if (event.rectangle.height && (event.edges.top || event.edges.bottom)) {
      this.layer.frame.height = event.rectangle.height;

      if (typeof event.edges.top === 'number') {
        this.layer.frame.y = event.edges.top;
      }
    }

    this.updateLayerStyle();
  }
  resizeEnd(event: ResizeEvent) {
    this.store.dispatch(new CurrentLayer(this.layer));
  }

  selectLayer(layer: SketchMSLayer) {
    this.store.dispatch(new CurrentLayer(layer));
  }
}
