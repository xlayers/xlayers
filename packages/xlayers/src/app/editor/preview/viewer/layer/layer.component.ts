import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { CurrentLayer, UiState } from '@app/core/state/ui.state';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResourceImageData, SketchService } from '@app/core/sketch.service';

@Component({
  selector: 'xly-viewer-layer',
  template: `
    <div
      [style.width.px]="layer?.frame?.width"
      [style.height.px]="layer?.frame?.height"
    >
      <xly-viewer-layer
        xlySelectedLayer
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
      ></xly-viewer-layer>

      <span *ngIf="textContent">{{ textContent }}</span>

      <img *ngIf="imageContent" [src]="imageContent.source" [style.height.%]="100" [style.width.%]="100"/>

      <div *ngIf="shapeContent" [innerHtml]="shapeContent"></div>

    </div>
  `,
  styles: [
    `
      :host {
        box-sizing: border-box;
        box-shadow: 0 0 0 1px transparent;
        transition: box-shadow 0.1s linear, transform 1s;
        transform-origin: 0 0;
        transform-style: preserve-3d;
        will-change: transform, transition;
        display: block;
      }

      :host(:hover) {
        box-shadow: 0 0 0 1px #51c1f8 !important;
        background-color: rgba(81, 193, 248, 0.2);
      }
      :host(.isCurrentLayer) {
        box-shadow: 0 0 0 1px #ee4743 !important;
        background-color: rgba(238, 71, 67, 0.2);
      }
      :host(.wireframe) {
        box-shadow: 0 0 0 1px black;
      }
    `
  ]
})
export class ViewerLayerComponent implements OnInit, AfterContentInit {
  @Input() layer: SketchMSLayer;
  @Input() wireframe = false;

  @Input() level = 0;

  borderWidth = 1;
  nativeElement: HTMLElement;

  offset3d = 20;

  textContent: string;
  imageContent: ResourceImageData;
  shapeContent: SafeHtml;

  constructor(
    public store: Store,
    public renderer: Renderer2,
    public element: ElementRef<HTMLElement>,
    public sketchService: SketchService,
    public sanitizer: DomSanitizer
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
      this.isSolidContent();
      this.isImageContent();
    }
  }

  isTextContent() {
    if ((this.layer._class as 'text') === 'text') {
      this.textContent = (this.layer as any).text;
    }
  }

  isImageContent() {
    if ((this.layer._class as 'bitmap') === 'bitmap') {
      this.imageContent = this.sketchService.getImageDataFromRef((this.layer as any).image._ref);
    }
  }

  isSolidContent() {
    if ((this.layer as any).shape) {
      this.shapeContent = this.sanitizer.bypassSecurityTrustHtml((this.layer as any).shape);
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
