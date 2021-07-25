import { Injectable } from '@angular/core';
import { SketchMSData } from '@xlayers/sketchtypes';
import {
  SvelteCodegenService,
  SvelteDocgenService,
} from '@xlayers/svelte-codegen';
import { XlayersNgxEditorModel } from './codegen.service';

@Injectable({
  providedIn: 'root',
})
export class SvelteCodeGenFacadeService {
  constructor(
    private readonly svelteCodeGen: SvelteCodegenService,
    private readonly svelteDocGen: SvelteDocgenService
  ) {}

  buttons() {
    return {
      stackblitz: false,
    };
  }

  generate(data: SketchMSData) {
    return this.svelteDocGen
      .aggregate(data)
      .concat(this.svelteCodeGen.aggregate(data)) as XlayersNgxEditorModel[];
  }
}
