import { Injectable } from '@angular/core';
import { Vue3CodeGenService, Vue3DocGenService } from '@xlayers/vue3-codegen';
import { XlayersNgxEditorModel } from './codegen.service';
import { SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class Vue3CodeGenFacadeService {
  constructor(
    private readonly vue3CodeGen: Vue3CodeGenService,
    private readonly vue3DocGen: Vue3DocGenService
  ) {}

  buttons() {
    return {};
  }

  generate(data: SketchMSData) {
    return this.vue3DocGen
      .aggregate(data)
      .concat(this.vue3CodeGen.aggregate(data)) as XlayersNgxEditorModel[];
  }
}
