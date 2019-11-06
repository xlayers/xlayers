import { Injectable } from "@angular/core";
import {
  AngularBootstrapService,
  AngularCodeGenService,
  AngularDocGenService
} from "@xlayers/angular-codegen";
import { XlayersNgxEditorModel } from "./codegen.service";

@Injectable({
  providedIn: "root"
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
    const files = this.angularDocGen
      .aggregate(data)
      .concat(
        data.pages.flatMap(page => this.angularCodeGen.aggregate(page, data))
      ) as XlayersNgxEditorModel[];
    return this.angularBootstrapService.generate(files).concat(files);
  }
}
