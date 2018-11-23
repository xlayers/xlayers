import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from '../../../core/state';

@Component({
  selector: 'sketch-settings-container',
  template: `
    <section [ngSwitch]="currentSettingView">
      <sketch-settings-preview></sketch-settings-preview>
      <sketch-settings-layer-position></sketch-settings-layer-position>
      <sketch-settings-layer-colors></sketch-settings-layer-colors>
      <sketch-settings-layer-properties></sketch-settings-layer-properties>
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
}
