import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from 'src/app/core/state';
import { SketchData } from './sketch.service';

@Component({
  selector: 'sketch-canvas',
  template: `
    <div class="canvas" #canvas>
      <div [ngClass]="{ 'hidden': !isPreview }">
        <img *ngFor="let image of data.previews" [src]="image.source" [width]="image.width" [height]="image.height"/>
      </div>
      <div>
        <sketch-page *ngIf="currentPage"
          [attr.data-id]="currentPage?.do_objectID"
          [attr.data-name]="currentPage?.name"
          [attr.data-class]="currentPage?._class"
          [page]="currentPage"></sketch-page>
      </div>
    </div>
  `,
  styles: [
    `
  :host {
    width: 100%;
    height: 100%;
    transform: none;
    overflow: visible;
    transform-style: preserve-3d;
    transition: transform 1s;
  }
  :host(.is-3d-view) {
    perspective: 9000px;
    transform: rotateY(22deg) rotateX(30deg);
  }
  img {
    left: 2px;
    top: 2px;
  }
  .canvas {
    user-select: none;
    left: 50%;
    position: absolute;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    transform: translate3d(-50%, 50%, 0px) scale(1);
  }
  .canvas img {
    opacity: 1;
    transition: opacity 0.1s linear;
  }
  .canvas .hidden img {
    opacity: 0;
  }
  `
  ]
})
export class SketchCanvasComponent implements OnInit, AfterViewInit {
  @Input() data: SketchData;
  @Input() currentPage: SketchMSPage = null;

  @ViewChild('canvas') canvasRef: ElementRef<HTMLElement>;

  isPreview: boolean;
  constructor(private store: Store, private renderer: Renderer2, private element: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.store.select(UiState.isPreview).subscribe(isPreview => {
      this.isPreview = isPreview;
    });
    this.store.select(UiState.is3dView).subscribe(is3dView => {
      const ne = this.element.nativeElement;
      if (ne) {
        if (is3dView === true) {
          this.renderer.addClass(ne, 'is-3d-view');
        } else {
          this.renderer.removeClass(ne, 'is-3d-view');
        }
      }
    });
    this.store.select(UiState.zoomLevel).subscribe(zoomLevel => {
      if (this.canvasRef && this.canvasRef.nativeElement) {
        this.canvasRef.nativeElement.style.transform = `translate3d(-50%, 50%, 0px) scale(${zoomLevel})`;
      }
    });
  }

  ngAfterViewInit() {
    if (!this.currentPage) {
      this.currentPage = this.data.pages[0];
    }
    // this.store.select(UiState.zoomLevel).subscribe(zoomLevel => {
    //   if (this.canvasRef && this.canvasRef.nativeElement) {
    //     this.canvasRef.nativeElement.style.transform = `translate3d(-50%, 50%, 0px) scale(${zoomLevel})`;
    //   }
    // });
  }
}
