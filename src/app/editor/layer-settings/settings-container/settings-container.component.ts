import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from '../../../core/state';

@Component({
  selector: 'sketch-settings-container',
  template: `
    <mat-toolbar>
      <mat-button-toggle-group
        class="mat-elevation-z0"
        [(ngModel)]="currentSettingView"
        [value]="currentSettingView">

        <mat-button-toggle value="1">
          <mat-icon [class.mat-button-toggle-checked]="currentSettingView === 1">open_with</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="2">
          <mat-icon>format_paint</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="3">
          <mat-icon>ballot</mat-icon>
        </mat-button-toggle>
      </mat-button-toggle-group>
    </mat-toolbar>

    <section [ngSwitch]="currentSettingView">
      <sketch-settings-layer-position *ngSwitchCase="1"></sketch-settings-layer-position>
      <sketch-settings-layer-colors *ngSwitchCase="2"></sketch-settings-layer-colors>
      <sketch-settings-layer-properties *ngSwitchCase="3"></sketch-settings-layer-properties>
    </section>
  `,
  styles: [
      `
      .mat-elevation-z0 {
        box-shadow: none;
      }

      .mat-button-toggle-checked {
        color: #EE4743;
      }
    `
  ]
})
export class SettingsContainerComponent implements OnInit {
  currentSettingView: number;
  previousLayout: any = null;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      if (currentLayer) {
        if (!this.previousLayout || this.previousLayout.do_objectID !== currentLayer.do_objectID) {
          this.currentSettingView = 1;
          this.previousLayout = currentLayer;
        }
      }
    });
  }
}
