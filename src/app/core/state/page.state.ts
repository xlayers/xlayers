import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CodeGenKind, XlayersExporterNavBar, XlayersNgxEditorModel } from 'src/app/editor/code-editor/editor-container/codegen/codegen.service';

export interface CodeGenSettings {
  content: XlayersNgxEditorModel[];
  kind: CodeGenKind;
  buttons: XlayersExporterNavBar;
}

export class CodeGen {
  static readonly type = '[CodeGen] CodeGen';
  constructor(public kind: CodeGenKind, public content: XlayersNgxEditorModel[], public buttons: XlayersExporterNavBar) {}
}


@State<SketchMSPage>({
  name: 'codegen'
})
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
      buttons: action.buttons
    });
  }
}
