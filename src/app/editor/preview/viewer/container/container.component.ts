import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { CurrentLayer, UiState, ZoomIn, ZoomOut } from "@app/core/state";
import { Store } from "@ngxs/store";
import { ViewerSelectedLayerDirective } from "../layer/selected-layer.directive";

@Component({
  selector: "xly-viewer-container",
  template: `
    <div
      *ngIf="data"
      class="layers-container"
      xly3dRotation
      [enabled]="is3dView"
    >
      <xly-viewer-canvas
        #ref
        xlySelectedLayer
        [data]="data"
        (click)="clearSelection()"
      ></xly-viewer-canvas>
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        justify-content: center;
        position: absolute;
        transform: scale(1);
        transform-origin: center;
      }

      .layers-container {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 100%;
        position: absolute;
      }

      xly-viewer-layer {
        top: 0;
        left: 0;
        position: absolute;
        will-change: transform;
      }
    `
  ]
})
export class ViewerContainerComponent implements OnInit {
  @ViewChild(ViewerSelectedLayerDirective) ref: ViewerSelectedLayerDirective;

  data: SketchMSData;
  currentPage: SketchMSPage;

  is3dView: boolean;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.currentPage).subscribe(currentPage => {
      this.currentPage = currentPage;
    });

    this.store.select(UiState.currentData).subscribe(currentData => {
      this.data = currentData;
    });

    this.store.select(UiState.is3dView).subscribe(is3dView => {
      this.is3dView = is3dView;
    });

    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      if (this.ref) {
        this.ref.selectDomNode(currentLayer);
      }
    });
  }

  clearSelection() {
    this.store.dispatch(new CurrentLayer(null));
  }

  @HostListener("mousewheel", ["$event"])
  onMouseWheel(event: MouseEvent) {
    /**
     * Emit Zoom events only when any sketch file is selected
     * deltaY < 0 means wheel/scroll up, otherwise wheel down
     */
    if ((event as any).deltaY < 0) {
      this.store.dispatch(new ZoomIn());
    } else {
      this.store.dispatch(new ZoomOut());
    }
  }
}
