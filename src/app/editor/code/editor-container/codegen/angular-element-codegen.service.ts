import { Injectable } from '@angular/core';
import { WebCodeGenService } from '@xlayers/web-codegen';

@Injectable({
  providedIn: 'root'
})
export class AngularElementCodeGenService {
  constructor(
    private readonly webCodeGen: WebCodeGenService,
  ) {}

  buttons() {
    return {
      stackblitz: false
    };
  }

  generate(data: SketchMSData) {
    const generatedFiles = data.pages.flatMap(page =>
      this.webCodeGen.aggreate(page, data, { mode: 'angularElement' })
    );

    return [
      ...generatedFiles
    ];
  }
}
