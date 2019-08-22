export interface WebBlocGenOptions {
  textTagName?: string;
  bitmapTagName?: string;
  blockTagName?: string;
  generateClassName?: boolean;
  xmlNamespace?: boolean;
  mode?: string;
  jsx?: boolean;
  xmlPrefix?: string;
  cssPrefix?: string;
  componentDir?: string;
  assetDir?: string;
  force?: boolean;
}

export interface WebBlocGenContext {
  components?: string[];
  attributes?: string[];
}
