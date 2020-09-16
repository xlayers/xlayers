import { Injectable } from '@angular/core';
import {
  LitElementCodeGenService,
  LitElementDocGenService,
} from '@xlayers/lit-element-codegen';
import { XlayersNgxEditorModel } from './codegen.service';
import { SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class LitElementCodeGenFacadeService {
  constructor(
    private readonly litElementCodeGen: LitElementCodeGenService,
    private readonly litElementDocGen: LitElementDocGenService
  ) {}

  buttons() {
    return {
      stackblitz: true,
    };
  }

  generate(data: SketchMSData) {
    return this.litElementDocGen
      .aggregate(data)
      .concat(
        this.litElementCodeGen.aggregate(data)
      ) as XlayersNgxEditorModel[];
  }
}
