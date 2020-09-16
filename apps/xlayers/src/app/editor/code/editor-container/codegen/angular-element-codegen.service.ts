import { Injectable } from '@angular/core';
import { AngularElementCodeGenService } from '@xlayers/angular-codegen';
import { SketchMSData } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class AngularElementCodeGenFacadeService {
  constructor(
    private readonly angularElementCodeGenService: AngularElementCodeGenService
  ) {}

  buttons() {
    return {
      stackblitz: false,
    };
  }

  generate(data: SketchMSData) {
    return this.angularElementCodeGenService.aggregate(data);
  }
}
