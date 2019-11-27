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
      .aggregate(data)
      .concat(this.stencilCodeGen.aggregate(data)) as XlayersNgxEditorModel[];
  }
}
