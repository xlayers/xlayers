import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from 'src/app/core/state';
import { SketchData } from '../../viewer/lib/sketch.service';

@Component({
  selector: 'sketch-settings-preview',
  template: `
  <div class="preview-image">
    <img *ngFor="let image of data?.previews" [src]="image.source" [width]="image.width" [height]="image.height"/>
  </div>
  `,
  styles: [`
    .preview-image {
      padding: 10px;
    }
    .preview-image img {
      width: 100%;
      height: auto;
    }
  `]
})
export class SettingsPreviewComponent implements OnInit {
  currentLayer: SketchMSLayer;
  data: SketchData;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.currentFile).subscribe(currentFile => {
      this.data = currentFile;
    });
  }
}
