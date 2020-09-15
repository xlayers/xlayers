import { NgModule } from '@angular/core';
import { CssCodeGenModule } from '@xlayers/css-codegen';
import { SketchLibModule } from '@xlayers/sketch-lib';
import { SvgCodeGenModule } from '@xlayers/svg-codegen';

@NgModule({
  imports: [CssCodeGenModule, SvgCodeGenModule, SketchLibModule],
})
export class XamlCodeGenModule {}
