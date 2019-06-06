export interface RessourceFile {
  kind: string;
  uri: string;
  value: string;
  language: string;
}

export interface ParserFacadeTranformOptions {
  [key: string]: any;
}

export interface ParserFacade {
  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    opts?: ParserFacadeTranformOptions
  ): RessourceFile[];
  identify(current: SketchMSLayer): boolean;
}

export interface WithLocalContext<T> {
  contextOf(current: SketchMSLayer): T;
  hasContext(current: SketchMSLayer): boolean;
}

export interface WithGlobalContext<T> {
  globalContextOf(current: SketchMSData): T;
  hasGlobalContext(current: SketchMSData): boolean;
}

export interface NavBarButtonSetting {
  stackblitz?: boolean;
}

export interface CodeGenFacadeGenerateOptions {
  [key: string]: any;
}

export interface CodeGenFacade {
  buttons(): NavBarButtonSetting;
  generate(
    data: SketchMSData,
    opts?: CodeGenFacadeGenerateOptions
  ): RessourceFile[];
}
