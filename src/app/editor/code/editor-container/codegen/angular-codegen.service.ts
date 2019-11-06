import { Injectable } from '@angular/core';
import {
  AngularBootstrapService,
  AngularCodeGenService,
  AngularDocGenService
} from '@xlayers/angular-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenFacadeService {
  constructor(
    private readonly angularBootstrapService: AngularBootstrapService,
    private readonly angularCodeGen: AngularCodeGenService,
    private readonly angularDocGen: AngularDocGenService
  ) {}

  buttons() {
    return {
      stackblitz: true
    };
  }

  generate(data: SketchMSData) {
    const files = data.pages.flatMap(page =>
      this.angularCodeGen.aggregate(page, data)
    );

    return [
      ...this.angularDocGen.aggregate(data),
      ...this.angularBootstrapService.generate(files),
      ...files
    ] as XlayersNgxEditorModel[];
  }
}
