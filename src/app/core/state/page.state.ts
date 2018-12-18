import { State, Action, StateContext, Selector } from '@ngxs/store';
import { XlayersNgxEditorModel } from 'src/app/editor/code-editor/editor-container/codegen/codegen.service';

export interface PageSettings {
  codegen: XlayersNgxEditorModel[];
}

export class CodeGen {
  static readonly type = '[Page] CodeGen';
  constructor(public data: XlayersNgxEditorModel[]) {}
}

@State<SketchMSPage>({
  name: 'page'
})
export class PageState {

  @Selector()
  static codegen(page: PageSettings) {
    return page.codegen;
  }

  @Action(CodeGen)
  selectCodegen({ setState }: StateContext<PageSettings>, action: CodeGen) {
    setState({
      codegen: [...action.data]
    });
  }
}
