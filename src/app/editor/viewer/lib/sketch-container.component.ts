import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { CurrentFile, UiState, CurrentLayer } from 'src/app/core/state';
import { SketchSelectedLayerDirective } from './selected-layer.directive';
import { SketchData, SketchService } from './sketch.service';

@Component({
  selector: 'sketch-container',
  template: `
    <ng-template #noDataRef>
      <sketch-dropzone (changed)="onFileSelected($event)"></sketch-dropzone>
    </ng-template>

    <div class="layers-container" *ngIf="data else noDataRef" >
      <sketch-canvas #ref sketchSelectedLayer (click)="clearSelection()" [currentPage]="currentPage" [data]="data"></sketch-canvas>
    </div>
  `,
  styles: [
    `
  :host {
    width: 100%;
    height: 100%;
    justify-content: center;
    top: 64px;
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
    overflow: scroll;
  }

  sketch-layer {
    top: 0;
    left: 0;
    position: absolute;
  }
  `
  ]
})
export class SketchContainerComponent implements OnInit {
  constructor(private service: SketchService, private store: Store) {}

  public data: SketchData;
  public currentPage: SketchMSLayer;

  @ViewChild(SketchSelectedLayerDirective) ref: SketchSelectedLayerDirective;

  ngOnInit() {
    this.store.select(UiState.currentPage).subscribe(currentPage => {
      this.currentPage = currentPage;
    });

    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      if (this.ref) {
        this.ref.selectDomNode(currentLayer);
      }
    });
  }

  async onFileSelected(file: File) {
    try {
      this.data = await this.service.process(file);
      this.store.dispatch(new CurrentFile(this.data));
    } catch (e) {
      console.error(e);
      // alert('Only .sketch files that were saved using Sketch v43 and above are supported.');
    }
  }

  clearSelection() {
    if (this.currentPage) {
      this.store.dispatch(new CurrentLayer(null));
    }
  }
}
