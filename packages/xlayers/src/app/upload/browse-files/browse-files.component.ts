import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'xly-browse-files',
  templateUrl: './browse-files.component.html',
  styleUrls: ['./browse-files.component.css']
})
export class BrowseFilesComponent implements OnInit {
  @Output() changed: EventEmitter<File> = new EventEmitter();
  @ViewChild('fileBrowserRef') fileBrowserRef: ElementRef;

  constructor() {}

  ngOnInit() {}

  openFileBrowser() {
    this.fileBrowserRef.nativeElement.click();
  }

  onFileChange(inputEvent: any | File) {
    let file: File;
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
}
