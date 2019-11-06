import { Injectable } from '@angular/core';
import { AngularElementCodeGenService } from '@xlayers/angular-codegen';

@Injectable({
  providedIn: 'root'
})
export class AngularElementCodeGenFacadeService {
  constructor(
    private readonly angularElementCodeGenService: AngularElementCodeGenService
  ) {}

  buttons() {
    return {
      stackblitz: false
    };
  }

  generate(data: SketchMSData) {
    const generatedFiles = data.pages.flatMap(page =>
      this.angularElementCodeGenService.aggregate(page, data)
    );

    return [...generatedFiles];
  }
}
