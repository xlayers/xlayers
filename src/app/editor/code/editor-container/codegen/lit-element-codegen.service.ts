import { Injectable } from '@angular/core';
import { LitElementCodeGenService } from '@xlayers/lit-element-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class LitElementCodeGenFacadeService {
  constructor(private readonly litElementCodeGen: LitElementCodeGenService) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return data.pages.flatMap(page =>
      this.litElementCodeGen.aggreate(page, data)
    ) as XlayersNgxEditorModel[];
  }
}
