import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { SketchService } from './sketch.service';

@Component({
  selector: 'sketch-dropzone',
  template: `
    <mat-icon
      class="mode__mini"
      *ngIf="isModeMini; else: large"
      (drop)="onFileDrop($event)"
      (dragover)="dragOverHandler($event)"
      (click)="openFileBrowser()"
      >cloud_upload</mat-icon
    >

    <ng-template #large>
      <section (drop)="onFileDrop($event)" (dragover)="dragOverHandler($event)">
        <mat-icon class="mode__large">cloud_upload</mat-icon>
        <h2 class="mat-headline">Drag&Drop your Sketch file here</h2>
        <span class="mat-subheading-1">OR</span>
        <button
          color="primary"
          class="mat-headline"
          mat-button
          (click)="openFileBrowser()"
        >
          BROWSE FILES
        </button>
        <sketch-select-demo-files
          [error]="selectedDemoFileError"
          (changed)="openSelectedDemoFile($event)"
        ></sketch-select-demo-files>
      </section>
    </ng-template>

    <input
      #fileBrowserRef
      type="file"
      (input)="onFileChange($event)"
      accept=".sketch"
    />
  `,
  styles: [
    `
      :host {
        display: flex;
        height: 100%;
        min-height: 100%;
        position: relative;
        align-items: center;
        justify-content: center;
        color: #b0b0b0;
      }
      section {
        width: 100%;
        height: 100%;
        background: white;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin: 20px auto;
      }

      input[type='file'] {
        display: none;
      }

      .mode__large {
        font-size: 4em;
        color: #b0b0b06b;
        width: 200px;
        height: 70px;
      }

      .mode__mini {
        cursor: pointer;
      }
    `
  ]
})
export class SketchDropzoneComponent implements OnInit, OnChanges {
  @Input() mode: 'mini|large';
  @Output() changed: EventEmitter<File> = new EventEmitter();
  @ViewChild('fileBrowserRef') fileBrowserRef: ElementRef;

  public isModeMini = false;
  public selectedDemoFileError = false;

  constructor(private service: SketchService) {}

  ngOnInit() {}

  ngOnChanges(records: SimpleChanges) {
    if (records.mode) {
      this.isModeMini = (records.mode.currentValue as string) === 'mini';
    }
  }

  openFileBrowser() {
    this.fileBrowserRef.nativeElement.click();
  }

  openSelectedDemoFile(fileName: string) {
    this.selectedDemoFileError = false;
    this.service.getSketchDemoFile(fileName).subscribe(
      (file: Blob) => {
        this.onFileChange(new File([file], `${fileName}.sketch`));
      },
      _ => {
        // include this status in the store for me it's an overkill
        this.selectedDemoFileError = true;
        setTimeout(() => {
          this.selectedDemoFileError = false;
        }, 3000);
      }
    );
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          const file = event.dataTransfer.items[i].getAsFile() as File;
          this.onFileChange(file);

          // we only accept one file (for now)
          return true;
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i];
        this.onFileChange(file);

        // we only accept one file (for now)
        return true;
      }
    }

    // Pass event to removeDragData for cleanup
    this.removeDragData(event);
  }

  dragOverHandler(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  onFileChange(inputEvent: any | File) {
    let file;
    if (!inputEvent.target) {
      file = inputEvent as File;
    } else {
      const files = inputEvent.target.files || inputEvent.dataTransfer.files;
      if (!files.length) {
        return;
      }
      file = files[0];
    }

    if (file.name.endsWith('.sketch')) {
      this.changed.emit(file);
    }
  }

  private removeDragData(event: DragEvent) {
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      event.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      event.dataTransfer.clearData();
    }
  }
}
