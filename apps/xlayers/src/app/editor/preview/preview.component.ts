import { Component, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { Store } from '@ngxs/store';
import { ViewerContainerComponent } from './viewer/container/container.component';
import { UiState, CurrentPage, CurrentLayer } from '../../core/state';
import { SketchMSPageLayer, SketchMSLayer } from '@xlayers/sketchtypes';

@Component({
  selector: 'xly-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit {
  sketchPages: Array<SketchMSPageLayer>;
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

  @ViewChild('xlyViewerContainerRef', { static: true })
  xlyViewerContainerRef: ViewerContainerComponent;
  @ViewChild('pagesPanelRef', { static: true })
  pagesPanelRef: MatExpansionPanel;
  @ViewChild('layersPanelRef', { static: true })
  layersPanelRef: MatExpansionPanel;
  @ViewChild('settingNavRef', { static: true })
  settingNavRef: MatDrawerContainer;
  @ViewChild('currentLayerNavRef', { static: true })
  currentLayerNavRef: MatDrawerContainer;

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.colors = {
      background: 'transparent',
    };

    this.store.select(UiState.currentPage).subscribe((currentPage) => {
      this.currentPage = currentPage;
    });

    this.store.select(UiState.availablePages).subscribe((availablePages) => {
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

    this.store.select(UiState.currentLayer).subscribe((currentLayer) => {
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

  setCurrentPage(page: SketchMSPageLayer) {
    this.store.dispatch(new CurrentPage(page));
  }

  closeLayerSettings() {
    this.store.dispatch(new CurrentLayer(null));
  }

  pageName(index: number, page: SketchMSPageLayer) {
    return page && page.name;
  }
}
