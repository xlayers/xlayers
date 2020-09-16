export interface WebCodeGenOptions {
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

export interface WebCodeGenContext {
  components?: string[];
  attributes?: string[];
}
