import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  XlayersNgxEditorModel,
  CodeGenKind,
  XlayersExporterNavBar,
} from '../../editor/code/editor-container/codegen/codegen.service';
import { Injectable } from '@angular/core';

export interface CodeGenSettings {
  kind: CodeGenKind;
  content?: XlayersNgxEditorModel[];
  buttons?: XlayersExporterNavBar;
}

export class SelectCodegenKind {
  static readonly type = '[CodeGen] Select Kind';
  constructor(public kind: CodeGenKind) {}
}

export class CodeGen {
  static readonly type = '[CodeGen] CodeGen';
  constructor(
    public kind: CodeGenKind,
    public content: XlayersNgxEditorModel[],
    public buttons: XlayersExporterNavBar
  ) {}
}

@State<CodeGenSettings>({
  name: 'codegen',
  defaults: {
    kind: 1,
  },
})
@Injectable()
export class CodeGenState {
  @Selector()
  static codegen(codegen: CodeGenSettings) {
    return codegen;
  }

  @Action(SelectCodegenKind)
  selectKind(
    { setState, getState }: StateContext<CodeGenSettings>,
    action: SelectCodegenKind
  ) {
    const state = getState();
    setState({
      ...state,
      kind: action.kind,
    });
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
