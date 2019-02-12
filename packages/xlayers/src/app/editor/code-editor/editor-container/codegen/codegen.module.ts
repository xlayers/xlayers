import { NgModule } from '@angular/core';
import { CodeGenService } from './codegen.service';
import { ReactCodeGenService } from './react/react.service';
import { VueCodeGenService } from './vue/vue.service';
import { WCCodeGenService } from './wc/wc.service';
import { StencilCodeGenService } from './stencil/stencil.service';
import { AngularCodeGenService } from './angular/angular.service';
import { SharedCodegen } from './shared-codegen.service';

@NgModule({
  providers: [
      CodeGenService,
      SharedCodegen,
      AngularCodeGenService,
      ReactCodeGenService,
      VueCodeGenService,
      WCCodeGenService,
      StencilCodeGenService
  ]
})
export class CodeGenModule {}
