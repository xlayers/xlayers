import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CurrentLayer, SketchMSLayer, UiState } from './../../state/ui.state';

@Component({
  selector: 'sketch-settings-layer',
  template: `
  <mat-expansion-panel expanded="true">
    <mat-expansion-panel-header>
      <mat-panel-title>
        Size
      </mat-panel-title>
    </mat-expansion-panel-header>

    <mat-form-field>
      <input matInput
        type="number"
        placeholder="Height"
        (ngModelChange)="updateCurrentLayerHeight($event)"
        [ngModel]="currentLayer?.frame.height.toFixed(0)">
    </mat-form-field>
    <mat-form-field>
      <input matInput
        type="number"
        placeholder="Width"
        (ngModelChange)="updateCurrentLayerWidth($event)"
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
        type="number"
        placeholder="Left"
        (ngModelChange)="updateCurrentLayerX($event)"
        [ngModel]="currentLayer?.frame.x.toFixed(0)">
    </mat-form-field>
    <mat-form-field>
      <input matInput
      type="number"
      placeholder="Top"
      (ngModelChange)="updateCurrentLayerY($event)"
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
export class SettingsLayerComponent implements OnInit {
  currentLayer: SketchMSLayer;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      this.currentLayer = currentLayer;
    });
  }

  updateCurrentLayerHeight(value: number) {
    this.currentLayer.frame.height = value;
    this.store.dispatch(new CurrentLayer(this.currentLayer));
  }
  updateCurrentLayerWidth(value: number) {
    this.currentLayer.frame.width = value;
    this.store.dispatch(new CurrentLayer(this.currentLayer));
  }
  updateCurrentLayerY(value: number) {
    this.currentLayer.frame.y = value;
    this.store.dispatch(new CurrentLayer(this.currentLayer));
  }
  updateCurrentLayerX(value: number) {
    this.currentLayer.frame.x = value;
    this.store.dispatch(new CurrentLayer(this.currentLayer));
  }
}
