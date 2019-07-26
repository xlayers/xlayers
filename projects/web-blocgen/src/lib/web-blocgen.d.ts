export interface WebBlocGenOptions {
  mode?: string;
  xmlPrefix?: string;
  cssPrefix?: string;
  componentDir?: string;
  assetDir?: string;
}

export interface WebBlocGenContext {
  html?: string[];
  css?: string[];
  components?: string[];
}
