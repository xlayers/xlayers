import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { Store } from '@ngxs/store';
import { CurrentLayer, UiState } from 'src/app/core/state/ui.state';

@Component({
  selector: 'sketch-layer',
  template: `
    <div
      *ngIf="!layer?.isLocked"
      [style.width.px]="layer?.frame?.width"
      [style.height.px]="layer?.frame?.height"
      [style.left.px]="layer?.frame?.x"
      [style.top.px]="layer?.frame?.y"
    >
      <span *ngIf="textContent">{{ textContent }}</span>

      <sketch-layer
        sketchSelectedLayer
        (selectedLayer)="selectLayer($event)"
        *ngFor="let layer of layer?.layers"
        class="layer"
        [layer]="layer"
        [level]="level + 1"
        [wireframe]="wireframe"
        [ngClass]="{ wireframe: wireframe }"
        [attr.data-id]="layer?.do_objectID"
        [attr.data-name]="layer?.name"
        [attr.data-class]="layer?._class"
      ></sketch-layer>
    </div>
  `,
  styles: [
    `
      :host {
        border: 1px solid transparent;
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

  borderWidth = 1;
  nativeElement: HTMLElement;

  offset3d = 20;

  textContent: string;

  constructor(
    public store: Store,
    public renderer: Renderer2,
    public element: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    this.nativeElement = this.element.nativeElement;
    this.store.select(UiState.isWireframe).subscribe(isWireframe => {
      this.wireframe = isWireframe;
    });
    this.store.select(UiState.is3dView).subscribe(is3dView => {
      if (this.nativeElement) {
        if (is3dView === true) {
          if (this.level > 0) {
            this.renderer.setStyle(
              this.nativeElement,
              'transform',
              `translateZ(${(this.level * this.offset3d).toFixed(3)}px)`
            );
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
    if ((this.layer._class as 'text') === 'text') {
      this.textContent = (this.layer as any).text;
    }
  }

  updateLayerStyle() {
    if (this.layer && this.nativeElement) {
      const elementPosition = this.nativeElement.getBoundingClientRect();
      this.renderer.setStyle(
        this.nativeElement,
        'border-width',
        `${this.borderWidth}px`
      );
      this.renderer.setStyle(
        this.nativeElement,
        'left',
        `${elementPosition.left - this.borderWidth}px`
      );
      this.renderer.setStyle(
        this.nativeElement,
        'top',
        `${elementPosition.top - this.borderWidth}px`
      );
      this.applyDefaultStyles();
    }
  }

  toggleSelected(_layer: SketchMSSymbolMaster) {}

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

  selectLayer(layer: SketchMSLayer) {
    this.store.dispatch(new CurrentLayer(layer));
  }
}
