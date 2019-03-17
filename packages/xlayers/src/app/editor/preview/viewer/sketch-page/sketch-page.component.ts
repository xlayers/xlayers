import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { Store } from '@ngxs/store';
import { SketchLayerComponent } from '../sketch-layer/sketch-layer.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SketchService } from '@app/core/sketch.service';
import { UiState } from '@app/core/state';

@Component({
  selector: 'xly-page',
  template: `
    <xly-layer
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
      #xlyLayer
      (mouseleave)="restore3dRotation($event, xlyLayer)"
      (mousemove)="rotate3d($event, xlyLayer)"
    ></xly-layer>
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
export class SketchPageComponent extends SketchLayerComponent
  implements OnInit, AfterContentInit {
  @Input() page: SketchMSPage;

  XAngle = 0;
  YAngle = 0;
  Z = 50;

  isDragEnded = false;

  constructor(
    public store: Store,
    public renderer: Renderer2,
    public element: ElementRef<HTMLElement>,
    public sketchService: SketchService,
    public sanitizer: DomSanitizer
  ) {
    super(store, renderer, element, sketchService, sanitizer);
  }

  ngOnInit() {
    this.store
      .select(UiState.designDraggingEnded)
      .subscribe((dragState: boolean) => (this.isDragEnded = dragState));
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    // Do nothing if nativeElement is not defined. Fixes its test case
    if (!this.nativeElement) {
      return;
    }
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

  rotate3d(event: MouseEvent, xlyLayer: ElementRef) {
    // Do not rotate while dragging is on
    if (this.isDragEnded) {
      const element = xlyLayer.nativeElement as HTMLElement;
      const XRel = event.pageX - element.offsetLeft;
      const YRel = event.pageY - element.offsetTop;
      const width = element.offsetWidth;
      this.YAngle = -(0.5 - XRel / width) * 40;
      this.XAngle = (0.5 - YRel / width) * 40;
      this.updateView(element);
    }
  }

  restore3dRotation(event: MouseEvent, xlyLayer: ElementRef) {
    const element = xlyLayer.nativeElement as HTMLElement;
    element.style.transform = `perspective(525px) translateZ(0) rotateX(0deg) rotateY(0deg)`;
    element.style.transition = `all 150ms linear 0s`;
    element.style['-webkit-transition'] = `all 150ms linear 0s`;
  }

  updateView(oLayer: HTMLElement) {
    oLayer.style.transform =
      `perspective(525px)
      translateZ(` +
      this.Z +
      `px) rotateX(` +
      this.XAngle +
      `deg) rotateY(` +
      this.YAngle +
      `deg)`;
    oLayer.style.transition = 'none';
    oLayer.style['-webkit-transition'] = 'none';
  }
}
