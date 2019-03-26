import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { CurrentLayer, CurrentPage, UiState } from '@app/core/state';
import { Store } from '@ngxs/store';
import { ViewerContainerComponent } from './viewer/container/container.component';

@Component({
  selector: 'xly-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  sketchPages: Array<SketchMSPage>;
  preview: boolean;
  currentLayer: SketchMSLayer;
  colors: {
    background: string;
  };
  settingTreeViewerWidth: number;
  shouldEnableCanvasSettings = false;
  currentPage: SketchMSLayer;
  settingMenuWidth: number;
  isCodeEditor: boolean;

  @ViewChild('xlyViewerContainerRef')
  xlyViewerContainerRef: ViewerContainerComponent;
  @ViewChild('pagesPanelRef') pagesPanelRef: MatExpansionPanel;
  @ViewChild('layersPanelRef') layersPanelRef: MatExpansionPanel;
  @ViewChild('settingNavRef') settingNavRef: MatDrawerContainer;
  @ViewChild('currentLayerNavRef') currentLayerNavRef: MatDrawerContainer;

  constructor(private readonly store: Store) { }

  ngOnInit() {
    this.colors = {
      background: 'transparent'
    };

    this.store.select(UiState.currentPage).subscribe(currentPage => {
      this.currentPage = currentPage;
    });

    this.store.select(UiState.availablePages).subscribe(availablePages => {
      this.sketchPages = availablePages;

      if (availablePages.length > 0) {
        this.pagesPanelRef.open();
        this.layersPanelRef.open();
        this.settingNavRef.open();
      } else {
        this.pagesPanelRef.close();
        this.layersPanelRef.close();
        this.settingNavRef.close();
      }
    });

    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      this.currentLayer = currentLayer;

      if (this.currentLayer) {
        this.currentLayerNavRef.open();
      } else {
        this.currentLayerNavRef.close();
      }
    });
  }

  changeBackgroundColor(event: any) {
    const c = event.color.rgb;
    if (c.a === 0) {
      this.colors.background = 'transparent';
    } else {
      this.colors.background = `rgba(${c.r},${c.g},${c.b},${c.a})`;
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
