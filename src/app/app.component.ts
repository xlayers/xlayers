import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { Store } from '@ngxs/store';
import {
  CurrentLayer,
  CurrentPage,
  HidePreview,
  HideWireframe,
  ShowPreview,
  ShowWireframe,
  UiState,
  ZoomIn,
  ZoomOut,
  Toggle3D
} from './state/ui.state';
import { SketchContainerComponent } from './viewer/lib/sketch-container.component';

@Component({
  selector: 'sketch-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentPage: SketchMSLayer;
  currentLayer: SketchMSLayer;
  sketchPages: Array<SketchMSPage>;
  wireframe: boolean;
  preview: boolean;
  enabled: boolean;
  colors: {
    background: string;
  };

  zoomLevel: number;

  is3dView: boolean;

  /**
   * @todo This feauture is not ready.
   */
  shouldEnableCanvasSettings = false;

  @ViewChild('pagesPanelRef') pagesPanelRef: MatExpansionPanel;
  @ViewChild('layersPanelRef') layersPanelRef: MatExpansionPanel;
  @ViewChild('currentLayerNavRef') currentLayerNavRef: MatDrawerContainer;
  @ViewChild('sketchContainerRef') sketchContainerRef: SketchContainerComponent;

  constructor(private store: Store) {}

  ngOnInit() {
    this.colors = {
      background: 'transparent'
    };

    this.store.select(UiState.availablePages).subscribe(availablePages => {
      this.sketchPages = availablePages;

      if (availablePages.length > 0) {
        setTimeout(_ => {
          this.pagesPanelRef.open();
          this.layersPanelRef.open();
        }, 0);
      }

      this.store.select(UiState.isWireframe).subscribe(isWireframe => {
        this.wireframe = isWireframe;
      });
      this.store.select(UiState.zoomLevel).subscribe(zoomLevel => {
        this.zoomLevel = zoomLevel;
      });
      this.store.select(UiState.is3dView).subscribe(is3dView => {
        this.is3dView = is3dView;
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

  toggleCodeEditor() {
    throw Error('not implemented');
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

  changeBackgroundColor(event) {
    const c = event.color.rgb;
    if (c.a === 0) {
      this.colors.background = 'transparent';
    } else {
      this.colors.background = `rgba(${c.r},${c.g},${c.b},${c.a})`;
    }
  }

  ZoomIn() {
    this.store.dispatch(new ZoomIn());
  }
  ZoomOut() {
    this.store.dispatch(new ZoomOut());
  }

  toggle3d() {
    this.is3dView = !this.is3dView;
    this.store.dispatch(new Toggle3D(this.is3dView));
  }
}
