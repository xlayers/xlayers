import { Injectable } from '@angular/core';
import { AngularCodeGenService } from '@xlayers/angular-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenFacadeService {
  constructor(private readonly angularCodeGen: AngularCodeGenService) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return data.pages.flatMap(page =>
      this.angularCodeGen.aggreate(page, data)
    ) as XlayersNgxEditorModel[];
  }
}
