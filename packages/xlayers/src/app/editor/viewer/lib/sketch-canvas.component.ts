import {
  CdkDragEnd,
  CdkDragMove,
  CdkDragStart,
  CdkDrag
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { UiState } from '@app/core/state';
import { Store } from '@ngxs/store';
import { SketchData } from './sketch.service';
import { fromEvent, merge } from 'rxjs';
@Component({
  selector: 'sketch-canvas',
  template: `
    <div
      class="canvas"
      cdkDrag
      [cdkDragDisabled]="is3dView"
      (cdkDragMoved)="OnCdkDragMoved($event)"
      (cdkDragStarted)="OnCdkDragStarted($event)"
      (cdkDragEnded)="OnCdkDragEnded($event)"
      (started)="dragStart($event)"
      (ended)="dragEnd($event)"
      (moved)="dragging($event)"
      [style.left.px]="positionX"
      [style.top.px]="positionY"
      #canvas
    >
      <div>
        <sketch-page
          *ngIf="currentPage"
          [attr.data-id]="currentPage?.do_objectID"
          [attr.data-name]="currentPage?.name"
          [attr.data-class]="currentPage?._class"
          [page]="currentPage"
        ></sketch-page>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
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
    `
  ]
})
export class SketchCanvasComponent implements OnInit, AfterViewInit {
  @Input() currentPage: SketchMSPage = null;

  @ViewChild('canvas') canvasRef: ElementRef<HTMLElement>;

  positionX = 0;
  positionY = 0;
  originPositionX = 0;
  originPositionY = 0;
  currentZoomLevel = 1;
  data: SketchData;

  is3dView = false;
  startAngle = 0;
  angle = 0;
  rotation = 0;
  R2D = 180 / Math.PI;
  center = { x: 0, y: 0 };
  isDragging = false;
  currentRotationState = 0;

  constructor(
    private store: Store,
    private renderer: Renderer2,
    private element: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    const rotate$ = merge(
      fromEvent(this.canvasRef.nativeElement, 'mousemove'),
      fromEvent(this.canvasRef.nativeElement, 'mousedown'),
      fromEvent(this.canvasRef.nativeElement, 'mouseup')
    );

    rotate$.subscribe(this.rotate);

    this.store.select(UiState.currentFile).subscribe(currentFile => {
      this.data = currentFile;
    });
    this.store.select(UiState.is3dView).subscribe(is3dView => {
      const ne = this.element.nativeElement;
      if (ne) {
        this.is3dView = is3dView;
        if (is3dView === true) {
          this.renderer.addClass(ne, 'is-3d-view');
        } else {
          this.isDragging = false;
          this.renderer.removeClass(ne, 'is-3d-view');
        }
      }
    });
    this.store.select(UiState.zoomLevel).subscribe(zoomLevel => {
      if (this.canvasRef && this.canvasRef.nativeElement) {
        this.canvasRef.nativeElement.style.transform = this.formatTransformStyle(
          this.canvasRef.nativeElement.style.transform,
          zoomLevel
        );
        this.currentZoomLevel = zoomLevel;
      }
    });
    const current = this.canvasRef.nativeElement.getBoundingClientRect();
    this.positionX = current.left - 100;
    this.positionY = current.top;
  }

  formatTransformStyle(
    existingTransformStyle: string,
    zoomLevel,
    rotateValue = null
  ) {
    existingTransformStyle = rotateValue
      ? this.setRotation(rotateValue, existingTransformStyle)
      : existingTransformStyle;

    existingTransformStyle = this.setScale(zoomLevel, existingTransformStyle);
    return existingTransformStyle;
  }

  /**
   * set scale
   * @param zoomLevel number
   * @param existingTransformStyle string
   */
  setScale(zoomLevel, existingTransformStyle) {
    const scaleStyleRegex = /(\([ ]?[\d]+(\.[\d]+)?[ ]?(,[ ]?[\d]+(\.[\d]+)?[ ]?)?\))/gim;
    return scaleStyleRegex.test(existingTransformStyle)
      ? existingTransformStyle.replace(
          scaleStyleRegex,
          `(${zoomLevel},${zoomLevel})`
        )
      : existingTransformStyle + ` scale(${zoomLevel},${zoomLevel})`;
  }

