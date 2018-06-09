import { UiState } from './../../state/ui.state';
import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sketch-settings-layer-properties',
  template: `
  <mat-form-field class="large">
    <input disabled matInput type="text" placeholder="Name" [ngModel]="currentLayer?.name">
  </mat-form-field>
  <mat-form-field class="large">
    <input disabled matInput type="text" placeholder="Kind" [ngModel]="currentLayer?._class">
  </mat-form-field>
  `,
  styles: [`
  mat-form-field {
    padding: 14px;
  }
  `]
})
export class SettingsLayerPropertiesComponent implements OnInit {

  currentLayer;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      this.currentLayer = currentLayer;
    });
  }

}
