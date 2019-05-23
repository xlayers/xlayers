export interface CodeGenRessourceFile {
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
  ): CodeGenRessourceFile[];
  identify(current: SketchMSLayer): boolean;
  getInfo(current: SketchMSLayer): any;
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
  ): CodeGenRessourceFile[];
}