  /**
   * Set rotation transform style
   * @param rotateValue number
   * @param existingTransformStyle string
   */
  setRotation(rotateValue, existingTransformStyle): string {
    const scaleStyleRegex = /rotate\([\d\.\-]+deg\)/g;
    return scaleStyleRegex.test(existingTransformStyle)
      ? existingTransformStyle.replace(
          scaleStyleRegex,
          `rotate(${rotateValue}deg)`
        )
      : existingTransformStyle + ` rotate(${rotateValue}deg)`;
  }

  ngAfterViewInit() {
    if (!this.currentPage) {
      this.currentPage = this.data.pages[0];
    }
  }

  dragStart(_event: DragEvent) {
    this.originPositionX = this.positionX;
    this.originPositionY = this.positionY;
  }

  dragging(event: DragEvent) {
    this.positionX = this.originPositionX + event.x;
    this.positionY = this.originPositionY + event.y;
  }

  dragEnd(event: DragEvent) {
    this.originPositionX += event.x;
    this.originPositionY += event.y;
  }

  /**
   * cdk overrides existing transform style and replace it by its own. We detect
   * if there is any existing scale propery in transform, then replace its value by current zoom level in both
   * drag started & ended event
   */
  OnCdkDragStarted(event: CdkDragStart) {
    event.source.element.nativeElement.style.transform = this.formatTransformStyle(
      event.source.element.nativeElement.style.transform,
      this.currentZoomLevel
    );
  }

  OnCdkDragEnded(event: CdkDragEnd) {
    event.source.element.nativeElement.style.transform = this.formatTransformStyle(
      event.source.element.nativeElement.style.transform,
      this.currentZoomLevel
    );
  }

  /**
   * Keep dragging element's transform style updated with currentZoomLeve, while it is moved.
   * @param event Observable<CdkDragMove<CdkDrag>>
   */
  OnCdkDragMoved(event: CdkDragMove<any>) {
    const sourceElement: CdkDrag<any> = event.source;
    sourceElement.element.nativeElement.style.transform = this.formatTransformStyle(
      sourceElement.element.nativeElement.style.transform,
      this.currentZoomLevel
    );

    // preserve rotation position if there is any
    if (this.currentRotationState !== 0) {
      sourceElement.element.nativeElement.style.transform += ` rotate(${
        this.currentRotationState
      }deg)`;
    }
  }

  /**
   * Enable rotation
   */
  enableRotation = (event: MouseEvent) => {
    const _ref = this.canvasRef.nativeElement.getBoundingClientRect();
    this.center = {
      x: _ref.left + _ref.width / 2,
      y: _ref.top + _ref.height / 2
    };
    this.startAngle =
      this.R2D *
      Math.atan2(event.clientY - this.center.y, event.clientX - this.center.x);
    this.isDragging = true;
  };

  /**
   * Rotation mouse event handler
   */
  rotate = (event: MouseEvent) => {
    if (event.type === 'mousedown' && this.is3dView) {
      return this.enableRotation(event);
    }

    if (event.type === 'mouseup' && this.isDragging) {
      return this.disableRotation(event);
    }

    if (event.type === 'mousemove' && this.is3dView && this.isDragging) {
      return this.initRotation(event);
    }
  };

  /**
   * Save final angle of rotation & disable rotation
   */
  disableRotation = (event: MouseEvent) => {
    this.angle += this.rotation;
    this.isDragging = false;
  };

  /**
   * Start rotation
   */
  initRotation = (event: MouseEvent) => {
    event.preventDefault();
    const x = event.clientX - this.center.x;
    const y = event.clientY - this.center.y;
    this.rotation = this.R2D * Math.atan2(y, x) - this.startAngle;
    this.canvasRef.nativeElement.style.transform = this.formatTransformStyle(
      this.canvasRef.nativeElement.style.transform,
      this.currentZoomLevel,
      this.angle + this.rotation
    );
    this.currentRotationState = this.angle + this.rotation;
  };
}
