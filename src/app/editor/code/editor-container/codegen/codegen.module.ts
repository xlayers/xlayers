import { NgModule } from '@angular/core';
import { CodeGenService } from './codegen.service';
import { ReactCodeGenFacadeService } from './react-codegen.service';
import { VueCodeGenFacadeService } from './vue-codegen.service';
import { WebComponentCodeGenFacadeService } from './web-component-codegen.service';
import { StencilCodeGenFacadeService } from './stencil-codegen.service';
import { AngularCodeGenFacadeService } from './angular-codegen.service';
import { LitElementCodeGenFacadeService } from './lit-element-codegen.service';
import { XamarinCodeGenService } from './xamarin-codegen.service';
import { AngularElementCodeGenFacadeService } from './angular-element-codegen.service';

@NgModule({
  providers: [
    CodeGenService,
    AngularCodeGenFacadeService,
    AngularElementCodeGenFacadeService,
    ReactCodeGenFacadeService,
    VueCodeGenFacadeService,
    WebComponentCodeGenFacadeService,
    StencilCodeGenFacadeService,
    LitElementCodeGenFacadeService,
    XamarinCodeGenService
  ]
})
export class CodeGenModule {}
