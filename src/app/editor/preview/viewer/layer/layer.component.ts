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
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { SketchService } from '@app/core/sketch.service';
import { CssContextService } from '@xlayers/css-blocgen';
import { SvgRenderService, SvgContextService } from '@xlayers/svg-blocgen';
import { TextContextService, TextRenderService } from '@xlayers/text-blocgen';
import {
  BitmapRenderService,
  BitmapContextService
} from '@xlayers/bitmap-blocgen';

@Component({
  selector: 'xly-viewer-layer',
  template: `
    <div
      [style.width.px]="layer?.frame?.width"
      [style.height.px]="layer?.frame?.height"
    >
      <xly-viewer-layer
        xlySelectedLayer
        *ngFor="let layer of layer?.layers"
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

      <xly-viewer-layer
        xlySelectedLayer
        *ngIf="symbolMaster"
        class="layer"
        [data]="data"
        [layer]="symbolMaster"
        [level]="level + 1"
        [wireframe]="wireframe"
        [attr.data-id]="symbolMaster?.do_objectID"
        [attr.data-name]="symbolMaster?.name"
        [attr.data-class]="symbolMaster?._class"
        (selectedLayer)="selectLayer($event)"
      ></xly-viewer-layer>

      <span *ngFor="let text of texts">{{ text }}</span>

      <img
        *ngFor="let image of images"
        [src]="image"
        [style.height.%]="100"
        [style.width.%]="100"
      />

      <div *ngFor="let shape of shapes" [innerHtml]="shape"></div>
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
  @Input() data: SketchMSData;
  @Input() layer: SketchMSLayer;

  @Input() wireframe = false;
  @Input() level = 0;

  nativeElement: HTMLElement;

  borderWidth = 1;
  offset3d = 20;

  texts: string[];
  images: SafeUrl[];
  shapes: SafeHtml[];
  symbolMaster: SketchMSLayer;

  constructor(
    public store: Store,
    public renderer: Renderer2,
    public element: ElementRef<HTMLElement>,
    public sketchService: SketchService,
    public sanitizer: DomSanitizer,
    public cssContextService: CssContextService,
    public bitmapContextService: BitmapContextService,
    public bitmapRenderService: BitmapRenderService,
    public svgContextService: SvgContextService,
    public svgRenderService: SvgRenderService,
    public textContextService: TextContextService,
    public textRenderService: TextRenderService
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
    this.loadSymbolMaster();
  }

  loadText() {
    if (this.textContextService.hasContext(this.layer)) {
      this.texts = this.textRenderService
        .render(this.data, this.layer)
        .map(file => file.value);
    }
  }

  loadImage() {
    if (this.bitmapContextService.identify(this.layer)) {
    this.images =  this.bitmapRenderService
        .render(this.data, this.layer)
        .map(file =>
          this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:image/jpg;base64,${file.value}`
          )
        );
    }
  }

  loadShapes() {
    if (this.svgContextService.identify(this.layer)) {
    this.shapes = this.svgRenderService
        .render({} as SketchMSData, this.layer)
        .map(file =>
          this.sanitizer.bypassSecurityTrustHtml(file.value)
        );
    }
  }

  loadSymbolMaster() {
    if (this.layer._class as string === 'symbolInstance') {
      const foreignSymbol = this.data.document.foreignSymbols.find(
        x => x.symbolMaster.symbolID === (this.layer as any).symbolID
      );
      this.symbolMaster = foreignSymbol.symbolMaster;
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
