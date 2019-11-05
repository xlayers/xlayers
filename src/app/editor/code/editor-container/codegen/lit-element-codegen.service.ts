import { Injectable } from '@angular/core';
import {
  LitElementCodeGenService,
  LitElementDocGenService
} from '@xlayers/lit-element-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class LitElementCodeGenFacadeService {
  constructor(
    private readonly litElementCodeGen: LitElementCodeGenService,
    private readonly litElementDocGen: LitElementDocGenService
  ) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return this.litElementDocGen
      .aggreate(data)
      .concat(
        data.pages.flatMap(page => this.litElementCodeGen.aggreate(page, data))
      ) as XlayersNgxEditorModel[];
  }
}
