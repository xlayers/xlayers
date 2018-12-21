import { State, Action, StateContext, Selector } from '@ngxs/store';
import { XlayersNgxEditorModel } from 'src/app/editor/code-editor/editor-container/codegen/codegen.service';

export interface CodeGenSettings {
  content: XlayersNgxEditorModel[];
  kind: number;
}

export class CodeGen {
  static readonly type = '[CodeGen] CodeGen';
  constructor(public kind: number, public content: XlayersNgxEditorModel[]) {}
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
      kind: action.kind
    });
  }
}
