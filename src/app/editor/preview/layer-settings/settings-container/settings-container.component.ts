import { Component } from '@angular/core';

@Component({
  selector: 'xly-settings-container',
  template: `
    <section>
      <xly-settings-preview></xly-settings-preview>
      <xly-settings-layer-position></xly-settings-layer-position>
      <xly-settings-layer-properties></xly-settings-layer-properties>
      <xly-settings-layer-colors></xly-settings-layer-colors>
      <xly-settings-html-mapper></xly-settings-html-mapper>
    </section>
  `,
  styles: [
    `
      :host,
      mat-toolbar {
        justify-content: center;
      }
      .mat-button-toggle-appearance-standard {
        background-color: #212121;
      }
      .mat-button-toggle-checked {
        color: #ee4743;
      }
    `
  ]
})
export class SettingsContainerComponent {}
