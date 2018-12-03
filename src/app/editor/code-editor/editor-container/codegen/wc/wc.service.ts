import { Injectable } from '@angular/core';
import { CodeGenFacade } from '../codegen.service';
import { NgxEditorModel } from 'ngx-monaco-editor';

@Injectable({
  providedIn: 'root'
})
export class WCCodeGenService implements CodeGenFacade {
  constructor() {}

  /**
   * @todo make this dynamic
   */
  generate(): Array<NgxEditorModel> {
    return [{
      uri: 'xlayers.js',
      value: '',
      language: 'javascript'
    }];
  }
}
