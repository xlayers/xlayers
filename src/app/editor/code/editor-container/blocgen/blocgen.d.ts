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
    options?: ParserFacadeTranformOptions
  ): RessourceFile[];
  identify(current: SketchMSLayer): boolean;
  contextOf(current: SketchMSLayer): any;
}

export interface RessourceParserFacade {
  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    options?: ParserFacadeTranformOptions
  ): RessourceFile[];
  identify(current: SketchMSLayer): boolean;
  getResources(data: SketchMSData): any;
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
    options?: CodeGenFacadeGenerateOptions
  ): RessourceFile[];
}
