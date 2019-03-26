import { Component, OnInit } from '@angular/core';
import { UiState } from '@app/core/state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'xly-settings-preview',
  template: `
    <mat-expansion-panel expanded="true">
      <mat-expansion-panel-header>
        <mat-panel-title> Preview </mat-panel-title>
      </mat-expansion-panel-header>

      <ng-container *ngFor="let image of data?.previews">
        <div class="preview-image">
          <img [src]="image.source"/>
          <a [href]="image.source" [download]="image.source">
            <div class="overlay">
                <mat-icon>cloud_download</mat-icon>
              </div>
            </a>
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
  data: SketchMSData;
  isMouseOver: boolean;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(UiState.currentFile).subscribe(currentFile => {
      this.data = currentFile;
    });
  }
}
