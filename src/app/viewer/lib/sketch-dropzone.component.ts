import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'sketch-dropzone',
  template: `

  <mat-icon class="mode__mini"
    *ngIf="mode === 'mini' else large"
    (drop)="onFileDrop($event)"
    (dragover)="dragOverHandler($event)"
    (click)="openFileBrowser()">cloud_upload</mat-icon>

  <ng-template #large>
    <section (drop)="onFileDrop($event)" (dragover)="dragOverHandler($event)">
      <mat-icon class="mode__large">cloud_upload</mat-icon>
      <h2 class="mat-headline">Drag&Drop your Sketch file here</h2>
      <span class="mat-subheading-1">Or</span>
      <button color="primary" class="mat-headline" mat-button (click)="openFileBrowser()">BROWSE FILES</button>
    </section>
  </ng-template>

  <input #fileBrowserRef type="file" (input)="onFileChange($event)" accept=".sketch">
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
      color: #B0B0B0;
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

    input[type="file"] {
      display: none;
    }

    .mode__large {
      font-size: 7em;
      color: #b0b0b0;
      width: 200px;
      height: 120px;
    }

    .mode__mini {
      cursor: pointer;
    }
  `
  ]
})
export class SketchDropzoneComponent implements OnInit {
  @Input() mode: 'mini|large';
  @Output() changed: EventEmitter<File>;
  @ViewChild('fileBrowserRef') fileBrowserRef: ElementRef;
  constructor() {
    this.changed = new EventEmitter();
  }

  ngOnInit() {}

  openFileBrowser() {
    this.fileBrowserRef.nativeElement.click();
  }

  onFileDrop(event) {
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

  dragOverHandler(event) {
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

  private removeDragData(event) {
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      event.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      event.dataTransfer.clearData();
    }
  }
}
