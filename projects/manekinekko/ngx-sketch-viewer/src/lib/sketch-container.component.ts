import { CurrentPage, AvailablePages, SettingsEnabled, ShowPreview, ShowWireframe } from './../../../../../src/app/state/ui.state';
import { SketchService, SketchData } from './sketch.service';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'sketch-container',
  template: `
    <ng-template #noDataRef>
      <sketch-dropzone (changed)="onFileSelected($event)"></sketch-dropzone>
    </ng-template>

    <div class="layers-container" *ngIf="data else noDataRef" >
      <sketch-canvas [data]="data"></sketch-canvas>
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

  ngOnInit() {}

  async onFileSelected(file: File) {
    try {

      this.data = await this.service.process(file);
      this.store.dispatch(new AvailablePages(this.data.pages));
      this.store.dispatch(new CurrentPage(this.data.pages[0]));
      this.store.dispatch(new SettingsEnabled());
      this.store.dispatch(new ShowPreview());
      this.store.dispatch(new ShowWireframe());

    } catch {
      alert('Only .sketch files that were saved using Sketch v43 and above are supported.');
    }
  }
}
