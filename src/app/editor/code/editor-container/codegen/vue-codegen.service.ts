import { Injectable } from '@angular/core';
import { VueCodeGenService } from '@xlayers/vue-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class VueCodeGenFacadeService {
  constructor(private readonly vueCodeGen: VueCodeGenService) {}

  buttons() {
    return {};
  }

  generate(data: SketchMSData) {
    return data.pages.flatMap(page =>
      this.vueCodeGen.aggreate(page, data)
    ) as XlayersNgxEditorModel[];
  }
}
