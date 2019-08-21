import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from '@app/core/state';

@Component({
  selector: 'xly-settings-layer-position',
  template: `
  <mat-expansion-panel expanded="false" [disabled]="!currentLayer?.frame.height">
    <mat-expansion-panel-header>
      <mat-panel-title>
        {{'SETTINGS_SIZE.title' | translate}}
      </mat-panel-title>
    </mat-expansion-panel-header>

    <mat-form-field>
      <input matInput
        disabled
        type="text"
        placeholder="{{'SETTINGS_SIZE.height' | translate}}"
        [ngModel]="currentLayer?.frame.height.toFixed(0) + 'px'">
    </mat-form-field>
    <mat-form-field>
      <input matInput
        disabled
        type="text"
        placeholder="{{'SETTINGS_SIZE.width' | translate}}"
        [ngModel]="currentLayer?.frame.width.toFixed(0) + 'px'">
    </mat-form-field>
  </mat-expansion-panel>

  <mat-expansion-panel expanded="false">
    <mat-expansion-panel-header>
      <mat-panel-title>
      {{'SETTINGS_POSITION.title' | translate}}
      </mat-panel-title>
    </mat-expansion-panel-header>

    <mat-form-field>
      <input matInput
        disabled
        type="text"
        placeholder="{{'SETTINGS_POSITION.left' | translate}}"
        [ngModel]="currentLayer?.frame.x.toFixed(0) + 'px'">
    </mat-form-field>
    <mat-form-field>
      <input matInput
        disabled
        type="text"
        placeholder="{{'SETTINGS_POSITION.top' | translate}}"
        [ngModel]="currentLayer?.frame.y.toFixed(0) + 'px'">
    </mat-form-field>
  </mat-expansion-panel>
  `,
  styles: [
    `
  :host {
    text-align: center;
  }

  mat-form-field {
    width: 40px;
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

  constructor(private readonly store: Store) { }

  ngOnInit() {
    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      this.currentLayer = currentLayer;
    });
  }
}
