import { Injectable } from '@angular/core';
import {
  StencilCodeGenService,
  StencilDocGenService
} from '@xlayers/stencil-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class StencilCodeGenFacadeService {
  constructor(
    private readonly stencilCodeGen: StencilCodeGenService,
    private readonly stencilDocGen: StencilDocGenService
  ) {}

  buttons() {
    return {
      stackblitz: false
    };
  }

  generate(data: SketchMSData) {
    return this.stencilDocGen
      .aggreate(data)
      .concat(
        data.pages.flatMap(page => this.stencilCodeGen.aggreate(page, data))
      ) as XlayersNgxEditorModel[];
  }
}
