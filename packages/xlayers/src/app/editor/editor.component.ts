import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { Store } from '@ngxs/store';
import * as FileSaver from 'file-saver';
import {
  CurrentLayer,
  CurrentPage,
  ResetUiSettings,
  Toggle3D,
  ToggleCodeEditor,
  ToggleWireframe,
  UiState,
  ZoomIn,
  ZoomOut,
  ZoomReset
} from '@app/core/state';
import { environment } from '@env/environment';
import { CodeGenState, CodeGenSettings } from '@app/core/state/page.state';
import { ExportStackblitzService } from './exports/stackblitz/stackblitz.service';
import { SketchContainerComponent } from './viewer/lib/sketch-container.component';
import { PreviewBadgeService } from './preview-badge.service';

@Component({
  selector: 'sketch-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  DEFAULT_TIMEOUT = 500;
  currentPage: SketchMSLayer;
  currentLayer: SketchMSLayer;
  sketchPages: Array<SketchMSPage>;
  wireframe: boolean;
  zoomIn: boolean;
  zoomOut: boolean;
  resetZoom: boolean;
  preview: boolean;
  enabled: boolean;
  colors: {
    background: string;
  };

  settingMenuWidth: number;
  settingTreeViewerWidth: number;

  zoomLevel: number;

  isStackblitzEnabled = true;
  is3dView: boolean;
  isCodeEditor: boolean;
  codegen: CodeGenSettings;

  version = environment.version;
  badge = '';

  shouldEnableCanvasSettings = false;

  @ViewChild('pagesPanelRef') pagesPanelRef: MatExpansionPanel;
  @ViewChild('layersPanelRef') layersPanelRef: MatExpansionPanel;
  @ViewChild('currentLayerNavRef') currentLayerNavRef: MatDrawerContainer;
  @ViewChild('settingNavRef') settingNavRef: MatDrawerContainer;
  @ViewChild('sketchContainerRef') sketchContainerRef: SketchContainerComponent;

  constructor(
    private readonly store: Store,
    private readonly exporter: ExportStackblitzService,
    private readonly badgeService: PreviewBadgeService
  ) { }

  ngOnInit() {

    this.badge = this.badgeService.computeBadge();

    this.colors = {
      background: 'transparent'
    };

    this.store.dispatch(new ResetUiSettings());

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

    this.store.select(UiState.isWireframe).subscribe(isWireframe => {
      this.wireframe = isWireframe;
    });
    this.store.select(UiState.zoomLevel).subscribe(zoomLevel => {
      this.zoomLevel = zoomLevel;
      this.zoomIn = zoomLevel > 1;
      this.zoomOut = zoomLevel < 1;
    });
    this.store.select(UiState.is3dView).subscribe(is3dView => {
      this.is3dView = is3dView;
    });
    this.store.select(UiState.isCodeEditor).subscribe(isCodeEditor => {
      this.isCodeEditor = isCodeEditor;
      if (this.sketchPages.length > 0) {
        if (this.isCodeEditor) {
          this.settingNavRef.close();
        } else {
          this.settingNavRef.open();
        }
      }
    });
    this.store.select(UiState.isPreview).subscribe(isPreview => {
      this.preview = isPreview;
      if (this.preview) {
        this.currentLayerNavRef.open();
      }
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
    this.store
      .select(UiState.isSettingsEnabled)
      .subscribe(isEnbaledSettings => {
        this.enabled = isEnbaledSettings;
      });

    this.store.select(CodeGenState.codegen).subscribe(codegen => {
      if (this.codegen) {
        this.isStackblitzEnabled = codegen.buttons.stackblitz;
      }
      this.codegen = codegen;
    });
  }

  toggleWireframe() {
    this.wireframe = !this.wireframe;
    this.store.dispatch(new ToggleWireframe(this.wireframe));
  }

  toggleCodeEditor() {
    this.isCodeEditor = !this.isCodeEditor;
    this.store.dispatch(new ToggleCodeEditor(this.isCodeEditor));
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

  changeBackgroundColor(event: any) {
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

  ZoomReset() {
    this.resetZoom = !this.resetZoom;
    setTimeout(() => this.resetZoom = !this.resetZoom, this.DEFAULT_TIMEOUT);
    this.store.dispatch(new ZoomReset());

  }

  toggle3d() {
    this.is3dView = !this.is3dView;
    this.store.dispatch(new Toggle3D(this.is3dView));
  }

  async download() {
    const zip = new window['JSZip']();
    this.codegen.content.forEach(file => {
      zip.file(file.uri, file.value);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    FileSaver.saveAs(content, 'xLayers.zip');
  }

  close() {
    this.store.dispatch(new ResetUiSettings());
  }

  openInStackblitz() {
    this.exporter.export(this.codegen);
  }
}
