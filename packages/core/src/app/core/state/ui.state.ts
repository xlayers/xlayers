import { MatSnackBar } from '@angular/material/snack-bar';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SketchData } from '~core/src/app/editor/viewer/lib/sketch.service';

export interface LayerCSS {
  transform: string;
  'border-radius': number;
  opacity: number;
  filter: string;
  'box-shadow': string;
  'background-color': string;
  background: string;
}

export interface UiSettings {
  currentFile: SketchData;
  currentPage?: SketchMSLayer;
  currentLayer?: SketchMSLayer;
  previousLayer?: SketchMSLayer;
  availablePages?: Array<SketchMSPage>;
  wireframe?: boolean;
  preview?: boolean;
  settingsEnabled?: boolean;
  zoomLevel: number;
  is3dView: boolean;
  isCodeEditor: boolean;
}

export class CurrentFile {
  static readonly type = '[UiSettings] Current File';
  constructor(public data: SketchData) {}
}
export class ToggleWireframe {
  static readonly type = '[UiSettings] Toggle Wireframe';
  constructor(public value: boolean) {}
}

export class AvailablePages {
  static readonly type = '[UiSettings] Available Pages';
  constructor(public pages: SketchMSPage[]) {}
}

export class CurrentPage {
  static readonly type = '[UiSettings] Current Page';
  constructor(public page: SketchMSPage) {}
}

export class CurrentLayer {
  static readonly type = '[UiSettings] Current Layer';
  constructor(public layer: SketchMSLayer) {}
}

export class SettingsEnabled {
  static readonly type = '[UiSettings] Enable Settings';
}
export class AutoFixPagePosition {
  static readonly type = '[UiSettings] Auto Fix Current Page Position';
  constructor(public page: SketchMSLayer) {}
}
export class LayerPosition {
  static readonly type = '[UiSettings] Set Layer Position';
  public left:  number;
  public top:  number;
  constructor({ left, top }: {left: number; top: number} = { left: 0, top: 0 }) {
    this.left = left;
    this.top = top;
  }
}
export class ZoomIn {
  static readonly type = '[UiSettings] Zoom In';
  constructor(public value: number = 0.1) {}
}
export class ZoomOut {
  static readonly type = '[UiSettings] Zoom Out';
  constructor(public value: number = 0.1) {}
}
export class Toggle3D {
  static readonly type = '[UiSettings] Toggle 3D';
  constructor(public value: boolean) {}
}
export class ToggleCodeEditor {
  static readonly type = '[UiSettings] Toggle Code Editor';
  constructor(public value: boolean) {}
}

export class ResetUiSettings {
  static readonly type = '[UiSettings] Reset UI Settings';
}

export class InformUser {
  static readonly type = '[UiSettings] Inform user';
  constructor(public message: string) {}
}

const DEFAULT_UI_STATE = {
  wireframe: false,
  preview: false,
  availablePages: [],
  currentLayer: null,
  previousLayer: null,
  currentFile: null,
  currentPage: null,
  zoomLevel: 1,
  is3dView: false,
  isCodeEditor: false
};

@State<UiSettings>({
  name: 'ui',
  defaults: DEFAULT_UI_STATE
})
export class UiState {
  constructor(private snackBar: MatSnackBar) {}

  @Selector()
  static currentFile(ui: UiSettings) {
    return ui.currentFile;
  }
  @Selector()
  static isWireframe(ui: UiSettings) {
    return ui.wireframe;
  }

  @Selector()
  static isPreview(ui: UiSettings) {
    return ui.preview;
  }

  @Selector()
  static currentPage(ui: UiSettings) {
    return ui.currentPage;
  }

  @Selector()
  static autoFixCurrentPagePosition(ui: UiSettings) {
    return ui.currentPage;
  }

  @Selector()
  static currentLayer(ui: UiSettings) {
    return ui.currentLayer;
  }

  @Selector()
  static availablePages(ui: UiSettings) {
    return ui.availablePages;
  }

  @Selector()
  static isSettingsEnabled(ui: UiSettings) {
    return ui.settingsEnabled;
  }
  @Selector()
  static zoomLevel(ui: UiSettings) {
    return ui.zoomLevel;
  }
  @Selector()
  static is3dView(ui: UiSettings) {
    return ui.is3dView;
  }
  @Selector()
  static isCodeEditor(ui: UiSettings) {
    return ui.isCodeEditor;
  }

  // Actions

