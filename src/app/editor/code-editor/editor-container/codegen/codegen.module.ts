import { NgModule } from '@angular/core';
import { CodeGenService } from './codegen.service';
import { ReactCodeGenService } from './react/react.service';
import { VueCodeGenService } from './vue/vue.service';
import { WCCodeGenService } from './wc/wc.service';
import { AngularCodeGenService } from './angular/angular.service';

@NgModule({
  providers: [
      CodeGenService,
      AngularCodeGenService,
      ReactCodeGenService,
      VueCodeGenService,
      WCCodeGenService
  ]
})
export class CodeGenModule {}
