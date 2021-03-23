import { Component, OnInit } from '@angular/core';

import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { SketchService } from '../core/sketch.service';
import { getFileData } from '../supported-files';
import {
  ResetUiSettings,
  CurrentData,
  SourceFileData,
  InformUser,
  ErrorType,
} from '../core/state';

@Component({
  selector: 'xly-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  public selectedDemoFileError = false;
  isDragging$ = new BehaviorSubject<boolean>(false);

  constructor(
    private sketchService: SketchService,
    private readonly store: Store
  ) {}

  ngOnInit() {}

  async onFileSelected(file: File) {
    try {
      const data = await this.sketchService.loadSketchFile(file);
      //check if there are pages, if so show the ui elements.
      if (data.pages.length > 0) {
        this.isDragging$.next(false);
        // Note: these actions need to be run in sequence!
        this.store.dispatch([
          new ResetUiSettings(),
          new CurrentData(data),
          new SourceFileData(getFileData(file.name, '')),
          new Navigate(['/editor/preview']),
        ]);
        return;
      }

      this.store.dispatch(
        new InformUser('Sketch file cannot be processed!', ErrorType.Runtime)
      );
    } catch (error) {
      this.store.dispatch(new InformUser(error, ErrorType.Runtime));
      throw error;
    }
  }

  openSelectedDemoFile(fileName: string) {
    this.selectedDemoFileError = false;
    this.sketchService.getSketchDemoFile(fileName).subscribe(
      async (file: Blob) => {
        await this.onFileSelected(new File([file], `${fileName}.sketch`));
      },
      (_) => {
        // include this status in the store for me it's an overkill
        this.selectedDemoFileError = true;
        setTimeout(() => {
          this.selectedDemoFileError = false;
        }, 3000);
      }
    );
  }
}
