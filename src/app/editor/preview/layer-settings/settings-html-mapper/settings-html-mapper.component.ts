import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import {
  LayerHtmlCustomTage as LayerHtmlCustomTag,
  UiState
} from '@app/core/state';
import { Store } from '@ngxs/store';
import {
  HtmlElementGroup,
  SettingsHtmlMapperService
} from './settings-html-mapper.service';

export const includes = (
  opt: XLayersWebCodeGenTag[],
  value: string
): XLayersWebCodeGenTag[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item: XLayersWebCodeGenTag) =>
    item.name.toLowerCase().includes(filterValue)
  );
};

@Component({
  selector: 'xly-settings-html-mapper',
  template: `
    <mat-expansion-panel expanded="true">
      <mat-expansion-panel-header>
        <mat-panel-title>{{
          'SETTINGS_HTML_MAPPER.title' | translate
        }}</mat-panel-title>
      </mat-expansion-panel-header>

      <mat-form-field class="large" [title]="selectedHtmlElementDescription">
        <input
          type="text"
          matInput
          placeholder="Attach an HTML element"
          [ngModel]="currentLayer?.web?.tag?.name"
          (ngModelChange)="ngModelChanged($event)"
          [matAutocomplete]="autoGroup"
          (blur)="updateLayerTagNameOnBlur()"
        />
        <mat-autocomplete
          #autoGroup="matAutocomplete"
          [autoActiveFirstOption]="false"
          (optionSelected)="optionSelected($event)"
        >
          <mat-optgroup
            *ngFor="let group of htmlMapperGroupAutocomplete"
            [label]="group.type"
          >
            <mat-option *ngFor="let item of group.elements" [value]="item.name">
              {{ item.name }}
            </mat-option>
          </mat-optgroup>
        </mat-autocomplete>
      </mat-form-field>
    </mat-expansion-panel>
  `,
  styles: [
    `
      :host {
        text-align: left;
      }
      mat-form-field {
        padding: 14px;
      }
      mat-hint {
        height: 130px;
        padding: 14px;
      }
    `
  ]
})
export class SettingsHtmlMapperComponent implements OnInit {
  stateGroups: HtmlElementGroup[];

  currentLayer: SketchMSLayer;

  DEFAULT_ELEMENT = 'div';

  selectedHtmlElementName = '';
  selectedHtmlElementDescription = '';

  htmlMapperGroupAutocomplete: HtmlElementGroup[];

  @ViewChild(MatAutocompleteTrigger) autocompletePanel: MatAutocompleteTrigger;

  constructor(
    private readonly store: Store,
    private readonly htmlMapper: SettingsHtmlMapperService
  ) {}

  ngOnInit() {
    this.stateGroups = this.htmlMapper.getHtmlElements();

    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      if (currentLayer) {
        this.autocompletePanel.closePanel();

        this.currentLayer = currentLayer;
        const value = this.currentLayer.web?.tag?.name;
        this.selectedHtmlElementDescription = this.getSelectedHtmlElementDescription(
          value
        );
      }
    });
  }

  ngModelChanged(value: string) {
    if (value) {
      this.htmlMapperGroupAutocomplete = this.filterGroup(value);
      const desc = this.getSelectedHtmlElementDescription(value);
      if (desc) {
        this.selectedHtmlElementDescription = desc;
      } else {
        // element not found in the list, update description accordingly
        if (value.includes('-')) {
          this.selectedHtmlElementDescription = 'Custom element';
        } else {
          this.selectedHtmlElementDescription = 'Unsupported element';
        }
      }
    } else {
      // reset state
      this.htmlMapperGroupAutocomplete = this.stateGroups;
      this.selectedHtmlElementDescription = '';
      this.autocompletePanel.closePanel();
      this.store.dispatch(new LayerHtmlCustomTag(null));
    }
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    const item = this.find(value);
    this.selectedHtmlElementDescription = item?.description || '';
    this.htmlMapperGroupAutocomplete = [...this.stateGroups];
    this.store.dispatch(new LayerHtmlCustomTag(item));
  }

  private getSelectedHtmlElementDescription(value: string): string {
    const item = this.find(value);
    return item?.description || '';
  }

  updateLayerTagNameOnBlur() {
    if (this.currentLayer.web?.tag?.name === '') {
      this.store.dispatch(new LayerHtmlCustomTag(null));
    }
  }

  private filterGroup(value: string): HtmlElementGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({
          type: group.type,
          elements: includes(group.elements, value)
        }))
        .filter(group => group.elements.length > 0);
    }

    return this.stateGroups;
  }

  private find(value: string): XLayersWebCodeGenTag {
    if (value) {
      const vals = this.stateGroups.flatMap(group => [...group.elements]);
      return vals.find(item => item.name === value);
    }
    return null;
  }
}
