import { Injectable } from '@angular/core';
import { StencilCodeGenService } from '@xlayers/stencil-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class StencilCodeGenFacadeService {
  constructor(private readonly stencilCodeGen: StencilCodeGenService) {}

  buttons() {
    return {
      stackblitz: false
    };
  }

  generate(data: SketchMSData) {
    return data.pages.flatMap(page =>
      this.stencilCodeGen.aggreate(page, data)
    ) as XlayersNgxEditorModel[];
  }
}
