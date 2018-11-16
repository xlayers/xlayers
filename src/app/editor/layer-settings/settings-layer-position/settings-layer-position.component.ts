import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from 'src/app/core/state';

@Component({
  selector: 'sketch-settings-layer-position',
  template: `
  <mat-expansion-panel expanded="true">
    <mat-expansion-panel-header>
      <mat-panel-title>
        Size
      </mat-panel-title>
    </mat-expansion-panel-header>

    <mat-form-field>
      <input matInput
        disabled
        type="number"
        placeholder="Height"
        [ngModel]="currentLayer?.frame.height.toFixed(0)">
    </mat-form-field>
    <mat-form-field>
      <input matInput
        disabled
        type="number"
        placeholder="Width"
        [ngModel]="currentLayer?.frame.width.toFixed(0)">
    </mat-form-field>
  </mat-expansion-panel>

  <mat-expansion-panel expanded="true">
    <mat-expansion-panel-header>
      <mat-panel-title>
        Position
      </mat-panel-title>
    </mat-expansion-panel-header>

    <mat-form-field>
      <input matInput
        disabled
        type="number"
        placeholder="Left"
        [ngModel]="currentLayer?.frame.x.toFixed(0)">
    </mat-form-field>
    <mat-form-field>
      <input matInput
        disabled
        type="number"
        placeholder="Top"
        [ngModel]="currentLayer?.frame.y.toFixed(0)">
    </mat-form-field>
  </mat-expansion-panel>
  `,
  styles: [
    `
  mat-form-field {
    width: 70px;
    padding: 14px;
  }

  button {
    margin: 14px;
  }
  `
  ]
})
export class SettingsLayerPositionComponent implements OnInit {
  currentLayer: SketchMSLayer;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      this.currentLayer = currentLayer;
    });
  }
}
