import { Injectable } from '@angular/core';
import {
  WebComponentCodeGenService,
  WebComponentDocGenService
} from '@xlayers/web-component-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class WebComponentCodeGenFacadeService {
  constructor(
    private readonly webCodeGen: WebComponentCodeGenService,
    private readonly webDocGen: WebComponentDocGenService
  ) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return this.webDocGen
      .aggregate(data)
      .concat(
        data.pages.flatMap(page => this.webCodeGen.aggregate(page, data))
      ) as XlayersNgxEditorModel[];
  }
}
