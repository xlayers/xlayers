import { NgModule } from '@angular/core';
import { CodeGenService } from './codegen.service';
import { ReactCodeGenService } from './react/react.service';
import { VueCodeGenService } from './vue/vue.service';
import { WCCodeGenService } from './wc/wc.service';
import { StencilCodeGenService } from './stencil/stencil.service';
import { AngularCodeGenService } from './angular/angular.service';
import { LitElementCodeGenService } from './lit-element/lit-element.service';
import { XamarinFormsCodeGenService } from './xamarin-forms/xamarin-forms.service';
import { XamarinFormsCodeGenVisitor } from './xamarin-forms/codegen/xamarin-forms-codegenvisitor.service';
import { SharedCodegen } from './shared-codegen.service';

@NgModule({
  providers: [
      CodeGenService,
      SharedCodegen,
      AngularCodeGenService,
      ReactCodeGenService,
      VueCodeGenService,
      WCCodeGenService,
      StencilCodeGenService,
      LitElementCodeGenService,
      XamarinFormsCodeGenService,
      XamarinFormsCodeGenVisitor
  ]
})
export class CodeGenModule {}
