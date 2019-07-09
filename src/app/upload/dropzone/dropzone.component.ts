import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'xly-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.css']
})
export class DropzoneComponent implements OnInit {
  @Output() changed: EventEmitter<File> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

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
