export interface RessourceFile {
  kind: string;
  uri: string;
  value: any;
  language: string;
}

export interface ParserFacadeTranformOptions {
  [key: string]: any;
}

export interface ParserFacade {
  transform(
    current: SketchMSLayer,
    data?: SketchMSData,
    opts?: ParserFacadeTranformOptions
  ): RessourceFile[];
  identify(current: SketchMSLayer): boolean;
}

export interface WithLocalContext<T> {
  of(current: SketchMSLayer): T;
  has(current: SketchMSLayer): boolean;
}

export interface WithGlobalContext<T> {
  globalof(current: SketchMSData): T;
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
