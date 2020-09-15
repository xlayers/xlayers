import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  XlayersNgxEditorModel,
  CodeGenKind,
  XlayersExporterNavBar,
} from '../../editor/code/editor-container/codegen/codegen.service';
import { SketchMSPageLayer } from '@xlayers/sketchtypes';
import { Injectable } from '@angular/core';

export interface CodeGenSettings {
  content: XlayersNgxEditorModel[];
  kind: CodeGenKind;
  buttons: XlayersExporterNavBar;
}

export class CodeGen {
  static readonly type = '[CodeGen] CodeGen';
  constructor(
    public kind: CodeGenKind,
    public content: XlayersNgxEditorModel[],
    public buttons: XlayersExporterNavBar
  ) {}
}

@State<SketchMSPageLayer>({
  name: 'codegen',
})
@Injectable()
export class CodeGenState {
  @Selector()
  static codegen(codegen: CodeGenSettings) {
    return codegen;
  }

  @Action(CodeGen)
  selectCodegen({ setState }: StateContext<CodeGenSettings>, action: CodeGen) {
    setState({
      content: [...action.content],
      kind: action.kind,
      buttons: action.buttons,
    });
  }
}
