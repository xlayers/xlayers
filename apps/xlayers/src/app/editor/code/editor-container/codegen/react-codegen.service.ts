import { Injectable } from '@angular/core';
import {
  ReactCodeGenService,
  ReactDocGenService,
} from '@xlayers/react-codegen';
import { XlayersNgxEditorModel } from './codegen.service';
import { SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class ReactCodeGenFacadeService {
  constructor(
    private readonly reactCodeGen: ReactCodeGenService,
    private readonly reactDocGen: ReactDocGenService
  ) {}

  buttons() {
    return {
      stackblitz: true,
    };
  }

  generate(data: SketchMSData) {
    return this.reactDocGen
      .aggregate(data)
      .concat(this.reactCodeGen.aggregate(data)) as XlayersNgxEditorModel[];
  }
}
