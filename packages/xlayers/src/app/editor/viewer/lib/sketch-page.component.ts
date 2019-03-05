import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { Store } from '@ngxs/store';
import { SketchLayerComponent } from './sketch-layer.component';
import { SketchService } from './sketch.service';

@Component({
  selector: 'sketch-page',
  template: `
    <sketch-layer
      sketchSelectedLayer
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
    ></sketch-layer>
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

  constructor(
    public store: Store,
    public renderer: Renderer2,
    public element: ElementRef<HTMLElement>,
    public sketchService: SketchService
  ) {
    super(store, renderer, element, sketchService);
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
