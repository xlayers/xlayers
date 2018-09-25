import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { UiState, LayerCSS } from 'src/app/core/state';

@Component({
  selector: 'sketch-settings-layer-colors',
  template: `
  <ng-template #noStyleRef>
    <p class="no-styling">
      <mat-icon>info</mat-icon>
      The current layer doesn't have styling properties
    </p>
  </ng-template>

  <mat-expansion-panel expanded="true" *ngIf="componentStyle else noStyleRef" >
    <mat-expansion-panel-header>
      <mat-panel-title>
        Style Properties
      </mat-panel-title>
    </mat-expansion-panel-header>


    <mat-nav-list>
      <mat-list-item [matMenuTriggerFor]="menuColor" *ngFor="let g of gradients">
        <span class="gradient-color" [style.backgroundColor]="g.backgroundColor"></span>

        <mat-menu #menuColor="matMenu" class="menu-color-panel" [overlapTrigger]="false">
          <color-sketch [color]="g.backgroundColor"></color-sketch>
        </mat-menu>

      </mat-list-item>
      <mat-list-item [matMenuTriggerFor]="menuColor" *ngIf="bgColor">
        <span class="gradient-color" [style.backgroundColor]="bgColor"></span> {{bgColor}}

        <mat-menu #menuColor="matMenu" class="menu-color-panel" [overlapTrigger]="false">
          <color-sketch [color]="bgColor"></color-sketch>
        </mat-menu>
      </mat-list-item>
    </mat-nav-list>

    <mat-list>
      <mat-list-item>
        Opacity
        <mat-slider
          thumbLabel
          [displayWith]="formatOpacityLabel"
          [value]="componentStyle.opacity"
          tickInterval="1000"
          min="0" max="1" step="0.1"></mat-slider>
      </mat-list-item>
    </mat-list>

  </mat-expansion-panel>
  `,
  styles: [
    `
      .gradient-color {
        display: block;
        width: 24px;
        height: 24px;
        margin: 0px 7px;
      }
      .no-styling {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
      }
    `
  ]
})
export class SettingsLayerColorsComponent implements OnInit {
  componentStyle: LayerCSS;
  gradients: Array<{
    backgroundColor: string;
    stop: string;
  }>;
  bgColor: string;
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      if (currentLayer) {
        this.componentStyle = (currentLayer as any).css as LayerCSS;
        this.computeBackgourndGradient();
      } else {
        this.componentStyle = null;
        this.gradients = [];
      }
    });
  }

  formatOpacityLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 100) {
      return Math.round(value / 100);
    }

    return value;
  }

  isBackgroundGradient() {
    const bc = this.componentStyle['background-color'];
    return bc && bc.startsWith('linear-gradient');
  }

  computeBackgourndGradient() {
    if (this.componentStyle) {
      if (this.isBackgroundGradient()) {
        this.gradients = this.componentStyle['background-color'].match(/(rgba[ %\(\),0-9]+)/gu).map(match => {
          const m = match.split(' ');
          return {
            backgroundColor: m[0],
            stop: m[1]
          };
        });
      } else {
        this.bgColor = this.componentStyle['background-color'];
      }
    }
  }
}
