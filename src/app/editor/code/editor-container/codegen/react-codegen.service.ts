import { Injectable } from '@angular/core';
import {
  ReactCodeGenService,
  ReactDocGenService
} from '@xlayers/react-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class ReactCodeGenFacadeService {
  constructor(
    private readonly reactCodeGen: ReactCodeGenService,
    private readonly reactDocGen: ReactDocGenService
  ) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return this.reactDocGen
      .aggregate(data)
      .concat(
        data.pages.flatMap(page => this.reactCodeGen.aggregate(page, data))
      ) as XlayersNgxEditorModel[];
  }
}
