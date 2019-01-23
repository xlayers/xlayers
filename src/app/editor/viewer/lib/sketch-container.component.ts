import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  CurrentFile,
  CurrentLayer,
  InformUser,
  UiState,
  ZoomIn,
  ZoomOut
} from 'src/app/core/state';
import { SketchSelectedLayerDirective } from './selected-layer.directive';
import { SketchService } from './sketch.service';

@Component({
  selector: 'sketch-container',
  template: `
    <ng-template #noDataRef>
      <sketch-dropzone (changed)="onFileSelected($event)"></sketch-dropzone>
    </ng-template>

    <div class="layers-container" *ngIf="currentPage; else: noDataRef">
      <sketch-canvas
        #ref
        sketchSelectedLayer
        (click)="clearSelection()"
        [currentPage]="currentPage"
      ></sketch-canvas>
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        justify-content: center;
        position: absolute;
        transform: scale(1);
        transform-origin: center;
      }

      .layers-container {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 100%;
        position: absolute;
      }

      sketch-layer {
        top: 0;
        left: 0;
        position: absolute;
      }
    `
  ]
})
export class SketchContainerComponent implements OnInit {
  constructor(private service: SketchService, private store: Store) {}

  public currentPage: SketchMSLayer;

  @ViewChild(SketchSelectedLayerDirective) ref: SketchSelectedLayerDirective;

  ngOnInit() {
    this.store.select(UiState.currentPage).subscribe(currentPage => {
      this.currentPage = currentPage;
    });

    this.store.select(UiState.currentLayer).subscribe(currentLayer => {
      if (this.ref) {
        this.ref.selectDomNode(currentLayer);
      }
    });
  }

  async onFileSelected(file: File) {
    try {
      const data = await this.service.process(file);
      this.store.dispatch(new CurrentFile(data));
    } catch (e) {
      this.store.dispatch(
        new InformUser(
          'The design was created using an unsupported version of SketchApp.'
        )
      );
    }
  }

  clearSelection() {
    this.store.dispatch(new CurrentLayer(null));
  }

  @HostListener('mousewheel', ['$event'])
  OnMouseWheel(event: MouseEvent) {

    /**
     * Emit Zoom events only when any sketch file is selected
     * deltaY < 0 means wheel/scroll up, otherwise wheel down
     */
    if (!!this.currentPage) {
      return (event as any).deltaY < 0
        ? this.store.dispatch(new ZoomIn())
        : this.store.dispatch(new ZoomOut());
    }
  }
}
