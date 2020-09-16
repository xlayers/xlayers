import { Injectable } from '@angular/core';
import { VueCodeGenService, VueDocGenService } from '@xlayers/vue-codegen';
import { XlayersNgxEditorModel } from './codegen.service';
import { SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class VueCodeGenFacadeService {
  constructor(
    private readonly vueCodeGen: VueCodeGenService,
    private readonly vueDocGen: VueDocGenService
  ) {}

  buttons() {
    return {};
  }

  generate(data: SketchMSData) {
    return this.vueDocGen
      .aggregate(data)
      .concat(this.vueCodeGen.aggregate(data)) as XlayersNgxEditorModel[];
  }
}
