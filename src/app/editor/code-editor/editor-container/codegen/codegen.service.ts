import { Injectable } from '@angular/core';
import { AngularCodeGenService } from './angular/angular.service';
import { ReactCodeGenService } from './react/react.service';
import { VueCodeGenService } from './vue/vue.service';
import { WCCodeGenService } from './wc/wc.service';
import { NgxEditorModel } from 'ngx-monaco-editor';

export interface CodeGenFacade {
  generate(): Array<NgxEditorModel>;
}

@Injectable({
  providedIn: 'root'
})
export class CodeGenService {
  static Kind = {
    Angular: 1,
    React: 2,
    Vue: 3,
    WC: 4
  };

  constructor(
    private readonly angular: AngularCodeGenService,
    private readonly react: ReactCodeGenService,
    private readonly vue: VueCodeGenService,
    private readonly wc: WCCodeGenService,
  ) {}

  generate(kind: number): Array<NgxEditorModel> {
    switch (kind) {
      case CodeGenService.Kind.Angular:
        return this.angular.generate();
      case CodeGenService.Kind.React:
        return this.react.generate();
      case CodeGenService.Kind.Vue:
        return this.vue.generate();
      case CodeGenService.Kind.WC:
        return this.wc.generate();
    }
  }
}
