import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { Store } from '@ngxs/store';
import { CurrentLayer, UiState } from '@app/core/state/ui.state';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CssContextService } from '@xlayers/css-blocgen';
import { SvgBlocGenService } from '@xlayers/svg-blocgen';
import { TextBlocGenService } from '@xlayers/text-blocgen';
import { BitmapBlocGenService } from '@xlayers/bitmap-blocgen';
import { AstService } from '@xlayers/std-library';

@Component({
  selector: 'xly-viewer-layer',
  template: `
    <div
      [style.width.px]="layer?.frame?.width"
      [style.height.px]="layer?.frame?.height"
    >
      <xly-viewer-layer
        xlySelectedLayer
        *ngFor="let layer of layers"
        class="layer"
        [ngClass]="{ wireframe: wireframe }"
        [data]="data"
        [layer]="layer"
        [level]="level + 1"
        [wireframe]="wireframe"
        [attr.data-id]="layer?.do_objectID"
        [attr.data-name]="layer?.name"
        [attr.data-class]="layer?._class"
        (selectedLayer)="selectLayer($event)"
      ></xly-viewer-layer>

      <span *ngFor="let text of texts">{{ text }}</span>

      <img
        *ngFor="let image of images"
        [src]="image"
        [style.height.%]="100"
        [style.width.%]="100"
      />
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

      :host * {
        position: absolute;
      }
    `
  ]
})
export class ViewerLayerComponent implements OnInit, AfterContentInit {
  @Input() data: SketchMSData;
  @Input() layer: SketchMSLayer;

  @Input() wireframe = false;
  @Input() level = 0;

  nativeElement: HTMLElement;

  borderWidth = 1;
  offset3d = 20;

  texts: string[] = [];
  images: SafeUrl[] = [];
  layers: SketchMSLayer[] = [];

  constructor(
    private store: Store,
    private renderer: Renderer2,
    private element: ElementRef<HTMLElement>,
    private sanitizer: DomSanitizer,
    private astService: AstService,
    private cssContextService: CssContextService,
    private bitmapBlocGenService: BitmapBlocGenService,
    private svgBlocGenService: SvgBlocGenService,
    private textBlocGenService: TextBlocGenService
  ) {}

  ngOnInit() {
    this.store.select(UiState.isWireframe).subscribe(isWireframe => {
      this.wireframe = isWireframe;
    });

    this.store.select(UiState.is3dView).subscribe(is3dView => {
      if (is3dView) {
        this.enable3dStyle();
      } else {
        this.disable3dStyle();
      }
    });
  }

  ngAfterContentInit() {
    this.applyHighlightStyles();
    this.applyLayerStyles();
    this.loadText();
    this.loadImage();
    this.loadShapes();
    this.loadLayers();
  }

  loadText() {
    if (this.textBlocGenService.hasContext(this.layer)) {
      this.textBlocGenService
        .transform(this.layer, this.data)
        .forEach(file => this.texts.push(file.value));
    }
  }

  loadImage() {
    if (this.bitmapBlocGenService.identify(this.layer)) {
      this.bitmapBlocGenService
        .transform(this.layer, this.data)
        .forEach(file =>
          this.images.push(
            this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:image/jpg;base64,${file.value}`
            )
          )
        );
    }
  }

  loadShapes() {
    if (this.svgBlocGenService.identify(this.layer)) {
      this.svgBlocGenService
        .transform(this.layer, this.data)
        .forEach(file =>
          this.images.push(
            this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:image/svg+xml;base64,${btoa(file.value)}`
            )
          )
        );
    }
  }

  loadLayers() {
    if (this.layer.layers) {
      this.layers = this.layer.layers;
    } else {
      this.loadSymbolMaster();
    }
  }

  loadSymbolMaster() {
    if ((this.layer._class as string) === 'symbolInstance') {
      const symbolMaster = this.astService.maybeFindSymbolMaster(
        this.layer,
        this.data
      );

      if (symbolMaster) {
        this.layers = [symbolMaster];
      }
    }
  }

  applyLayerStyles() {
    if (this.cssContextService.hasContext(this.layer)) {
      const context = this.cssContextService.contextOf(this.layer);
      Object.entries(context.rules).forEach(([property, value]) => {
        this.renderer.setStyle(this.element.nativeElement, property, value);
      });
    }
  }

  applyHighlightStyles() {
    const elementPosition = this.element.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(
      this.element.nativeElement,
      'border-width',
      `${this.borderWidth}px`
    );
    this.renderer.setStyle(
      this.element.nativeElement,
      'left',
      `${elementPosition.left - this.borderWidth}px`
    );
    this.renderer.setStyle(
      this.element.nativeElement,
      'top',
      `${elementPosition.top - this.borderWidth}px`
    );
  }

  enable3dStyle() {
    this.renderer.setStyle(
      this.element.nativeElement,
      'transform',
      `translateZ(${(this.level * this.offset3d).toFixed(3)}px)`
    );
  }

  disable3dStyle() {
    this.renderer.setStyle(this.element.nativeElement, 'transform', `none`);
  }

  selectLayer(layer: SketchMSLayer) {
    this.store.dispatch(new CurrentLayer(layer));
  }
}
