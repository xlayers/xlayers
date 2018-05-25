import { UiState } from './../../../../../src/app/state/ui.state';
import { Component, OnInit, Input, ElementRef, Renderer2, ViewChildren, AfterViewInit } from '@angular/core';
import { SketchData } from '../public_api';
import { Store } from '@ngxs/store';

@Component({
  selector: 'sketch-canvas',
  template: `
    <div class="canvas">
      <div [ngClass]="{ 'hidden': !isPreview }">
        <img #previewRefs *ngFor="let image of data.previews" [src]="image.source" [width]="image.width" [height]="image.height"/>
      </div>
      <sketch-page *ngIf="currentPage"
        [attr.data-id]="currentPage?.id"
        [attr.data-name]="currentPage?.name"
        [attr.data-class]="currentPage?._class"
        [page]="currentPage"></sketch-page>
    </div>
  `,
  styles: [
    `
  :host {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    left: 2px;
    top: 2px;
  }
  .canvas {
    user-select: none;
    position: relative;
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

  @ViewChildren('previewRef') previewRefs: Array<ElementRef<HTMLImageElement>>;
  isPreview: boolean;
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.isPreview).subscribe(isPreview => {
      this.isPreview = isPreview;
    });
    this.store.select(UiState.currentPage).subscribe(currentPage => {
      this.currentPage = currentPage;
    });
  }

  ngAfterViewInit() {
    if (!this.currentPage) {
      this.currentPage = this.data.pages[0];
    }
  }
}
