import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from '../../../core/state';

@Component({
  selector: 'sketch-settings-container',
  template: `
    <mat-toolbar>
      <mat-toolbar-row class="mat-button-toggle-appearance-standard">
        <button matTooltip="Preview" [color]=" currentSettingView === 1 ? 'warn':'' " mat-button (click)="changeSettingView(1)">
          <mat-icon>visibility</mat-icon>
        </button>
        <button matTooltip="Size" [color]=" currentSettingView === 2 ? 'warn':'' " mat-button (click)="changeSettingView(2)">
          <mat-icon>open_with</mat-icon>
        </button>
        <button matTooltip="Style" [color]=" currentSettingView === 3 ? 'warn':'' " mat-button (click)="changeSettingView(3)">
          <mat-icon>format_paint</mat-icon>
        </button>
        <button matTooltip="Description" [color]=" currentSettingView === 4 ? 'warn':'' " mat-button (click)="changeSettingView(4)">
          <mat-icon>ballot</mat-icon>
        </button>
      </mat-toolbar-row>
    </mat-toolbar>

    <section [ngSwitch]="currentSettingView">
      <sketch-settings-preview *ngSwitchCase="1"></sketch-settings-preview>
      <sketch-settings-layer-position *ngSwitchCase="2"></sketch-settings-layer-position>
      <sketch-settings-layer-colors *ngSwitchCase="3"></sketch-settings-layer-colors>
      <sketch-settings-layer-properties *ngSwitchCase="4"></sketch-settings-layer-properties>
    </section>
  `,
  styles: [
      `
      :host, mat-toolbar {
        justify-content: center;
      }
      .mat-button-toggle-appearance-standard {
        background-color: #212121
      }
      .mat-button-toggle-checked {
        color: #EE4743;
      }
    `
  ]
})
export class SettingsContainerComponent implements OnInit {
  currentSettingView = 1;
  previousLayout: any = null;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      if (currentLayer) {
        if (!this.previousLayout || this.previousLayout.do_objectID !== currentLayer.do_objectID) {
          this.previousLayout = currentLayer;
        }
      }
    });
  }

  changeSettingView(index) {
    this.currentSettingView = index;
  }
}
