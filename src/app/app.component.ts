import { Component, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { HideWireframe, ShowWireframe, UiState, UiSettings, HidePreview, ShowPreview, CurrentLayer, CurrentPage } from './state/ui.state';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDrawerContainer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentPage: SketchMSPage;
  currentLayer: SketchMSSymbolMaster;
  sketchPages: Array<SketchMSPage>;
  wireframe: boolean;
  preview: boolean;
  enabled: boolean;

  @ViewChild('expansionPanelRef') expansionPanelRef: MatExpansionPanel;
  @ViewChild('currentLayerNavRef') currentLayerNavRef: MatDrawerContainer;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(UiState.availablePages).subscribe(availablePages => {
      this.sketchPages = availablePages;
      if (availablePages.length > 0) {
        this.expansionPanelRef.open();
      }

      this.store.select(UiState.isWireframe).subscribe(isWireframe => {
        this.wireframe = isWireframe;
      });
      this.store.select(UiState.isPreview).subscribe(isPreview => {
        this.preview = isPreview;
      });
      this.store.select(UiState.currentPage).subscribe(currentPage => {
        this.currentPage = currentPage;
      });
      this.store.select(UiState.currentLayer).subscribe(currentLayer => {
        this.currentLayer = currentLayer;
        if (this.currentLayer) {
          this.currentLayerNavRef.open();
        } else {
          this.currentLayerNavRef.close();
        }
      });
      this.store.select(UiState.isSettingsEnabled).subscribe(isEnbaledSettings => {
        this.enabled = isEnbaledSettings;
      });
    });
  }

  toggleWireframe() {
    if (this.wireframe === true) {
      this.store.dispatch(new HideWireframe());
    } else {
      this.store.dispatch(new ShowWireframe());
    }
  }

  togglePreview() {
    if (this.preview === true) {
      this.store.dispatch(new HidePreview());
    } else {
      this.store.dispatch(new ShowPreview());
    }
  }

  setCurrentPage(page: SketchMSPage) {
    this.store.dispatch(new CurrentPage(page));
  }

  closeLayerSettings() {
    this.store.dispatch(new CurrentLayer(null));
  }

  pageName(page: SketchMSPage) {
    return page && page.name;
  }
}
