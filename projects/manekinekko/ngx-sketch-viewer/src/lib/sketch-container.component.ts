import { SketchService, SketchData } from './sketch.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sketch-container',
  template: `
    <ng-template #noDataRef>
      <sketch-dropzone (changed)="onFileSelected($event)"></sketch-dropzone>
    </ng-template>

    <div class="layers-container" *ngIf="data else noDataRef" >
      <sketch-canvas [data]="data" [currentPage]="page"></sketch-canvas>
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
  @Input() page: SketchMSPage;

  constructor(private service: SketchService) {}

  public data: SketchData;

  wireframe = true;

  ngOnInit() {}

  async onFileSelected(file: File) {
    try {
      this.data = await this.service.process(file);
    } catch {
      alert('Only .sketch files that were saved using Sketch v43 and above are supported.');
    }
  }

  toggleWireframe() {
    this.wireframe = !this.wireframe;
  }

  getPages() {
    return this.service.getPages();
  }
}
