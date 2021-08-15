import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from '../../../../core/state';
import { SketchMSPageLayer, SketchMSData } from '@xlayers/sketchtypes';

@Component({
  selector: 'xly-viewer-canvas',
  template: `
    <div
      cdkDrag
      *ngFor="let page of data.pages"
      class="canvas"
      [class.selected]="page.do_objectID === currentPage.do_objectID"
      (cdkDragMoved)="onDragStarted($event)"
      (cdkDragStarted)="onDragStarted($event)"
      (cdkDragEnded)="onDragEnded($event)"
      #canvas
    >
      <xly-viewer-page
        [data]="data"
        [page]="page"
        [attr.data-id]="page?.do_objectID"
        [attr.data-name]="page?.name"
        [attr.data-class]="page?._class"
      ></xly-viewer-page>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: calc(100% - 64px);
        transform: none;
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
        display: none;
        cursor: move;
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
      .selected {
        display: block;
      }
    `,
  ],
})
export class ViewerCanvasComponent implements OnInit {
  @Input() data: SketchMSData;

  @ViewChildren('canvas') canvasRef: QueryList<ElementRef<HTMLElement>>;

  currentPage: SketchMSPageLayer;

  currentZoomLevel = 1;

  constructor(
    private readonly store: Store,
    private renderer: Renderer2,
    private element: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    this.store.select(UiState.currentPage).subscribe((currentPage) => {
      this.currentPage = currentPage as SketchMSPageLayer;
    });

    this.store.select(UiState.is3dView).subscribe((is3dView) => {
      if (is3dView === true) {
        this.renderer.addClass(this.element.nativeElement, 'is-3d-view');
      } else {
        this.renderer.removeClass(this.element.nativeElement, 'is-3d-view');
      }
    });

    this.store.select(UiState.zoomLevel).subscribe((zoomLevel) => {
      if (this.canvasRef) {
        this.canvasRef.map((element) => {
          element.nativeElement.style.transform = this.formatTransformStyle(
            element.nativeElement.style.transform,
            zoomLevel
          );
        });
        this.currentZoomLevel = zoomLevel;
      }
    });
  }

  formatTransformStyle(existingTransformStyle: string, zoomLevel) {
    const scaleStyleRegex =
      /(\([ ]?[\d]+(\.[\d]+)?[ ]?(,[ ]?[\d]+(\.[\d]+)?[ ]?)?\))/gim;
    return scaleStyleRegex.test(existingTransformStyle)
      ? existingTransformStyle.replace(
          scaleStyleRegex,
          `(${zoomLevel},${zoomLevel})`
        )
      : existingTransformStyle + ` scale(${zoomLevel},${zoomLevel})`;
  }

  /**
   * cdk overrides existing transform style and replace it by its own. We detect
   * if there is any existing scale propery in transform, then replace its value by current zoom level in both
   * drag started & ended event
   */
  onDragStarted(event: CdkDragStart) {
    event.source.element.nativeElement.style.transform =
      this.formatTransformStyle(
        event.source.element.nativeElement.style.transform,
        this.currentZoomLevel
      );
  }

  onDragEnded(event: CdkDragEnd) {
    event.source.element.nativeElement.style.transform =
      this.formatTransformStyle(
        event.source.element.nativeElement.style.transform,
        this.currentZoomLevel
      );
  }

  /**
   * Keep dragging element's transform style updated with currentZoomLeve, while it is moved.
   * @param event Observable<CdkDragMove<CdkDrag>>
   */
  onDragMoved(event: CdkDragMove<any>) {
    const sourceElement: any = event.source;
    sourceElement.element.nativeElement.style.transform =
      this.formatTransformStyle(
        sourceElement.element.nativeElement.style.transform,
        this.currentZoomLevel
      );
  }
}
