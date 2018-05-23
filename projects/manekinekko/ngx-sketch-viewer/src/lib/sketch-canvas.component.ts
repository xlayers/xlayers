import { Component, OnInit, Input, ElementRef, Renderer2, ViewChildren, AfterViewInit } from '@angular/core';
import { SketchData } from '../public_api';

@Component({
  selector: 'sketch-canvas',
  template: `
    <div class="canvas">
      <img #previewRefs *ngFor="let image of data.previews" [src]="image.source" [width]="image.width" [height]="image.height"/>
      <sketch-page *ngIf="currentPage"
        [attr.data-id]="currentPage.do_objectID"
        [attr.data-name]="currentPage.name"
        [attr.data-class]="currentPage._class"
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
  `
  ]
})
export class SketchCanvasComponent implements OnInit, AfterViewInit {
  @Input() data: SketchData;
  @Input() currentPage: SketchMSPage = null;

  @ViewChildren('previewRef') previewRefs: Array<ElementRef<HTMLImageElement>>;
  constructor(private render: Renderer2) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.currentPage) {
      this.currentPage = this.data.pages[0];
    }
  }
}
