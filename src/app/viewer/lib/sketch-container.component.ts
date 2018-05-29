import { CurrentLayer, HidePreview, HideWireframe } from './../../state/ui.state';
import { CurrentPage, AvailablePages, SettingsEnabled, ShowPreview, ShowWireframe, UiState, SketchMSLayer } from '../../state/ui.state';
import { SketchService, SketchData } from './sketch.service';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'sketch-container',
  template: `
    <ng-template #noDataRef>
      <sketch-dropzone (changed)="onFileSelected($event)"></sketch-dropzone>
    </ng-template>

    <div class="layers-container" *ngIf="data else noDataRef" >
      <sketch-canvas (click)="clearSelection()" [currentPage]="currentPage" [data]="data"></sketch-canvas>
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

  ngOnInit() {
    this.store.select(UiState.currentPage).subscribe(currentPage => {
      this.currentPage = currentPage;
    });
  }

  async onFileSelected(file: File) {
    try {
      this.data = await this.service.process(file);
      this.currentPage = this.data.pages[0];

      this.store.dispatch([
        new AvailablePages(this.data.pages),
        new CurrentPage(this.currentPage),
        new SettingsEnabled(),
        new ShowPreview(),
        new HideWireframe()
      ]);
    } catch {
      alert('Only .sketch files that were saved using Sketch v43 and above are supported.');
    }
  }

  clearSelection() {
    if (this.currentPage) {
      this.store.dispatch(new CurrentLayer(null));
    }
  }
}
