import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from 'src/app/core/state';
import { SketchData } from '../../viewer/lib/sketch.service';

@Component({
  selector: 'sketch-settings-preview',
  template: `
    <mat-expansion-panel expanded="true">
      <mat-expansion-panel-header>
        <mat-panel-title> Preview </mat-panel-title>
      </mat-expansion-panel-header>

      <ng-container *ngFor="let image of data?.previews">
        <div class="preview-image">
          <img [src]="image.source"/>
          <div class="overlay">
            <a [href]="image.source" download="preview">
              <mat-icon>cloud_download</mat-icon>
            </a>
          </div>
        </div>
      </ng-container>
    </mat-expansion-panel>
  `,
  styles: [
    `
      .preview-image {
        position: relative;
        padding: 10px;
      }
      .preview-image img {
        width: 100%;
        height: auto;
      }

      .preview-image .overlay {
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #1e1e1e;
        opacity: 0;
      }
      .preview-image:hover .overlay {
        opacity: 0.6;
      }
      .overlay mat-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
        color: #fff;
      }

      .mat-expansion-panel-body {
        text-align: center;
      }
    `
  ]
})
export class SettingsPreviewComponent implements OnInit {
  currentLayer: SketchMSLayer;
  data: SketchData;
  isMouseOver: boolean;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.currentFile).subscribe(currentFile => {
      this.data = currentFile;
    });
  }
}
