import { Component, OnInit } from '@angular/core';
import { SketchService } from '@app/core/sketch.service';
import {
  CurrentFile,
  ErrorType,
  InformUser,
  ResetUiSettings
} from '@app/core/state';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'xly-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  public selectedDemoFileError = false;
  isDragging$ = new BehaviorSubject<boolean>(false);

  constructor(private sketchService: SketchService, private store: Store) {}

  ngOnInit() {}

  async onFileSelected(file: File) {
    try {
      const data = await this.service.process(file);
      this.isDragging$.next(false);
      // Note: these actions need to be run in sequence!
      this.store.dispatch([
        new ResetUiSettings(),
        new CurrentFile(data),
        new Navigate(['/editor/preview'])
      ]);
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
      _ => {
        // include this status in the store for me it's an overkill
        this.selectedDemoFileError = true;
        setTimeout(() => {
          this.selectedDemoFileError = false;
        }, 3000);
      }
    );
  }
}
