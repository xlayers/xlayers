import { NgModule } from '@angular/core';
import { CodeGenService } from './codegen.service';
import { ReactCodeGenService } from './react-codegen.service';
import { VueCodeGenService } from './vue-codegen.service';
import { WebComponentCodeGenService } from './web-component-codegen.service';
import { StencilCodeGenService } from './stencil-codegen.service';
import { AngularCodeGenService } from './angular-codegen.service';
import { AngularElementCodeGenService } from './angular-element-codegen.service';
import { LitElementCodeGenService } from './lit-element-codegen.service';
import { XamarinCodeGenService } from './xamarin-codegen.service';

@NgModule({
  providers: [
    CodeGenService,
    AngularCodeGenService,
    AngularElementCodeGenService,
    ReactCodeGenService,
    VueCodeGenService,
    WebComponentCodeGenService,
    StencilCodeGenService,
    LitElementCodeGenService,
    XamarinCodeGenService
  ]
})
export class CodeGenModule {}
