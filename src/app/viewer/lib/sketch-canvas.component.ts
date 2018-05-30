import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from '../../state/ui.state';
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
  }
  img {
    left: 2px;
    top: 2px;
  }
  .canvas {
    user-select: none;
    transform: translate3d(-50%, 50%, 0px) scale(1);
    transform-origin: center;
    left: 50%;
    position: absolute;
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

  @ViewChild('canvasRef') canvasRef: ElementRef<HTMLElement>;

  isPreview: boolean;
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.isPreview).subscribe(isPreview => {
      this.isPreview = isPreview;
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
