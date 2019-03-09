import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from '@app/core/core.module';
import { UploadComponent } from './upload.component';
import { SketchDropzoneComponent } from './sketch-dropzone/sketch-dropzone.component';
import { SketchSelectDemoFilesComponent } from './sketch-select-demo-files/sketch-select-demo-files.component';
import { BrowseFilesComponent } from './browse-files/browse-files.component';

export const routes: Route[] = [
  {
    path: '',
    component: UploadComponent
  }
];

@NgModule({
  declarations: [
    UploadComponent,
    SketchDropzoneComponent,
    SketchSelectDemoFilesComponent,
    BrowseFilesComponent
  ],
  imports: [CoreModule, RouterModule.forChild(routes)]
})
export class UploadModule {}
