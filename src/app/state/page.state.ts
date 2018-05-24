import { State, Action, StateContext } from '@ngxs/store';

export class CurrentPage {
  static readonly type = '[Page] Current Page';
  constructor(public page: SketchMSPage) {}
}

@State<SketchMSPage>({
  name: 'page'
})
export class PageState {
  @Action(CurrentPage)
  selectPage({ setState, getState }: StateContext<SketchMSPage>) {
    const page = getState();
    setState(page);
  }
}
