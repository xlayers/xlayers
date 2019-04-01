import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { Store } from '@ngxs/store';
import { ViewerLayerComponent } from '../layer/layer.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SketchService } from '@app/core/sketch.service';

@Component({
  selector: 'xly-viewer-page',
  template: `
    <xly-viewer-layer
      xlySelectedLayer
      (selectedLayer)="selectLayer($event)"
      *ngFor="let layer of page?.layers"
      class="layer"
      [layer]="layer"
      [level]="1"
      [wireframe]="wireframe"
      [ngClass]="{ wireframe: wireframe }"
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
export class ViewerPageComponent extends ViewerLayerComponent
  implements OnInit, AfterContentInit {
  @Input() page: SketchMSPage;

  constructor(
    public store: Store,
    public renderer: Renderer2,
    public element: ElementRef<HTMLElement>,
    public sketchService: SketchService,
    public sanitizer: DomSanitizer
  ) {
    super(store, renderer, element, sketchService, sanitizer);
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    const elementPosition = this.nativeElement.getBoundingClientRect();
    const ne = this.element.nativeElement;
    this.renderer.setStyle(ne, 'border-width', `${this.borderWidth}px`);
    this.renderer.setStyle(
      ne,
      'left',
      `${elementPosition.left - this.borderWidth}px`
    );
    this.renderer.setStyle(
      ne,
      'top',
      `${elementPosition.top - this.borderWidth}px`
    );
  }
}
