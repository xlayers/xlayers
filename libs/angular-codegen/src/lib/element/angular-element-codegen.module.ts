import { NgModule } from '@angular/core';
import { WebCodeGenModule } from '@xlayers/web-codegen';
import { AngularCodeGenModule } from '../angular-codegen.module';

@NgModule({
  imports: [WebCodeGenModule, AngularCodeGenModule],
})
export class AngularElementCodeGenModule {}
