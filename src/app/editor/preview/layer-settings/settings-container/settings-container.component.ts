import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UiState } from '@app/core/state';

@Component({
  selector: 'xly-settings-container',
  template: `
    <section>
      <xly-settings-preview></xly-settings-preview>
      <xly-settings-layer-position></xly-settings-layer-position>
      <xly-settings-layer-properties></xly-settings-layer-properties>
      <xly-settings-layer-colors></xly-settings-layer-colors>
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