  @Action(CurrentFile)
  currentFile(
    { patchState, dispatch }: StateContext<UiSettings>,
    action: CurrentFile
  ) {
    let shouldFixTopLeftPosition = false;

    action.data.pages.map(page => {
      shouldFixTopLeftPosition =
        page.frame.x !== 0 ||
        page.frame.y !== 0 ||
        (page.layers &&
          (page.layers[0].frame.x !== 0 || page.layers[0].frame.y !== 0));

      if (shouldFixTopLeftPosition) {
        dispatch(new AutoFixPagePosition(page));
      }
    });

    if (shouldFixTopLeftPosition) {
      // dispatch this message only once.
      dispatch(new InformUser('Auto Fixed Top/Left Position'));
    }

    dispatch([
      new AvailablePages(action.data.pages),
      new CurrentPage(action.data.pages[0]),
      new SettingsEnabled(),
      new ToggleWireframe(false),
      new ToggleCodeEditor(false)
    ]);
    patchState({
      currentFile: { ...action.data }
    });
  }

  @Action(ToggleWireframe)
  showWireframe(
    { patchState }: StateContext<UiSettings>,
    action: ToggleWireframe
  ) {
    patchState({
      wireframe: action.value
    });
  }

  @Action(AvailablePages)
  setAvailablePages(
    { patchState }: StateContext<UiSettings>,
    action: AvailablePages
  ) {
    patchState({
      availablePages: [...action.pages]
    });
  }

  @Action(CurrentPage)
  currentPage({ patchState }: StateContext<UiSettings>, action: CurrentPage) {
    patchState({
      currentPage: action.page ? { ...action.page } : null
    });
  }

  @Action(CurrentLayer)
  currentLayer(
    { getState, patchState }: StateContext<UiSettings>,
    action: CurrentLayer
  ) {
    patchState({
      currentLayer: action.layer ? { ...action.layer } : null,
      previousLayer: { ...getState().currentLayer }
    });
  }

  @Action(SettingsEnabled)
  enableSettings({ patchState }: StateContext<UiSettings>) {
    patchState({
      settingsEnabled: true
    });
  }

  @Action(AutoFixPagePosition)
  autoFixLayersPosition(
    { patchState, dispatch }: StateContext<UiSettings>,
    action: AutoFixPagePosition
  ) {
    const currentPage = { ...action.page };

    // reset the top/left position of the current page
    // and the root layer
    currentPage.frame = {
      ...currentPage.frame,
      x: 0,
      y: 0
    };

    if (currentPage.layers[0]) {
      // use array destructuring to avoid:
      // TypeError: Cannot assign to read only property '0' of [object Array]
      const [firstLayer, ...remainingLayers] = currentPage.layers;
      currentPage.layers = [
        {
          ...firstLayer,
          frame: {
            ...firstLayer.frame,
            x: 0,
            y: 0
          }
        },
        ...remainingLayers
      ];
    }

    patchState({
      currentPage
    });
  }

  @Action(LayerPosition)
  layerPosition(
    { getState, patchState }: StateContext<UiSettings>,
    action: LayerPosition
  ) {
    const ui = { ...getState() };

    // reset the top/left position of the current page
    // and the root layer
    ui.currentPage = {
      ...ui.currentPage,
      frame: {
        ...ui.currentPage.frame,
        x: action.left,
        y: action.top
      }
    };

    patchState({
      currentPage: ui.currentPage
    });
  }

  @Action(ZoomIn)
  zoomIn({ getState, setState }: StateContext<UiSettings>, action: ZoomIn) {
    const ui = { ...getState() };
    ui.zoomLevel = parseFloat((ui.zoomLevel + action.value).toFixed(2));
    if (ui.zoomLevel <= 3) {
      setState(ui);
    }
  }
  @Action(ZoomOut)
  zoomOut({ getState, setState }: StateContext<UiSettings>, action: ZoomOut) {
    const ui = { ...getState() };
    ui.zoomLevel = parseFloat((ui.zoomLevel - action.value).toFixed(2));
    if (ui.zoomLevel >= 0.1) {
      setState(ui);
    }
  }
  @Action(Toggle3D)
  toggle3D(
    { patchState, dispatch }: StateContext<UiSettings>,
    action: Toggle3D
  ) {
    if (action.value) {
      dispatch(new ToggleWireframe(true));
    }

    patchState({
      is3dView: action.value
    });
  }
  @Action(ToggleCodeEditor)
  toggleCodeEditor(
    { patchState, dispatch }: StateContext<UiSettings>,
    action: ToggleCodeEditor
  ) {
    dispatch(new CurrentLayer(null));
    patchState({
      isCodeEditor: action.value
    });
  }
  @Action(ResetUiSettings)
  resetUiSettings({ patchState }: StateContext<UiSettings>) {
    patchState(DEFAULT_UI_STATE);
  }
  @Action(InformUser)
  informUser({}, action: InformUser) {
    this.snackBar.open(action.message, 'CLOSE', {
      duration: 5000
    });
  }
}
