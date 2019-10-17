import { Injectable } from '@angular/core';
import { WebComponentCodeGenService } from '@xlayers/web-component-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class WebComponentCodeGenFacadeService {
  constructor(private readonly webCodeGen: WebComponentCodeGenService) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return data.pages.flatMap(page =>
      this.webCodeGen.aggreate(page, data)
    ) as XlayersNgxEditorModel[];
  }
}
