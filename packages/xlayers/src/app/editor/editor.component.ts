import { Component, OnInit } from '@angular/core';
import { ResetUiSettings, Toggle3D, UiState, ZoomIn, ZoomOut, ZoomReset, ToggleWireframe, ToggleCodeEditor } from '@app/core/state';
import { CodeGenSettings, CodeGenState } from '@app/core/state/page.state';
import { environment } from '@env/environment';
import { Store } from '@ngxs/store';
import * as FileSaver from 'file-saver';
import { PreviewBadgeService } from '../core/preview-badge.service';
import { ExportStackblitzService } from './code/exports/stackblitz/stackblitz.service';
import { Navigate } from '@ngxs/router-plugin';


@Component({
  selector: 'xly-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  currentPage: SketchMSLayer;
  codegen: CodeGenSettings;
  isStackblitzEnabled = true;
  is3dView = false;
  DEFAULT_TIMEOUT = 500;
  zoomIn: boolean;
  zoomOut: boolean;
  resetZoom: boolean;
  zoomLevel = 1;
  wireframe = false;
  isCodeEditor = false;
  enabled = false;


  version = environment.version;
  badge = '';
  constructor(
    private readonly store: Store,
    private readonly badgeService: PreviewBadgeService,
    private readonly exporter: ExportStackblitzService
  ) { }

  ngOnInit() {
    this.badge = this.badgeService.computeBadge();

    this.store.select(UiState.currentPage).subscribe(currentPage => {
      this.currentPage = currentPage;
    });

    this.store.select(CodeGenState.codegen).subscribe(codegen => {
      if (this.codegen) {
        this.isStackblitzEnabled = codegen.buttons.stackblitz;
      }
      this.codegen = codegen;
    });

    this.store.select(UiState.is3dView).subscribe(is3dView => {
      this.is3dView = is3dView;
    });

    this.store.select(UiState.zoomLevel).subscribe(zoomLevel => {
      this.zoomLevel = zoomLevel;
      this.zoomIn = zoomLevel > 1;
      this.zoomOut = zoomLevel < 1;
    });

    this.store.select(UiState.isWireframe).subscribe(isWireframe => {
      this.wireframe = isWireframe;
    });

    this.store
      .select(UiState.isSettingsEnabled)
      .subscribe(isEnbaledSettings => {
        this.enabled = isEnbaledSettings;
      });

  }

  toggleWireframe() {
    this.wireframe = !this.wireframe;
    this.store.dispatch(new ToggleWireframe(this.wireframe));
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
    this.store.dispatch([
      new ResetUiSettings(),
      new Navigate(['/upload'])
    ]);
  }

  toggle3d() {
    this.is3dView = !this.is3dView;
    this.store.dispatch(new Toggle3D(this.is3dView));
  }

  openInStackblitz() {
    this.exporter.export(this.codegen);
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

  private toggleIsCodeEditor() {
    this.isCodeEditor = !this.isCodeEditor;
    this.store.dispatch(new ToggleCodeEditor(this.isCodeEditor));
  }

  toggleCodeEditor() {
    this.toggleIsCodeEditor();
    this.store.dispatch(new Navigate(['/editor/code']));
  }
  togglePreview() {
    this.toggleIsCodeEditor();
    this.store.dispatch(new Navigate(['/editor/preview']));
  }

}
