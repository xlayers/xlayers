import { Injectable } from '@angular/core';
import {
  AngularCodeGenService,
  AngularDocGenService
} from '@xlayers/angular-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenFacadeService {
  constructor(
    private readonly angularCodeGen: AngularCodeGenService,
    private readonly angularDocGen: AngularDocGenService
  ) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return this.angularDocGen
      .aggregate(data)
      .concat(this.angularCodeGen.aggregate(data)) as XlayersNgxEditorModel[];
  }
}
