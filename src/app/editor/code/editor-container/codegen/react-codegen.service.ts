import { Injectable } from '@angular/core';
import { ReactCodeGenService } from '@xlayers/react-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class ReactCodeGenFacadeService {
  constructor(private readonly reactCodeGen: ReactCodeGenService) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    return data.pages.flatMap(page =>
      this.reactCodeGen.aggreate(page, data)
    ) as XlayersNgxEditorModel[];
  }
}
